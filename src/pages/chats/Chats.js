import React from 'react';
import "./Chats.css";
import SideBar from './SideBar';
import { useLocation } from 'react-router-dom';
import { useState } from "react";
import * as signalR from "@microsoft/signalr";

function ErrorChat(){
  return(
    // need to wirte here the right text
    <h1 className="errorChat">To get to the chats you need to login.</h1>
  );
}


// person is the object with the fields of the user (image, friends, nickname...).
function Chats({}) {
  // loaction
  const location= useLocation();

  // the chat screen that will appear right the sidebar
  const[chatScreen, setChatScreen] = useState(null);
  const createChatScreen = function(newScreen) {
    setChatScreen(newScreen);
  }


  if (location.state==null){
    return(<ErrorChat/>);
  }

  return(
    <div className="chats">
      <div className="chats_body">
        <SideBar user={location.state} createScreen={createChatScreen}/>
        {(chatScreen !== null)? chatScreen:null}
      </div>
    </div>
  );
}

export default Chats;