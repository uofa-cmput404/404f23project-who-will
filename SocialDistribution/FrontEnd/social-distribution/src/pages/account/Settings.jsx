import React, { Component } from 'react';
import './Settings.css';
import axios from 'axios';

class Settings extends Component {
    state = {
        newUsername: '',
        newProfilePicture: null,
        newGithub: "",
        newDOB: "",
        newPhone: ""
    };

    handleUsernameChange = (e) => {
        this.setState({ newUsername: e.target.value });
    };

    handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        this.setState({ newProfilePicture: file });
    };

    handleSaveSettings = () => {
        const { newUsername, newProfilePicture } = this.state;
        //save these settings in the database
        this.props.onClose();
    };

    handleGithub = (e) => {
        this.setState({ newGithub: e.target.value });
    }

    handleDOB = (e) => {
        this.setState({ newDOB: e.target.value });
    }

    handlePhone = (e) => {
        this.setState({ newPhone: e.target.value });
    }
    

   
    render() {
        return (
            <div className="settings-popup">
                <div className = "settings-content">
                    <h2>Settings</h2>
                    <div className='entryFields'>
                        <label>
                            New Username:
                            <input type="text" value={this.state.newUsername} onChange={this.handleUsernameChange} />
                        </label>
                        <label>
                            New DOB:
                            <input type="text" value={this.state.newDOB} onChange={this.handleDOB} />
                        </label>
                        <label>
                            New Phone Number:
                            <input type="text" value={this.state.newPhone} onChange={this.handlePhone} />
                        </label>
                        <label>
                            New Github:
                            <input type="text" value={this.state.newGithub} onChange={this.handleGithub} />
                        </label>

                        <label>
                            New Profile Picture:
                            <input type="file" accept="image/*" onChange={this.handleProfilePictureChange} />
                        </label>
                    </div>
                    <button onClick={this.handleSaveSettings}>Save</button>
                    <button onClick={this.props.onClose}>Cancel</button>
                </div>
            </div>
        );
    }
}

export default Settings;