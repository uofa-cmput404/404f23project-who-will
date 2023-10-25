import React from 'react';
import axios from 'axios';

class DeletePost extends React.Component {


    deletePost = (postId) => {
        console.log("Deleting post with ID: ", postId);
        const authToken = localStorage.getItem("authToken");
        if (authToken) {
            axios.delete(`http://localhost:8000/api/posts/${postId}/`, {
                headers: {
                    'Authorization': `Token ${authToken}`,
                }
            })
            .then((res) => {
                console.log("Post deleted successfully");
            })
            .catch((err) => {
                console.log("Error response:", err.response);
                console.log(err);
            });
        }
    }


    
}

export default DeletePost;