import React from "react";
import Post from "./Post";
import "./homepage.css"; // use css style


function Postlist({ posts, username}) {
    
  return (
    <div className="post-list">
      {posts.sort((a, b) => new Date(b.post_date_time) - new Date(a.post_date_time))
      .map((post, index) => (
        
        <Post key={index}  content={post.content} post_image = {post.post_image} post_date = {post.post_date_time}  post_owner = {post.owner} post_id = {post.id} username = {username}/>
      ))}
    </div>
  );
}

export default Postlist;