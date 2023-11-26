import React, { Component } from 'react';
import axios from 'axios';
import './Comments.css'
import FormatDate from '../../utils/FormatDate.jsx';

class Comments extends Component {
    state = {
        comments: null,
        postID: null,
    };

    componentDidMount(){
        this.postID = this.props.postID
        console.log("POST ID ==== " + this.postID);
        this.getData();
    }


    getData = () => {
        const authToken = localStorage.getItem("authToken");
        if (authToken) {
            axios.get(`http://localhost:8000/api/comments/`, {
                headers: {
                    'Authorization': `Token ${authToken}`,
                }
            })
            .then((res) => {
                const comments = res.data;

                //TODO: Make it so that comments are on proper posts

                this.setState({ comments });
            })
            .catch((err) => {
                console.log(err);
            });
        }
    }




    render() {

        const { comments } = this.state;
        const formattedDate = FormatDate.formatDate('2023-11-26T09:11:08Z');

        return (
            <div className="comments-popup">
                <div className="comments-content">
                    <h2>Comments Page</h2>
                    <div className="comment-section">
                    {comments && comments.map((comment, index) => (
                        <div key={index} className="comment">
                            {console.log(comment)}
                            <p id="commenter">user {comment.commented_by} commented:</p>
                            <p id="comment-comment">{comment.comment}</p>
                            <p id="comment-date">Comment date: {formattedDate}</p>
                        </div>
                    ))}
                <button onClick={this.props.onClose}>Close</button>
                </div>
                </div>
            </div>
        );
    }
}

export default Comments;