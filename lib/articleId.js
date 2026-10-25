// 주소나 폼에서 받은 기사 번호를 숫자로 바꾼다. 올바른 번호가 아니면 null.
// (데이터베이스의 id는 1 ~ 2147483647 범위의 정수)
export function parseArticleId(value) {
  const text = String(value);
  if (!/^\d{1,10}$/.test(text)) return null;
  const id = Number(text);
  return id >= 1 && id <= 2147483647 ? id : null;
}
