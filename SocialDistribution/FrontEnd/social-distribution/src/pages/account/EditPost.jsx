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

    //handle content changes retrieve all data
    handleContentChange = (e) => {
        this.setState({ content: e.target.value });
    };

    handleVisibilityChange = (e) => {
        this.setState({ visibility: e.target.value });
    };

    handleTitleChange = (e) => {
        this.setState({ title: e.target.value });
    };

    handleDescriptionChange = (e) => {
        this.setState({ description: e.target.value });
    };

    handleSourceChange = (e) => {
        this.setState({ source: e.target.value });
    };
    
    handleOriginChange = (e) => {
        this.setState({ origin: e.target.value });
    };

    handleCategoriesChange = (e) => {
        this.setState({ categories: e.target.value })
    };

    
    handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            this.setState({ image: file }); 
        }
    };

    handleSubmit = () => {
        const { content, visibility, image, source, origin, description, title, categories } = this.state;

        this.setState({ initialVisibility: this.props.currentVisibility });

        const postToEdit = this.props.postToEdit;

        const primaryKey = localStorage.getItem("pk");
        console.log("hello"+primaryKey); // 3c11192-7ed8-4081-8827-af44db15485e  ( id for profile)
        console.log("hello2"+postToEdit); // 24e5c965b-e686-4d8a-a0a4-1cd5627f41e9 (post id)
        //Note if you change the initial size of this, you must change the end check!
        const editedPost = {
            id: postToEdit,
            owner: primaryKey,
        };


        if (title !== ''){
            editedPost.title = title;
        }
    
        if (description !== ''){
            editedPost.description = description;
        }

        if (content !== ''){
            editedPost.content = content;
        }

        if (source !== ''){
            editedPost.source = source;
        }

        if (origin !== ''){
            editedPost.origin = origin;
        }


        //TODO: Fix this
        // if (categories !== '') {
        //     editedPost.categories = categories.split(',').map(category => category.trim());
        // }

        // console.log(categories)

        if (visibility !== this.props.currentVisibility) {
            editedPost.visibility = visibility;
        }

        //add image if exists. This needs to be done last because of reader.readAsDataURL(image);
        if (image) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64Image = event.target.result;
                editedPost.post_image = base64Image;
                this.sendEditPostData(postToEdit.id, editedPost);
            };
    
            reader.readAsDataURL(image);
        }

        if (Object.keys(editedPost).length <= 2) {
            // No new data, nothing to update
            toast.error('No changes detected');
            this.closeModal();
            return;
        }

        this.sendEditPostData(postToEdit, editedPost);
        this.closeModal();
    };

    sendEditPostData = (postId, editedPostData) => {
        const authToken = localStorage.getItem("authToken"); // Use localStorage.getItem() to get the authToken
        if (authToken) {
            axios.patch(`${process.env.REACT_APP_WHO_WILL_URL}/api/posts/${postId}/`, editedPostData, {
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
                <div class="add-post-scrollable">
                    <div className="add-post-content">
                        <h2>Add New Post</h2>

                        <textarea id="title"
                            rows="1"
                            placeholder="Enter a title..."
                            value={this.state.title}
                            onChange={this.handleTitleChange}
                        />

                        <textarea
                            rows="2"
                            placeholder="Add a description..."
                            value={this.state.description}
                            onChange={this.handleDescriptionChange}
                        />
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

                        <textarea id="source"
                            rows="1"
                            placeholder="Source of the image..."
                            value={this.state.source}
                            onChange={this.handleSourceChange}
                        />

                        <textarea id="origin"
                            rows="1"
                            placeholder="Origin of the image..."
                            value={this.state.origin}
                            onChange={this.handleOriginChange}
                        />

                        <label>
                            Categories:
                            <textarea
                                rows="2"
                                placeholder="Add categories separated by commas..."
                                value={this.state.categories}
                                onChange={this.handleCategoriesChange}
                            />
                        </label>

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
            </div>
        );
    }
}

export default EditPost;