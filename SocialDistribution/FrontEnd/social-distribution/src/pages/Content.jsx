import React from "react";
import "./homepage.css"; // use css style

function Content({ content, post_image }) {
  return (
  <div className="content">
    <div className="text">{content} </div>
    {post_image && <img src={post_image} alt="Post content " id = "post_image"/>}
  </div>
  );

}

export default Content;
