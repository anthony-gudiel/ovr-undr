import '../styles/header.css'
import logo from '../assets/logo.png'
import dropdown from '../assets/dropdown.png'


export default function Header() {
    return (
        <header className='container'>
            <img src={logo} alt="NBA logo" className='nba-logo'/>
            <ul>
                <li>About Us</li>
                <li>Contact Us</li>
                <li>Start Research</li>
                <li>Features</li>
            </ul>
            <img src={dropdown} alt="Dropdown icon" className='dropdown'/>
        </header>
    )
}