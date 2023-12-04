import React from "react";
import Post from "./Post";
import "../homepage.css"; // use css style
import { useState, useEffect } from 'react';
import Github from "../github";
import GetAllFriends from "../../utils/GetAllFriends";



function Postlist({ posts, username}) {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [friendLst, setFriendLst] = useState([]);

  

  const getAllFriendsInstance = new GetAllFriends(localStorage.getItem("pk"));

  const friendsList = getAllFriendsInstance.GetAllFriends(localStorage.getItem("pk"));

  friendsList.then((res) => {
    setFriendLst(res);
    console.log(res);
    setFriendLst(res);
  }).catch((err) => {
    console.log(err);
  })

  //username --> retrieve list of friends

  const handleFilterChange = event => {
    setSelectedFilter(event.target.value);
  };

  // Filter posts based on the selected visibility
  const filteredPosts = posts.filter(post => {
    if (selectedFilter === 'public') {
      return post.visibility === selectedFilter || post.visibility === "PUBLIC"; // Show all posts when 'all' is selected
    } else if(selectedFilter === "friends only"){
        //return post.visibility === selectedFilter && post.owner in friendsList
        console.log(typeof(friendLst[0]));
        console.log("show postowner: ", post.owner);
        console.log("show frinedList" ,friendLst);
        if (friendLst.includes(post.owner)){
          console.log("***********************************");
        }
        return (post.visibility === selectedFilter) && friendLst.includes(post.owner);
    }else {
      return;
    }

    // else {
    //   return post.visibility === selectedFilter; // Show posts matching the selected visibility
    // }
  });
 
    
  return (
    <div className="post-list">
      <div className='filter'>
        <select name="filter" className="custom-filter"  onChange={handleFilterChange}>  
          <option value="all">Select field</option>
          <option value="private">Private</option>
          <option value="public">Public</option>
          <option value="friends only">Friends Only</option>
        </select>

        <div className="github_activity">
          <Github></Github>
        </div>
      </div>

      
      
      {filteredPosts.sort((a, b) => new Date(b.post_date_time) - new Date(a.post_date_time))
      .map((post, index) => (
        
        <Post post={post} key={index}  content={post.content} post_image = {post.post_image} post_date = {post.post_date_time}  post_owner = {post.owner} post_id = {post.id} username = {username} votes = {post.votes} comments = {post.comments}/>
      ))}
    </div>
  );
}

export default Postlist;