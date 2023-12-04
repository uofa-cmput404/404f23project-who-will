import styled from "styled-components";
import { NavLink as Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { useState } from 'react'
import axios from "axios";
import { toast } from 'react-toastify';
import "./Nav.css";

// height was 80px before nav change
export const Nav = styled.nav`
    background: #000;
    height: 100px;
    display: flex;
    justify-content: space-between;
    padding: 0.5rem calc((100vw-1000px) / 2);
    z-index: 10;
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
`;


// remove margin-top to revert nav change
export const NavLogo = styled(Link)`
    color: #fff;
    display: flex;
    align-items: center;
    text-decoration: none;
    padding: 0.1rem;
    padding-left: 1rem;
    height: 100%;
    cursor: pointer;
    margin-top: 25px;
    &.active{
        color: #15cdfc;
    }
`;

export const NavLink = styled(Link)`
    color: #fff;
    display: flex;
    align-items: center;
    text-decoration: none;
    padding: 0 13rem;
    height: 100%;
    cursor: pointer;
    margin-top: 5px;
    font-weight: bold;
    &.active{
        color: #15cdfc;
    }
    &:hover{
        color: #15cdfc;
    }
    @media (max-width: 2250px) {
        padding: 0 10rem;
    }

    @media (max-width: 1900px) {
        padding: 0 9rem;
    }

    @media (max-width: 1800px) {
        padding: 0 7rem;
    }

    @media (max-width: 1600px) {
        padding: 0 6rem;
    }

    @media (max-width: 1500px) {
        padding: 0 5rem;
    }

    @media (max-width: 1450px) {
        padding: 0 3rem;
    }
`;

export const NavIcon = styled(Link)`
    width: 20px;
    height: 10px;
    background-image: url("./NavBarIcons/notification-icon.jpg");
`;


export const Bars = styled(FaBars)`
    display: none;
    color: #fff;

    @media screen and (max-width: 768px){
        display: block;
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(-100%, 75%);
        font-size: 1.8rem;
        cursor: pointer;
    }
`;

// remove margin-top to revert nav changes
export const NavMenu = styled.div`
    display: inline-flex;
    align-items: center;
    margin-top: 52px;
    @media screen and (max-width:768px) {
        display: none;
    }
`;

// revert margin-top iff nav revert
export const NavBtn = styled.nav`
    display: flex;
    align-items: center;
    margin-right: 24px;
    margin-top: 37px;
    

    @media screen and (max-width: 768px) {
        display: none;
    }
`;


export const NavBtnLink = styled(Link)`
    border-radius: 4px;
    background-color: #15cdfc;
    padding: 10px 22px;
    color: #fff;
    border: none;
    outline: none;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    text-decoration: none;

    &:hover {
        transition: all 0.2s ease-in-out;
        background: #fff;
        color: #010606;
    }
`;


export const SearchBar = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);


    const handleSearch = async () => {
        var userExists = false;
        var searchedID = null;
        // hit the users endpoint, determine if the user exists or not
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await axios.get(`${process.env.REACT_APP_WHO_WILL_URL}/api/users/`, {
                headers: {
                    'Authorization': `Token ${authToken}`,
                }
            });
            // search through json to see if user exists
            // there is probably a way better way to do this, but this is fine for now
            var data = response.data;
            data.forEach(element => {
                if (element.username === query) {
                    userExists = true;
                    searchedID = element.id;
                    window.location.href = `/account?${searchedID}`;
                   
                }
            });
            setResults(response.data.results);  
        } 
        // catch all erros
        catch (error) {
            console.error('Error searching:', error);
        }

        if(!userExists) {
            toast.error("That user does not exist!");
        }
    };

    // styling
    // remove marginTop to revert nav changes
    const BarStyle = 
    {
        width:"20rem",
        background:"#F0F0F0", 
        border: "1px solid grey",
        display: "flex",
        borderRadius: "10px",
        margin: "20px",
        marginLeft: "0px",
        marginRight: "0px",
        height: "30px",
        marginTop: "50px",
    
    };
    
    const SearchDivStyle = 
    {
        display: "flex",
        alignItems: "center",
        marginTop: "5px",
    };

    const SearchButtonStyle = 
    {
        display: "flex",
        alignItems: "center",
        height: "35px",
        fontSize: "16px",

    };


    // in the future, call a query function in Django in the onChange section
    return (
    <div>
        <div style={SearchDivStyle} className="searchBar">
        <input 
        style={BarStyle}
        key="search-bar"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={"  Search Users"}
        />
        <button className="actionSearch" style={SearchButtonStyle}  onClick={handleSearch}> Search</button>
        </div>
      </div>
    );
  }
  
  
