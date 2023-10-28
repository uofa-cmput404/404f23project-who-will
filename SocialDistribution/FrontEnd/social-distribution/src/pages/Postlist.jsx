import React from "react";
import Post from "./Post";

function Postlist({ posts }) {
    
  return (
    <div className="post-list">
      {posts.map((post, index) => (
        
        <Post key={index} content={post.content} />
      ))}
    </div>
  );
}

export default Postlist;