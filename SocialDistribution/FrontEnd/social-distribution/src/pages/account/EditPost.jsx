import React, { Component } from 'react';
import axios from 'axios';
import './AddPost.css'

class EditPost extends Component {
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

        const postToEdit = this.props.postToEdit;



        if (content === '' && image === null){
            //empty post
            this.closeModal();
            return;
        }

        console.log(postToEdit.id)


        const editedPost = {
            id: postToEdit.id, 
            content: content,
            visibility: visibility,
            timestamp: postToEdit.timestamp,
            image: image,
        };

        if (content === ''){
            editedPost.content = postToEdit.content;
        }

        this.props.onEditPost(editedPost);

        this.sendEditPostData(19, editedPost)

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

export default EditPost;