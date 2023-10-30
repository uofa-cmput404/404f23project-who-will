import React from "react";
import "./homepage.css"; // use css style

function Profile({username, post_date}) {
  return (<div className="profile">
    <div id='profileimage'></div> 
    <div className="name_date">
        <div id='username'>{username}</div>
        <div id = "post_date"> {post_date}</div>

    </div>
    
  </div>);
}

export default Profile;
