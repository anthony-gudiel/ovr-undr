import '../styles/stats.css'
import Footer from './Footer'
import filterIcon from '../assets/filter.png'
import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, defaults} from 'chart.js';
import { toast } from 'sonner'
import { Bar } from 'react-chartjs-2';
import annotationPlugin from 'chartjs-plugin-annotation';
import ChartDataLabels from 'chartjs-plugin-datalabels';
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, annotationPlugin, ChartDataLabels);

defaults.maintainAspectRatio = false;
defaults.responsive = true;
defaults.color = '#FFFFFF';
defaults.font.family = "'Roboto', 'sans-serif'";

export default function NflPlayerStats() {
    
    let isFromUseEffect = false;
    const { state } = useLocation();
    let playerData = state.playerData;
    let newPlayerData = playerData.filter(data => data.Gcar !== null || data.Gcar2 !== null || data.Gcar3 !== null );
    let position = (newPlayerData[0].Position).slice(0,2);

    const [pageNum, setPageNum] = useState(1);
    const [numOfGames, setNumOfGames] = useState(5);
    const [statType, setStatType] = useState('MainYds');
    const [positionSlider, setPositionSlider] = useState(null);
    const [line, setLine] = useState(80);
    const [overOrUnder, setOverOrUnder] = useState('>');
    const [showFilters, setShowFilters] = useState(false);
    const [minutes, setMinutes] = useState(null);
    const [opponent, setOpponent] = useState(null);
    const [homeAway, setHomeAway] = useState(null);
    const [filteredData, setFilteredData] = useState(null);
    const [showOppButton, setShowOppButton] = useState(false);
    const [showMinButton, setShowMinButton] = useState(false);
    const [showHomeButton, setShowHomeButton] = useState(false);
    const [minutesInput, setMinutesInput] = useState(null);
    const [opponentInput, setOpponentInput] = useState(null);
    const [homeAwayInput, setHomeAwayInput] = useState(null);
    const [headshotYear, setHeadshotYear] = useState(2024);

    useEffect(() => {
        if (position == 'WR') {
            setPositionSlider('Receiving');
            setStatType('MainYds');
            setLine(60.5);
        }
        else if (position == 'RB') {
            setPositionSlider('Rushing');
            setStatType('MainYds');
            setLine(60.5);
        } 
        else if (position == 'QB') {
            setPositionSlider('Passing');
            setStatType('MainYds');
            setLine(220.5);
        };
        
        // Reset headshot year to 2024 when player changes
        setHeadshotYear(2024);
    }, [playerData])

    useEffect(() => {
        if ((opponent != null) || (minutes != null) || (homeAway != null)){
            isFromUseEffect = true;
            handleFilterSubmit();
        } else {
            setFilteredData(null);
        }
    }, [opponent, minutes, homeAway])

    function getSlicedData(){

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

            if (!minutesInput && !opponentInput && !homeAwayInput) {
                toast.error('Please fill in at least 1 field before submission.');
                return;
            }
            if (opponentInput && opponentInput.length != 3){
                toast.error('Please enter a valid team abbreviation (e.g. TOR).');
                return;
            }
            if (minutesInput && (minutesInput > 48 || minutesInput < 0)){
                toast.error('Please enter a minutes value from 0-48.');
                return;
            }
            if (homeAwayInput && homeAwayInput.length != 4){
                toast.error('Please specify "Home" or "Away"');
                return;
            }
            
        }

        let filtered = newPlayerData.filter(game => {
            if (!opponentInput && minutesInput && homeAwayInput){
                setHomeAway(homeAwayInput);
                setShowHomeButton(true);
                setMinutes(minutesInput);
                setShowMinButton(true);
                return game.MP >= minutes && (homeAwayInput == 'Home' ? game.Location == null : game.Location != null);
            } else if (!minutesInput && opponentInput && homeAwayInput){
                setHomeAway(homeAwayInput);
                setShowHomeButton(true);
                setOpponent(opponentInput);
                setShowOppButton(true);
                return game.Opp == opponent && (homeAwayInput == 'Home' ? game.Location == null : game.Location != null);
            } else if (minutesInput && opponentInput && !homeAwayInput){
                setOpponent(opponentInput);
                setMinutes(minutesInput);
                setShowMinButton(true);
                setShowOppButton(true);
                return (game.Opp == opponent) && (game.MP >= minutes);
            } else if (minutesInput && !opponentInput && !homeAwayInput) {
                setMinutes(minutesInput);
                setShowMinButton(true);
                return (game.MP >= minutes);
            } else if (opponentInput && !minutesInput && !homeAwayInput){
                setOpponent(opponentInput);
                setShowOppButton(true);
                return game.Opp == opponent;
            } else if (homeAwayInput && !minutesInput && !opponentInput){
                setHomeAway(homeAwayInput);
                setShowHomeButton(true);
                return (homeAwayInput == 'Home' ? game.Location == null : game.Location != null);
            } else if (homeAwayInput && minutesInput && opponentInput){
                setMinutes(minutesInput);
                setShowMinButton(true);
                setHomeAway(homeAwayInput);
                setShowHomeButton(true);
                setOpponent(opponentInput);
                setShowOppButton(true);
                return (game.Opp == opponent) && (homeAwayInput == 'Home' ? game.Location == null : game.Location != null) && (game.MP >= minutes);
            }
            return false;
        });

        if (filtered.length == 0 && isFromUseEffect){
            toast.error('No games were found matching the provided criteria.');
            isFromUseEffect = false;
        }

        setFilteredData(filtered);
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

    function handleImageError() {
        setHeadshotYear(prevYear => {
            const newYear = prevYear - 1;
            if (newYear >= 2010) {
                return newYear;
            } else {
                console.log('No headshot found for any available year');
                return prevYear;
            }
        });
    }



    return (
        <main>
            <h2 className='stats-header'>{newPlayerData[0].Name.replace('_', ' ')} Performance History</h2>
            <div className='player-card'>
                <div className='images'>
                    <img src={`https://www.pro-football-reference.com/req/20230307/images/headshots/${newPlayerData[0].pID}_${headshotYear}.jpg`}
                    alt="Player headshot" className='headshot' onError={handleImageError}/>
                </div>


                <div className='stats-container' id='chart2'>
                    <div className='stats'>
                        <Bar 
                            data={{
                                labels: getSlicedData().map(data => [data.Date, `${data.Location ? data.Location : ""} ${data.Opp}`]),
                                datasets : [
                                    {
                                        label: statType,
                                        data: getSlicedData().map(data => data[statType]),
                                        backgroundColor: getSlicedData().map(data => {
                                            if (data[statType] > line){
                                                if (overOrUnder == '>') return 'green';
                                                else return 'red';
                                            }
                                            else if (data[statType] < line){
                                                if (overOrUnder == '>') return 'red';
                                                else return 'green';
                                            } else return 'gray';
                                         })
                                    }
                                ]
                            }}
                            options={{
                                plugins: {
                                    legend: {
                                        display: false
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
                                        },
                                        padding: 30
                                    },
                                    datalabels: {
                                        anchor: 'end',
                                        align: 'top',
                                        color: 'white',
                                        font: {
                                            weight: 'bold'
                                        },
                                        formatter: (value) => value
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
                            <div className='stat-type' id='bar'>
                                <div className='position-slider'>
                                    <button id='receiving' onClick={() => setPositionSlider('Receiving')} className={`stat-button${positionSlider == 'Receiving' ? 'active' : ''}`}>RECEIVING</button>
                                    <button id='rushing' onClick={() => setPositionSlider('Rushing')} className={`stat-button${positionSlider == 'Rushing' ? 'active' : ''}`}>RUSHING</button>
                                    <button id='passing' onClick={() => setPositionSlider('Passing')} className={`stat-button${positionSlider == 'Passing' ? 'active' : ''}`}>PASSING</button>
                                </div>

                                { positionSlider == 'Receiving' ? <button onClick={(button) => {
                                    setStatType(button.target.value);
                                    if (position == 'QB') setLine(0.5);
                                    if (position == 'RB') setLine(21.5);
                                    else setLine(60.5);
                                } }
                                value={position == 'WR' ? 'MainYds' : 
                                    position == 'RB' ? 'RBRecYds/WRRushYds' :
                                    'Other'
                                } className={`stat-button${(statType == "MainYds") && (position == 'WR') || statType == 'RBRecYds/WRRushYds' && (position != 'WR') || statType == 'Other' ? '-active' : ""}`} id='YDS'>YDS</button> : ''}   

                                { positionSlider == 'Receiving' ? <button onClick={(button) => {
                                    setStatType(button.target.value);
                                    if (position == 'RB') setLine(2.5);
                                    else if (position == 'WR') setLine(4.5);
                                    else setLine(0.5);
                                } }
                                value="Rec" className={`stat-button${statType == "Rec" ? '-active' : ""}`} id='REC'>REC</button> : ''}

                                { positionSlider == 'Receiving' ? <button onClick={(button) => {
                                    setStatType(button.target.value);
                                    setLine(0.5);
                                } }
                                value={position == 'WR' ? "MainTD" : 
                                    position == 'RB' ? 'WRRushTD/QBRushTD/RBRecTD' :
                                    'Other2'
                                } className={`stat-button${statType ==  "MainTD" && (position == 'WR')|| statType ==  "WRRushTD/QBRushTD/RBRecTD" && (position != 'WR') || statType ==  "Other2" ? '-active' : ""}`} id='TD'>TD</button> : ''}  

                                { positionSlider == 'Rushing' ? <button onClick={(button) => {
                                    setStatType(button.target.value);
                                    if (position == 'RB') setLine(60.5);
                                    if (position == 'WR') setLine(2.5);
                                    if (position == 'QB') setLine(22.5);
                                } }
                                value={position == 'RB' ? 'MainYds' :
                                    position == 'QB' ? 'QBRushYds' :
                                    'RBRecYds/WRRushYds'
                                } className={`stat-button${statType ==  "RBRecYds/WRRushYds" || statType == 'QBRushYds' || (statType ==  "MainYds") && (position == 'RB')  ? '-active' : ""}`} id='RUSHYDS'>YDS</button> : ''}

                                { positionSlider == 'Rushing' ? <button onClick={(button) => {
                                    setStatType(button.target.value);
                                    if (position == 'RB') setLine(14.5);
                                    else if (position == 'QB') setLine(5.5);
                                    else setLine (1.5);
                                } }
                                value={position == 'WR' || position == 'RB' ? "Att" : "QBRushAtt"} className={`stat-button${statType == "Att" && (position == 'RB')|| statType == 'QBRushAtt' ? '-active' : ""}`} id='ATT'>ATT</button> : ''}   

                                { positionSlider == 'Rushing' ? <button onClick={(button) => {
                                    setStatType(button.target.value);
                                    setLine(0.5);
                                } }
                                value={position == 'RB' ? 'MainTD' :
                                    'WRRushTD/QBRushTD/RBRecTD'
                                } className={`stat-button${statType ==  "WRRushTD/QBRushTD/RBRecTD" || (statType == 'MainTD') && (position == 'RB') ? '-active' : ""}`} id='RUSHTD'>TD</button> : ''}

                                { positionSlider == 'Passing' ? <button onClick={(button) => {
                                    setStatType(button.target.value);
                                    setLine(220.5);
                                } }
                                value={position == 'QB' ? 'MainYds' : 'Other3'}  className={`stat-button${(statType == "MainYds") && (position == 'QB') || statType == 'Other3' ? '-active' : ""}`} id='PASSYDS'>YDS</button> : ''}  

                                { positionSlider == 'Passing' ? <button onClick={(button) => {
                                    setStatType(button.target.value);
                                    setLine(21.5);
                                } }
                                value="Cmp" className={`stat-button${statType == "Cmp" ? '-active' : ""}`} id='CMP'>CMP</button> : ''}   

                                { positionSlider == 'Passing' ? <button onClick={(button) => {
                                    setStatType(button.target.value);
                                    setLine(33.5);
                                } }
                                value={position == 'QB' ? 'Att' : 'Other'} className={`stat-button${statType == "Att" && (position == 'QB') || statType == 'Other' ? '-active' : ""}`} id='PASSATT'>ATT</button> : ''}

                                { positionSlider == 'Passing' ? <button onClick={(button) => {
                                    setStatType(button.target.value);
                                    setLine(1.5);
                                } }
                                value={position == 'QB' ? 'MainTD' : 'Other2'}  className={`stat-button${statType == "MainTD" || statType == 'Other2' ? '-active' : ""}`} id='PASSTD'>TD</button>: ''}

                                { positionSlider == 'Passing' ? <button onClick={(button) => {
                                    setStatType(button.target.value);
                                    setLine(0.5);
                                } }
                                value="Int" className={`stat-button${statType == "Int" ? '-active' : ""}`} id='INT'>INT</button>: ''}                            
                                

                            </div>
                            <div className='stat-type' id='last-games'>
                                <button onClick={event => setNumOfGames(event.target.value)} value="5"
                                 className={`stat-button${numOfGames == "5" ? '-active-games' : ""}`}>L5</button>
                                <button onClick={event => setNumOfGames(event.target.value)} value="10"
                                 className={`stat-button${numOfGames == "10" ? '-active-games' : ""}`}>L10</button>
                                <button onClick={event => setNumOfGames(event.target.value)} value="20"
                                 className={`stat-button${numOfGames == "20" ? '-active-games' : ""}`}>L20</button>
                                 <div>
                                    <button id='over' onClick={() => setOverOrUnder('>')} className={`${overOrUnder == '>' ? 'active-ou' : 'inactive-ou'}`}>O</button>
                                    <button id='under' onClick={() => setOverOrUnder('<')} className={`${overOrUnder == '<' ? 'active-ou' : 'inactive-ou'}`}>U</button>
                                    <select value={line} name='line' id='line' onChange={event => setLine(event.target.value)}>
                                        {[...Array(320)].map((_, i) => {
                                            const val = (i + 0.5);
                                            return (
                                                <option key={val} value={val}>{val}</option>
                                            );
                                        })}
                                    </select> 
                                </div>
                            </div>
                            <div className='line-container'>
                                <div className='dropdown'>
                                    <img src={filterIcon} className={filteredData ? "active-button" : null} onClick={() => setShowFilters(showFilters ? false : true)} alt='filter icon'></img>
                                    <button className={`filter${showMinButton ? "-show-exit" : ""}`} onClick={() => {
                                        setMinutes(null);
                                        setMinutesInput(null);
                                        setShowMinButton(false);
                                    }}> <small>x</small> Minutes</button>
                                    <button className={`filter${showOppButton ? "-show-exit" : ""}`} onClick={() => {
                                        setOpponent(null);
                                        setOpponentInput(null);
                                        setShowOppButton(false);
                                    }}><small>x</small> Opponent</button>
                                    <button className={`filter${showHomeButton ? "-show-exit" : ""}`} onClick={() => {
                                        setHomeAway(null);
                                        setHomeAwayInput(null);
                                        setShowHomeButton(false);
                                    }}><small>x</small> Home/Away</button>
                                    <form className={showFilters ? 'show-form' : 'hide-form'} onSubmit={handleFilterSubmit}>
                                        <label htmlFor='opponent' className={`filter${showFilters ? "-show" : ""}`}>Opponent:</label>
                                        <input type='text' placeholder='TOR' id='opponent' name='opponent' className={`filter${showFilters ? "-show" : ""}`} onChange={event => setOpponentInput(event.target.value)}></input>
                                        <label htmlFor='homeAway' className={`filter${showFilters ? "-show" : ""}`}>Home or Away:</label>
                                        <input type='text' placeholder='Home' id='homeAway' name='homeAway' className={`filter${showFilters ? "-show" : ""}`} onChange={event => setHomeAwayInput(event.target.value)}></input>
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