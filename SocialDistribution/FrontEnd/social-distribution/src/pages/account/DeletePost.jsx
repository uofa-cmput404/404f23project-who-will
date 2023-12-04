import React from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class DeletePost extends React.Component {


    deletePost = (postId) => {
        console.log("Deleting post with ID: ", postId);
        const authToken = localStorage.getItem("authToken");
        console.log(" HERE HERE 1 1 1 1 1");
        if (authToken) {
            axios.delete(`${process.env.REACT_APP_WHO_WILL_URL}/api/posts/${postId}/`, {
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
                toast.error('Failed to delete post. Please try again.');
            });
        }
    }

    
}

export default DeletePost;