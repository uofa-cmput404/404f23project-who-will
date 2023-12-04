import React from "react";
import styled from "styled-components";
import TextInput from "../Components/TextInput";
import Button from "../Components/Button";
import { useState } from "react";
import { NavLink as Link } from "react-router-dom";
import axios from "axios";

const ScrollContainer = styled.div`
  overflow: auto;
  display: flex;
  flex-direction: column;
  width: 30%;
  height: 60%;
  align-items: center;
  justify-content: center;
  border: 1px solid black;
  border-radius: 10px;
`;

const SignUp = () => {
  const [inputs, setInputs] = useState({});

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (inputs["passWord"] !== inputs["rePassWord"]) {
      alert("Make Sure the 2 passwords are matching.");
    } else {
      let data;
      data = {
        username: inputs["userName"],
        email: inputs["email"],
        password: inputs["passWord"],
      };
      console.log(data);
      axios
        .post(`${process.env.REACT_APP_WHO_WILL_URL}/api/users/`, data)
        .then((res) => {
          console.log(res);
          window.location.reload();
          window.location.href = "/signin";
        })
        .catch((err) => {
          console.log(err);
          alert(err['request']['response']);
        });
    }
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "90vh",
      }}
    >
      <h1>Sign Up</h1>
      <ScrollContainer>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
            alignContent: "center",
            alignItems: "center",
          }}
        >
          <TextInput
            placeholder="Email"
            onChange={handleChange}
            name="email"
          ></TextInput>
          <TextInput
            placeholder="User Name"
            onChange={handleChange}
            name="userName"
          ></TextInput>
          <TextInput
            type="password"
            placeholder="Password"
            onChange={handleChange}
            name="passWord"
          ></TextInput>
          <TextInput
            type="password"
            placeholder="Re-enter Password"
            onChange={handleChange}
            name="rePassWord"
          ></TextInput>
          <Button type="submit" size="md" variant="primary">
            Sign Up
          </Button>
        </form>
        <Link to="/signin">Have an Account?</Link>
      </ScrollContainer>
    </div>
  );
};

export default SignUp;
