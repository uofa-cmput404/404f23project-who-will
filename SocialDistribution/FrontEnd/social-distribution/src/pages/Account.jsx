import React, { Component } from 'react';
import './Account.css';
import { FaGear, IconName } from "react-icons/fa6";
import AddPost from './account/AddPost.jsx'
import Settings from './account/Settings';
import EditPost from './account/EditPost.jsx';
import DeletePost from './account/DeletePost.jsx';
import Comments from './account/Comments.jsx';
import axios from 'axios';
import { toast } from 'react-toastify';
import GetAllFriends from '../utils/GetAllFriends.jsx';

function isNotEmptyObject(obj) {
    return obj !== null && typeof obj === 'object' && Object.keys(obj).length > 0;
}


class Account extends Component {

    delayTime = 100;

    state = {
        user: null,
        error: null,
        userSettings: null,
        isAddPostOpen: false,
        isSettingsOpen: false,
        isEditPostOpen: false,
        isCommentsOpen: false,
        postToEdit: null,
        ownerID: null,
        isFriend: false,
        viewedProfileUserID: null,
        isMyAccount: false,
        currentPostVisibility: null,
        currentPasedData: null,
        postID: null,
        profileImage: "https://reactjs.org/logo-og.png"
    };

    handleCommentsClick = (id) => {
        this.setState({ isCommentsOpen: true, });
        this.postID = id;
    }

    handleCloseComments = () => {
        this.setState({ isCommentsOpen: false });
    }

    handleSettingsClick = () => {
        this.setState({ isSettingsOpen: true });
    };

    handleCloseSettings = () => {
        this.setState({ isSettingsOpen: false });
    };


    handleAddPost = () => {
        this.setState({ isAddPostOpen: true });
    }

    handleCloseAddPost = () => {
        this.setState({ isAddPostOpen: false, content: '', visibility: 'public' });
        this.retrievePostsWithDelay();
    }

    handleEditPost = (post) => {
        console.log("handle editting**************");
        this.setState({ isEditPostOpen: true, postToEdit: post , currentPostVisibility: post.visibility});
    }

    handleCloseEditPost = () => {
        this.setState({ isEditPostOpen: false, content: '', visibility: 'public', postToEdit: null });
        this.retrievePostsWithDelay();
    }

    /* Follow / Friend Request code */
    sendFollowRequest = (IDtoFollow, currentUserID) => {
        /* This function calls from the onlick method from the follow button
        updates the follow_request fields in /profile/profileID api */

        const authToken = localStorage.getItem("authToken");
        if (authToken) {
            // this is the ID of the user we WANT TO FOLLOW
            var actualID = Object.keys(IDtoFollow)[0];
            
            // get the data at /api/profiles/id to determine profile
            axios.get(`${process.env.REACT_APP_WHO_WILL_URL}/api/profiles/${actualID}/`, {
                headers: {

                    'Authorization': `Token ${authToken}`,
                    'Content-Type': 'application/json',

                }
            }) 
            .then((res) => {
                // declare profile data from the get request
                var profileData = res.data;
                var profileID = profileData.id;
            
                // request payload
                const postData = {
                    "add_follow_request": currentUserID,
                    "delete_follow_request": "None",
                    "add_following": "None",
                    "delete_following": "None"
                };

                // update the 'add_follow_request' field via a custom view in the api
                axios.put(`${process.env.REACT_APP_WHO_WILL_URL}/api/profiles/${profileID}/`, postData, {
                    headers: {
                        'Authorization': `Token ${authToken}`,
                    }
                })
                .then((res) => {
                    toast.success("Successfully Followed!")
                    this.isFollowing = true;
                    console.log(profileID)
                    console.log("followed")

                    // now we need to update the LOGGED IN user's "following field"
                    const newPostData = {
                        "add_follow_request": "None",
                        "delete_follow_request": "None",
                        "add_following": profileID,
                        "delete_following": "None"
                    };
                    // update the 'add_following' field via a custom view in the api
                    axios.put(`${process.env.REACT_APP_WHO_WILL_URL}/api/profiles/${currentUserID}/`, newPostData, {
                        headers: {
                            'Authorization': `Token ${authToken}`,
                        }
                    })
                    .then((res) => {
                    })

                    .catch((err) => {
                        console.log(err);
                    })
                    
                })
                // catch all errors related to the requests
                .catch((err) => {
                    console.log(err);
                    toast.error("Error sending follow request");
                });

            })
           
            .catch((err) => {
                console.log(err);
                toast.error("Error sending follow request");
            });
        }

    }

