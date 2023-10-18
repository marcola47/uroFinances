"use client";

export default function SeederPage() {
  async function seedUsers() {
    const res = await fetch('/api/seed?type=users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })

    console.log(await res.json());
  }

  async function seedCategories() {
    const res = await fetch('/api/seed?type=categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })

    console.log(await res.json());
  }
  
  return (
    <div className="seeder">
      <div 
        onClick={ seedUsers }
        className="seeder__btn"
      > SEED USERS</div>

      <div 
        onClick={ seedCategories }
        className="seeder__btn"
      > SEED CATEGORIES</div>
    </div>
  )
}