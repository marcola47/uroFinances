"use client"

export default function TransactionAdd({ type }: { type: string }): JSX.Element {
  const className = type === 'income'
    ? "btn btn--full btn--bg-green"
    : "btn btn--full btn--bg-red"
  
  function handleAddTransaction() {
    return true;
  }

  return (
    <button 
      className={ className }
      onClick={ handleAddTransaction }
      children={`ADD ${type.toUpperCase()}`}
    />
  )
}