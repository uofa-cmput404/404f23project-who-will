import styled from "styled-components";
import { NavLink as Link } from 'react-router-dom';
import { FaBars } from 'react-icons/fa';
import { useState } from 'react'
import axios from "axios";
import { toast } from 'react-toastify';

export const Nav = styled.nav`
    background: #000;
    height: 80px;
    display: flex;
    justify-content: space-between;
    padding: 0.5rem calc((100vw-1000px) / 2);
    z-index: 10;
`;

export const NavLogo = styled(Link)`
    color: #fff;
    display: flex;
    align-items: center;
    text-decoration: none;
    padding: 0.1rem;
    padding-left: 1rem;
    height: 100%;
    cursor: pointer;
    &.active{
        color: #15cdfc;
    }
`;

export const NavLink = styled(Link)`
    color: #fff;
    display: flex;
    align-items: center;
    text-decoration: none;
    padding: 0 15rem;
    height: 100%;
    cursor: pointer;
    &.active{
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

export const NavMenu = styled.div`
    display: inline-flex;
    align-items: center;
    @media screen and (max-width:768px) {
        display: none;
    }
`;

export const NavBtn = styled.nav`
    display: flex;
    align-items: center;
    margin-right: 24px;

    @media screen and (max-width: 768px) {
        display: none;
    }
`;

export const NavBtnLink = styled(Link)`
    border-radius: 4px;
    background: #256ce1;
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
        try {
            const authToken = localStorage.getItem('authToken');
            const response = await axios.get(`http://localhost:8000/api/users/`, {
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
        catch (error) {
            console.error('Error searching:', error);
        }

        if(!userExists) {
            toast.error("That user does not exist!");
        }
    };

    const BarStyle = 
    {
        width:"20rem",
        background:"#F0F0F0", 
        border: "1px solid blue",
        display: "flex",
        borderRadius: "10px",
        margin: "20px",
        height: "30px",
    
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
        height: "30px",
        border: "1px solid blue",
        fontSize: "13px",

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
        <button style={SearchButtonStyle}  onClick={handleSearch}> Search</button>
        </div>
      </div>
    );
  }
  
  
