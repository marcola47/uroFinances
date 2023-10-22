import Navbar from "@/app/components/Navbar/Navbar"
import Footer from "@/app/components/Footer/Footer"

export default function BudgetsLayout({ 
  children 
}: { 
  children: React.ReactNode 
}): JSX.Element {
  return (
    <div className="app">
      <Navbar/>
      { children }
      <Footer/>
    </div>
  )
}