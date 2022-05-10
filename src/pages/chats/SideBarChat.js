import React, { useState } from "react";
import "./SideBarChat.css";
import Avatar from "./icons/Avatar";
import ChatScreen from "./ChatScreen";

function SideBarChat({usernameinlogin, username, nickname, image, chat, createScreen}) {

    // render this sidebar chat when a new message is added to the chat (of "me"), in order to update the "last message"
    const [updChat, setUpdChat] = useState(chat);

    // function that insert the chat screen when we click on a sidebar chat to the function "setChatScreen" in chats.js
    const clickOnChat = function() {
        const newChatScreen = <ChatScreen usernameinlogin={usernameinlogin} username={username} nickname={nickname}
                                            image={image} messageList={updChat} createScreen={createScreen} updateLastM={setUpdChat}/>;
        createScreen(newChatScreen);
    }

    const lastMsg = updChat[updChat.length - 1]

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
                    {(chat.length===0)?"":
                    <div className="last_message" id="last_message">{(lastMsg.own == "me")?"me":(nickname)}:{infoText(lastMsg.type,lastMsg.message)}
                        <span className="last_message_timedate">{lastMsg.time + " " + lastMsg.date}</span>
                    </div>}
                </div>
            </div>
        </div>
        
    );
}

export default SideBarChat;