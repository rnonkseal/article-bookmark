import { lookup } from "node:dns/promises";
import { BlockList, isIP } from "node:net";

// 기사 링크에 접속해서 제목을 읽어 온다. (og:title → <title> 순서로 찾음)

// 서버 내부망 주소로는 접속하지 않는다. (다른 사람이 이 기능으로 내부 서버를 엿보는 것을 막기 위함)
const privateAddresses = new BlockList();
for (const [address, prefix] of [
  ["0.0.0.0", 8],
  ["10.0.0.0", 8],
  ["100.64.0.0", 10],
  ["127.0.0.0", 8],
  ["169.254.0.0", 16],
  ["172.16.0.0", 12],
  ["192.168.0.0", 16],
]) {
  privateAddresses.addSubnet(address, prefix, "ipv4");
}
privateAddresses.addSubnet("::", 127, "ipv6"); // :: 와 ::1
privateAddresses.addSubnet("fc00::", 7, "ipv6");
privateAddresses.addSubnet("fe80::", 10, "ipv6");

function isPrivate(address) {
  const mapped = address.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/i); // IPv6 안에 들어 있는 IPv4 주소
  if (mapped) return privateAddresses.check(mapped[1], "ipv4");
  return privateAddresses.check(address, isIP(address) === 6 ? "ipv6" : "ipv4");
}

async function assertPublicUrl(url) {
  if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error("http(s) 주소가 아님");
  const hostname = url.hostname.replace(/^\[|\]$/g, "");
  const addresses = isIP(hostname)
    ? [{ address: hostname }]
    : await lookup(hostname, { all: true });
  if (addresses.some(({ address }) => isPrivate(address))) throw new Error("내부망 주소");
}

const MAX_REDIRECTS = 3;
const MAX_BYTES = 512 * 1024; // 제목은 페이지 앞부분에 있으므로 앞 512KB만 읽는다.

// 리다이렉트(다른 주소로 이동)도 한 번씩 내부망인지 확인하면서 따라간다.
async function fetchPage(startUrl) {
  let url = new URL(startUrl);
  for (let i = 0; i <= MAX_REDIRECTS; i++) {
    await assertPublicUrl(url);
    const res = await fetch(url, {
      redirect: "manual",
      signal: AbortSignal.timeout(5000),
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
        "Accept-Language": "ko-KR,ko;q=0.9",
      },
    });
    const location = res.headers.get("location");
    if (res.status >= 300 && res.status < 400 && location) {
      url = new URL(location, url);
      continue;
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res;
  }
  throw new Error("리다이렉트가 너무 많음");
}

async function readStart(res) {
  const reader = res.body.getReader();
  const chunks = [];
  let size = 0;
  while (size < MAX_BYTES) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    size += value.length;
  }
  reader.cancel().catch(() => {});
  return Buffer.concat(chunks);
}

// 한국 뉴스 사이트 중에는 UTF-8이 아닌 EUC-KR을 쓰는 곳도 있어서 글자 인코딩을 확인한다.
function decode(bytes, contentType) {
  const head = bytes.subarray(0, 4096).toString("latin1");
  const charset =
    contentType.match(/charset=["']?([\w-]+)/i)?.[1] ??
    head.match(/<meta[^>]+charset=["']?([\w-]+)/i)?.[1] ??
    "utf-8";
  try {
    return new TextDecoder(charset).decode(bytes);
  } catch {
    return new TextDecoder("utf-8").decode(bytes);
  }
}

function decodeEntities(text) {
  const named = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", middot: "·" };
  return text.replace(/&(#x[\da-f]+|#\d+|\w+);/gi, (match, code) => {
    if (code[0] === "#") {
      const n = code[1].toLowerCase() === "x" ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
      return Number.isNaN(n) ? match : String.fromCodePoint(n);
    }
    return named[code.toLowerCase()] ?? match;
  });
}

function extractTitle(html) {
  for (const tag of html.match(/<meta\s[^>]*>/gi) ?? []) {
    if (/(property|name)=["']og:title["']/i.test(tag)) {
      const content = tag.match(/content=(["'])([\s\S]*?)\1/i)?.[2];
      if (content?.trim()) return content;
    }
  }
  return html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? null;
}

export async function fetchTitle(url) {
  const res = await fetchPage(url);
  const html = decode(await readStart(res), res.headers.get("content-type") ?? "");
  const title = extractTitle(html);
  return title ? decodeEntities(title).replace(/\s+/g, " ").trim() : null;
}
