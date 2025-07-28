import "../styles/landingMain.css"
import LandingInfo from "./LandingInfo"
import Footer from "./Footer"
import Search from "./Search"
import { Toaster, toast } from 'sonner'


export default function LandingMain() {

    function isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }

    async function handleSearch(event) {

        event.preventDefault();

        const formElement = event.currentTarget;
        const formData = new FormData(formElement);
        // console.log(formData);
        // console.log('handleSearch entered');
        
        let userPlayerSearch = formData.get("player-search");
        const spaceIndex = (userPlayerSearch.indexOf(" "));

        if (spaceIndex === -1) {
            toast.error("Please enter a first and last name separated by a space.");
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
            console.log(json);

            if (isEmpty(json)) {
                toast.error("No players matching that name were found. Please check your spelling or try a different name.");
            }

        } catch (error) {
            console.log(error.message);
            toast.error('Something went wrong. Please try again.');
        }
    }

    return (
        
        <main>
            <Toaster richColors position="top-center"/>
            <div className="tagline">
                <h1>Do yourself a favour by making more informed bets.</h1>
                <h3>Most bets are made on gut feeling. We help you back it up with real trends by
                highlighting how players have performed against the line in recent games.</h3>
                <Search 
                    onClick = {handleSearch}
                />
            </div>

            <div className="gradient-transition"></div>

            <div className="features">
                <LandingInfo 
                    headline='Track Player Performance Against Betting Lines'
                    text='Easily see how NBA players perform compared to their betting lines. Just search for a player, choose how many past games you want to look at, and instantly see whether they went over or under. We keep it simple—just the info you need to make smarter picks.'
                    side={true}
                    image='this is an image'
                />
                <LandingInfo
                    headline='Filter by Opponent, Minutes Played, and More'
                    text='Want to know how a player does against a specific team? Or only when they play heavy minutes? Use our filters to dig deeper. You can narrow results by opponent, minutes played, and other key stats, so you’re not just seeing raw numbers—you’re seeing the full picture.'
                    side={false}
                    image='this is an image'
                />
                <LandingInfo
                    headline='Visualize the Data with Clean, Interactive Graphs'
                    text="No need to stare at a spreadsheet. We turn the numbers into clear, interactive graphs so trends pop out at a glance. Whether you're researching for fantasy, betting, or just curious, you’ll get quick insights that make sense."
                    side={true}
                    image='this is an image'
                />
            </div>
            <Footer />
        </main>
    )
}

