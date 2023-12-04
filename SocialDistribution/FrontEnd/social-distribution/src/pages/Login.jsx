import React from "react";
import Button from "../Components/Button";
import TextInput from "../Components/TextInput";
import styled from "styled-components";
import { NavLink as Link, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Account from "./Account";

const Container = styled.div`
  width: 30%;
  height: 60%;
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  border: 1px solid black;
  border-radius: 10px;
`;
const TextLink = styled(Link)`
  margin-top: 30px;
`;

const Login = () => {
  const [inputs, setInputs] = useState({});
  const [key, setKey] = useState("");

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    let data;
    data = {
      username: inputs["userName"],
      password: inputs["psw"],
    };
    console.log(data);
    axios
      .post(`${process.env.REACT_APP_WHO_WILL_URL}/api/auth/login/`, data)
      .then((res) => {
        console.log(res.data);
        const authorizationToken = res.data.key;
        localStorage.setItem("authToken", authorizationToken);
        localStorage.setItem("username", data.username);  


        if (authorizationToken) {
            axios.get(`${process.env.REACT_APP_WHO_WILL_URL}/api/auth/user/`, {
                headers: {
                    'Authorization': `Token ${authorizationToken}`,
                }
            })
            .then((res) => {
                console.log(res.data); 
                const primaryKey = res.data["pk"];
                localStorage.setItem("username", res.data["username"]);
                localStorage.setItem("pk", primaryKey); 
                console.log(primaryKey);
                if(localStorage.getItem("pk") != null) {
                  console.log("Successfully logged in")
                  window.location.reload();
                  window.location.href = "/";
                }
            })
            
        }

       
        

        setKey(res.data);
      })
      .catch((err) => {
        console.log(err);
        alert('Incorrect User Name or Password, Please Try Again.');
      });
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
      <h1>Social Distribution</h1>
      <h1>Sign In</h1>
      <Container>
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
            name="userName"
            placeholder="User Name"
            onChange={handleChange}
          ></TextInput>
          <TextInput
            type="password"
            name="psw"
            placeholder="Password"
            onChange={handleChange}
          ></TextInput>
          <Button type="submit" size="md" variant="primary">
            Sign in
          </Button>
          <TextLink to="/signup">Don't have an account?</TextLink>
        </form>
      </Container>
    </div>
  );
};

export default Login;
