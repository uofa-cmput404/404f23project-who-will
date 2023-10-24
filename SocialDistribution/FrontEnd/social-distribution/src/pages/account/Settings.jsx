import React, { Component } from 'react';
import './Settings.css';

class Settings extends Component {
    state = {
        newUsername: '',
        newProfilePicture: null,
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

    render() {
        return (
            <div className="settings-popup">
                <div className = "settings-content">
                    <h2>Settings</h2>
                    <label>
                        New Username:
                        <input type="text" value={this.state.newUsername} onChange={this.handleUsernameChange} />
                    </label>
                    <label>
                        New Profile Picture:
                        <input type="file" accept="image/*" onChange={this.handleProfilePictureChange} />
                    </label>
                    <button onClick={this.handleSaveSettings}>Save</button>
                    <button onClick={this.props.onClose}>Cancel</button>
                </div>
            </div>
        );
    }
}

export default Settings;