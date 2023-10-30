import React, { Component } from 'react';
import './AddPost.css';
import axios from "axios";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


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
    
        if (content === '' && image === null) {
            // Empty post
            toast.error('Post must contain body or image');
            this.closeModal();
            return;
        }

        if (content.length > 4000){
            toast.error('Post cannot exceed 4000 characters');
            this.closeModal();
            return;
        }
    
        const primaryKey = localStorage.getItem("pk");
        if (image) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64Image = event.target.result;
                console.log(base64Image);
                const newPost = {
                    owner: primaryKey,
                    content: content,
                    visibility: visibility,
                    post_image: base64Image,
                };
                this.sendPostData(newPost);
            };
    
            reader.readAsDataURL(image); 
        } else {
            const newPost = {
                owner: primaryKey,
                content: content,
                visibility: visibility,
                post_image: null,
            };
            this.sendPostData(newPost);
        }
    
        this.closeModal();
    };


    sendPostData = (postData) => {
        const authToken = localStorage.getItem("authToken");

        console.log(postData);

        if (authToken) {
            axios.post('http://localhost:8000/api/posts/', postData, {
                headers: {
                    'Authorization': `Token ${authToken}`,
                    'Content-Type': "application/json"
                }
            })
            .then((res) => {
                console.log(res.data); 
            })
            .catch((err) => {
                console.log(err);
                toast.error('Failed to upload post. Please try again.');
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