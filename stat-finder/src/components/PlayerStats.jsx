import '../styles/stats.css'
import Footer from './Footer'
import Search from './Search'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, defaults} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, annotationPlugin);

defaults.maintainAspectRatio = false;
defaults.responsive = true;
defaults.color = '#FFFFFF';
defaults.font.family = "'Roboto', 'sans-serif'";

export default function PlayerStats() {
    
    const { state } = useLocation();
    let playerData = state.playerData;
    let newPlayerData = playerData.filter(data => data.Gcar !== null);

    const [pageNum, setPageNum] = useState(1);
    const [numOfGames, setNumOfGames] = useState(5);
    const [statType, setStatType] = useState('PTS');
    const [line, setLine] = useState(19.5);

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
            if (prev <= (newPlayerData.length / numOfGames)) {
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
            <h2 className='stats-header'>{newPlayerData[0].Name.replace('_', ' ')} Performance History</h2>
            <div className='player-card'>
                <div className='images'>
                    <img src={`https://www.basketball-reference.com/req/202106291/images/headshots/${newPlayerData[0].pID}.jpg`}
                    alt="Player headshot" className='headshot'/>
                    <img src={`https://cdn.ssref.net/req/202507211/tlogo/bbr/${newPlayerData[0].Team}.png`}
                    alt="Player headshot" className='headshot'/>
                </div>
                
                <div className='stats-container' id='chart'>
                    <div className='stats'>
                        <Bar 
                            data={{
                                labels: newPlayerData.slice((newPlayerData.length) - (numOfGames * pageNum), (newPlayerData.length) - (numOfGames * (pageNum - 1)))
                                .map(data => [data.Date, `${data.Home ? data.Home : ""} ${data.Opp}`]),
                                datasets : [
                                    {
                                        label: statType,
                                        data: newPlayerData.slice((newPlayerData.length) - (numOfGames * pageNum), (newPlayerData.length) - (numOfGames * (pageNum - 1))).map(data => data[statType]),
                                        backgroundColor: newPlayerData.slice((newPlayerData.length) - (numOfGames * pageNum), (newPlayerData.length) - (numOfGames * (pageNum - 1))).map(data => data[statType] > line ? "green" 
                                           : data[statType] == line ? "gray" 
                                           : "red"),
                                    }
                                ]
                            }}
                            options={{
                                plugins: {
                                    legend: {
                                        labels: {
                                            boxWidth: 15,
                                            generateLabels: () => [
                                            { text: `${statType} > ${line}`, fillStyle: 'green'},
                                            { text: `${statType} = ${line}`, fillStyle: 'gray'},
                                            { text: `${statType} < ${line}`, fillStyle: 'red' }
                                            ]
                                        }
                                    },
                                    annotation: {
                                        annotations: {
                                            line1: {
                                                type: 'line',
                                                yMin: line,
                                                yMax: line,
                                                borderColor: 'white',
                                                borderWidth: 2,
                                                borderDash: [6, 6]
                                            }
                                        }
                                    },
                                    title: {
                                        display: true,
                                        text: `${newPlayerData[0].Name.replace('_', ' ')} - ${statType}`,
                                        font: {
                                            size: 30
                                        }
                                    }
                                }
                            }}
                            width={1200}
                        />
                    </div>
                </div>


                <div className='stats-controls'>
                    <div className='stats-container' id='buttons'>
                        <div className='filters'>
                            <div className='stat-type'>
                                <button onClick={(button) => setStatType(button.target.value) }value="PTS" className={`stat-button${statType == "PTS" ? '-active' : ""}`} id='PTS'>PTS</button>
                                <button onClick={(button) => setStatType(button.target.value) }value="TRB" className={`stat-button${statType == "TRB" ? '-active' : ""}`} id='REB'>REB</button>
                                <button onClick={(button) => setStatType(button.target.value) }value="AST" className={`stat-button${statType ==  "AST" ? '-active' : ""}`} id='AST'>AST</button>
                                <button onClick={(button) => setStatType(button.target.value) }value="3P" className={`stat-button${statType == "3P" ? '-active' : ""}`} id='3PM'>3PM</button>
                                <button onClick={(button) => setStatType(button.target.value) }value="STL" className={`stat-button${statType ==  "STL" ? '-active' : ""}`} id='STL'>STL</button>
                                <button onClick={(button) => setStatType(button.target.value) }value="BLK" className={`stat-button${statType == "BLK" ? '-active' : ""}`} id='BLK'>BLK</button>
                                <button onClick={(button) => setStatType(button.target.value) }value="PTS_AST" className={`stat-button${statType == "PTS_AST" ? '-active' : ""}`} id='PTS_REB'>PTS + AST</button>
                                <button onClick={(button) => setStatType(button.target.value) }value="PTS_REB" className={`stat-button${statType == "PTS_REB" ? '-active' : ""}`} id='REB_AST'>PTS + REB</button>
                                <button onClick={(button) => setStatType(button.target.value) }value="REB_AST" className={`stat-button${statType == "REB_AST" ? '-active' : ""}`} id='PTS_AST'>REB + AST</button>
                                <button onClick={(button) => setStatType(button.target.value) }value="PTS_REB_AST" className={`stat-button${statType == "PTS_REB_AST" ? '-active' : ""}`} id='PTS_REB_AST'>P + R + A</button>
                                <button onClick={(button) => setStatType(button.target.value) }value="STL_BLK" className={`stat-button${statType == "STL_BLK" ? '-active' : ""}`} id='STL_BLK'>STL + BLK</button>
                            </div>
                            <div className='stat-type' id='last-games'>
                                <button onClick={event => setNumOfGames(event.target.value)} value="5" className={`stat-button${numOfGames == "5" ? '-active-games' : ""}`}>L5</button>
                                <button onClick={event => setNumOfGames(event.target.value)} value="10" className={`stat-button${numOfGames == "10" ? '-active-games' : ""}`}>L10</button>
                                <button onClick={event => setNumOfGames(event.target.value)} value="20" className={`stat-button${numOfGames == "20" ? '-active-games' : ""}`}>L20</button>
                            </div>
                            <label for="line">Set Line: </label>
                            <select value={line} name='line' id='line' onChange={event => setLine(event.target.value)}>
                                {[...Array(60)].map((_, i) => {
                                    const val = (i + 0.5);
                                    return (
                                        <option key={val} value={val}>{val}</option>
                                    );
                                })}
                            </select> 
                        </div>
                        <div className='pagination'>
                            <button className='neu-button' onClick={handleNext}>Prev {numOfGames}</button>
                            <button className='neu-button' onClick={handlePrev}>Next {numOfGames}</button>
                        </div>
                    </div>

                </div>

            </div>
            
            <Footer />

        </main>
    )
}