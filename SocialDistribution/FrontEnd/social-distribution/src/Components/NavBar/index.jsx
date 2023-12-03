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
  const authToken = localStorage.getItem('authToken');
  if(authToken) {
  return (
    <>
        <div className='compName'><h3>Who Will?</h3></div>
        <Nav>
            <NavLogo to='/'>
                <h1>Home</h1>
            </NavLogo>
           
            <Bars/>
            <NavMenu>
                <NavLink to="/account" >
                    Account
                </NavLink>
                <NavLink to="/friends">
                    Friends
                </NavLink>
                <NavLink to="/notifications" activeStyle>
                    Notifications
                </NavLink>
            </NavMenu>
            <SearchBar></SearchBar>
            <NavBtn>
                <NavBtnLink to='/signout'>Sign Out</NavBtnLink>
            </NavBtn>
           
        </Nav>
    </>
  )
}

if(!authToken) {
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
                    <NavLink to="/friends">
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

}

export default NavBar;