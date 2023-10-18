"use client";

export default function SeederPage() {
  async function handleClick() {
    const res = await fetch('/api/seed', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })

  }
  
  return (
    <div className="seeder">
      <button onClick={ handleClick }>Seed All</button>
    </div>
  )
}