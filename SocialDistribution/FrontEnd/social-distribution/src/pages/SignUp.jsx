import React from "react";
import styled from "styled-components";
import TextInput from "../Components/TextInput";
import Button from "../Components/Button";

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
        <TextInput placeholder="Email"></TextInput>
        <TextInput placeholder="User Name"></TextInput>
        <TextInput placeholder="Password"></TextInput>
        <TextInput placeholder="Re-enter Password"></TextInput>
        <div
          style={{
            marginTop: "30px",
            marginBottom: "30px",
          }}
        >
          <Button size="md" variant="primary">
            Sign Up 
          </Button>
        </div>
      </ScrollContainer>
    </div>
  );
};

export default SignUp;
