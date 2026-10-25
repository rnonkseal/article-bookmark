import { Suspense } from "react";
import Link from "next/link";
import { sql } from "@/lib/db";
import { CATEGORIES } from "@/lib/categories";
import ArticleCard from "@/components/ArticleCard";
import CategoryFilter from "@/components/CategoryFilter";

// 주소의 ?category=... 값을 읽어서, 필터 버튼과 기사 목록을 보여준다.
async function ArticleList({ searchParams }) {
  const { category } = await searchParams;
  // 목록에 없는 카테고리가 주소에 들어오면 "전체"로 본다.
  const selected = CATEGORIES.includes(category) ? category : null;

  const [articles, countRows] = await Promise.all([
    selected
      ? sql`
          SELECT id, title, url, category, memo, created_at
          FROM articles
          WHERE category = ${selected}
          ORDER BY created_at DESC, id DESC
        `
      : sql`
          SELECT id, title, url, category, memo, created_at
          FROM articles
          ORDER BY created_at DESC, id DESC
        `,
    sql`SELECT category, count(*)::int AS count FROM articles GROUP BY category`,
  ]);
  const counts = Object.fromEntries(countRows.map((row) => [row.category, row.count]));

  return (
    <>
      <CategoryFilter selected={selected} counts={counts} />

      {articles.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-zinc-500 dark:border-zinc-700">
          {selected ? (
            <>&lsquo;{selected}&rsquo; 카테고리에 등록된 기사가 없어요.</>
          ) : (
            <>
              아직 등록된 기사가 없어요. 오른쪽 위 <strong>+ 기사 등록</strong>을 눌러 첫 기사를 추가해 보세요.
            </>
          )}
        </p>
      ) : (
        <ul className="flex flex-col gap-3">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </ul>
      )}
    </>
  );
}

export default function Home({ searchParams }) {
  return (
    <>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">기사 목록</h2>
        <Link
          href="/new"
          className="shrink-0 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          + 기사 등록
        </Link>
      </div>

      {/* 데이터를 불러오는 동안 "불러오는 중"을 먼저 보여준다 */}
      <Suspense fallback={<p className="p-8 text-center text-zinc-500">기사를 불러오는 중…</p>}>
        <ArticleList searchParams={searchParams} />
      </Suspense>
    </>
  );
}
