import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Player = ({ playerID, onStatsChange }) => {

    const [leagueValue, setLeagueValue] = useState('');
    const [yearValue, setYearValue] = useState('');
    const [clubValue, setClubValue] = useState('');
    const [nameValue, setNameValue] = useState('');

    const [teamData, setTeamData] = useState([]);
    const [playerData, setPlayerData] = useState([]);

    
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
                //stripStats(response.data);
                onStatsChange(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        if (leagueValue && yearValue) {
            fetchTeams();
        }

        if (leagueValue && yearValue && clubValue) {
            fetchPlayers();
        }

        if (leagueValue && yearValue && clubValue && nameValue) {
            fetchStats();
        }

        // Once values have changed
    }, [leagueValue, yearValue, clubValue, nameValue]);

    return (
        <div className="player" id={playerID}>
            <h4>Choose a Player</h4>
            <div className="dropdowns">
            <div className="season">
                <div className="league">
                <label htmlFor="league">League </label>
                <select
                    id="league"
                    className="league"
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

                <div className="year">
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
    );
};

export default Player;
