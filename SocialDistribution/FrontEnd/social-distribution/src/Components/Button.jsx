/*
 Buttons, able to change size, color.
 */
import React from "react";
import styled from "styled-components";

const ButtonComponent = styled.button`
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    text-decoration: none;
    vertical-align: middle;
    cursor: pointer;
    user-select: none;
    border-radius: 0.3rem;
    padding: 0
        ${(props) => 
          props.size === "sm"
            ? "1.1rem"
            : props.size === "md"
            ? "1.4rem"
            : props.size === "lg"
            ? "1.6rem"
            : "1.1rem"  
        };
    height: ${(props) =>
        props.size === "sm"
            ? "34px"
            : props.size === "md"
            ? "37px"
            : props.size === "lg"
            ? "40px"
            : "34px"
    };
    font-family: "Inter", sans-serif;
    font-weight: 500;
    border: 1px solid grey;
    width: 100px;
    background-color: ${(props) => 
        props.variant === "light"
            ? "#f8f9fa"
            : props.variant === "dark"
            ? "#212529"
            : props.variant === "primary"
            ? "#fff"
            : props.variant === "secondary"
            ? "#6c757d"
            : props.variant === "success"
            ? "#fff"
            : props.variant === "info"
            ? "#0dcaf0"
            : props.variant === "warning"
            ? "#fff"
            : props.variant === "danger"
            ? "#dc3545"
            : "f8f9fa"
    };
`;

const Button = ({type, variant, onClick, size, className, id, children}) => {
    return(
        <ButtonComponent
            type={type ? type:"button"}
            variant={variant}
            className={className ? `btn-component ${className}` : "btn-component "}
            id={id}
            onClick={onClick}
            size={size}
        >
            {children}
        </ButtonComponent>
    );
};

export default Button;