import React, { Component } from 'react';
import './Settings.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class Settings extends Component {
    state = {
        newUsername: '',
        newProfilePicture: null,
        newGithub: ""
    };

    handleUsernameChange = (e) => {
        this.setState({ newUsername: e.target.value });
    };

    handleProfilePictureChange = (e) => {
        const file = e.target.files[0];
        this.setState({ newProfilePicture: file });
    };

    handleSaveSettings = () => {
        const { newUsername, newProfilePicture, newGithub } = this.state;

        const data = {
            profile_image: 'null'
        };

        if (newProfilePicture) {
            // Convert the newProfilePicture to base64
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64Image = event.target.result;
                // Include base64-encoded image in editData
                data.profile_image = base64Image;

                // Send the updated profile information to the server
                this.sendEditProfileData(data);
            };

            reader.readAsDataURL(newProfilePicture);
            window.location.reload();
        }

    };

    sendEditProfileData = (editData) => {
        const authToken = localStorage.getItem("authToken"); // Use localStorage.getItem() to get the authToken
        const pk = localStorage.getItem("pk");
        if (authToken) {
            axios.patch(`${process.env.REACT_APP_WHO_WILL_URL}/api/profiles/${pk}/`, editData, {
                headers: {
                    'Authorization': `Token ${authToken}`,
                    'Content-Type': 'application/json'
                }
            })
            .then((res) => {
                console.log(res.data);
                console.log("Successful edit");
            })
            .catch((err) => {
                console.log(err);
                toast.error('Failed to upload profile');
            });
        }
    }

    sendPostData = (postData) => {
    const authToken = localStorage.getItem("authToken");
    console.log(postData);

    if (authToken) {
      axios
        .post(`${process.env.REACT_APP_WHO_WILL_URL}/api/posts/`, postData, {
          headers: {
            Authorization: `Token ${authToken}`,
            "Content-Type": "application/json",
          },
        })
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(err);
          toast.error("Failed to upload post. Please try again.");
        });
    }
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