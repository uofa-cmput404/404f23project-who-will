import axios from 'axios';

class GetAllFriends {
    
    constructor(currentUserID){
        this.currentID = currentUserID;
    }

    // This function will return an array of all your friends 

    GetAllFriends = (userID) => {
        const authToken = localStorage.getItem("authToken");
    
        return new Promise((resolve, reject) => {
            if (authToken) {
                axios.get(`${process.env.REACT_APP_WHO_WILL_URL}/api/profiles/${userID}/`, {
                    headers: {
                        'Authorization': `Token ${authToken}`,
                    }
                })
                .then((res) => {
                    const friendsList = [];
                    const data = res.data;
                    const following = data.following;
                    const follow_requests = data.follow_requests;

                    //console.log("following = " + following);
                    //console.log("followers = " + follow_requests);
    
                    following.forEach(userIFollow => {
                        follow_requests.forEach(userWhoFollowsMe => {
                            if (String(userIFollow) === String(userWhoFollowsMe)) {
                                friendsList.push(userWhoFollowsMe);
                            }
                        });
                    });
    
                    resolve(friendsList);
                })
                .catch((err) => {
                    console.log(err);
                    console.log("THIS IS THE ERROR ");
                    reject(err); 
                });
            } else {
                reject(new Error("No authToken available"));
            }
        });
    };

}

export default GetAllFriends;