import React from "react";
import axios from "axios";

const api_addr = process.env.REACT_APP_API_URL;
class Friends extends React.Component {
  state = { details: [] };
  componentDidMount() {
    let info;
    axios
      .get(`${api_addr}/users/`)
      .then((res) => {
        console.log(res);
        info = res.data;
        this.setState({
          details: info,
        });
      })
      .catch((err) => {
        console.log(err); 
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
