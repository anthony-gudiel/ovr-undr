import "../styles/landing.css"
import search from "../assets/search-icon.png"

export default function Landing() {
    return (
        <main>
            <div className="tagline">
                <h1>Do yourself a favour by making more informed bets.</h1>
                <h3>Most bets are made on gut feeling. We help you back it up with real trends by
                highlighting how players have performed against the line in recent games.</h3>
                <form>
                    <input type="text" className="player-search" id="player-search" name="player-search" placeholder="Find a Player"/>
                    <input type="image" src={search} alt="Submit" className="submit-button"/>
                </form>
            </div>

            <div className="landing-container">
                <p>Hello</p>
                <p>Hello</p>
            </div>
        </main>
    )
}

