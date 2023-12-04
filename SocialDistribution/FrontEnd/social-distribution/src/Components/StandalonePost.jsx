// this component suffices the last user story where we need to be
// able to share a post by URI alone
// will use a ?query to
import React, { Component} from 'react'; 
import axios from 'axios';
import Post from "../pages/homepage/Post";
import { useEffect, useState } from 'react';

function isNotEmptyObject(obj) {
    return obj !== null && typeof obj === 'object' && Object.keys(obj).length > 0;
}

class Standalone extends Component {


    constructor(props) {
        // define state on load
        super(props);
        this.post = "temp placeholder"
        this.done = false;
      };



    async componentDidMount() {
        // actually wait for us to load friends
        await this.getData();
     };


     getData = () => {
        const authToken = localStorage.getItem("authToken");
        const queryParams = new URLSearchParams(window.location.search);
        const passedData = Object.fromEntries(queryParams.entries());
        var actualID = Object.keys(passedData)[0];
        // check if the past data is not null
        // also need to check if the postID exists
        if(isNotEmptyObject(passedData)) {
            axios.get(`${process.env.REACT_APP_WHO_WILL_URL}/api/posts/${actualID}/`, {
                headers: {
                    'Authorization': `Token ${authToken}`,
                }  
            })
            .then((res) => {
                console.log("post exists");
                // post exists, let's display it
                this.post = res.data;
                this.done = true;
                console.log("state reset");
                this.setState({ done: this.done, post: this.post });
                
            })
            .catch((err) => {
                console.log("Doesn't exist");
                return (
                    <p>It appears this post doesn't exist</p>
                );
            });
        }
        else {
            return (
                <p>It appears this post doesn't exist</p>
            );
        }

     }

    // will also need to add postID 
    render () {
        // get query params from window
        if(this.done === true) {
            return (
            <Post post={this.post} key={9999}  content={this.post.content} post_image = {this.post.post_image} post_date = {this.post.post_date_time}  post_owner = {this.post.owner} post_id = {this.post.id} username = {"bob"} votes = {this.post.votes} comments = {this.post.comments}/>
            );
        }

        return (
            <div className = "friendsPage">
            </div>
        );
    }

}

export default Standalone;