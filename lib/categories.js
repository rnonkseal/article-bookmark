// 카테고리 목록. db/schema.sql의 CHECK 규칙과 같아야 한다.
export const CATEGORIES = ["환경", "노동", "젠더", "교육", "주거", "기타"];

// 카테고리별 배지 색상 (Tailwind 클래스)
export const CATEGORY_STYLES = {
  환경: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  노동: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  젠더: "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-950 dark:text-fuchsia-300",
  교육: "bg-sky-100 text-sky-800 dark:bg-sky-950 dark:text-sky-300",
  주거: "bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300",
  기타: "bg-zinc-200 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300",
};
