import { useUIContext } from "@/app/context/Ui"

export default function ModalConfirmation(): JSX.Element {
  const { modalConfirmation, setModalConfirmation } = useUIContext();
  
  let confirmBtnClassName = "btn btn--full ";
  switch (modalConfirmation?.type) {
    case "danger": confirmBtnClassName += "btn--bg-red"; break;
    case "warning": confirmBtnClassName += "btn--bg-yellow"; break;
    case "success": confirmBtnClassName += "btn--bg-green"; break;
  }

  function handleCancel() {
    setModalConfirmation(null);
    modalConfirmation?.onCancel();
  }

  function handleConfirm() {
    setModalConfirmation(null);
    modalConfirmation?.onConfirm();
  }

  return (
    <div 
      className="modal__bg"
      onClick={ () => setModalConfirmation(null) }
    >
      <div 
        className="modal--confirmation"
        onClick={ e => e.stopPropagation() }
      >
        <div className="modal--confirmation__content">
          <h2 className="modal--confirmation__header">
            { modalConfirmation?.header }
          </h2>
          
          <p className="modal--confirmation__message">
            { modalConfirmation?.message }
          </p>
          
          <div className="modal--confirmation__btns">
            <button 
              className="btn btn--full btn--border"
              onClick={ handleCancel }
            > { modalConfirmation?.cancelText || "NO" }
            </button>
            
            <button 
              className={ confirmBtnClassName }
              onClick={ handleConfirm }
            > { modalConfirmation?.confirmText || "YES" }
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}