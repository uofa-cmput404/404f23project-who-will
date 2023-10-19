import React from 'react';
import {
    Nav,
    NavLink,
    Bars,
    NavMenu,
    NavBtn,
    NavBtnLink,
    NavLogo,
    SearchBar,
    NavIcon
} from './NavBarElements';


const NavBar = () => {
  return (
    <>
        <Nav>
            <NavLogo to='/'>
                <h1>Home</h1>
            </NavLogo>
           
            <Bars/>
            <NavMenu>
                <NavLink to="/account" >
                    Account
                </NavLink>
                <NavLink to="/friends" activeStyle>
                    Friends
                </NavLink>
                <NavLink to="/notifications" activeStyle>
                    Notifications
                </NavLink>
            </NavMenu>
            <SearchBar></SearchBar>
            <NavBtn>
                <NavBtnLink to='/signin'>Sign In</NavBtnLink>
            </NavBtn>
           
        </Nav>
    </>
  )
}

export default NavBar;