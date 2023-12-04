import React from "react";
import axios from "axios"; // for ES6 (Browsers, Modern JavaScript)
import "./homepage.css"; // use css style
import Postlist from "./homepage/Postlist";
import { useEffect, useState } from 'react';


const Home = () => {

  const [posts, setPosts] = useState([]); // Initialize the state to store the fetched posts
  const [username, setUsername] = useState('');

  const getData = () => {
    console.log("Fetching data");
    const authToken = localStorage.getItem("authToken");
    var username = localStorage.getItem("username");
    setUsername(username);

    // console.log(authToken);
    console.log(username);

    if (authToken) {
      axios
        .get(`${process.env.REACT_APP_WHO_WILL_URL}/api/posts/`, {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        })
        .then((res) => {
          console.log(res.data);
          const posts = res.data; // Access the data array
          setPosts(posts);
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log("Error: No auth token provided.");
    }
  };

    //   getData();
  useEffect(() => {
    getData(); // Fetch data when the component mounts
   }, []);
  
    return (
        <div >
            <Postlist posts={posts} username = {username} /> {/* Pass the posts array as a prop to Postlist */}
        </div>
    );
};

export default Home; 