import React from "react";
import axios from "axios";

class Friends extends React.Component {
  state = { details: [] };
  componentDidMount() {
    let info;
    axios
      .get("http://localhost:8000/api/users/")
      .then((res) => {
        console.log(res);
        info = res.data;
        this.setState({
          details: info,
        });
      })
      .catch((err) => {
        
      });
  }

  render() {
    console.log(this.state.details);
    return (
      <div>
        <h1>test</h1>
      </div>
    );
  }
}


export default Friends;
