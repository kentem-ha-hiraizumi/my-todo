export const TodoDeleteModal = ({
  onCancel,
  onConfirm,
}: {
  onCancel: () => void;
  onConfirm: () => void;
}) => {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-2xl max-w-md border border-cyan-100">
        <h3 className="text-xl font-bold mb-4 text-slate-800">削除確認</h3>
        <p className="mb-6 text-slate-600">
          このタスクは未完了です。本当に削除しますか?
        </p>
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            className="px-5 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors duration-200 font-medium shadow-sm"
            onClick={onCancel}
          >
            キャンセル
          </button>
          <button
            type="button"
            className="px-5 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200 font-medium shadow-sm"
            onClick={onConfirm}
          >
            削除する
          </button>
        </div>
      </div>
    </div>
  );
};
