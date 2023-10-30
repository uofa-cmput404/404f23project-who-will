import React from "react";
import Button from "../Components/Button";
import TextInput from "../Components/TextInput";
import styled from "styled-components";
import { NavLink as Link, Navigate, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Account from './Account';

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
const TextLink = styled(Link)``;

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
      .post("http://localhost:8000/api/auth/login/", data)
      .then((res) => {
        console.log(res.data); 
        const authorizationToken = res.data.key;
        localStorage.setItem('authToken', authorizationToken);
        localStorage.setItem('username', data.username );
        window.location.reload(); // this effectively navigates us back to home
        // need to associate authToken with ID
        // also NEED a signout option
        setKey(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  

  const AuthStr = "Token ".concat(key["key"]);
  axios
    .get("http://localhost:8000/api/auth/user/", {
      headers: { Authorization: AuthStr },
    })
    .then((res) => {
      console.log(res.data);
    })
    .catch((err) => {
      console.log(err);
    });

  const useGetUser = () => {
    const [pk, setPk] = useState(-1);
    useEffect(() => {
      axios
        .get("http://localhost:8000/api/auth/user/", {
          headers: { Authorization: AuthStr },
        })
        .then((res) => {
          //console.log(res.data);
          setPk(res.data["pk"]);
        })
        .catch((err) => {
          console.log(err);
        });
    });
    console.log(pk);
    return (pk);
  };

  let testpk = useGetUser();
  console.log(testpk);

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
      <h1>Sign In</h1>
      <Container>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
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
          <div
            style={{
              marginTop: "30px",
              marginBottom: "30px",
            }}
          >
            <Button type="submit" size="md" variant="primary">
              Sign in
            </Button>
          </div>
          <TextLink>Forget password?</TextLink>
          <TextLink to="/signup">Don't have an account?</TextLink>
        </form>
      </Container>
    </div>
  );
};

export default Login;
