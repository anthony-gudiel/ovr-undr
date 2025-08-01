import Header from "./components/Header"
import Landing from "./components/LandingMain"
import PlayerStats from './components/PlayerStats'
import About from "./components/About"
import Contact from "./components/Contact"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Toaster, toast } from 'sonner'
import { useNavigate } from "react-router-dom"

function App() {

    const navigate = useNavigate();

    function isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }

    async function handleSearch(event) {

        event.preventDefault();

        const formElement = event.currentTarget;
        const formData = new FormData(formElement);

        // console.log(formData);
        // console.log('handleSearch entered')

        let userPlayerSearch = formData.get("player-search");
        const spaceIndex = (userPlayerSearch.indexOf(" "));

        if (spaceIndex === -1) {
            toast.error("Please enter a first and last name separated by a space.");
            formElement.reset();
            return;
        }

        userPlayerSearch = userPlayerSearch[0].toUpperCase() 
            + userPlayerSearch.substring(1, spaceIndex + 1)
            + userPlayerSearch[spaceIndex + 1].toUpperCase() 
            + userPlayerSearch.substring(spaceIndex + 2, userPlayerSearch.length);
       
        userPlayerSearch = userPlayerSearch.substring(0, spaceIndex) + '_' 
        + userPlayerSearch.substring(spaceIndex + 1, userPlayerSearch.length);        

        const url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/player?name=${encodeURIComponent(userPlayerSearch)}`;        

        formElement.reset();
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error (`Response Status: ${response.status}`);
            }

            const json = await response.json();
            // console.log(json);

            if (isEmpty(json)) {
                toast.error("No players matching that name were found. Please check your spelling or try a different name.");
            } else {
                navigate('/player-stats', {state: {playerData: json}});
            }

        } catch (error) {
            console.log(error.message);
            toast.error('Something went wrong. Please try again.');
        }
    }

  return (
    <>

      <Toaster richColors position="top-center"/>
      <Header handleSearch={handleSearch} />
      <div style={{ height: "50px" }} /> 
        <Routes>
          <Route index element={<Landing handleSearch={handleSearch} />} />
          <Route path="/player-stats" element={<PlayerStats />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />    
          <Route path="*" element={<Error />} />  
        </Routes>
    </>
  )
}

export default App
