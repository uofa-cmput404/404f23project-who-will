import React, { Component } from 'react';
import axios from 'axios';
import './AddPost.css'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class EditPost extends Component {
    state = {
        content: '',
        visibility: 'public',
        image: null,
        currentVisibility: null,
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

        this.setState({ initialVisibility: this.props.currentVisibility });

        const postToEdit = this.props.postToEdit;

        const primaryKey = localStorage.getItem("pk");

        //TODO: This allows for empty posts! Just take the old content and image and overwrite them if new stuff, leave if no new
        if (content === '' && image === null && this.props.currentVisibility === this.state.visibility){
            //empty post
            this.closeModal();
            return;
        }

        if (image) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64Image = event.target.result;
                console.log(base64Image);
                const editedPost = {
                    id: postToEdit.id, 
                    owner: primaryKey,
                    content: content,
                    post_image: base64Image,
                    visibility: this.state.visibility,
                };
                this.sendEditPostData(postToEdit.id, editedPost);
            };
    
            reader.readAsDataURL(image); 

        } else {
            const editedPost = {
                id: postToEdit.id, 
                owner: primaryKey,
                content: content,
                post_image: null,
                visibility: this.state.visibility,
            };

            console.log(editedPost);
            this.sendEditPostData(postToEdit.id, editedPost);
        }
    
        this.closeModal();
    };

    sendEditPostData = (postId, editedPostData) => {
        const authToken = localStorage.getItem("authToken"); // Use localStorage.getItem() to get the authToken
        if (authToken) {
            axios.put(`http://localhost:8000/api/posts/${postId}/`, editedPostData, {
                headers: {
                    'Authorization': `Token ${authToken}`,
                    'Content-Type': 'application/json'
                }
            })
            .then((res) => {
                console.log(res.data);
                console.log("Successful edit");
            })
            .catch((err) => {
                console.log(err);
                toast.error('Failed to edit post. Please try again.');
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
                    <h2>Edit Post</h2>
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
                            <option value="friends only">Friends Only</option>
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

export default EditPost;