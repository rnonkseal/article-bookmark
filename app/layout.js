import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "사회문제 기사 북마크",
  description: "수업·리포트 준비를 위해 읽은 사회문제 기사를 모아 정리하는 앱",
};

// 모든 페이지에 공통으로 들어가는 틀 (상단 제목 + 가운데 정렬된 본문)
export default function RootLayout({ children }) {
  return (
    <html lang="ko" className="h-full antialiased">
      <body className="min-h-full bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
          <div className="mx-auto max-w-2xl px-4 py-4">
            <Link href="/" className="text-xl font-bold">
              📰 사회문제 기사 북마크
            </Link>
          </div>
        </header>
        <main className="mx-auto max-w-2xl px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
