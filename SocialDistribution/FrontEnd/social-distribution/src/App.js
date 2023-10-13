import logo from './logo.svg';
import './App.css';
import React from 'react';
import Button from './Components/Button';
import TextInput from './Components/TextInput';
function App() {
  return (
    <React.Fragment>
      <h1
      style={{
        textAlign: "center",
        fontSize: "17px",
        margin: "15px"
      }}
      >
        Create Reusable Button Components
      </h1>
      <div
        style={{ 
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
         }}
      >
        <Button variant="success">Success Button</Button>
        <Button>Danger Button</Button>
        <Button>Warning Button</Button>
        <Button>Primary Button</Button>
        <TextInput place_holder="test"></TextInput>
      </div>
    </React.Fragment>
  );
}

export default App;
