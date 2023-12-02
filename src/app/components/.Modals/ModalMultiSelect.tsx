import { useUIContext } from "@/app/context/Ui"

export default function ModalMultiSelect(): JSX.Element {
  const { modalMultiSelect, setModalMultiSelect } = useUIContext();

  function handleCancel() {
    setModalMultiSelect(null);
    modalMultiSelect?.onCancel();
  }

  function handleConfirm(selected: string) {
    setModalMultiSelect(null);
    modalMultiSelect?.onConfirm(selected);
  }

  type ModalMultiSelectOptionProps = {
    option: string;
    index: number;
  }

  function ModalMultiSelectOption({ option, index }: ModalMultiSelectOptionProps): JSX.Element {
    //@ts-expect-error - I don't know why ts can't infer that length not undefined if this component is rendered
    const isLastOption = index === modalMultiSelect?.options.length - 1;
    let optionClassName = "btn btn--full ";

    switch (modalMultiSelect?.type) {
      case "danger": optionClassName += isLastOption ?  "btn--bg-red" : "btn--red"; break;
      case "warning": optionClassName += isLastOption ?  "btn--bg-yellow" : "btn--yellow"; break;
      case "success": optionClassName += isLastOption ?  "btn--bg-green" : "btn--green"; break;
    }
    
    return (
      <div 
        className={ optionClassName }
        onClick={ () => handleConfirm(option) }
      > { option }
      </div>
    )
  }

  return (
    <div 
      className="modal__bg"
      onClick={ () => setModalMultiSelect(null) }
    >
      <div 
        className="modal--multi"
        onClick={ e => e.stopPropagation() }
      >
        <div className="modal--multi__content">
          <h2 className="modal--multi__header">
            { modalMultiSelect?.header }
          </h2>
          
          <p className="modal--multi__message">
            { modalMultiSelect?.message }
          </p>
        </div>

        <div className="modal--multi__options">
          {
            modalMultiSelect?.options.map((option, index) => (
              <ModalMultiSelectOption 
                option={ option }
                index={ index }
                key={ index }
              />
            ))
          }
        </div>
      </div>
    </div>
  )
}