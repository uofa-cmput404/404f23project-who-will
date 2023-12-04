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
    categoryOptions: null,
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

  handleCategoryCheckboxChange = (e) => {
    const categoryId = parseInt(e.target.value, 10);
    const updatedCategories = [...this.state.categories];
  
    if (e.target.checked) {
      updatedCategories.push(categoryId);
    } else {
      const index = updatedCategories.indexOf(categoryId);
      if (index !== -1) {
        updatedCategories.splice(index, 1);
      }
    }
  
    this.setState({ categories: updatedCategories });
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
    //initialize new post with required field
    const newPost = {
      owner: primaryKey,
    };


    //add optional elements 1 by 1
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

    console.log("SELECTED CATEGORYYYYY ======= " + this.state.categories) 
    //TODO: Fix this
    // if (categories !== '') {
    //     newPost.categories = categories.split(',').map(category => category.trim());
    // }

   
    //image should be last thing added
    if (image) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Image = event.target.result;
        newPost.post_image = base64Image;
        this.sendPostData(newPost);
        this.closeModal();
      };

      reader.readAsDataURL(image);
    } 
    else {
      this.sendPostData(newPost);
      this.closeModal();
    }
  };

  sendPostData = (postData) => {
    const authToken = localStorage.getItem("authToken");
    console.log(postData);

    if (authToken) {
      axios
        .post(`${process.env.REACT_APP_WHO_WILL_URL}/api/posts/`, postData, {
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

  componentDidMount() {
    this.getCategories();
  }

  getCategories = () => {
    const authToken = localStorage.getItem("authToken");
  
    if (authToken) {
      axios
        .get(`${process.env.REACT_APP_WHO_WILL_URL}/api/categories/`, {
          headers: {
            Authorization: `Token ${authToken}`,
          },
        })
        .then((res) => {
          const categoryOptions = res.data;
          console.log("Categories ===", categoryOptions);
  
          // Set the availableCategories in the state
          this.setState({ availableCategories: categoryOptions });
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log("Error: No auth token provided.");
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
              {this.state.availableCategories ? (
                this.state.availableCategories.map((category) => (
                  <div id="categories" key={category.id}>
                    <input
                      type="checkbox"
                      id={`category-${category.id}`}
                      value={category.id}
                      checked={this.state.categories.includes(category.id)}
                      onChange={this.handleCategoryCheckboxChange}
                    />
                    <label htmlFor={`category-${category.id}`}>{category.category}</label>
                  </div>
                ))
              ) : (
                <p>Loading categories...</p>
              )}
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
