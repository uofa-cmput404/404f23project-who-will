import React from "react";
import Post from "./Post";
import "./homepage.css"; // use css style


function Postlist({ posts, username }) {
    
  return (
    <div className="post-list">
      {posts.map((post, index) => (
        
        <Post key={index} content={post.content} post_image = {post.post_image} post_date = {post.post_date} username = {username}/>
      ))}
    </div>
  );
}

export default Postlist;