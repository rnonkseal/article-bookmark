"use client";

// 삭제 버튼: 누르면 확인 창을 띄우고, "확인"을 누른 경우에만 삭제한다.

import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-md px-3 py-1 text-red-600 hover:bg-red-50 disabled:opacity-50 dark:text-red-400 dark:hover:bg-red-950"
    >
      {pending ? "삭제 중…" : "삭제"}
    </button>
  );
}

export default function DeleteButton({ action, title }) {
  function confirmDelete(event) {
    if (!window.confirm(`'${title}'\n\n이 기사를 삭제할까요? 삭제하면 되돌릴 수 없어요.`)) {
      event.preventDefault();
    }
  }

  return (
    <form action={action} onSubmit={confirmDelete}>
      <SubmitButton />
    </form>
  );
}
