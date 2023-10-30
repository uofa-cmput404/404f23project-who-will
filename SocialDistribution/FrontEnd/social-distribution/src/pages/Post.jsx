import React from "react";
import Profile from "./Profile";
import Content from "./Content";
import "./homepage.css"; // use css style


function Post({ content , post_image, post_date, username}) {
    
  return (
    <div className="postbox">
      <div>
        <Profile username = {username} post_date = {post_date}  />
      </div>
     
      <Content content={content} post_image={post_image}   />
      {/* <p id="postdate">{post_date}</p> */}
      
      <div className="bottombar">
        <button id="like">       
          <span role="img" aria-label="Heart">❤️</span>
        </button>

      </div>
     


      
      </div>
  );
}

export default Post;