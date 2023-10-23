import React, { Component } from 'react';
import './Account.css';
import { FaGear, IconName } from "react-icons/fa6";

class Account extends Component {

    static sampleUserData = {
        username: "Username",
        profilePicture: "../images/free_profile_picture.png",
        posts: [
            {
                id: 4,
                content: "Newest post",
                timestamp: "2023-10-18 16:38:00",
                image: "https://reactjs.org/logo-og.png",
            },
            {
                id: 3,
                content: "post --------------------------------------- how long should be our max post length???????\n ABCDEFGHHIJKLMOPNW",
                timestamp: "2023-10-18 10:00:00",
            },
            {
                id: 2,
                content: "Older Post",
                timestamp: "2023-10-18 9:15:00",
                image: "https://static.djangoproject.com/img/logos/django-logo-negative.png",
            },
            {
                id: 1,
                content: "Oldest Post",
                timestamp: "2023-10-18 9:10:00",
            },

        ],
    };
    

    state = {
        user: null,
        error: null,
    };

    //TODO add logic to the 3 buttons
    handleAddPost = () => {
        console.log('Add post button clicked -- account');
    }

    handleEditPost = () => {
        console.log('Edit post button clicked -- account');
    }

    handleDeletePost = (postId) => {
        const updatedPosts = this.state.user.posts.filter(post => post.id !== postId); //new list with all posts except specified (deleted)
        const updatedUser = { ...this.state.user, posts: updatedPosts }; 
        this.setState({ user: updatedUser });
    }

    handleSettingsClick = () => {
        //settings logic
      }

    componentDidMount() {
        // Retrieve user data from Django API
        try {
            const user = Account.sampleUserData; //Replace with actual user
            this.setState({ user });
        } catch (error) {
            this.setState({ error: "Error loading user data" });
        }
    }

    render() {
        const { user } = this.state;

        if (!user) {
            return (
                <div>Could Not Load User Data</div>
            );
        }

        

        return (
            <div className="grid">
                {/*Account Details*/}
                <div className="profile-picture">
                    <img  src="https://reactjs.org/logo-og.png" alt="Profile" /> {/*temporary image*/}
                </div>
                
                <p className='username'>{user.username}</p>
                
                <button className="settings-icon" onClick={this.handleSettingsClick}>
                    <FaGear/>
                </button>

                <button className="add-post-button" onClick={this.handleAddPost}>Add Post</button> 

                {/*Posts*/}
                <div className="post-content">
                    {user.posts.map(post => (   //map method iterates over posts, current post is passed to arrow function
                        <div className="post-box" key={post.id}>
                            <p>{post.content}</p>
                            {post.image && <img className="post-image"src={post.image} alt="Post Image" />}
                            <p>Posted on: {post.timestamp}</p>
                            <button className="edit-post-button" onClick={this.handleEditPost}>Edit</button>
                            <button className="delete-post-button" onClick={() => this.handleDeletePost(post.id)}>Delete</button>
                        </div>
                    ))}
                </div>

            </div>
        );
    }
}

export default Account;