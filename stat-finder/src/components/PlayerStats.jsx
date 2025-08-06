import '../styles/stats.css'
import Footer from './Footer'
import filterIcon from '../assets/filter.png'
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
    const [overOrUnder, setOverOrUnder] = useState('>');
    const [showFilters, setShowFilters] = useState(false);
    const [minutes, setMinutes] = useState(null);
    const [opponent, setOpponent] = useState(null);
    const [filteredData, setFilteredData] = useState(null);
    const [showOppButton, setShowOppButton] = useState(false);
    const [showMinButton, setShowMinButton] = useState(false);
    const [minutesInput, setMinutesInput] = useState(null);
    const [opponentInput, setOpponentInput] = useState(null);

    useEffect(() => {
        if ((opponent != null) || (minutes != null)){
            handleFilterSubmit();
        } else {
            setFilteredData(null);
        }
    }, [opponent, minutes])

    useEffect(() => {
        console.log("showOppButton: " + showOppButton );
        console.log("showMinButton: " + showMinButton);
    }, [showOppButton, showMinButton])

    function getSlicedData()
    {
        const dataSource = filteredData ? filteredData : newPlayerData;
        const totalGames = dataSource.length;
        const gamesToShow = Math.min(numOfGames, totalGames);
        const startIndex = Math.max(0, totalGames - (gamesToShow * pageNum));
        const endIndex = totalGames - (gamesToShow * (pageNum - 1));
        
        return dataSource.slice(startIndex, endIndex);
    };

    function handleFilterSubmit(event){

        if (event) {
            event.preventDefault();
            event.currentTarget.reset();
        }

        setFilteredData(newPlayerData.filter(game => {
            if (!opponentInput){
                setMinutes(minutesInput);
                setShowMinButton(true);
                return game.MP >= minutes;
            } else if (!minutesInput){
                setOpponent(opponentInput);
                setShowOppButton(true);
                return game.Opp == opponent;
            } else if (minutesInput && opponentInput){
                setOpponent(opponentInput);
                setMinutes(minutesInput);
                setShowMinButton(true);
                setShowOppButton(true);
                return (game.Opp == opponent) && (game.MP >= minutes);
            } 
        }));

        setPageNum(1);
        setShowFilters(null);
    }

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
            if (prev <= ((filteredData ? filteredData : newPlayerData).length / numOfGames)) {
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
                                labels: getSlicedData().map(data => [data.Date, `${data.Home ? data.Home : ""} ${data.Opp}`]),
                                datasets : [
                                    {
                                        label: statType,
                                        data: getSlicedData().map(data => {
                                            if (statType.length <= 3) return data[statType] ;
                                            else if (statType.length == 11) return data[statType.slice(0,3)] + data[statType.slice(4,7)] + data[statType.slice(8, 11)];
                                            else return data[statType.slice(0, 3)] + data[statType.slice(4, 7)];
                                        }),
                                        backgroundColor: getSlicedData().map(data => {
                                                if (statType.length <= 3) {
                                                    if (data[statType] > line){
                                                        if (overOrUnder == '>') return 'green';
                                                        else return 'red';
                                                    }
                                                    else if (data[statType] < line){
                                                        if (overOrUnder == '>') return 'red';
                                                        else return 'green';
                                                    } else return 'gray';
                                                    } else if (statType.length == 11){
                                                        if ((data[statType.slice(0,3)] + data[statType.slice(4,7)] + data[statType.slice(8, 11)]) > line){
                                                            if (overOrUnder == '>') return 'green';
                                                            else return 'red';
                                                        } 
                                                        else if ((data[statType.slice(0,3)] + data[statType.slice(4,7)] + data[statType.slice(8, 11)]) < line){
                                                            if (overOrUnder == '>') return 'red';
                                                            else return 'green';
                                                        }
                                                        else return "gray"
                                                } else {
                                                    if (data[statType.slice(0, 3)] + data[statType.slice(4, 7)] > line){
                                                        if (overOrUnder == '>') return 'green';
                                                        else return 'red';
                                                    } else if (data[statType.slice(0, 3)] + data[statType.slice(4, 7)] < line ){
                                                        if (overOrUnder == '>') return 'red';
                                                        else return 'green';
                                                    } else return 'gray'
                                                }
                                         })
                                    }
                                ]
                            }}
                            options={{
                                plugins: {
                                    legend: {
                                        labels: {
                                            boxWidth: 15,
                                            generateLabels: () => [
                                            { text: `${statType} ${overOrUnder} ${line}`, fillStyle: 'green'},
                                            { text: `${statType} = ${line}`, fillStyle: 'gray'},
                                            { text: `${statType} ${overOrUnder == '>' ? '<' : '>'} ${line}`, fillStyle: 'red' }
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
                                <button onClick={(button) => setStatType(button.target.value) }
                                value="PTS" className={`stat-button${statType == "PTS" ? '-active' : ""}`} id='PTS'>PTS</button>
                                <button onClick={(button) => setStatType(button.target.value) }
                                value="TRB" className={`stat-button${statType == "TRB" ? '-active' : ""}`} id='REB'>REB</button>
                                <button onClick={(button) => setStatType(button.target.value) }
                                value="AST" className={`stat-button${statType ==  "AST" ? '-active' : ""}`} id='AST'>AST</button>
                                <button onClick={(button) => setStatType(button.target.value) }
                                value="3P" className={`stat-button${statType == "3P" ? '-active' : ""}`} id='3PM'>3PM</button>
                                <button onClick={(button) => setStatType(button.target.value) }
                                value="STL" className={`stat-button${statType ==  "STL" ? '-active' : ""}`} id='STL'>STL</button>
                                <button onClick={(button) => setStatType(button.target.value) }
                                value="BLK" className={`stat-button${statType == "BLK" ? '-active' : ""}`} id='BLK'>BLK</button>
                                <button onClick={(button) => setStatType(button.target.value) }
                                value="PTS+AST" className={`stat-button${statType == "PTS+AST" ? '-active' : ""}`} id='PTS_AST'>PTS + AST</button>
                                <button onClick={(button) => setStatType(button.target.value) }
                                value="PTS+TRB" className={`stat-button${statType == "PTS+TRB" ? '-active' : ""}`} id='PTS_REB'>PTS + REB</button>
                                <button onClick={(button) => setStatType(button.target.value) }
                                value="TRB+AST" className={`stat-button${statType == "TRB+AST" ? '-active' : ""}`} id='REB_AST'>REB + AST</button>
                                <button onClick={(button) => setStatType(button.target.value) }
                                value="PTS+TRB+AST" className={`stat-button${statType == "PTS+TRB+AST" ? '-active' : ""}`} id='PTS_REB_AST'>P + R + A</button>
                                <button onClick={(button) => setStatType(button.target.value) }
                                value="STL+BLK" className={`stat-button${statType == "STL+BLK" ? '-active' : ""}`} id='STL_BLK'>STL + BLK</button>
                            </div>
                            <div className='stat-type' id='last-games'>
                                <button onClick={event => setNumOfGames(event.target.value)} value="5"
                                 className={`stat-button${numOfGames == "5" ? '-active-games' : ""}`}>L5</button>
                                <button onClick={event => setNumOfGames(event.target.value)} value="10"
                                 className={`stat-button${numOfGames == "10" ? '-active-games' : ""}`}>L10</button>
                                <button onClick={event => setNumOfGames(event.target.value)} value="20"
                                 className={`stat-button${numOfGames == "20" ? '-active-games' : ""}`}>L20</button>
                            </div>
                            <div className='line-container'>
                                <button id='over' onClick={() => setOverOrUnder('>')} className={`${overOrUnder == '>' ? 'active-ou' : 'inactive-ou'}`}>O</button>
                                <button id='under' onClick={() => setOverOrUnder('<')} className={`${overOrUnder == '<' ? 'active-ou' : 'inactive-ou'}`}>U</button>
                                <select value={line} name='line' id='line' onChange={event => setLine(event.target.value)}>
                                    {[...Array(60)].map((_, i) => {
                                        const val = (i + 0.5);
                                        return (
                                            <option key={val} value={val}>{val}</option>
                                        );
                                    })}
                                </select> 
                                <div className='dropdown'>
                                    <img src={filterIcon} className={filteredData ? "active-button" : null} onClick={() => setShowFilters(showFilters ? false : true)} alt='filter icon'></img>
                                    <button className={`filter${showMinButton ? "-show-exit" : ""}`} onClick={() => {
                                        setShowFilters(null);
                                        setMinutes(null);
                                        setMinutesInput(null);
                                        setShowMinButton(false);
                                    }}> <small>x</small> Minutes</button>
                                    <button className={`filter${showOppButton ? "-show-exit" : ""}`} onClick={() => {
                                        setShowFilters(null);
                                        setOpponent(null);
                                        setOpponentInput(null);
                                        setShowOppButton(false);
                                    }}><small>x</small> Opponent</button>
                                    <form onSubmit={handleFilterSubmit}>
                                        <label htmlFor='opponent' className={`filter${showFilters ? "-show" : ""}`}>Opponent:</label>
                                        <input type='text' placeholder='e.g. TOR' id='opponent' name='opponent' className={`filter${showFilters ? "-show" : ""}`} onChange={event => setOpponentInput(event.target.value)}></input>
                                        <label htmlFor='minutes' className={`filter${showFilters ? "-show" : ""}`}>Minutes Played:</label>
                                        <input type='number' placeholder='30' id='minutes' name='minutes' className={`filter${showFilters ? "-show" : ""}`} onChange={event => setMinutesInput(event.target.value)}></input>
                                        <button type="submit" className='filter'></button>
                                    </form>
                                </div>
                            </div>
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