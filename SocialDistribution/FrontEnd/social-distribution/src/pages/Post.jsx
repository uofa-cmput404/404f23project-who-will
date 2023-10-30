import React from "react";
import Profile from "./Profile";
import Content from "./Content";
import "./homepage.css"; // use css style
import { useState, useEffect } from 'react';
import axios from "axios"; // for ES6 (Browsers, Modern JavaScript)


function Post({ content , post_image, post_date,  post_owner, post_id, username}) {
  const [userInfo, setUserInfo] = useState('');

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
  
  //handle vote up 
  const handleLikeClick=() =>{
    // 
    const postVote = {
      "post": {post_id},
      "up_vote_by": {username}
    }

    // fetch('http://localhost:8000/api/posts/', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(postVote),
    // })
    // .then((response) => {
    //   if (response.status === 200) {
    //     // Request was successful, handle the response here
    //   } else {
    //     // Request failed, handle the error here
    //   }
    // })
    // .catch((error) => {
    //   // Network error, handle the error here
    // });
  };

  useEffect(() => {
    getPoseOwner(); // Fetch data when the component mounts
   }, []);
    
  return (
    <div className="postbox">
      <div>
        <Profile username={userInfo.username} post_date = {post_date} />
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