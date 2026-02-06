export const InputDialogButton = () => {
  return <>
  <InputDialog />
  <button command="show-modal" commandfor="input-dialog" type="button">Open Input Dialog</button>
  </>
}

const InputDialog = () => {
  return <dialog id="input-dialog"></dialog>
}
