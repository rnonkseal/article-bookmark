"use client"; // 오류 화면은 브라우저에서 동작해야 한다.

// 데이터베이스 연결이 끊기는 등 예상하지 못한 문제가 생기면 보여주는 화면

import { useEffect } from "react";
import Link from "next/link";

export default function Error({ error, retry }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-3xl">⚠️</p>
      <h2 className="mt-2 text-lg font-semibold">문제가 생겼어요</h2>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        기사를 불러오거나 저장하지 못했어요. 인터넷 연결을 확인하고 다시 시도해 주세요.
      </p>
      <div className="mt-5 flex justify-center gap-2">
        <button
          type="button"
          onClick={() => retry()}
          className="rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
        >
          다시 시도
        </button>
        <Link
          href="/"
          className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-200 dark:text-zinc-300 dark:hover:bg-zinc-800"
        >
          목록으로
        </Link>
      </div>
    </div>
  );
}
