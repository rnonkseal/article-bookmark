import Link from "next/link";

// 없는 주소나 삭제된 기사로 들어왔을 때 보여주는 화면 (404)
export default function NotFound() {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-8 text-center dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-3xl">🔍</p>
      <h2 className="mt-2 text-lg font-semibold">페이지를 찾을 수 없어요</h2>
      <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
        주소가 잘못되었거나, 이미 삭제된 기사예요.
      </p>
      <Link
        href="/"
        className="mt-5 inline-block rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-300"
      >
        목록으로 돌아가기
      </Link>
    </div>
  );
}
