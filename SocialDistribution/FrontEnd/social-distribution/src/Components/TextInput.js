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

const TextInput = ({type, place_holder, id, name, onChange, box}) => {
    if (box){
        return(
            <TextAreaComponent></TextAreaComponent>
        );
    } else {

        return(
            <InputComponent 
                id={id}
                name={name}
                type={type ? type:"text"}
                placeholder={place_holder} 
                onChange={onChange}
            />
        );
    }
};

export default TextInput;