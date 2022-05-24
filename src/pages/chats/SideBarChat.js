import React, { useEffect, useState } from "react";
import "./SideBarChat.css";
import Avatar from "./icons/Avatar";
import ChatScreen from "./ChatScreen";
import * as signalR from "@microsoft/signalr";

function SideBarChat({usernameinlogin, username, nickname, image, server, createScreen}) {

    // render this sidebar chat when a new message is added to the chat (of "me"), in order to update the "last message
    const [messageList, setMessageList] = useState([])
    useEffect(() => {
        async function fetchData() {
            var path = 'http://localhost:5034/api/contacts/'+ username + '/messages/?user=' + usernameinlogin;
            const response = await fetch(path);
            const data =  await response.json();
            setMessageList(data);
        }
        fetchData();
      }, []); // Or [] if effect doesn't need props or stat


    // function that insert the chat screen when we click on a sidebar chat to the function "setChatScreen" in chats.js
    const clickOnChat = function() {
        const newChatScreen = <ChatScreen usernameinlogin={usernameinlogin} username={username} nickname={nickname}
                                            image={image} messageList={messageList} server={server} createScreen={createScreen} updateLastM={setMessageList}/>;
        createScreen(newChatScreen);
    }
    const lastMsg = messageList[messageList.length - 1]

    const infoText=function(type, message){
        if(type=="Text"){
            var info = message.substr(0,12);
            if(message.length>12){
                info = info + "...";
            }
            return(info);
        }else{
            var info = " " + type;
            return(info);
        }
    }

    return (
        <div className="sidebar_chat" onClick={clickOnChat}>
            <div className="sidechat_info">
                <div className="friendImage">
                    {(image!==null)?<img id="userimag" src={image} />:<Avatar/>}
                </div>
                <div className="info">
                    <div className="nickname" id="nickname">{nickname}</div>
                    {(messageList.length===0)?"":
                    <div className="last_message" id="last_message">{(lastMsg.sent == true)?"me":(nickname)}:{infoText(lastMsg.type,lastMsg.content)}
                        <span className="last_message_timedate">{lastMsg.created}</span>
                    </div>}
                </div>
            </div>
        </div>
        
    );
}

export default SideBarChat;