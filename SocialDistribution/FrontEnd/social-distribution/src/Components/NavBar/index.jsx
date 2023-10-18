import React from 'react';
import {
    Nav,
    NavLink,
    Bars,
    NavMenu,
    NavBtn,
    NavBtnLink,
    NavLogo,
} from './NavBarElements';


const NavBar = () => {
  return (
    <>
        <Nav>
            <NavLogo to='/'>
                <h1>Logo</h1>
            </NavLogo>
            <Bars/>
            <NavMenu>
                <NavLink to="/account" >
                    Account
                </NavLink>
                <NavLink to="/friends" activeStyle>
                    Friends
                </NavLink>
            </NavMenu>
            <NavBtn>
                <NavBtnLink to='/signin'>Sign In</NavBtnLink>
            </NavBtn>
                        
        </Nav>
    </>
  )
}

export default NavBar;