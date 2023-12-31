import Navbar from "@/app/components/Navbar/Navbar";

export default function AccountsLayout({ 
  children 
}: { 
  children: React.ReactNode 
}): JSX.Element {
  return (
    <div className="app">
      <Navbar/>
      { children }
    </div>
  )
}