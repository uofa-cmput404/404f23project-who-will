import React from "react";
import "./homepage.css"; // use css style

function Profile({username, post_date}) {

  return (<div className="profile">
    <div id='profileimage'>
      <img src="https://th.bing.com/th/id/OIP.i_bpSvfG5T2Ekf3xGuqQMwHaH_?w=262&h=208&c=7&r=0&o=5&dpr=2&pid=1.7" id = "profileimage"/>

      </div> 
    <div className="name_date">
        <div id='username'>{username}</div>
        <div id = "post_date"> {post_date}</div>
    </div>
    
  </div>);
}

export default Profile;
