import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";

// 카테고리 필터 버튼 줄. selected가 없으면 "전체"가 선택된 상태다.
// counts: { 환경: 3, 노동: 1, ... } 카테고리별 기사 수
export default function CategoryFilter({ selected, counts }) {
  const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
  const items = [
    { label: "전체", href: "/", count: total, active: !selected },
    ...CATEGORIES.map((category) => ({
      label: category,
      href: { pathname: "/", query: { category } },
      count: counts[category] ?? 0,
      active: selected === category,
    })),
  ];

  return (
    // 좁은 화면(휴대폰): 4칸 격자로 같은 너비의 버튼 두 줄 (4개 + 3개)
    // 넓은 화면(640px 이상, sm:): 한 줄로 나란히
    <nav aria-label="카테고리 필터" className="mb-4 grid grid-cols-4 gap-2 sm:flex sm:flex-wrap">
      {items.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          aria-current={item.active ? "page" : undefined}
          className={`whitespace-nowrap rounded-full border px-2 py-1.5 text-center text-sm sm:px-3 sm:py-1 ${
            item.active
              ? "border-zinc-900 bg-zinc-900 text-white dark:border-zinc-100 dark:bg-zinc-100 dark:text-zinc-900"
              : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
          }`}
        >
          {item.label} <span className="opacity-60">{item.count}</span>
        </Link>
      ))}
    </nav>
  );
}
