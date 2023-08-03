const PORT = 8000;
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();

app.use(cors());

app.get('/', (req, res) => {
});

app.get('/fetchTeams', async (req, res) => {

    const leagueValue = req.query.league;
    const yearValue = req.query.season;

    const fetchTeams = async () => {
        try {
            const options = {
                method: 'GET',
                url: 'https://api-football-v1.p.rapidapi.com/v3/teams',
                params: {
                    league: leagueValue,
                    season: yearValue,
                },
                headers: {
                    'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
                    'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com',
                }
            };

            const response = await axios.request(options);

            const teamData = response.data.response.map((team) => ({
                id: team.team.id,
                name: team.team.name,
            }));

            res.json(teamData);
            
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch teams' });
        }
    }

    fetchTeams();
});

app.get('/fetchPlayers', async (req, res) => {

    const leagueValue = req.query.league;
    const yearValue = req.query.season;
    const clubValue = req.query.team;

    const fetchPlayers = async (page = 1, allPlayersData = []) => {
        try {
            const options = {
                method: 'GET',
                url: 'https://api-football-v1.p.rapidapi.com/v3/players',
                params: {
                    team: clubValue,
                    league: leagueValue,
                    season: yearValue,
                    page: page,
                },
                headers: {
                    'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
                    'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
                }
            };
        
            const response = await axios.request(options);
        
            // Check if there's more data on the next page
            const totalPages = response.data.paging.total;
            
            // Add the new data with the previously collected data
            const updatedPlayersData = [...allPlayersData, ...response.data.response];
        
            if (page < totalPages) {

                // If there's a next page, recursively call the fetchPlayers function
                // with the updated page number and accumulated data
                await fetchPlayers(page + 1, updatedPlayersData);
            } else {

                // If there are no more pages, filter and map the data as before
                // Get players who played at least 10 full games in the league
                const filteredPlayerData = updatedPlayersData.filter((player) =>
                    player.statistics[0].league.id == leagueValue &&
                    player.statistics[0].games.minutes >= 900
                );
        
                const playerData = filteredPlayerData.map((player) => ({
                    id: player.player.id,
                    name: player.player.name,
                }));
            
                res.json(playerData);
                
            }
        } catch (error) {
            console.error(error);
        }
    }

    fetchPlayers();
});

app.get('/fetchStats', async (req, res) => {

    const leagueValue = req.query.league;
    const yearValue = req.query.season;
    const clubValue = req.query.team;
    const nameValue = req.query.name;

    const fetchStats = async () => {
        try {
            const options = {
                method: 'GET',
                url: 'https://api-football-v1.p.rapidapi.com/v3/players',
                params: {
                    id: nameValue,
                    team: clubValue,
                    league: leagueValue,
                    season: yearValue,
                },
                headers: {
                    'X-RapidAPI-Key': process.env.REACT_APP_RAPID_API_KEY,
                    'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
                }
            };

            const response = await axios.request(options);

            res.send(response.data.response);
            
        } catch (error) {
            console.error(error);
        }
    }

    fetchStats();
});

app.listen(PORT, () => console.log('Server is running on port ' + PORT));