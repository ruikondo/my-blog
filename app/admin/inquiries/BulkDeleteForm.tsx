"use client";

import { useEffect, useRef, useState } from "react";
import ConfirmSubmitButton from "../_components/ConfirmSubmitButton";
import { deleteInquiries } from "./actions";
import { BULK_FORM_ID } from "./constants";

// 一括削除フォーム(全選択チェックボックス + 削除ボタン)。
// 各お問い合わせのチェックボックスは一覧側に置き、form 属性でこのフォームに紐づける
// (個別削除フォームと入れ子にならないようにするため)。
export default function BulkDeleteForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [selected, setSelected] = useState(0);
  const [total, setTotal] = useState(0);

  const boxes = () =>
    Array.from(
      document.querySelectorAll<HTMLInputElement>(
        `input[type="checkbox"][name="ids"][form="${BULK_FORM_ID}"]`,
      ),
    );

  // 一覧側のチェックボックスの変化を購読して件数を更新する
  useEffect(() => {
    const recount = () => {
      const all = boxes();
      setTotal(all.length);
      setSelected(all.filter((b) => b.checked).length);
    };
    const form = formRef.current;
    const onReset = () => setTimeout(recount, 0); // reset 後の状態で数える
    // 削除後に一覧が再描画されてチェックボックスが減った場合も数え直す
    const observer = new MutationObserver(recount);
    observer.observe(document.body, { childList: true, subtree: true });
    recount();
    document.addEventListener("change", recount);
    form?.addEventListener("reset", onReset);
    return () => {
      observer.disconnect();
      document.removeEventListener("change", recount);
      form?.removeEventListener("reset", onReset);
    };
  }, []);

  const toggleAll = (checked: boolean) => {
    const all = boxes();
    all.forEach((b) => (b.checked = checked));
    setSelected(checked ? all.length : 0);
  };

  // フォーム自体は常に描画しておく(reset イベントの購読と form 属性の紐づけのため)。
  // チェックボックスが無いときは非表示にする。
  return (
    <form
      id={BULK_FORM_ID}
      ref={formRef}
      action={deleteInquiries}
      hidden={total === 0}
      className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded border bg-gray-50 px-4 py-2 text-sm"
    >
      <label className="flex cursor-pointer items-center gap-2">
        <input
          type="checkbox"
          checked={total > 0 && selected === total}
          onChange={(e) => toggleAll(e.target.checked)}
          className="h-4 w-4"
          aria-label="このページのお問い合わせをすべて選択"
        />
        このページをすべて選択
        <span className="text-gray-500">({selected}件選択中)</span>
      </label>
      <ConfirmSubmitButton
        message={`選択した${selected}件のお問い合わせを削除します。よろしいですか?`}
        disabled={selected === 0}
        className="rounded border border-red-500 px-3 py-1 text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:border-gray-300 disabled:text-gray-400 disabled:hover:bg-transparent"
      >
        選択した{selected}件を削除
      </ConfirmSubmitButton>
    </form>
  );
}
