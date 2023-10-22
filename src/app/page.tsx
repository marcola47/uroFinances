import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';

export default function App(): JSX.Element {
  return (
    <div className="app">
      <Navbar/>
      <div className="home">
        home
      </div>
      <Footer/>
    </div>
  )
}