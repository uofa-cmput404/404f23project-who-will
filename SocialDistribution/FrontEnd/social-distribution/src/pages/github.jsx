import React from "react";
import "./homepage.css"; // use css style
import { useState, useEffect } from 'react';


function Github() {
    const [activity, setActivity] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [buttonClicked, setButtonClicked] = useState(false);

    const [openEnterUsername, setOpenEnterUsername] = useState(false);
    const [username, setUsername] = useState('');

    const handleButtonClick = () => {
        setButtonClicked(true);
        setOpenEnterUsername(true);
    };

    const handleUsernameSubmit = () => {
        // setButtonClicked(true);
        setOpenEnterUsername(true);
        
        // show activity 
        fetch(`https://api.github.com/users/${username}/events`)
            .then(response => response.json())
            .then(data => {
                setActivity(data);
                setOpenDialog(true);
            })
            .catch(error => console.error('Error fetching data:', error));

    };

    const handleCloseUsernameDialog = () => {
        setOpenEnterUsername(false);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    
    return (
        <div>
            <button onClick={handleButtonClick}  id="github_activity" > 
                <p id="github"> Github</p>
            </button>

            {openEnterUsername && (
                <div className="dialog-overlay">
                    <div className="username-dialog">
                       <button onClick={handleCloseUsernameDialog} className="close-button">Close</button>
                        <div className="username-box">
                            <input
                                type="text"
                                placeholder="Enter your GitHub username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="input"
                            />
                            <button onClick={handleUsernameSubmit} className="submit-username">Submit</button>
                        </div>
                    </div>
                </div>
            )}


            {openDialog && (
                <div className="dialog-overlay">
                    <div className="dialog-content">
                        <ul>
                            {activity.map((event, index) => (
                                <li key={index}>{event.type}: {event.repo.name}</li>
                            ))}
                        </ul>
                        <button onClick={handleCloseDialog} className="github_close_button">Close</button>

                    </div>
                </div>
            )}
        </div>
    );
}

export default Github;