    sendUnfollowRequest = (viewedProfileUserID, loggedInUsersID) => {
        const authToken = localStorage.getItem("authToken");
        viewedProfileUserID = Object.keys(viewedProfileUserID)[0];

        // We want to remove loggedInUsersID from the "follow_requests" field in /profiles/viewedProfileUserID
        // And we want to remove viewedProfileUserID from the "following" field in /profiles/loggedInUsersID

        // IMPRORTANT: profileID NEEDS to equal userID or else everything will break
        // works, but is very slow changing the buttons, w/e

        if(authToken) {
            const putData = {
                "add_follow_request": "None",
                "delete_follow_request": loggedInUsersID,
                "add_following": "None",
                "delete_following": "None"
            };

            // update the 'delete_follow_request' custom view ihe api
            axios.put(`${process.env.REACT_APP_WHO_WILL_URL}/api/profiles/${viewedProfileUserID}/`, putData, {
            headers: {
                'Authorization': `Token ${authToken}`,
            }
            })
            .then((res) => {
                const secondPutData = {
                    "add_follow_request": "None",
                    "delete_follow_request": "None",
                    "add_following": "None",
                    "delete_following": viewedProfileUserID
                };
                // update the 'delete_following' custom view ihe api
                axios.put(`${process.env.REACT_APP_WHO_WILL_URL}/api/profiles/${loggedInUsersID}/`, secondPutData, {
                    headers: {
                        'Authorization': `Token ${authToken}`,
                    }
                })
                .then((res) => {
                    toast.success("You have successfully unfollowed");
                    this.isFollowing = false;
                })

                .catch((err) => {
                    toast.error("Error trying to unfollow (R2)")
                    console.log(err);
                })

            })

            .catch((err) => {
                toast.error("Error trying to unfollow (R1)");
                console.log(err);
            });
        }

    }

    handleDeletePost = (postId) => {
        const confirmation = window.confirm("Are you sure you want to delete this post?");

        if (confirmation){
            const deletePost = new DeletePost();
            deletePost.deletePost(postId)
            this.retrievePostsWithDelay();
        }
    }

    async retrievePostsWithDelay() {
        await new Promise((resolve) => {
          setTimeout(resolve, this.delayTime);
        });
    
        this.retrievePosts();
      }

    retrievePosts = () => {
        const authToken = localStorage.getItem("authToken");

        axios.get(`${process.env.REACT_APP_WHO_WILL_URL}/api/posts/?owner=${this.state.ownerID}`, {
            headers: {
                'Authorization': `Token ${authToken}`,
            }
        })
        .then((res) => {
            const user = { posts: res.data };
            this.setState({ user: user })
        })
        .catch((err) => {
            console.log(err);
            this.setState({ error: "Error loading user data" });
        });
    }

    retrieveProfilePicture = (id) => {
        const authToken = localStorage.getItem("authToken");
        // if us, retrieve our profile image, else retrieve viewd profile id
        axios.get(`${process.env.REACT_APP_WHO_WILL_URL}/api/profiles/${id}/`, {
            headers: {
                'Authorization': `Token ${authToken}`,
            }
        })
        .then((res) => {
            const userProfile = res.data;

        const profileImage = userProfile.profile_image;
        
        console.log("Profile Image URL:", profileImage);

        this.setState({ profileImage: profileImage });
        })
        .catch((err) => {
            console.log(err);
            this.setState({ error: "Error profile picture" });
        });
    }

    
  
