"use server";

// 서버 액션: 폼의 버튼을 누르면 서버에서 실행되는 함수들

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { sql } from "@/lib/db";
import { CATEGORIES } from "@/lib/categories";
import { fetchTitle } from "@/lib/fetchTitle";
import { parseArticleId } from "@/lib/articleId";

// 폼에서 받은 값을 정리하고, 잘못된 부분이 있으면 errors에 이유를 담는다.
function validate(formData) {
  const values = {
    title: String(formData.get("title") ?? "").trim(),
    url: String(formData.get("url") ?? "").trim(),
    category: String(formData.get("category") ?? ""),
    memo: String(formData.get("memo") ?? "").trim(),
  };

  const errors = {};
  if (!values.title) errors.title = "제목을 입력해 주세요.";
  else if (values.title.length > 200) errors.title = "제목은 200자 이하로 입력해 주세요.";

  if (!isHttpUrl(values.url)) errors.url = "http:// 또는 https:// 로 시작하는 링크를 입력해 주세요.";

  if (!CATEGORIES.includes(values.category)) errors.category = "카테고리를 선택해 주세요.";

  if (values.memo.length > 200) errors.memo = "메모는 200자 이하로 입력해 주세요.";

  return { values, errors };
}

function isHttpUrl(text) {
  if (!/^https?:\/\//.test(text)) return false;
  try {
    new URL(text);
    return true;
  } catch {
    return false;
  }
}

// 저장에 실패했을 때 폼에 돌려줄 상태 (입력값은 그대로 남긴다)
function failure(prevState, values, errors, message = "") {
  return { values, errors, message, attempt: prevState.attempt + 1 };
}

// 링크에서 기사 제목 가져오기 (폼의 링크 칸을 다 입력하면 호출된다)
export async function fetchArticleTitle(url) {
  const failed = { error: "제목을 가져오지 못했어요. 직접 입력해 주세요." };
  if (!isHttpUrl(String(url).trim())) return failed;

  try {
    const title = await fetchTitle(String(url).trim());
    if (title) return { title: title.slice(0, 200) };
  } catch (error) {
    console.error("제목 가져오기 실패:", url, error.message);
  }
  return failed;
}

// 기사 등록
export async function createArticle(prevState, formData) {
  const { values, errors } = validate(formData);
  if (Object.keys(errors).length > 0) return failure(prevState, values, errors);

  try {
    await sql`
      INSERT INTO articles (title, url, category, memo)
      VALUES (${values.title}, ${values.url}, ${values.category}, ${values.memo})
    `;
  } catch (error) {
    console.error("기사 등록 실패:", error);
    return failure(prevState, values, {}, "저장하지 못했어요. 잠시 후 다시 시도해 주세요.");
  }

  // 목록 화면을 새로 고치고 목록으로 이동한다.
  revalidatePath("/");
  redirect("/");
}

// 기사 수정 (수정 화면에서 id를 미리 묶어서 넘긴다: updateArticle.bind(null, id))
export async function updateArticle(id, prevState, formData) {
  const articleId = parseArticleId(id);
  const { values, errors } = validate(formData);
  if (Object.keys(errors).length > 0) return failure(prevState, values, errors);
  if (!articleId) return failure(prevState, values, {}, "잘못된 기사 번호예요.");

  let updated;
  try {
    updated = await sql`
      UPDATE articles
      SET title = ${values.title}, url = ${values.url}, category = ${values.category},
          memo = ${values.memo}, updated_at = now()
      WHERE id = ${articleId}
      RETURNING id
    `;
  } catch (error) {
    console.error("기사 수정 실패:", error);
    return failure(prevState, values, {}, "저장하지 못했어요. 잠시 후 다시 시도해 주세요.");
  }
  if (updated.length === 0) return failure(prevState, values, {}, "이미 삭제된 기사예요.");

  revalidatePath("/");
  redirect("/");
}
