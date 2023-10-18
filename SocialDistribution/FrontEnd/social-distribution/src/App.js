import './App.css';
import React from 'react';
import NavBar from './Components/NavBar/index';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Account from './pages/Account';
import Login from './pages/Login';
function App() {
  return (
    <Router>

      <NavBar/>
      <Routes>
        <Route path='/' exact Component={Home} />
        <Route path='/account' Component={Account}/>
        <Route path='/signin' Component={Login}/>
      </Routes>
    </Router>
  );
}

export default App;
