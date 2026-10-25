import { notFound } from "next/navigation";
import { sql } from "@/lib/db";
import { parseArticleId } from "@/lib/articleId";
import ArticleForm from "@/components/ArticleForm";
import { updateArticle } from "@/app/actions";

export const metadata = {
  title: "기사 수정 | 사회문제 기사 북마크",
};

// 이 화면은 기사를 다 불러온 뒤에 보여준다. (폼을 채울 내용이 있어야 하고, 없는 기사면 404를 보내야 하므로)
export const instant = false;

// 기사 수정 화면 (/articles/번호/edit)
// 주소의 번호로 기사를 찾아서, 내용이 채워진 폼을 보여준다.
// 없는 기사면 404 화면을 보여준다. (404는 화면을 그리기 시작하기 전에 정해야 해서 <Suspense>를 쓰지 않는다)
export default async function EditArticlePage({ params }) {
  const id = parseArticleId((await params).id);
  if (!id) notFound();

  const [article] = await sql`
    SELECT id, title, url, category, memo FROM articles WHERE id = ${id}
  `;
  if (!article) notFound();

  return (
    <>
      <h2 className="mb-4 text-lg font-semibold">기사 수정</h2>
      <ArticleForm
        action={updateArticle.bind(null, article.id)}
        initialValues={{ title: article.title, url: article.url, category: article.category, memo: article.memo }}
        submitLabel="수정하기"
      />
    </>
  );
}
