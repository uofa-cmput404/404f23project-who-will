/* 
 TextInput Field, able to change size and hint text
 */
import React from "react";

const TextInput = ({type, value}) => {
    return(
        <input 
            type={type ? type:"text"}
            value={value}
        />
    );
};

export default TextInput;