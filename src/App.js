import React, { useState } from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';
import Chats from "./pages/chats/Chats";
import Regist from './pages/registration/Regist.js';
import Login from './pages/login/Login';
import Users from './Users';

function App() {
                  
  return (
    <>
      <Routes>
        <Route path="/" element={<Login users={Users}/>} />
        <Route path="/regist" element={<Regist users={Users} />} />
        <Route path="/chats" element={<Chats />} />
      </Routes>
    </>
  );
}

export default App;