"use client"

export function ResetPassword({ type, id, name, email }: { type: string, id: any, name: any, email: any }): JSX.Element {
  async function handleResetPassword(): Promise<void> {
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, name, email })
    })
  }
  
  return (
    <button 
      className="btn btn--reset-pwd"
      onClick={ handleResetPassword }
      children={ type === "create" ? "CREATE NEW PASSWORD" : "RESET PASSWORD"}
    />
  )
}

export function UpdatePassword(): JSX.Element {
  async function handleUpdatePassword(): Promise<void> {
    
  }
  
  return (
    <button 
      className="btn--update-pwd"
      onClick={ handleUpdatePassword }
      children="UPDATE PASSWORD"
    />
  )
}