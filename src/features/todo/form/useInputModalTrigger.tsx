import { useEffect } from "react";

export const useInputModalTrigger = () => {
  useEffect(() => {
    // nキーで入力モーダルを開く
    const nKeyHandler = (e: KeyboardEvent) => {
      if (e.key === "n" && e.target === document.body) {
        e.preventDefault();
        const dialog =
          document.querySelector<HTMLDialogElement>("#input-dialog");
        dialog?.showModal();
      }
    };

    document.addEventListener("keydown", nKeyHandler);

    return () => {
      document.removeEventListener("keydown", nKeyHandler);
    };
  }, []);
};
