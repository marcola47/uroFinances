"use client";

export default function SeederPage() {
  async function seedModel(type: string) {
    const res = await fetch(`/api/seed?type=${type}`, {
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
        onClick={ () => {seedModel('users')} }
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