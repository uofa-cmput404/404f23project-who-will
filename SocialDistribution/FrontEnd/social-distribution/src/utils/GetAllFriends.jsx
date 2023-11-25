import React, { Component } from 'react';
import axios from 'axios';

class allFriends {
    
    constructor(currentUserID){
        this.currentID = currentUserID;
    }

    // This function will return an array of all your friends 

    getAllFriends = () => {
        const authToken = localStorage.getItem("authToken");
        const friendsList = [];

        // store the ID in a list 

        if (authToken) {
            axios.get(`http://localhost:8000/api/profiles/${this.currentID}`, {
                headers: {
                    'Authorization': `Token ${authToken}`,
                }
            })
            .then((res) => {
                var data = res.data;
                var following = data.following;
                var follow_requests = data.follow_requests;
                following.forEach(userIFollow => {
                    follow_requests.forEach(userWhoFollowsMe => {
                        if(String(userIFollow) === String(userWhoFollowsMe)) {
                            friendsList.push(userWhoFollowsMe);
                        } 
                    });
                });

               return friendsList;
            })
            .catch((err) => {
                console.log(err);
                
            });
        }
    }

}