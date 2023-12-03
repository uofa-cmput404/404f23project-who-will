import React from "react";
import "./homepage.css"; // use css style
import { useState, useEffect } from 'react';


function Github({username}) {
    const [activity, setActivity] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [showDialog, setShowDialog] = useState(false);


    const [buttonClicked, setButtonClicked] = useState(false);


    const handleButtonClick = () => {
        setButtonClicked(true);
        fetch(`https://api.github.com/users/${username}/events`)
            .then(response => response.json())
            .then(data => {
                setActivity(data);
                setOpenDialog(true);
            })
            .catch(error => console.error('Error fetching data:', error));
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    
    return (
        <div>
            <button onClick={handleButtonClick}  id="github_activity" > 
                <p id="github"> Github</p>
            </button>
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