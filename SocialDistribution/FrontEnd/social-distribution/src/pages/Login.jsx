import React from "react";
import Button from "../Components/Button";
import TextInput from "../Components/TextInput";
import styled from "styled-components";
import { NavLink as Link } from "react-router-dom";

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
  
`;

const Login = () => {
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
        <TextInput placeholder="User Name"></TextInput>
        <TextInput placeholder="Password"></TextInput>
        <div style={{
          marginTop: '30px',
          marginBottom: '30px',
        }}>
          <Button size='md' variant="primary">Sign in</Button>
        </div>
        <TextLink>Forget password?</TextLink>
        <TextLink>Don't have an account?</TextLink>
      </Container>

    </div>
  );
};

export default Login;
