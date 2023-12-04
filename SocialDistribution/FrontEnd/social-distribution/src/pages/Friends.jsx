import React, { Component } from "react";
import "./Friends.css";
import GetAllFriends from "../utils/GetAllFriends";
import axios from "axios";

class Friends extends Component {
  constructor(props) {
    // define state on load
    super(props);
    this.usernameList = "temp placeholder";
    this.done = false;
    this.friends_list = "temp placeholder2";
  }

  async componentDidMount() {
    // actually wait for us to load friends
    await this.getFriends();
  }

  handleProfileClick = (index) => {
    console.log("profile button clicked");
    // might cause a bug with the weird IDS, untested
    var idToVisit = this.friends_list[index];
    window.location.href = `/account?${idToVisit}`;
  };

  getFriends = async () => {
    // get the logged in user's ID
    var currentUserID = localStorage.getItem("pk");
    // get the logged in user's friends' ID's
    const getAllFriendsInstance = new GetAllFriends(currentUserID);

    const authToken = localStorage.getItem("authToken");
    const usrList = [];

    //  TODO: add an 'else' in case of no friends
    await getAllFriendsInstance
      .GetAllFriends(currentUserID)
      .then((friendsList) => {
        var lengthFriends = friendsList.length;
        this.friends_list = friendsList;

        // get their usernames
        friendsList.forEach((id) => {
          if (authToken) {
            axios
              .get(`${process.env.REACT_APP_WHO_WILL_URL}/api/users/${id}/`, {
                headers: {
                  Authorization: `Token ${authToken}`,
                },
              })
              .then((res) => {
                const data = res.data;
                const username = data.username;
                usrList.push(username);
                if (usrList.length === lengthFriends) {
                  // Update State
                  this.usernameList = usrList;
                  this.done = true;
                  // this will trigger a 're-rendering'
                  this.setState({
                    done: this.done,
                    usernameList: this.usernameList,
                  });
                  console.log("State reset...");
                }
              });
          }
        });
      });
  };

  render() {
    // render friends list iff we have friends
    if (this.done === true && this.usernameList.length > 0) {
      console.log(this.done);
      console.log(this.usernameList);

      //onClick={this.sendFollowRequest.bind(this, passedData, loggedInUsersID)}

      var myArray = this.usernameList;
      const divs = myArray.map((item, index) => {
        const uniqueClassName = "aFriend";
        return (
          <div key={index} className={uniqueClassName}>
            <div className="friendName">{item} </div>
            <div
              className="messageButton"
              onClick={this.handleProfileClick.bind(this, index)}
            >
              View Profile
            </div>
            {/* <div className="viewProfileButton" onClick={this.handleProfileClick}>Message</div> */}
          </div>
        );
      });

      return (
        <div className="friendsPage">
          <div className="friendsTitle">My Friends</div>
          <div className="myFriends">{divs}</div>
        </div>
      );
    } else {
      return (
        <div className="friendsPage">
          <div className="friendsTitle">My Friends</div>
        </div>
      );
    }
  }
}
export default Friends;
