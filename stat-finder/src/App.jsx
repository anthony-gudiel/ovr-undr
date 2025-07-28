import Header from "./components/Header"
import Landing from "./components/LandingMain"
import PlayerStats from './components/PlayerStats'
import About from "./components/About"
import Contact from "./components/Contact"
import { BrowserRouter, Routes, Route } from "react-router-dom"

function App() {

  return (
    <>

      <BrowserRouter >
        <Header />
        <Routes>
          <Route index element={<Landing />} />
          <Route path="/player-stats" element={<PlayerStats />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />    
          <Route path="*" element={<Error />} />  
        </Routes>
      </BrowserRouter>

    </>
  )
}

export default App
