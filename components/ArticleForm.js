"use client";

// 기사 입력 폼 (등록 화면과 수정 화면이 같이 쓴다)

import { useActionState, useRef, useState } from "react";
import Link from "next/link";
import { CATEGORIES } from "@/lib/categories";
import { fetchArticleTitle } from "@/app/actions";

const EMPTY = { title: "", url: "", category: "", memo: "" };

const inputClass =
  "w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-base focus:border-zinc-900 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:focus:border-zinc-100";

// 입력칸 하나: 이름표(+ 오른쪽 버튼) + 입력칸 + 오류 메시지
function Field({ label, htmlFor, error, hint, extra, children }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={htmlFor} className="text-sm font-medium">
          {label}
        </label>
        {extra}
      </div>
      {children}
      {hint && !error && <p className="text-xs text-zinc-500">{hint}</p>}
      {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}

export default function ArticleForm({ action, initialValues = EMPTY, submitLabel }) {
  const [state, formAction, pending] = useActionState(action, {
    values: initialValues,
    errors: {},
    message: "",
    attempt: 0,
  });
  const { values, errors } = state;

  const urlRef = useRef(null);
  const titleRef = useRef(null);
  const [titleStatus, setTitleStatus] = useState(""); // "" | "loading" | 안내 문구

  // 링크에서 제목을 가져와 제목 칸에 넣는다.
  // overwrite가 false이면 제목 칸이 비어 있을 때만 채운다. (직접 쓴 제목을 지우지 않도록)
  async function loadTitle(overwrite) {
    const url = urlRef.current.value.trim();
    if (!/^https?:\/\//.test(url)) {
      if (overwrite) setTitleStatus("먼저 http:// 또는 https:// 로 시작하는 링크를 넣어 주세요.");
      return;
    }
    if (!overwrite && titleRef.current.value.trim()) return;

    setTitleStatus("loading");
    const result = await fetchArticleTitle(url);
    if (!result.title) {
      setTitleStatus(result.error);
      return;
    }
    if (overwrite || !titleRef.current.value.trim()) titleRef.current.value = result.title;
    setTitleStatus("");
  }

  return (
    // key: 저장에 실패하면 폼을 새로 그려서, 입력했던 값이 지워지지 않고 남아 있게 한다.
    <form key={state.attempt} action={formAction} noValidate className="flex flex-col gap-4">
      <Field label="링크 (URL) *" htmlFor="url" error={errors.url} hint="기사 주소를 붙여넣으면 제목이 자동으로 채워져요.">
        <input
          ref={urlRef}
          id="url"
          name="url"
          type="url"
          defaultValue={values.url}
          placeholder="https://"
          onBlur={() => loadTitle(false)}
          className={inputClass}
        />
      </Field>

      <Field
        label="제목 *"
        htmlFor="title"
        error={errors.title}
        hint={titleStatus === "loading" ? "제목을 가져오는 중…" : titleStatus}
        extra={
          <button
            type="button"
            onClick={() => loadTitle(true)}
            disabled={titleStatus === "loading"}
            className="text-xs text-zinc-500 underline hover:text-zinc-900 disabled:opacity-50 dark:hover:text-zinc-100"
          >
            링크에서 가져오기
          </button>
        }
      >
        <input
          ref={titleRef}
          id="title"
          name="title"
          type="text"
          maxLength={200}
          defaultValue={values.title}
          placeholder={titleStatus === "loading" ? "가져오는 중…" : ""}
          className={inputClass}
        />
      </Field>

      <Field label="카테고리 *" htmlFor="category" error={errors.category}>
        <select id="category" name="category" defaultValue={values.category} className={inputClass}>
          <option value="">카테고리를 선택하세요</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </Field>

      <Field label="한 줄 메모" htmlFor="memo" error={errors.memo} hint="선택 · 200자까지">
        <input id="memo" name="memo" type="text" maxLength={200} defaultValue={values.memo} className={inputClass} />
      </Field>

      {state.message && (
        <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950 dark:text-red-300" aria-live="polite">
          {state.message}
        </p>
      )}

      <div className="flex justify-end gap-2">
        <Link href="/" className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-200 dark:text-zinc-300 dark:hover:bg-zinc-800">
          취소
        </Link>
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          {pending ? "저장 중…" : submitLabel}
        </button>
      </div>
    </form>
  );
}
