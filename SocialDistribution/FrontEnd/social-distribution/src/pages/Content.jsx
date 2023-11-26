import React from "react";
import "./homepage.css"; // use css style

function Content({ title, description, content, post_image, source, origin, categories }) {
  return (
  <div className="content">
    <div className="title">{title} </div>
    <div className="text">{content} </div>
    {post_image && <img src={post_image} alt="Post content " id = "post_image"/>}
  </div>
  );

}

export default Content;
