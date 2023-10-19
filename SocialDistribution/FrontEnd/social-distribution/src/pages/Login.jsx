import React from "react";
import Button from "../Components/Button";
import TextInput from "../Components/TextInput";
import styled from "styled-components";
import { NavLink as Link } from "react-router-dom";
import { useState } from "react";
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

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setInputs((values) => ({ ...values, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    alert(inputs);
    console.log(inputs);
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
            name='userName'
            placeholder="User Name"
            onChange={handleChange}
          ></TextInput>
          <TextInput
            type="password"
            name='psw'
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
