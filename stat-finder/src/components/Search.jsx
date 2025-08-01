import search from "../assets/search-icon.png"

export default function Search(props) {

    console.log('Search bar rendered');

    return (
        <form onSubmit={props.onClick}>
            <input type="text" className="player-search" id="player-search" name="player-search" placeholder="Find a Player"/>
            <input type="image" src={search} alt="Submit" className="submit-button"/>
        </form>
    )
}