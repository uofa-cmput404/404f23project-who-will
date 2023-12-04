import './App.css';
import React from 'react';
import NavBar from './Components/NavBar/index';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Account from './pages/Account';
import Friends from './pages/Friends';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Notifications from './pages/Notifications';
import Standalone from './Components/StandalonePost';
import Logout from './pages/Logout';
import { ToastContainer } from 'react-toastify';

// require('dotenv').config()
function App() {

  // if username is also associated, we can route pathes to /friends/id ect
  const authToken = localStorage.getItem('authToken');
  if (authToken) {
    return (
      <Router>
      <NavBar/>
      <Routes>
        <Route path='/' exact Component={Home} />
        <Route path='/account' Component={Account}/>
        <Route path='/signout' Component={Logout}/>
        <Route path='/friends' Component={Friends}/>
        <Route path='/signup' Component={SignUp}/>
        <Route path='/notifications' Component={Notifications}/>
        <Route path='/post' Component={Standalone}/>

      </Routes>
      <ToastContainer autoClose={3000} />
    </Router>

    );
  }
  

// the if not here is causing some good, but weird behaviour...
if (!authToken) {
  return (
    <Router>
      <Routes>
        <Route path='/' exact Component={Login} />
        <Route path='/account' Component={Login}/>
        <Route path='/signin' Component={Login}/>
        <Route path='/friends' Component={Login}/>
        <Route path='/signup' Component={SignUp}/>
        <Route path='/notifications' Component={Login}/>

      </Routes>
    </Router>
  );
}
}

export default App;
