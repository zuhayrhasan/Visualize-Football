import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Player = ({ playerID, onStatsChange }) => {

    const [leagueValue, setLeagueValue] = useState('');
    const [yearValue, setYearValue] = useState('');
    const [clubValue, setClubValue] = useState('');
    const [nameValue, setNameValue] = useState('');

    const [leagueName, setLeagueName] = useState('');
    const [yearName, setYearName] = useState('');
    const [clubName, setClubName] = useState('');
    const [chosenPlayer, setChosenPlayer] = useState('');

    const [teamData, setTeamData] = useState([]);
    const [playerData, setPlayerData] = useState([]);

    
    const handleLeagueChange = (event) => {
        setLeagueValue(event.target.value);
        setLeagueName(event.target.options[event.target.selectedIndex].text);

        if (leagueValue && leagueValue != event.target.value) {
            onStatsChange(null);
        }

        setClubValue('');
        setClubName('');
        setNameValue('');
        setChosenPlayer('');
    };

    const handleYearChange = (event) => {
        setYearValue(event.target.value);
        setYearName(event.target.options[event.target.selectedIndex].text);

        if (yearValue && yearValue != event.target.value) {
            onStatsChange(null);
        }

        setClubValue('');
        setClubName('');
        setNameValue('');
        setChosenPlayer('');
    };

    const handleClubChange = (event) => {
        setClubValue(event.target.value);
        setClubName(event.target.options[event.target.selectedIndex].text);

        if (clubValue && clubValue != event.target.value) {
            onStatsChange(null);
        }

        setNameValue('');
        setChosenPlayer('');
    };

    const handleNameChange = (event) => {
        setNameValue(event.target.value);
    };
    
    const isClubDisabled = !leagueValue || !yearValue;
    const isNameDisabled = !clubValue;

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const response = await axios.get(`https://visualizefootball.netlify.app/fetchTeams?league=${leagueValue}&season=${yearValue}`);
                setTeamData(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchPlayers = async () => {
            try {
                const response = await axios.get(`https://visualizefootball.netlify.app/fetchPlayers?league=${leagueValue}&season=${yearValue}&team=${clubValue}`);
                setPlayerData(response.data);
            } catch (error) {
                setChosenPlayer(null);
                console.error(error);
            }
        };

        const fetchStats = async () => {
            try {
                const response = await axios.get(`https://visualizefootball.netlify.app/fetchStats?league=${leagueValue}&season=${yearValue}&team=${clubValue}&name=${nameValue}`);
                //stripStats(response.data);
                console.log(response.data);
                onStatsChange(response.data);
                setChosenPlayer(response.data);
            } catch (error) {
                setChosenPlayer(null);
                console.error(error);
            }
        };


        if (leagueValue && yearValue && clubValue && nameValue) {
            fetchStats();
        } else if (leagueValue && yearValue && clubValue) {
            fetchPlayers();
        } else if (leagueValue && yearValue) {
            fetchTeams();
        }


        // Once values have changed
    }, [leagueValue, yearValue, clubValue, nameValue]);

    return (
        <div className="player" id={playerID}>
            <h4>Choose a Player</h4>
            <div className="dropdowns">

                <div class="dropdown-row first-row">
                    <div class="first-row league-item">
                        <label htmlFor="league">League </label>
                        <select
                            id="league"
                            className=""
                            value={leagueValue}
                            onChange={handleLeagueChange}
                        >
                            <option value="" defaultValue></option>
                            <option value="39">Premier League</option>
                            <option value="140">La Liga</option>
                            <option value="135">Serie A</option>
                            <option value="78">Bundesliga</option>
                            <option value="61">Ligue 1</option>
                        </select>
                    </div>
                    <div class="first-row year-item">
                        <label htmlFor="year">Year </label>
                        <select
                            id="year"
                            className="year"
                            value={yearValue}
                            onChange={handleYearChange}
                        >
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
                <div class="dropdown-row">
                    <label htmlFor="club">Club </label>
                    <select
                        id="club"
                        className="club"
                        value={clubValue}
                        onChange={handleClubChange}
                        disabled={isClubDisabled}
                    >
                        <option value="" defaultValue></option>
                        {/* Map over the team data and populate the club dropdown */}
                        {teamData.map((team) => (
                        <option key={team.id} value={team.id}>
                            {team.name}
                        </option>
                        ))}
                    </select>
                </div>
                <div class="dropdown-row">
                    <label htmlFor="name">Name </label>
                    <select
                        id="name"
                        className="club"
                        value={nameValue}
                        onChange={handleNameChange}
                        disabled={isNameDisabled}
                    >
                        <option value="" defaultValue></option>
                        {/* Map over the player data and populate the name dropdown */}
                        {playerData.map((player) => (
                        <option key={player.id} value={player.id}>
                            {player.name}
                        </option>
                        ))}
                    </select>
                </div>

            </div>
            <div class="profile">
                <h5 class="h5-season">
                    {leagueName && yearName ? `${leagueName} - ${yearName}` : null}
                </h5>
                <h5 class="h5-club">{clubName}</h5>
                <div class="display-player">
                    {chosenPlayer[0]?.player.photo ? <img src={chosenPlayer[0]?.player.photo} alt={chosenPlayer[0]?.player.name} /> : null}
                </div>
                <h5 class="h5-player">{chosenPlayer[0]?.player.firstname} {chosenPlayer[0]?.player.lastname}</h5>
            </div>
        </div>
    );
};

export default Player;
