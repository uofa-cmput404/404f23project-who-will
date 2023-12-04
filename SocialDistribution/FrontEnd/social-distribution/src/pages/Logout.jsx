import React from 'react';
import axios from 'axios';

const Logout = () => {
    try {
        // these logs are not even showing up in the console????
        const authToken = localStorage.getItem('authToken');
        console.log("attempting to logout...");
        axios.post(`${process.env.REACT_APP_WHO_WILL_URL}/api/auth/logout/`, {
            headers: {
                'Authorization': `Token ${authToken}`,
            }
        });
       
    }
    catch (error) {
        console.error("Error logging out:", error);
    }
    localStorage.removeItem('authToken');
    localStorage.removeItem('pk');
    window.location.reload();
    window.location.href = "/signin";
    

}

export default Logout;