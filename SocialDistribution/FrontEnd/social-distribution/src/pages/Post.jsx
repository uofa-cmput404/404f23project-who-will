import React from "react";
import Profile from "./Profile";
import Content from "./Content";
import "./homepage.css"; // use css style
import { useState, useEffect } from 'react';
import axios from "axios"; // for ES6 (Browsers, Modern JavaScript)

// const state = {
//   post_id: null,
//   username: null
// }

function Post({ content , post_image, post_date,  post_owner, post_id, username}) {
  const [userInfo, setUserInfo] = useState('');

  // this.state.post_id = post_id;
  // this.state.username = username;

  const getPoseOwner=() =>{
      console.log("get post owner");
      const authToken = localStorage.getItem("authToken");
  
      if (authToken) {
        console.log(`http://localhost:8000/api/users/${post_owner}/`);

        axios
          .get(`http://localhost:8000/api/users/${post_owner}/`, {
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
    getPoseOwner(); // Fetch data when the component mounts
   }, []);
  
  //handle vote up 
  const handleLikeClick=() =>{

    console.log(post_id);
    console.log(username);

    const postVote = {
      post: post_id,
      up_vote: true
    }
    const authToken = localStorage.getItem("authToken");

    console.log(postVote);

    if (authToken) {
        axios.post('http://localhost:8000/api/votes/', postVote, {
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


    
  return (
    <div className="postbox">
      <div>
        <Profile username={userInfo.username} post_date = {formatDate(post_date)} />
      </div>
     
      <Content content={content} post_image={post_image}   />
      {/* <p id="postdate">{post_date}</p> */}
      
      <div className="bottombar">
        <button onClick={handleLikeClick} id="like">       
          <span role="img" aria-label="Heart">❤️</span>
        </button>

      </div>
 
      </div>
  );
}

export default Post;