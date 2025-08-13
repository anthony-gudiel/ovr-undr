import "../styles/landingMain.css"
import LandingInfo from "./LandingInfo"
import Footer from "./Footer"
import Search from "./Search"
import graph from '../assets/landing-graph.png'
import overUnder from '../assets/over-under.png'
import filterForm from '../assets/filter-form.png'

export default function LandingMain(props) {
    

    return (
        
        <main>
            <div className="tagline">
                <h1>Do yourself a favour by making more informed bets.</h1>
                <h3>Most bets are made on gut feeling. We help you back it up with real trends by
                highlighting how players have performed against the line in recent games.</h3>
                <Search 
                    onClick = {props.handleSearch}
                />
            </div>

            <div className="gradient-transition"></div>

            <div className="features">
                <LandingInfo 
                    headline='Track Player Performance Against Betting Lines'
                    text='Easily see how NBA players perform compared to their betting lines. Just search for a player, choose how many past games you want to look at, and instantly see whether they went over or under the line of your choice. We keep it simple—just the info you need to make smarter picks.'
                    side={true}
                    image={overUnder}
                    alt='filter buttons for data'
                    class='first-image'
                />
                <LandingInfo
                    headline='Filter by Opponent, Minutes Played, and More'
                    text='Want to know how a player does against a specific team? Or only when they play heavy minutes? Use our filters to dig deeper. You can narrow results by opponent, minutes played, and other key stats, so you’re not just seeing raw numbers—you’re seeing the full picture.'
                    side={false}
                    image={filterForm}
                    alt='form for filtering data'
                    class='second-image'
                />
                <LandingInfo
                    headline='Visualize the Data with Clean, Interactive Graphs'
                    text="No need to stare at a spreadsheet. We turn the numbers into clear, interactive graphs so trends pop out at a glance. Whether you're researching for fantasy, betting, or just curious, you’ll get quick insights that make sense."
                    side={true}
                    image={graph}
                    alt='graph of player data'
                    class='third-image'
                />
            </div>
            <Footer />
        </main>
    )
}