    checkParams(){
        const queryParams = new URLSearchParams(window.location.search);
        const passedData = Object.fromEntries(queryParams.entries());
        this.state.viewedProfileUserID = Object.keys(passedData)[0];
        //console.log("__+++++++++++++++++++++++")
        //console.log(this.state.viewedProfileUserID);  // undefiend
        //console.log(this.state.ownerID);
        //console.log("__+++++++++++++++++++++++")

        if (this.state.viewedProfileUserID === undefined) {
            this.state.isMyAccount = true;
        }
        else{
            this.state.isMyAccount = false;
        }

        const getAllFriendsInstance = new GetAllFriends(this.state.ownerID);
        
        if (this.state.viewedProfileUserID !== this.ownerID){
            getAllFriendsInstance.GetAllFriends(this.state.ownerID)
                .then(friendsList => {
                    if (friendsList.includes(parseInt(this.state.viewedProfileUserID))) {
                        this.state.isFriend = true;
                    } 
                    else{
                        this.state.isFriend = false;
                    }
                })
                .catch(error => {
                    console.error("Error fetching friends:", error);
                });
            }
        
    }

    getViewedUsername = async () => {
        const authToken = localStorage.getItem("authToken");
        const queryParams = new URLSearchParams(window.location.search);
        const passedData = Object.fromEntries(queryParams.entries());
        if(isNotEmptyObject(passedData)) {
            var actualID = Object.keys(passedData)[0];
            if(authToken) {
                axios.get(`${process.env.REACT_APP_WHO_WILL_URL}/api/users/${actualID}/`, {
                headers: {
                    'Authorization': `Token ${authToken}`,
                }
                })
                .then((res) => {
                        var data = res.data;
                        this.vUser = data.username;
                        console.log(this.vUser);
                    });
            }
            
        }
        else {
            var localUser = localStorage.getItem("username");
            this.vUser = localUser;
        }


    }

    componentDidMount() {
        this.retrievePosts();
        this.getViewedUsername();
        this.state.ownerID = localStorage.getItem("pk");
        this.interval = setInterval(() => {
            this.retrievePosts();
        }, 5000);

        if (this.state.isMyAccount){
            const id = localStorage.getItem('pk');
            this.retrieveProfilePicture(id);
        }
        else {
            const queryParams = new URLSearchParams(window.location.search);
            const passedData = Object.fromEntries(queryParams.entries());
            var actualID = Object.keys(passedData)[0];
            this.retrieveProfilePicture(actualID);
        }
    }

    componentWillUnmount(){
        clearInterval(this.interval);
    }

    formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        const formattedDate = new Date(dateString).toLocaleDateString('en-US', options);
        return formattedDate;
    }

    forceNavigatePost = (id) => {
        window.location.href = `/post?${id}`;
    }

    render() {

        const queryParams = new URLSearchParams(window.location.search);
        const passedData = Object.fromEntries(queryParams.entries());

        if (passedData !== this.state.currentPassedData) {
            this.state.currentPassedData = passedData;
            this.checkParams();
        } 


        // 'passedData' is the ID we need to populate this page with

        // ID OF THE CURRENT USER THAT IS LOGGED IN
        var loggedInUsersID = localStorage.getItem("pk");
        const authToken = localStorage.getItem("authToken");

         // Check if we are currently following the viewed page
        // ID OF THE ACCOUNT WE WANT TO FOLLOW
        var actualID = Object.keys(passedData)[0];

        // This request checks, updates the profile viewed on state change to determine whether we are
        // following the viewed user or not
        if (this.isFollowing !== true && this.isFollowing !== false) {
            if(authToken) {
                axios.get(`${process.env.REACT_APP_WHO_WILL_URL}/api/profiles/${loggedInUsersID}/`, {
                headers: {
                    'Authorization': `Token ${authToken}`,
                }
                })
                .then((res) => {
                    // set target parameters
                    var following = res.data.following;
                    following.forEach(element => {
                        if (String(element) === String(actualID)) {
                            this.isFollowing = true;
                        
                        }
                    });
                    
                })
                .catch((err) => {
                    console.log(err);
                });
            }
        }
       
    
        const { user } = this.state;
        if (!user) {
            return (
                <div>Could Not Load User Data</div>
            );
        }

        return (
            <div className="grid">
                {/*Account Details*/}
                <div className='usrName'>{this.vUser}'s Profile</div>
                <div className="profile-picture">
                    <img  src={this.state.profileImage} alt="Profile" /> {/*temporary image*/}
                </div>
                
                <p className='username'>{user.username}</p>
                
                    {this.state.isMyAccount ? (
                        <button className="settings-icon" onClick={this.handleSettingsClick}>
                        <FaGear/>
                        </button>
                    ) : null}
                  

                {this.state.isSettingsOpen && (
                    <Settings onClose={this.handleCloseSettings} />
                )}

                {this.state.isMyAccount && (
                    <>
                        <button className="add-post-button" onClick={this.handleAddPost}>Add Post</button> 
                    </>
                )}

                {/*button shoudln't show up if you are already following */}
                {/* display follow/unfollow buttons based on current parameters */}
                {isNotEmptyObject(passedData) && actualID !== loggedInUsersID && this.isFollowing === true && (
                    <button onClick={this.sendUnfollowRequest.bind(this, passedData, loggedInUsersID)} className='send-friend-request' > Unfollow</button>
                )}
                {isNotEmptyObject(passedData) && actualID !== loggedInUsersID && this.isFollowing !== true && (
                    <button onClick={this.sendFollowRequest.bind(this, passedData, loggedInUsersID)} className='send-friend-request'> Follow</button>
                )}
                
                {this.state.isAddPostOpen && (
                    <AddPost
                        onClose={this.handleCloseAddPost}
                        image={this.state.image}
                    />
                )}
                {/*Posts*/}
                <div className="post-content">
                {user.posts
                    .filter(post => {
                        if (this.state.isMyAccount === true) { // my account
                            console.log("1");
                            console.log(post.owner);
                            console.log(this.state.ownerID);
                            console.log(Number(this.state.ownerID));
                            return this.state.ownerID ? post.owner === this.state.ownerID : true;
                        } 
                        else if (this.state.isFriend === true) {
                            console.log("2");
                            return this.state.ownerID ? (post.owner === this.state.viewedProfileUserID && (post.visibility === 'friends only' || post.visibility === 'public')) : true;
                        } 
                        else {
                            return this.state.ownerID ? post.owner === this.state.viewedProfileUserID && post.visibility === 'public' : true;
                        }
                      })
                    .sort((a, b) => new Date(b.post_date_time) - new Date(a.post_date_time))
                    .map(post => (
                    <div className="post-box" key={post.id}>
                        <p id="visibility">Visibility: {post.visibility}</p>
                        {post.title && <p id="title-account">{post.title}</p>}
                        {post.description && <p>Description: {post.description}</p>}
                        <p>{post.content}</p>
                        {post.post_image && <img className="post-image" src={post.post_image} alt="Post Image" />}
                        {post.source && <p id = "source-account">Image Source: {post.source}</p>}
                        {post.origin && <p id = "origin-account">Image Origin: {post.origin}</p>}
                        {post.categories && (<p>Categories: {post.categories.join(', ')}</p>)}
                        <p className="likes">likes: {post.votes.length}</p>
                        <p id="date-posted">Posted on: {this.formatDate(post.post_date_time)}</p>
                        <div>
                        <button className="comments-button" onClick={() => this.handleCommentsClick(post.id)}>Comments</button>
                        {this.state.isMyAccount && (
                            <>
                                <button className="edit-post-button" onClick={() => this.handleEditPost(post)}>Edit</button>
                                <button className="delete-post-button" onClick={() => this.handleDeletePost(post.id)}>Delete</button>
                            </>
                        )}
                       
                        </div>
                        <div className='postID' onClick={this.forceNavigatePost.bind(this,post.id)}>Post ID: {post.id}</div>
                    </div>
                    
                    ))}
                </div>
                {this.state.isCommentsOpen && (
                    <Comments onClose={this.handleCloseComments} 
                    postID={this.postID}
                    />
                )}
                {this.state.isEditPostOpen && (
                    <EditPost
                        onClose={this.handleCloseEditPost}
                        image={this.state.image}
                        postToEdit={this.state.postToEdit.id}
                        currentVisibility={this.state.currentPostVisibility}
                    />
                )}

            </div>
        );
    }
}

export default Account;