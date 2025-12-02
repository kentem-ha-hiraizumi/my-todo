export const TodoDeleteModal = ({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
      <div className="max-w-md rounded-xl border border-cyan-100 bg-white p-8 shadow-2xl">
        <h3 className="mb-4 font-bold text-slate-800 text-xl">削除確認</h3>
        <p className="mb-6 text-slate-600">
          このタスクは未完了です。本当に削除しますか?
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            className="rounded-lg bg-slate-200 px-5 py-2 font-medium text-slate-700 shadow-sm transition-colors duration-200 hover:bg-slate-300"
            onClick={onCancel}
          >
            キャンセル
          </button>
          <button
            type="button"
            className="rounded-lg bg-red-500 px-5 py-2 font-medium text-white shadow-sm transition-colors duration-200 hover:bg-red-600"
            onClick={onConfirm}
          >
            削除する
          </button>
        </div>
      </div>
    </div>
  );
};
