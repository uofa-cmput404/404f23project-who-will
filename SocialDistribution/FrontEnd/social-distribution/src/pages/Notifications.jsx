import React from "react";
import styled from "styled-components";
import Button from "../Components/Button";
import { FaPen } from "react-icons/fa";

const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
`;

const SideBar = styled.div`
  width: 20%;
  height: 100vh;
  display: inline-block;
  text-align: center;
  align-items: baseline;
  justify-content: center;
  background-color: #3b3939;
  flex-direction: row;
`;

const Inbox = styled.div`
  width: 25%;
  height: 100vh;
  display: flex;
`;

const Message = styled.div`
  width: 55%;
  height: 100vh;
  display: flex;
`;

const Tile = styled.div`
    margin: 10px;
    height: 5%;
    position: relative;
    cursor: pointer;
    align-items: center;
    justify-content:  center;
    display: flex;
    border: 1px solid transparent;
`;

const Notifications = () => {
  return (
    <Container>
      <SideBar>
        <Button size="lg" variant="primary">
          <FaPen />
          <p style={{ margin: "5px" }}>Compose</p>
        </Button>
      <Tile>Inbox</Tile>
      <Tile>Sent</Tile>
      </SideBar>
      <Inbox>test</Inbox>
      <Message>test</Message>
    </Container>
  );
};

export default Notifications;
