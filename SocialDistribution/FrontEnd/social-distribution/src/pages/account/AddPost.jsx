import React, { Component } from 'react';
import './AddPost.css';
import axios from "axios";


class AddPost extends Component {
    state = {
        content: '',
        visibility: 'public',
        image: null,
    };

    handleContentChange = (e) => {
        this.setState({ content: e.target.value });
    };

    handleVisibilityChange = (e) => {
        this.setState({ visibility: e.target.value });
    };

    
    handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            this.setState({ image: file }); 
        }
    };

    handleSubmit = () => {
        const { content, visibility, image } = this.state;

        const databaseTime = new Date().toISOString();
        const date = new Date(databaseTime);

        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit' 
        };

        const formattedDate = date.toLocaleDateString('en-CA', options);

        if (content === '' && image === null){
            //empty post
            this.closeModal();
            return;
        }

        //Creates new post
        const newPost = {
            id: Date.now(), 
            content: content,
            visibility: visibility,
            timestamp: formattedDate,
            image: image,
        };


        this.sendPostData(newPost);

        const post = {
            "id": 1,
            "content": "hellwo",
            "post_image": "http://127.0.0.1:8000/media/post_image/background.png",
            "category": "test",
            "post_date": "2023-10-22",
            "comments": [],
            "votes": []
        };


        this.props.onAddPost(post);

        this.closeModal();

        // once "submit" is clicked, get the profile visibility (public/private) -->
        // make api POST request
    };


    sendPostData = (postData) => {
        console.log("HERE 2")
        const authToken = localStorage.getItem("authToken");
        if (authToken) {
            axios.post('https://localhost8000/api/posts/', postData, {
                headers: {
                    'Authorization': authToken
                }
            })
            .then((res) => {
                console.log(res.data); 
                console.log("Successful post");
            })
            .catch((err) => {
                console.log(err);
            });
        }
    }


    closeModal = () => {
        this.setState({ content: '', visibility: 'public', image: null });
        this.props.onClose();
    };

    render() {
        return (
            <div className="add-post-popup">
                <div className="add-post-content">
                    <h2>Add New Post</h2>
                    <textarea
                        rows="8"
                        placeholder="Write your post here..."
                        value={this.state.content}
                        onChange={this.handleContentChange}
                    />
                    <label>
                        Image:
                    </label>
                    <input id = "image-selector" type="file" accept="image/*" onChange={this.handleImageUpload} />

                    

                    <label>
                        Visibility:
                        <select value={this.state.visibility} onChange={this.handleVisibilityChange}>
                            <option value="public">Public</option>
                            <option value="friends">Friends Only</option>
                            <option value="private">Private</option>
                        </select>
                    </label>
                    <div>
                        <button id= "submit-button" onClick={this.handleSubmit}>Submit</button>
                        <button id= "cancel-button" onClick={this.closeModal}>Cancel</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default AddPost;