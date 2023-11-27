import React, { Component } from "react";
import "./AddPost.css";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

class AddPost extends Component {
  state = {
    content: "",
    visibility: "public",
    image: null,
    source: "",
    origin: "",
    categories: [],
    title: "",
    description: "",
  };

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
    this.setState({ categories: e.target.value });
  };

  handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      this.setState({ image: file });
    }
  };

  handleSubmit = () => {
    const {
      content,
      visibility,
      image,
      source,
      origin,
      description,
      title,
      categories,
    } = this.state;

    if (content === "" && image === null && title === "") {
      // Empty post
      toast.error("Post must contain title, content or image");
      this.closeModal();
      return;
    }

    if (content.length > 4000) {
      toast.error("Post cannot exceed 4000 characters");
      this.closeModal();
      return;
    }

    const primaryKey = localStorage.getItem("pk");
    const newPost = {
      owner: primaryKey,
    };

    if (title !== "") {
      newPost.title = title;
    }

    if (description !== "") {
      newPost.description = description;
    }

    if (content !== "") {
      newPost.content = content;
    }

    newPost.visibility = visibility;

    if (source !== "") {
      newPost.source = source;
    }

    if (origin !== "") {
      newPost.origin = origin;
    }

    //TODO: Fix this
    // if (categories !== '') {
    //     newPost.categories = categories.split(',').map(category => category.trim());
    // }

    // console.log(categories)

    if (image) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Image = event.target.result;
        newPost.post_image = base64Image;
        this.sendPostData(newPost);
        this.closeModal();
      };

      reader.readAsDataURL(image);
    } else {
      this.sendPostData(newPost);
      this.closeModal();
    }
  };

  sendPostData = (postData) => {
    const authToken = localStorage.getItem("authToken");
    console.log(postData);

    if (authToken) {
      axios
        .post("http://localhost:8000/api/posts/", postData, {
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
          toast.error("Failed to upload post. Please try again.");
        });
    }
  };

  closeModal = () => {
    this.setState({ content: "", visibility: "public", image: null });
    this.props.onClose();
  };

  render() {
    return (
      <div className="add-post-popup">
        <div class="add-post-scrollable">
          <div className="add-post-content">
            <h2>Add New Post</h2>

            <textarea
              id="title"
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
            <label>Image:</label>
            <input
              id="image-selector"
              type="file"
              accept="image/*"
              onChange={this.handleImageUpload}
            />

            <textarea
              id="source"
              rows="1"
              placeholder="Source of the image..."
              value={this.state.source}
              onChange={this.handleSourceChange}
            />

            <textarea
              id="origin"
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
              <select
                value={this.state.visibility}
                onChange={this.handleVisibilityChange}
              >
                <option value="public">Public</option>
                <option value="friends only">Friends Only</option>
                <option value="private">Private</option>
              </select>
            </label>
            <div>
              <button id="submit-button" onClick={this.handleSubmit}>
                Submit
              </button>
              <button id="cancel-button" onClick={this.closeModal}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AddPost;
