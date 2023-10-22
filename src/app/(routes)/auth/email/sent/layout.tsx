import Navbar from "@/app/components/Navbar/Navbar"
import Footer from "@/app/components/Footer/Footer"

export default function EmailSentLayout({
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