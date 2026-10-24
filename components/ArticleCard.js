import { CATEGORY_STYLES } from "@/lib/categories";

// 등록 시각을 한국 시간으로 보기 좋게 바꾼다. (Vercel 서버는 한국 시간이 아니라서 시간대를 꼭 지정)
const dateFormatter = new Intl.DateTimeFormat("ko-KR", {
  dateStyle: "medium",
  timeStyle: "short",
  timeZone: "Asia/Seoul",
});

// 목록에 나오는 기사 카드 하나
export default function ArticleCard({ article }) {
  return (
    <li className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center gap-2 text-xs">
        <span className={`rounded-full px-2 py-0.5 font-medium ${CATEGORY_STYLES[article.category]}`}>
          {article.category}
        </span>
        <time className="text-zinc-500" dateTime={article.created_at.toISOString()}>
          {dateFormatter.format(article.created_at)}
        </time>
      </div>

      <h2 className="mt-2 text-lg font-semibold leading-snug">
        <a
          href={article.url}
          target="_blank"
          rel="noopener noreferrer"
          className="break-words hover:underline"
        >
          {article.title}
        </a>
      </h2>

      {article.memo && (
        <p className="mt-1 break-words text-sm text-zinc-600 dark:text-zinc-400">{article.memo}</p>
      )}
    </li>
  );
}
