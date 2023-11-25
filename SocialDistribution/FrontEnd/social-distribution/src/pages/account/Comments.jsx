import React, { Component } from 'react';
import axios from 'axios';
import './Comments.css'

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
            axios.get('http://localhost:8000/api/posts/', {
                headers: {
                    'Authorization': `Token ${authToken}`,
                }
            })
            .then((res) => {
                console.log(res.data);
                const comments = res.data.map(post => post.comments);

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
                    <button onClick={this.props.onClose}>Close</button>
                    <div className="comment-section">
                    {comments && comments.map((comment, index) => (
                        <div key={index} className="comment">
                            <p>{comment}</p>
                            <p>Author: </p> 
                        </div>
                    ))}
                </div>
                </div>
            </div>
        );
    }
}

export default Comments;