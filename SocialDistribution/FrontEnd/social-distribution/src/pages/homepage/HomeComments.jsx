import React, { Component } from 'react';
import axios from 'axios';
import '../account/Comments.css'
import FormatDate from '../../utils/FormatDate.jsx';
import AddComment from './AddComment.jsx'

class HomeComments extends Component {
    state = {
        comments: null,
        showAddCommentPopup: false,
    };

    delayTime = 100;

    handlePostCommentClick = () => {
        console.log("hello");
        this.setState({ showAddCommentPopup: true });
    }

    handleClosePostComment = () => {
        this.setState({ showAddCommentPopup: false });
        this.getData();
        this.getDataDelay();
    }

    componentDidMount(){
        this.getData();
    }

    async getDataDelay() {
        await new Promise((resolve) => {
          setTimeout(resolve, this.delayTime);
        });
    
        this.getData();
      }


    //retrieves post from db
    getData = () => {
        const authToken = localStorage.getItem("authToken");
        if (authToken) {
            //queries posts with correct id
            axios.get(`${process.env.REACT_APP_WHO_WILL_URL}/api/comments/?post=${this.props.post_id}`, {
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
        const { comments, showAddCommentPopup } = this.state;

        return (
            <div className="comments-popup">
                <div className="comments-content">
                    <h2>Comments Page</h2>
                    <div className="comment-section">
                        {comments && comments.map((comment, index) => (
                            <div key={index} className="comment">
                                <p id="commenter">{comment.commented_by}:</p>
                                <p id="comment-comment">{comment.comment}</p>
                                <p id="comment-date">{FormatDate.formatDate(comment.post_date_time)}</p>
                            </div>
                        ))}
                        <button onClick={this.handlePostCommentClick}>Comment</button>
                        <button onClick={this.props.onClose}>Close</button>
                    </div>
                </div>
                {showAddCommentPopup && <AddComment onClose={this.handleClosePostComment} postID={this.props.post_id} owner={this.props.owner} />}
            </div>
        );
    }
}

export default HomeComments;