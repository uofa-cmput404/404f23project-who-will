import React from "react";
import styled from "styled-components";
import Button from "./Button";
import TextInput from "./TextInput";
import { FaFileImage } from "react-icons/fa";


const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
`;

const ModalContainer = styled.div`
  width: 50vw;
  height: 50vh;
  position: fixed;
  top: 50%;
  left: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1001;
`;

const StyledLabel = styled.label`
    padding: 0.5em;
    margin: 0.5em;
    border-radius: 5px;
    background-color: #bbb9ac;
    cursor: pointer;
    &:hover{
        background-color: burlywood;
    }
    & > *{
        margin-right:0.5em;
    }
`

const ComposeModal = ({ onClose }) => {
  return (
    <>
      <Overlay />
      <ModalContainer>
        <h2>Send Post to A Friend</h2>
        <TextInput placeholder={"To: "}></TextInput>
        <TextInput box={true} placeholder={"Enter your Post"}></TextInput>
        <input
          type="file"
          id="images"
          accept="image/*"
          active={false}
          style={{ display: "none" }}
        />
        <StyledLabel htmlFor="images"><FaFileImage />Select Image</StyledLabel>
        <div>
          <Button variant={"success"}>Send</Button>
          <Button variant={"warning"} onClick={onClose}>
            Cancle
          </Button>
        </div>
      </ModalContainer>
    </>
  );
};

export default ComposeModal;
