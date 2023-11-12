import Navbar from "@/app/components/LayoutClient/Navbar/Navbar";

export default function TransactionsLayout({ 
  children 
}: { 
  children: React.ReactNode 
}): JSX.Element {
  return (
    <div className="app">
      {/* <Navbar/> */}
      { children }
    </div>
  )
}