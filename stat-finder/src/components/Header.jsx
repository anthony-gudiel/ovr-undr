import '../styles/header.css'
import logo from '../assets/logo.png'
import dropdown from '../assets/dropdown.png'
import { Outlet, Link } from 'react-router-dom'

export default function Header() {

    return (
        <header className='container'>
            <img src={logo} alt="Logo" className='nba-logo' />
            <nav aria-label="Main navigation">
                <ul>
                    <li>
                        <Link to='/about'>About</Link>
                    </li>
                    <li>
                        <Link to='/contact'>Contact</Link>
                    </li>
                    <li>
                        <Link to='/'>Start Research</Link>
                    </li>
                    <li>
                        <Link to='/'>Features</Link>
                    </li>
                </ul>
            </nav>
            <Outlet />
            <img src={dropdown} alt="Dropdown icon" className='dropdown'/>
        </header>
    )
}