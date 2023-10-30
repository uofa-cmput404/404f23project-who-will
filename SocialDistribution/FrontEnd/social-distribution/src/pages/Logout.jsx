import React from 'react';
import axios from 'axios';

const Logout = () => {
    try {
        // these logs are not even showing up in the console????
        const authToken = localStorage.getItem('authToken');
        console.log("attempting to logout...");
        axios.post("http://localhost:8000/api/auth/logout/", {
            headers: {
                'Authorization': `Token ${authToken}`,
            }
        });
       
    }
    catch (error) {
        console.error("Error logging out:", error);
    }
    localStorage.removeItem('authToken');
    window.location.reload();
    window.location.href = "/signin";
    

}

export default Logout;