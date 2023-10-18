import './App.css';
import React from 'react';
import NavBar from './Components/NavBar/index';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Account from './pages/Account';
import Friends from './pages/Friends';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
function App() {
  return (
    <Router>

      <NavBar/>
      <Routes>
        <Route path='/' exact Component={Home} />
        <Route path='/account' Component={Account}/>
        <Route path='/signin' Component={Login}/>
        <Route path='/friends' Component={Friends}/>
        <Route path='/signup' Component={SignUp}/>
      </Routes>
    </Router>
  );
}

export default App;
