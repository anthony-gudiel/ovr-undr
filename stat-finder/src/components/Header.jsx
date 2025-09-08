import '../styles/header.css'
import logo from '../assets/logo.png'
import { Outlet, Link } from 'react-router-dom'
import Search from './Search.jsx'

export default function Header(props) {
    return (
        <header className='container'>
            <img src={logo} alt="Logo" className='nba-logo' />
            <nav aria-label="Main navigation">
                <ul>
                    <li>
                        <Link to='/'>Home</Link>
                    </li>
                    <li>
                        <Link to='/'>Features</Link>
                    </li>
                    <li>
                        <Link to='/about'>About</Link>
                    </li>
                    <li>
                        <Link to='/contact'>Contact</Link>
                    </li>
                </ul>
            </nav>
            <Outlet />
                <div className='small-search'>
                    <Search onClick={props.handleSearch} 
                    league={props.league} 
                    changeToNba={props.changeToNba} 
                    changeToNfl={props.changeToNfl}/>
                </div>
        </header>
    )
}