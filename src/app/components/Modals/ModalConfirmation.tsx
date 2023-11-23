import { useUIContext } from "@/app/context/Ui"

export default function ModalConfirmation(): JSX.Element {
  const { modalConfirmation, setmodalConfirmation } = useUIContext();
  
  let confirmBtnClassName = "btn btn--full ";
  switch (modalConfirmation?.type) {
    case "danger":  confirmBtnClassName += "btn--bg-red";    break;
    case "warning": confirmBtnClassName += "btn--bg-yellow"; break;
    case "success": confirmBtnClassName += "btn--bg-green";  break;
  }

  function handleCancel() {
    setmodalConfirmation(null);
    modalConfirmation?.onCancel();
  }

  function handleConfirm() {
    setmodalConfirmation(null);
    modalConfirmation?.onConfirm();
  }

  return (
    <div className="modal__bg">
      <div className="modal--confirmation">
        <div className="modal--confirmation__content">
          <h2 className="modal--confirmation__title">
            { modalConfirmation?.header }
          </h2>
          
          <p className="modal--confirmation__message">
            { modalConfirmation?.message }
          </p>
          
          <div className="modal--confirmation__btns">
            <button 
              className="btn btn--full btn--border"
              onClick={ handleCancel }
            >Cancel
            </button>
            
            <button 
              className={ confirmBtnClassName }
              onClick={ handleConfirm }
            >Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}