import React, { useState, useEffect } from 'react';
import Chart from 'chart.js/auto'; 
import ChartDataLabels from 'chartjs-plugin-datalabels';
import axios from 'axios';
import '../styles/page.css';
import '../styles/player.css';
import '../styles/graph.css';

import Player from '../components/player.js';

const Page = () => {

    const [P1Stats, setP1Stats] = useState([]);
    const [P2Stats, setP2Stats] = useState([]);

    const [P1Data, setP1Data] = useState([]);
    const [P2Data, setP2Data] = useState([]);

    const [P1, setP1] = useState([]);
    const [P2, setP2] = useState([]);
    
    const [barLabels, setBarLabels] = useState([]);
    const [attribute, setAttribute] = useState('');

    const handlePlayer1Data = (data) => {
        console.log(data);
        setP1Data(data);
        setP1Stats(stripData(data));

    }

    const handlePlayer2Data = (data) => {
        console.log(data);
        setP2Data(data);
        setP2Stats(stripData(data));
    }
    
    function showAttributes(tabNumber) {
        if (tabNumber==1) { setAttribute('F') }
        if (tabNumber==2) { setAttribute('M') }
        if (tabNumber==3) { setAttribute('D') }
        if (tabNumber==4) { setAttribute('G') }
    };

    const handleOnLoad = () => {
        showAttributes(1); 

        const firstTab = document.getElementById('radio-1');

        // Check first tab if it exists
        if (firstTab) { firstTab.checked = true; }
    };

    // On Load
    useEffect(() => {
        handleOnLoad();
    }, []);

    // Update Chart
    useEffect(() => {
        if (P1.length > 0 && P2?.length > 0) {
            console.log(P1, P2);
            // Chart set-up and defaults
            let radarChart = null;   
            const radarChartCanvas = document.getElementById('radarChart').getContext('2d');
            const graphSpace = document.getElementById('graph-square');
            graphSpace.classList.add('graph-visible');
            Chart.defaults.scale.ticks.beginAtZero = true;
            Chart.defaults.borderColor = '#000D2E';
            Chart.defaults.color = '#000D2E';
            Chart.register(ChartDataLabels);
            
            // Normalize data
            var P1Norm = [];
            var P2Norm = [];

            for (let i = 0; i < P1.length; i++) {
                const maxValue = Math.max(P1[i], P2[i]);
                P1Norm.push(P1[i]/(maxValue*1.1).toFixed(2));
                P2Norm.push(P2[i]/(maxValue*1.1).toFixed(2));
            }

            // Custom labels
            var P1Name = P1Data[0].player.name;
            var P1Season = (P1Data[0].statistics[0].league.season).toString().slice(2) + '/' + (P1Data[0].statistics[0].league.season+1).toString().slice(2);

            var P2Name = P2Data[0].player.name;
            var P2Season = (P2Data[0].statistics[0].league.season).toString().slice(2) + '/' + (P2Data[0].statistics[0].league.season+1).toString().slice(2);


            radarChart = new Chart(radarChartCanvas, {
                type: 'radar',
                data: {
                    labels: barLabels,
                    datasets: [
                        {
                            label: `${P1Name} (${P1Season})`,
                            backgroundColor: 'rgba(255, 75, 0, 0.1)',
                            borderColor: 'rgba(255, 75, 0, 0.5)',
                            pointBorderColor: 'rgba(255, 75, 0, 1)',
                            pointBackgroundColor: 'rgba(255, 75, 0, 1)',
                            pointHoverBackgroundColor: 'rgba(255, 255, 255, 1)',
                            pointHoverBorderColor: 'rgba(255, 75, 0, 1)',
                            borderWidth: 2,
                            data: P1Norm,
                            custom: P1,
                        },
                        ...(P2 && P2Data[0].player.name ? 
                        [{
                            label: `${P2Name} (${P2Season})`,
                            backgroundColor: 'rgba(0, 125, 255, 0.1)',
                            borderColor: 'rgba(0, 125, 255, 0.5)',
                            pointBorderColor: 'rgba(0, 125, 255, 1)',
                            pointBackgroundColor: 'rgba(0, 125, 255, 1)',
                            pointHoverBackgroundColor: 'rgba(255, 255, 255, 1)',
                            pointHoverBorderColor: 'rgba(0, 125, 255, 1)',
                            borderWidth: 2,
                            data: P2Norm,
                            custom: P2,
                        }]
                        : [])
                    ],
                },
                options: {
                    scales: {
                        r: {
                            min: 0,
                            max: 1,
                            ticks: {
                                display: false,
                            },
                            angleLines: {
                                color: 'grey'
                            },
                            grid: {
                                color: 'grey',
                            },
                            pointLabels: {
                            }
                        }
                    }, /*
                    onHover: (event, elements) => {
                        // Access the custom property to get the original unnormalized data
                        
                        console.log(elements);
                        if (elements.length > 0) {
                            const datasetIndex = elements[0].datasetIndex;
                            const dataIndex = elements[0].index;
                            const unnormalizedValue = radarChart.data.datasets[datasetIndex].custom[dataIndex];
                            console.log(unnormalizedValue);
                        }
                    }, */
                    responsive: true,
                    plugins: {
                        datalabels: {
                            formatter: function(value, context) {
                                const datasetIndex = context.datasetIndex;
                                const dataIndex = context.dataIndex;
                                const unnormalizedValue = context.chart.data.datasets[datasetIndex].custom[dataIndex];
                                return unnormalizedValue;
                            },
                            color: function(context) {
                                const datasetIndex = context.datasetIndex;
                                const dataset = context.chart.data.datasets[datasetIndex];
                                return dataset.borderColor;
                            },
                            anchor: 'end',
                            align: 'start',
                            font: {
                                size: 18,
                                family: 'Poppins, sans-serif',
                                weight: 'bold',
                            },
                        }
                    }
                },
            });

            
            return () => {
                radarChart.destroy()
            }
        }
    }, [P1Stats, P2Stats, P1, P2]);

    useEffect(() => {
        if (P1Stats.length > 0 && P2Stats?.length > 0) {
            var attackerLabels = ['Goals', 'Shots', 'Shots On Target', 'Duels Won', 'Duels Won %', 'Dribbles', 'Dribbles %', 'Fouls Drawn'];
            var midfieldLabels = ['Assists', 'Key Passes', 'Passes', 'Passes %', 'Duels Won', 'Duels Won %', 'Fouls Drawn', 'Fouls Committed'];
            var defenceLabels = ['Tackles', 'Blocks', 'Interceptions', 'Dribbled Past', 'Fouls Committed', 'Yellows', 'Reds', 'Penalties Committed'];
            var goalkeeperLabels = ['Saves', 'Goals Conceded', 'Saves Per Concede', 'Passes', 'Passes %', 'Penalties Saved'];

            if (attribute=='F') { setP1(P1Stats[0]); setP2(P2Stats[0]); setBarLabels(attackerLabels) };
            if (attribute=='M') { setP1(P1Stats[1]); setP2(P2Stats[1]); setBarLabels(midfieldLabels); }
            if (attribute=='D') { setP1(P1Stats[2]); setP2(P2Stats[2]); setBarLabels(defenceLabels); }
            if (attribute=='G') { setP1(P1Stats[3]); setP2(P2Stats[3]); setBarLabels(goalkeeperLabels); }
        }
    }, [attribute, P1Stats, P2Stats]);

    function stripData(statsData) {


        var stats = statsData[0].statistics[0];
        var full90s = stats.games.minutes/90;

        // Attacker Stats
        var goals = (stats.goals.total / full90s).toFixed(2);
        var shots = (stats.shots.total / full90s).toFixed(2);
        var shotsOnTarget = (stats.shots.on / full90s).toFixed(2); 
        var duelsWon = (stats.duels.won / full90s).toFixed(2);
        var duelsWonRate = ((stats.duels.won / stats.duels.total)*100).toFixed(0);
        var dribbles = (stats.dribbles.success / full90s).toFixed(2);
        var dribblesRate = ((stats.dribbles.success / stats.dribbles.attempts)*100).toFixed(0);
        var foulsDrawn = (stats.fouls.drawn / full90s).toFixed(2);
        var penaltiesWon = (stats.penalty.won / full90s).toFixed(2);

        // var attackerStats = [goals, shots, shotsOnTarget, duelsWon, duelsWonRate, dribbles, dribblesRate, foulsDrawn, penaltiesWon];
        var attackerStats = [goals, shots, shotsOnTarget, duelsWon, duelsWonRate, dribbles, dribblesRate, foulsDrawn];
        
        // Midfield Stats
        var assists = (stats.goals.assists / full90s).toFixed(2);
        var keyPasses = (stats.passes.key / full90s).toFixed(2);

        var passes, passessRate;

        // API switched formula from % to total accurate passes in 20/21 season
        if (stats.league.season >= 2020) {
            passes = (stats.passes.accuracy).toFixed(2)
            passessRate = ((stats.passes.accuracy / (stats.passes.total / full90s))*100).toFixed(0);
        } else {
            passes = ((stats.passes.total*stats.passes.accuracy/100) / full90s).toFixed(0);
            passessRate = (stats.passes.accuracy).toFixed(0);
        }

        var duelsWon;
        var duelsWonRate;
        var foulsDrawn;
        var foulsCommitted = (stats.fouls.committed / full90s).toFixed(2);

        var midfieldStats = [assists, keyPasses, passes, passessRate, duelsWon, duelsWonRate, foulsDrawn, foulsCommitted];

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

        // Goalkeeper Stats
        var saves = (stats.goals.saves / full90s).toFixed(2);
        var goalsConceded = (stats.goals.conceded / full90s).toFixed(2);
        var savePerConceded = (stats.goals.saves / stats.goals.conceded).toFixed(0);
        var passes;
        var passessRate;
        var penaltiesSaved = (stats.penalty.saved / full90s).toFixed(2);
        
        var goalkeeperStats = [saves, goalsConceded, savePerConceded, passes, passessRate, penaltiesSaved];

        return [attackerStats, midfieldStats, defenceStats, goalkeeperStats];
    }


    return (
      <>
        <div class="main-page row">
            <div class="stats-side">
                <div class="players">
                    <Player playerID="player1" onStatsChange={handlePlayer1Data} ></Player>
                    <Player playerID="player2" onStatsChange={handlePlayer2Data} ></Player>
                </div>
            </div>
            <div class="graph-side">
                <div class="graph-container">
                    <div id="graph-square" class="graph-square">
                        <div class="attributes-tab">
                            <label class="radio">
                                <input type="radio" name="radio" id="radio-1" onClick={() => showAttributes(1)}/>
                                <span class="name">Attacker</span>
                            </label>
                            <label class="radio">
                                <input type="radio" name="radio" id="radio-2" onClick={() => showAttributes(2)}/>
                                <span class="name">Midfielder</span>
                            </label>
                            <label class="radio">
                                <input type="radio" name="radio" id="radio-3" onClick={() => showAttributes(3)}/>
                                <span class="name">Defender</span>
                            </label>
                            <label class="radio">
                                <input type="radio" name="radio" id="radio-4" onClick={() => showAttributes(4)}/>
                                <span class="name">Goalkeeper</span>
                            </label>
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