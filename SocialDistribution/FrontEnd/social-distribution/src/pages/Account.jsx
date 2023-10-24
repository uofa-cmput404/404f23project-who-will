import React, { Component } from 'react';
import './Account.css';
import { FaGear, IconName } from "react-icons/fa6";
import AddPost from './account/AddPost.jsx'
import photo from '../images/free_profile_picture.png'; //need to import local images, I wonder how this will work for django database
import Settings from './account/Settings';
import EditPost from './account/EditPost.jsx'

class Account extends Component {

    static sampleUserData = {
        username: "Username",
        profilePicture: "../images/free_profile_picture.png",
        posts: [
            {
                id: 4,
                content: "Newest post",
                visibility: "private",
                timestamp: "2023-10-18 16:38:00",
                image: "https://reactjs.org/logo-og.png",
            },
            {
                id: 3,
                content: "post --------------------------------------- how long should be our max post length???????\n ABCDEFGHHIJKLMOPNW",
                visibility: "public",
                timestamp: "2023-10-18 10:00:00",
            },
            {
                id: 2,
                content: "Older Post",
                visibility: "friends only",
                timestamp: "2023-10-18 9:15:00",
                image: "https://static.djangoproject.com/img/logos/django-logo-negative.png",
            },
            {
                id: 1,
                content: "Oldest Post",
                visibility: "public",
                timestamp: "2023-10-18 9:10:00",
                image: photo,
            },

        ],
    };
    

    state = {
        user: null,
        error: null,
        userSettings: null,
        isAddPostOpen: false,
        isSettingsOpen: false,
        isEditPostOpen: false,
    };

    handleSettingsClick = () => {
        this.setState({ isSettingsOpen: true });
    };

    handleCloseSettings = () => {
        this.setState({ isSettingsOpen: false });
    };

    handleSettingsClick = () => {
        this.openSettings();
    };

    openSettings = () => {
        // Retrieve user settings data
        const userSettings = {

        };
    
        this.setState({ isSettingsOpen: true, userSettings });
    };
    

    handleAddPost = () => {
        this.setState({ isAddPostOpen: true });
    }

    handleCloseAddPost = () => {
        this.setState({ isAddPostOpen: false, content: '', visibility: 'public' });
    }

    addNewPost = (newPost) => {
        this.setState((prevState) => ({
            user: {
                ...prevState.user,
                posts: [newPost, ...prevState.user.posts], 
            },
        }));
    };

    handleEditPost = () => {
        this.setState({ isEditPostOpen: true });
    }

    handleCloseEditPost = () => {
        this.setState({ isEditPostOpen: false, content: '', visibility: 'public' });
    }

    updatePost = (newPost) => {
        //Update the database in editPost.jsx
        //This is solely to update the render
        this.setState((prevState) => ({
            user: {
                ...prevState.user,
                posts: [...prevState.user.posts, newPost],
            },
        }));
    };

    handleDeletePost = (postId) => {
        const confirmation = window.confirm("Are you sure you want to delete this post?");
        
        if (confirmation){
            const updatedPosts = this.state.user.posts.filter(post => post.id !== postId); //new list with all posts except specified (deleted)
            const updatedUser = { ...this.state.user, posts: updatedPosts }; 
            this.setState({ user: updatedUser });
        }
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
                {this.state.isSettingsOpen && (
                    <Settings onClose={this.handleCloseSettings} />
                )}

                <button className="add-post-button" onClick={this.handleAddPost}>Add Post</button> 
                
                {this.state.isAddPostOpen && (
                    <AddPost
                        onClose={this.handleCloseAddPost}
                        onAddPost={this.addNewPost}
                        image={this.state.image}
                    />
                )}

                {/*Posts*/}
                <div className="post-content">
                    {user.posts.map(post => (   //map method iterates over posts, current post is passed to arrow function
                        <div className="post-box" key={post.id}>
                            <p id="visibility">Visibility: {post.visibility}</p>
                            <p>{post.content}</p>
                            {post.image && <img className="post-image"src={post.image} alt="Post Image" />}
                            <p>Posted on: {post.timestamp}</p>
                            <div>
                                <button className="comments-button" onClick={this.handleComments}>Comments</button>
                                <button className="edit-post-button" onClick={() => this.handleEditPost(post)}>Edit</button>
                                <button className="delete-post-button" onClick={() => this.handleDeletePost(post.id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
                {this.state.isEditPostOpen && (
                    <EditPost
                        onClose={this.handleCloseEditPost}
                        onEditPost={this.updatePost}
                        image={this.state.image}
                    />
                )}

            </div>
        );
    }
}

export default Account;