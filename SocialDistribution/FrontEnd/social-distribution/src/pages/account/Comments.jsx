import React, { Component } from 'react';
import axios from 'axios';
import './Comments.css'
import FormatDate from '../../utils/FormatDate.jsx';

class Comments extends Component {
    state = {
        comments: null,
    };

    componentDidMount(){
        this.getData();
    }


    getData = () => {
        const authToken = localStorage.getItem("authToken");
        if (authToken) {
            axios.get(`${process.env.REACT_APP_WHO_WILL_URL}/api/comments/?post=${this.props.postID}`, {
                headers: {
                    'Authorization': `Token ${authToken}`,
                }
            })
            .then((res) => {
                const comments = res.data;

                console.log(comments);

                this.setState({ comments });
            })
            .catch((err) => {
                console.log(err);
            });
        }
    }




    render() {

        const { comments } = this.state;

        return (
            <div className="comments-popup">
                <div className="comments-content">
                    <h2>Comments Page</h2>
                    <div className="comment-section">
                    {comments && comments.map((comment, index) => (
                        <div key={index} className="comment">
                            {console.log(comment)}
                            <p id="commenter">{comment.commented_by}:</p>
                            <p id="comment-comment">{comment.comment}</p>
                            <p id="comment-date">{FormatDate.formatDate(comment.post_date_time)}</p>
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