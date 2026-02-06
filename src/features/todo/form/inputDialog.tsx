export const InputDialogButton = () => {
  return (
    <>
      <InputDialog />
      {/* @ts-ignore command属性 */}
      <button command="show-modal" commandfor="input-dialog" type="button">
        Open Input Dialog
      </button>
    </>
  );
};

const InputDialog = () => {
  return (
    <dialog
      id="input-dialog"
      closedby="any"
      className="fixed inset-0 m-auto min-w-24 rounded border-none p-4"
    >
      testtest
    </dialog>
  );
};
