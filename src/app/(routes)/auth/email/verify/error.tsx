"use client";

export default function Error({ 
  error, reset 
}: { 
  error: Error & { digest?: string }, reset: () => void 
}): JSX.Element {
  const errorMessage = error.toString().replace("Error: ", "")

  return (
    <div style={{ marginTop: 128 }}>
      <h2>Oopsy daisy something went wrong</h2>
      <p>{ errorMessage }</p>
      <button onClick={ () => {reset()} }>Try again bitch</button>
    </div>
  )
}

