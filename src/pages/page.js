import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto'; 
import axios from 'axios';
import '../styles/page.css';
import '../styles/player.css';
import '../styles/graph.css';

const Page = () => {

    const [leagueValue, setLeagueValue] = useState('');
    const [yearValue, setYearValue] = useState('');
    const [clubValue, setClubValue] = useState('');
    const [nameValue, setNameValue] = useState('');

    const [teamData, setTeamData] = useState([]);
    const [playerData, setPlayerData] = useState([]);

    const [statsData, setStatsData] = useState([]);
    const [barLabels, setBarLabels] = useState([]);
      
    const handleLeagueChange = (event) => {
        setLeagueValue(event.target.value);
    };

    const handleYearChange = (event) => {
        setYearValue(event.target.value);
    };

    const handleClubChange = (event) => {
        setClubValue(event.target.value);
    };

    const handleNameChange = (event) => {
        setNameValue(event.target.value);
    };
    
    const isClubDisabled = !leagueValue || !yearValue;
    const isNameDisabled = !clubValue;

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/fetchTeams?league=${leagueValue}&season=${yearValue}`);
                setTeamData(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchPlayers = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/fetchPlayers?league=${leagueValue}&season=${yearValue}&team=${clubValue}`);
                setPlayerData(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchStats = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/fetchStats?league=${leagueValue}&season=${yearValue}&team=${clubValue}&name=${nameValue}`);
                stripStats(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        // Check if both leagueValue and yearValue are not empty before making the API call
        if (leagueValue && yearValue && clubValue && nameValue) {
            fetchStats();
        } else if (leagueValue && yearValue && clubValue) {
            fetchPlayers();
        } else if (leagueValue && yearValue) {
            fetchTeams();
            //testStats();
        }

        // Once values have changed
    }, [leagueValue, yearValue, clubValue, nameValue]);

    useEffect(() => {
        if (statsData && statsData.length > 0) {
                
            let radarChart = null;   
            const radarChartCanvas = document.getElementById('radarChart').getContext('2d');
            const graphSpace = document.getElementById('graph-square');
            graphSpace.classList.add('graph-visible');

            Chart.defaults.scale.ticks.beginAtZero = true;
            Chart.defaults.borderColor = '#000D2E';
            Chart.defaults.color = '#000D2E';

            radarChart = new Chart(radarChartCanvas, {
                type: 'radar',
                data: {
                    labels: barLabels,
                    datasets: [
                        {
                            label: 'Bukayo Saka',
                            backgroundColor: 'rgba(00, 255, 00, 0.1)',
                            borderColor: 'rgba(00, 255, 00, 0.5)',
                            borderWidth: 2,
                            data: statsData,
                        },
                        {
                            label: 'Phil Foden',
                            backgroundColor: 'rgba(00, 00, 255, 0.1)',
                            borderColor: 'rgba(00, 00, 255, 0.5)',
                            borderWidth: 2,
                            data: [0.12, 0.15, 0.23, 0.12, 0.12, 0.45, 0.42, 0.04, 0.20],
                        },
                    ],
                },
                options: {
                    responsive: true,
                },
            });

            
            return () => {
                radarChart.destroy()
            }
        }
    }, [statsData]);

    function testStats() {
        var forwardStats = [0.10, 0.30, 0.30, 0.2, 0.78, 0.3, 0.65, 0.12, 0.02];
        setStatsData(forwardStats);
        var forwardLabels = ['Goals', 'Shots', 'Shots On Target', 'Duels Won', 'Duels Won Rate', 'Dribbles', 'Dribbles Rate', 'Fouls Drawn', 'Penalties Won'];
        setBarLabels(forwardLabels);
    }

    function stripStats(statsData) {

        var stats = statsData[0].statistics[0];
        //console.log(stats);
        var full90s = stats.games.minutes/90;

        // Forward Stats
        var goals = (stats.goals.total / full90s).toFixed(2);
        var shots = (stats.shots.total / full90s).toFixed(2);
        var shotsOnTarget = (stats.shots.on / full90s).toFixed(2); 
        var duelsWon = (stats.duels.won / full90s).toFixed(2);
        var duelsWonRate = ((stats.duels.won / stats.duels.total)).toFixed(2);
        var dribbles = (stats.dribbles.success / full90s).toFixed(2);
        var dribblesRate = ((stats.dribbles.success / stats.dribbles.attempts)).toFixed(2);
        var foulsDrawn = (stats.fouls.drawn / full90s).toFixed(2);
        var penaltiesWon = (stats.penalty.won / full90s).toFixed(2);

        var forwardStats = [goals, shots, shotsOnTarget, duelsWon, duelsWonRate, dribbles, dribblesRate, foulsDrawn, penaltiesWon];
        setStatsData(forwardStats);

        var forwardLabels = ['Goals', 'Shots', 'Shots On Target', 'Duels Won', 'Duels Won Rate', 'Dribbles', 'Dribbles Rate', 'Fouls Drawn', 'Penalties Won'];
        setBarLabels(forwardLabels);


        // Midfield Stats
        var assists = (stats.goals.assists / full90s).toFixed(2);
        var passes = ((stats.passes.total*stats.passes.accuracy/100) / full90s).toFixed(2);
        var passessRate = stats.passes.accuracy.toFixed(2);
        var duelsWon;
        var duelsWonRate;
        var foulsDrawn;
        var foulsCommitted = (stats.fouls.committed / full90s).toFixed(2);

        var midfieldStats = [assists, passes, passessRate, duelsWon, duelsWonRate, foulsDrawn, foulsCommitted];
        //console.log(midfieldStats);

        // Defence Stats
        var tackles = (stats.tackles.total / full90s).toFixed(2);
        var blocks = (stats.tackles.blocks / full90s).toFixed(2);
        var interceptions = (stats.tackles.interceptions / full90s).toFixed(2);
        var dribbledPast = (stats.dribbles.past / full90s).toFixed(2);
        var foulsCommitted;
        var yellows = (stats.cards.yellow / full90s).toFixed(2);
        var reds = (stats.cards.red / full90s).toFixed(2);
        var penaltiesCommited = (stats.penalty.commited / full90s).toFixed(2);

        var defenceStats = [tackles, blocks, interceptions, dribbledPast, foulsCommitted, yellows, reds, penaltiesCommited];
        //console.log(defenceStats);
    
    }

    return (
      <>
        <div class="main-page row">
            <div class="stats-side">
                <div class="players">
                    <div class="player">
                        <h4>Choose a Player</h4>
                        <div class="dropdowns">
                            <div class="season">
                                <div class="league">
                                    <label htmlFor="league">League </label>
                                    <select id="league" class="league" value={leagueValue} onChange={handleLeagueChange}>
                                        <option value="" defaultValue></option>
                                        <option value="39">Premier League</option>
                                        <option value="140">La Liga</option>
                                        <option value="135">Serie A</option>
                                        <option value="78">Bundesliga</option>
                                        <option value="61">Ligue 1</option>
                                    </select>
                                </div>

                                <div class="year">
                                    <label htmlFor="year">Year </label>
                                    <select id="year" class="year" value={yearValue} onChange={handleYearChange}>
                                        <option value="" defaultValue></option>
                                        <option value="2023">23/24</option>
                                        <option value="2022">22/23</option>
                                        <option value="2021">21/22</option>
                                        <option value="2020">20/21</option>
                                        <option value="2019">19/20</option>
                                        <option value="2018">18/19</option>
                                        <option value="2017">17/18</option>
                                        <option value="2016">16/17</option>
                                        <option value="2015">15/16</option>
                                        <option value="2014">14/15</option>
                                        <option value="2013">13/14</option>
                                        <option value="2012">12/13</option>
                                        <option value="2011">11/12</option>
                                        <option value="2010">10/11</option>
                                    </select>
                                </div>
                            </div>

                            <label htmlFor="club">Club </label>
                            <select id="club" class="club" value={clubValue} onChange={handleClubChange} disabled={isClubDisabled}>
                                <option value="" defaultValue></option>
                                {/* Map over the team data and populate the club dropdown */}
                                {teamData.map((team) => (
                                <option key={team.id} value={team.id}>
                                    {team.name}
                                </option>
                                ))};
                            </select>

                            <label htmlFor="name">Name </label>
                            <select id="club" class="club" value={nameValue} onChange={handleNameChange} disabled={isNameDisabled}>
                                <option value="" defaultValue></option>
                                {/* Map over the team data and populate the club dropdown */}
                                {playerData.map((player) => (
                                <option key={player.id} value={player.id}>
                                    {player.name}
                                </option>
                                ))};
                            </select>
                        </div>

                    </div>


                    <div class="player">
                        
                    </div>
                </div>
            </div>
            <div class="graph-side">
                <div class="graph-container">
                    <div id="graph-square" class="graph-square">
                        <div class="names-header">

                        </div>
                        <div class="attributes-header">
                            
                        </div>
                        <canvas id="radarChart" class="radar-chart"></canvas>
                    </div>
                </div>
            </div>
        </div>
      </>
    );
}

export default Page;