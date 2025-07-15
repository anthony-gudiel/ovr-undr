import '../styles/stats.css'
import Footer from './Footer'
import Search from './Search'

export default function PlayerStats() {
    return (
        <main>
            <h2 className='stats-header'>Scottie Barnes Performance History</h2>
            <Search />
            <div className='player-card'>
                <img src='https://www.basketball-reference.com/req/202106291/images/headshots/barnesc01.jpg'
                alt="Player headshot" className='headshot'/>

                <div className='stats-container'>
                    <div className='stats'>
                        <p>There will be stats here</p>
                        <p>There will be more stats here</p>
                    </div>

                    <div className='stats'>
                        <p>There will be stats here</p>
                        <p>There will be more stats here</p>
                    </div>
                </div>


                <div className='stats-container' id='filter'>
                    <div className='stats'>
                        <p>This is where the user will be able to filter results based on different criteria</p>
                    </div>
                </div>

                <div className='stats-container' id='filter'>
                    <div className='stats'>
                        <p>This is where the user will be able to filter results based on different criteria</p>
                    </div>
                </div>

            </div>

            <Footer />

        </main>
    )
}