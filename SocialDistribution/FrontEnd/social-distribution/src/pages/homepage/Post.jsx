import React from "react";
import Profile from "../Profile";
import Content from "../Content";
import "../homepage.css"; // use css style
import { useState, useEffect } from 'react';
import axios from "axios"; // for ES6 (Browsers, Modern JavaScript)
import HomeComments from "./HomeComments";

// const state = {
//   post_id: null,
//   username: null
// }


function Post({ post, content , post_image, post_date,  post_owner, post_id, username, votes, comments}) {
  const [userInfo, setUserInfo] = useState('');
  const [likesCount, setLikesCount] = useState('');
  const [liked, setLiked] = useState(false);
  const [isCommentsOpen, setCommentsPopup] = useState(false);

  //console.log(comments);


  useEffect(() => {
    // Check if the username is in any up_vote_by in the votes array
    const isLiked = votes.some((vote) => vote.up_vote_by === username);
    setLiked(isLiked);
  }, [votes, username]);



  // this.state.post_id = post_id;
  // this.state.username = username;

  // get the post owner
  const getPostOwner=() =>{

      console.log("get post owner");
      const authToken = localStorage.getItem("authToken");
  
      if (authToken) {
        console.log(`${process.env.REACT_APP_WHO_WILL_URL}/api/users/${post_owner}/`);

        axios
          .get(`${process.env.REACT_APP_WHO_WILL_URL}/api/users/${post_owner}/`, {
            headers: {
              Authorization: `Token ${authToken}`,
            },
          })
          .then((res) => {
            const userInfo = res.data;
            setUserInfo(userInfo);

          })
          .catch((err) => {
            console.log(err);
          });
      } else {
        console.log("Error: No auth token provided.");
      }
    
  }

  useEffect(() => {
    getPostOwner(); // Fetch data when the component mounts
    getPostLikes();
   }, []);
  

  const handleCommentsClick=() => {
    console.log("comments button clicked!!!"); 
    setCommentsPopup(true);
  };

  const handleCloseComments = () => {
    setCommentsPopup(false);
}

  const getPostLikes = () => {
      // for the post, get the like count
      const authToken = localStorage.getItem("authToken");
      if (authToken) {
        axios.get(`${process.env.REACT_APP_WHO_WILL_URL}/api/votes/`, {
            headers: {
                'Authorization': `Token ${authToken}`,
                'Content-Type': "application/json"
            }
        })
        .then((response) => {
          // Handle the successful response here
          console.log("REQUEST WORKING?");
          var data = response.data;
          var count = 0;
          data.forEach(element => {
            // for each object in the votes api, update the count
              if(element.post === post_id) {
                 count = count + 1;
              }
          });
          setLikesCount(count);
    
        })
        .catch((error) => {
          // Handle any errors here
          console.error("REQUEST NOT WORKING");
        });
    }

  }

  
  //handle vote up 
  const handleLikeClick=() =>{
    setLiked(true);

    console.log(post_id);
    console.log(username);

    const postVote = {
      post: post_id,
      up_vote: true
    }
    const authToken = localStorage.getItem("authToken");

    console.log(postVote);

    if (authToken) {
        axios.post(`${process.env.REACT_APP_WHO_WILL_URL}/api/votes/`, postVote, {
            headers: {
                'Authorization': `Token ${authToken}`,
                'Content-Type': "application/json"
            }
        })
        .then((response) => {
          // Handle the successful response here
          console.log('POST request successful:', response.data);
    
          // Assuming that the response contains an updated list, you can set it in your component's state or do further processing.
          // For example, if you have a state variable `updatedList`:
          // this.setState({ updatedList: response.data });
        })
        .catch((error) => {
          // Handle any errors here
          console.error('POST request error:', error);
        });
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const formattedDate = new Date(dateString).toLocaleDateString('en-US', options);
    return formattedDate;
  }

  // need to be able to see likes on posts

    
  return (
    
    <div className="postbox">
      <div>
        <Profile username={userInfo.username} post_date = {formatDate(post_date)} />
      </div>
     
      <Content title={post.title} content={post.content} post_image={post_image}   />
      {/* <p id="postdate">{post_date}</p> */}
      
      <div className="bottombar">
        <button onClick={handleLikeClick} id="like"> 
        <span role="img" className="heart" aria-label="Heart">{liked ? '❤️' : '🤍'}</span>
        </button>
        <div className="likeNumber">{likesCount}</div>
        <button className="comments" onClick={handleCommentsClick}>Comments</button>

      </div>
        {isCommentsOpen && (
          <HomeComments onClose={handleCloseComments} 
          comments={comments}
          post_id={post_id} 
          owner={post.owner}
          username={username}/>
        )}
      </div>
  );
}

export default Post;