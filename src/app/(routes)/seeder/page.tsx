"use client";

export default function SeederPage() {
  async function seedUser() {
    const res = await fetch(`/api/seed/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })

    console.log(await res.json());
  }

  async function seedTransactions() {
    const res = await fetch(`/api/seed/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })

    console.log(await res.json());
  }

  async function seedTransactionsBenchmark() {
    const res = await fetch(`/api/seed/transactions/benchmark`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    })

    console.log(await res.json());
  }
  
  return (
    <div className="seeder">
      <div 
        onClick={ seedUser }
        className="seeder__btn"
      > SEED USERS</div>

      <div 
        onClick={ seedTransactions }
        className="seeder__btn"
      > SEED TRANSACTIONS</div>

      <div 
        onClick={ seedTransactionsBenchmark }
        className="seeder__btn"
      > SEED TRANSACTIONS BENCHMARK</div>
    </div>
  )
}