import { Suspense } from "react";
import Link from "next/link";
import { sql } from "@/lib/db";
import ArticleCard from "@/components/ArticleCard";

// 데이터베이스에서 기사를 최신순으로 가져와 보여준다.
async function ArticleList() {
  const articles = await sql`
    SELECT id, title, url, category, memo, created_at
    FROM articles
    ORDER BY created_at DESC, id DESC
  `;

  if (articles.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-zinc-500 dark:border-zinc-700">
        아직 등록된 기사가 없어요. 오른쪽 위 <strong>+ 기사 등록</strong>을 눌러 첫 기사를 추가해 보세요.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {articles.map((article) => (
        <ArticleCard key={article.id} article={article} />
      ))}
    </ul>
  );
}

export default function Home() {
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
        <ArticleList />
      </Suspense>
    </>
  );
}
