/* 
 TextInput Field, able to change size and hint text
 */
import React from "react";
import styled from "styled-components";

const InputComponent = styled.input`
    padding: 0.5em;
    margin: 0.5em;
    border-radius: 3px;
`;
const TextAreaComponent = styled.textarea`
    padding: 0.5em;
    margin: 0.5em;
    border-radius: 3px
`;

const TextInput = ({type, placeholder, id, name, onChange, box}) => {
    if (box){
        return(
            <TextAreaComponent
                id={id}
                name={name}
                placeholder={placeholder}
                rows="4"
                col = "50"
            ></TextAreaComponent>
        );
    } else {

        return(
            <InputComponent 
                id={id}
                name={name}
                type={type ? type:"text"}
                placeholder={placeholder} 
                onChange={onChange}
            />
        );
    }
};

export default TextInput;