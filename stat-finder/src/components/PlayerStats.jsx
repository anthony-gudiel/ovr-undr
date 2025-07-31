import '../styles/stats.css'
import Footer from './Footer'
import Search from './Search'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, defaults} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, annotationPlugin);

defaults.maintainAspectRatio = false;
defaults.responsive = true;
defaults.color = '#FFFFFF'

export default function PlayerStats() {

    const { state } = useLocation();
    const playerData = state.playerData;
    const newPlayerData = playerData.filter(data => data.Gcar !== null)

    const [pageNum, setPageNum] = useState(1);

    function handlePrev() {
        setPageNum(prev => {
            if (prev >= 2) {
                console.log('Succesfully decremented pageNum.');
                return (prev - 1);
            } else {
                console.log('Unable to decrement pageNum.')
                return prev;
            }
        })
    };

    function handleNext() {
        setPageNum(prev => {
            if (prev < (newPlayerData.length / 10)) {
                console.log('Succesfully incremented pageNum.');
                return (prev + 1);
            } else {
                console.log("Unable to increment pageNum.")
                return prev;
            }
        })
    }


    // console.log(playerData);

    return (
        <main>
            <h2 className='stats-header'>Scottie Barnes Performance History</h2>
            <div className='player-card'>
                <img src='https://www.basketball-reference.com/req/202106291/images/headshots/barnesc01.jpg'
                alt="Player headshot" className='headshot'/>
                <img src='https://cdn.ssref.net/req/202507211/tlogo/bbr/TOR.png'
                alt="Player headshot" className='headshot'/>
                
                <div className='stats-container' id='chart'>
                    <div className='stats'>
                        <Bar 
                            data={{
                                labels: newPlayerData.slice((pageNum * 10) - 10, pageNum * 10).map((data) => data.Date),
                                datasets : [
                                    {
                                        label: "PTS",
                                        data: newPlayerData.slice((pageNum * 10) - 10, pageNum * 10).map(data => data.PTS),
                                        backgroundColor: newPlayerData.slice((pageNum * 10) - 10, pageNum * 10).map(data => data.PTS > 19 ? "green" 
                                           : data.PTS == 19 ? "gray" 
                                           : "red"),
                                    }
                                ]
                            }}
                            options={{
                                plugins: {
                                    legend: {
                                        labels: {
                                            generateLabels: () => [
                                            { text: 'PTS > 19', fillStyle: 'green' },
                                            { text: 'PTS = 19', fillStyle: 'gray' },
                                            { text: 'PTS < 19', fillStyle: 'red' }
                                            ]
                                        }
                                    },
                                    annotation: {
                                        annotations: {
                                            line1: {
                                                type: 'line',
                                                yMin: 19,
                                                yMax: 19,
                                                borderColor: 'white',
                                                borderWidth: 2,
                                                borderDash: [6, 6],
                                            }
                                        }
                                    }
                                }
                            }}
                            height={600}
                            width={1160}
                        />
                    </div>
                </div>

                <div className='stats-controls'>
                    <div className='stats-container' id='buttons'>
                        <div className='pagination'>
                            <button className='neu-button' onClick={handlePrev}>Prev 10</button>
                            <button className='neu-button' onClick={handleNext}>Next 10</button>
                        </div>
                    </div>
                </div>

            </div>

            <Footer />

        </main>
    )
}