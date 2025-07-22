import "../styles/landingMain.css"
import LandingInfo from "./LandingInfo"
import Footer from "./Footer"
import Search from "./Search"

export default function LandingMain() {

    async function handleSearch(event) {

        event.preventDefault();
        const formElement = event.currentTarget;
        const formData = new FormData(formElement);
        // console.log(formData);
        // console.log('handleSearch entered');
        const userPlayerSearch = formData.get("player-search");
        const url = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/player?name=${encodeURIComponent(userPlayerSearch)}`;        
        formElement.reset();
        
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error (`Response Status: ${response.status}`);
            }

            const json = await response.json();
            console.log(json);

        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <main>
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

