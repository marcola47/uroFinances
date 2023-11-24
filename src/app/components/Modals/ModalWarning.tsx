import { useUIContext } from "@/app/context/Ui"

export default function ModalWarning(): JSX.Element {
  const { modalWarning, setModalWarning } = useUIContext();

  return (
    <div 
      className="modal__bg"
      onClick={ () => setModalWarning(null) }
    >
      <div 
        className="modal--warning"
        onClick={ e => e.stopPropagation() }
      >
        <div className="modal--warning__content">
          <h2 className="modal--warning__header">
            { modalWarning?.header }
          </h2>
          
          <p className="modal--warning__message">
            { modalWarning?.message }
          </p>
          
          <button 
            className="btn btn--full btn--bg-yellow"
            onClick={ () => setModalWarning(null) }
            children="I UNDERSTAND"
          />
        </div>
      </div>
    </div>
  )
}