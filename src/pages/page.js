import React, { useState } from 'react';
import '../styles/page.css';

const Page = () => {
    const [leagueValue, setLeagueValue] = useState('');
    const [yearValue, setYearValue] = useState('');
    const [clubValue, setClubValue] = useState('');
    const [nameValue, setNameValue] = useState('');
  
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
                                        <option value="option1">Dropdown 1 - Option 1</option>
                                        <option value="option2">Dropdown 1 - Option 2</option>
                                        <option value="option3">Dropdown 1 - Option 3</option>
                                    </select>
                                </div>

                                <div class="year">
                                    <label htmlFor="year">Year </label>
                                    <select id="year" class="year" value={yearValue} onChange={handleYearChange}>
                                    <option value="" defaultValue></option>
                                        <option value="option1">Dropdown 2 - Option 1</option>
                                        <option value="option2">Dropdown 2 - Option 2</option>
                                        <option value="option3">Dropdown 2 - Option 3</option>
                                    </select>
                                </div>
                            </div>

                            <label htmlFor="club">Club </label>
                            <select id="club" class="club" value={clubValue} onChange={handleClubChange} disabled={isClubDisabled}>
                                <option value="" defaultValue></option>
                                <option value="option1">Dropdown 3 - Option 1</option>
                                <option value="option2">Dropdown 3 - Option 2</option>
                                <option value="option3">Dropdown 3 - Option 3</option>
                            </select>

                            <label htmlFor="name">Name </label>
                            <select id="club" class="club" value={nameValue} onChange={handleNameChange} disabled={isNameDisabled}>
                                <option value="" defaultValue></option>
                                <option value="option1">Dropdown 4 - Option 1</option>
                                <option value="option2">Dropdown 4 - Option 2</option>
                                <option value="option3">Dropdown 4 - Option 3</option>
                            </select>
                        </div>

                    </div>


                    <div class="player">
                        
                    </div>
                </div>
            </div>
            <div class="graph-side">
                <h4>Test 4</h4>
                <h5>Test 5</h5>
                <h6>Test 6</h6>
            </div>
        </div>
      </>
    );
}

export default Page;