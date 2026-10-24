import ArticleForm from "@/components/ArticleForm";
import { createArticle } from "@/app/actions";

export const metadata = {
  title: "기사 등록 | 사회문제 기사 북마크",
};

// 기사 등록 화면
export default function NewArticlePage() {
  return (
    <>
      <h2 className="mb-4 text-lg font-semibold">기사 등록</h2>
      <ArticleForm action={createArticle} submitLabel="등록하기" />
    </>
  );
}
