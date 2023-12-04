import React, { Component } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";

class AddComment extends Component {
    state = {
        commentText: '',
    };

    //main logic for when user attempts to submit their comment
    handleSubmit = () => {
        console.log("Submbit button clicked!!!!");

        if (this.state.commentText === ''){
            toast.error("Comments cannot be empty");
            this.props.onClose();
        }

        const newComment = {
            owner: this.props.owner,
            post: this.props.postID,
            comment: this.state.commentText,
        };
        

        console.log("newCOmment === " + newComment.comment);

        this.sendCommentData(newComment);

        this.props.onClose();
    }

    handleCommentChange = (event) => {
        this.setState({ commentText: event.target.value });
    };




    //uploads newly formed comment to database
    sendCommentData = (commentData) => {
        const authToken = localStorage.getItem("authToken");
        if (authToken) {
          axios
            .post(`${process.env.REACT_APP_WHO_WILL_URL}/api/comments/`, commentData, {
              headers: {
                Authorization: `Token ${authToken}`,
                "Content-Type": "application/json",
              },
            })
            .then((res) => {
              console.log(res.data);
            })
            .catch((err) => {
              console.log(err);
              toast.error("Comment Failed to Upload");
            });
        }
      };



    render() {
        const { comments, showAddCommentPopup } = this.state;

        return (
            <div className="comments-popup">
                <div className="comments-content">
                    <h2>Create Comment</h2>
                    <textarea id="comment-input"
                        value={this.state.commentText}
                        onChange={this.handleCommentChange}
                        rows="5"
                        placeholder="Write your comment here..."
                    />
                    <div>
                        <button id= "submit-button" onClick={this.handleSubmit}>Submit</button>
                        <button id= "cancel-button" onClick={this.props.onClose}>Cancel</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default AddComment;