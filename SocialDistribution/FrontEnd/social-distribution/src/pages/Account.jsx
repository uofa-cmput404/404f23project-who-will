import React, { Component } from 'react';
import './Account.css';
import { FaGear, IconName } from "react-icons/fa6";
import AddPost from './account/AddPost.jsx'
import photo from '../images/free_profile_picture.png'; //need to import local images, I wonder how this will work for django database
import Settings from './account/Settings';
import EditPost from './account/EditPost.jsx';
import DeletePost from './account/DeletePost.jsx';
import Comments from './account/Comments.jsx';

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
        isCommentsOpen: false,
        postToEdit: null,
    };

    handleCommentsClick = () => {
        this.setState({ isCommentsOpen: true });
        console.log("Click registered")
    }

    handleCloseComments = () => {
        this.setState({ isCommentsOpen: false });
    }

    handleSettingsClick = () => {
        this.setState({ isSettingsOpen: true });
    };

    handleCloseSettings = () => {
        this.setState({ isSettingsOpen: false });
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

    handleEditPost = (post) => {
        this.setState({ isEditPostOpen: true, postToEdit: post });
    }

    handleCloseEditPost = () => {
        this.setState({ isEditPostOpen: false, content: '', visibility: 'public' });
    }

    updatePost = (editedPost) => {

        console.log("--------------")
        console.log(editedPost.id)

        
        const postIndex = this.state.user.posts.findIndex(post => post.id === editedPost.id);

        if (postIndex === -1){
            console.log("----ERROR----")
            return;
        }

        const profileUpdate = { ...this.state.user };
        profileUpdate.posts[postIndex] = editedPost;

        this.setState({ user: profileUpdate });
    };

    handleDeletePost = (postId) => {
        const confirmation = window.confirm("Are you sure you want to delete this post?");

        if (confirmation){
            const deletePost = new DeletePost();
            deletePost.deletePost(1)
            const updatedPosts = this.state.user.posts.filter(post => post.id !== postId); //new list with all posts except specified (deleted)
            const updatedUser = { ...this.state.user, posts: updatedPosts }; 
            this.setState({ user: updatedUser });
        }
    }


    componentDidMount() {
        //this gets all posts. We only want posts for your account
        // (bruh, this was a post method to post the user_post to the api so we can call it in main feed...)
    /*    getData = () => {
            console.log("Fetching data");
            const authToken = localStorage.getItem("authToken");
            if (authToken) {
                axios.get('http://localhost:8000/api/posts/', {
                    headers: {
                        'Authorization': `Token ${authToken}`,
                    }
                })
                .then((res) => {
                    console.log(res.data);
                    // You can use the data in your React component here
                })
                .catch((err) => {
                    console.log(err);
                });
            }
        } */


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
                                <button className="comments-button" onClick={() => this.handleCommentsClick()}>Comments</button>
                                <button className="edit-post-button" onClick={() => this.handleEditPost(post)}>Edit</button>
                                <button className="delete-post-button" onClick={() => this.handleDeletePost(post.id)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
                {this.state.isCommentsOpen && (
                    <Comments onClose={this.handleCloseComments} />
                )}
                {this.state.isEditPostOpen && (
                    <EditPost
                        onClose={this.handleCloseEditPost}
                        onEditPost={this.updatePost}
                        image={this.state.image}
                        postToEdit={this.state.postToEdit}
                    />
                )}

            </div>
        );
    }
}

export default Account;