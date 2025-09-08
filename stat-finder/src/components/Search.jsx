import search from "../assets/search-icon.png"
import nbaLogo from '../assets/nba-logo-transparent.png'
import nflLogo from '../assets/nfl-logo.png'
import '../styles/search.css'

export default function Search(props) {

    return (
        <form onSubmit={props.onClick}>
            <input type="text" className="player-search" id="player-search" name="player-search" placeholder="Find a Player"/>
            <img src={nbaLogo} alt="NBA Logo" className={props.league == 'NBA' ? 'active-logo' : 'inactive-logo'} onClick={props.changeToNba}/>
            <img src={nflLogo} alt="NFL Logo" className={props.league == 'NFL' ? 'active-logo' : 'inactive-logo'} onClick={props.changeToNfl}/>
            <input type="image" src={search} alt="Submit" className="submit-button"/>
        </form>
    )
}