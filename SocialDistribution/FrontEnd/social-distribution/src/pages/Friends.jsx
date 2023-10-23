import React, { Component } from "react";
import './Friends.css';

class Friends extends Component {

    // TODO: 
    // 1. Add logic to the "view profile" and "message" buttons
    // 2. change myArray with DB data
    // 3. somehow add a user state

    handleProfileClick = () => {
        console.log("profile button clicked")
    } 

    handleMessageClick = () => {
        console.log("message button clicked")
    }
    
    render() {
        const myArray = ['Bob', 'Jon', 'Timmy', "xxIanSniper1010xx", "kooldue7878", "WILLLLLLLLLLLLLLL"]; // replace this with a query from DB
        const divs = myArray.map((item, index) => {
            const uniqueClassName = "aFriend";
            return (  
              <div key={index} className={uniqueClassName}>
                <div className="friendName">{item} </div>
                <div className="messageButton" onClick={this.handleMessageClick}>View Profile</div>
                <div className="viewProfileButton" onClick={this.handleProfileClick}>Message</div>
              </div>
            );
          });
      

          return  (
          <div className = "friendsPage">
          <div className = "friendsTitle">My Friends</div>
          <div className="myFriends">{divs}</div>;
          </div>
          );
        }

       
    }
    

export default Friends; 