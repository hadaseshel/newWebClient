import React, { useEffect, useState } from "react";
import "./SideBarChat.css";
import Avatar from "./icons/Avatar";
import ChatScreen from "./ChatScreen";
import * as signalR from "@microsoft/signalr";
import Users from "../../Users";

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.status);
    }
    return response;
}

async function startSignalR({con, currentUser}) {
    // using signalR for recieving new message.
    await con.start();
    con.invoke("CreateConID", currentUser).catch(function (err) {
        return console.error(err.toString());})
}

function SideBarChat({usernameinlogin, username, nickname, image, server, createScreen, connection}) {

    // render this sidebar chat when a new message is added to the chat (of "me"), in order to update the "last message
    const [messageList, setMessageList] = useState([])
    const [errorServer, setErrorServer] = useState("");
    const [renderThis, setRenderThis] = useState("");
    Users[usernameinlogin][username] = setRenderThis;
    var _connection = new signalR.HubConnectionBuilder().withUrl("http://localhost:5034/chatHub").build();
    startSignalR({con: _connection, currentUser: usernameinlogin})

    function getMessages() {
        fetch('http://localhost:5034/api/contacts/'+ username + '/messages/?user=' + usernameinlogin)
        .then(handleErrors)
        .then(response => response.json())
        .then(data => setMessageList(data))
        .catch(
            function(error){
                if(error.message === '400' || error.message === '404'){
                    setErrorServer("error");
                }
            }
        );
    }
    if(errorServer!=""){ // if there is error with the request that has been befor
        return(
        <div className="sidebar_chat">
            <div className="sidechat_info">
                <div className="friendImage">
                    {(image!==null)?<img id="userimag" src={image} />:<Avatar/>}
                </div>
                <div className="info">
                    <div className="nickname" id="nickname">{nickname}</div>
                    <div className="alert" role="alert">There is a problem with your server or with your request, the credible information about the chats could not be displayed.</div>
                    {(messageList.length===0)?"":
                    <div className="last_message" id="last_message">{(lastMsg.sent == true)?"me":(nickname)}:{infoText(lastMsg.type,lastMsg.content)}
                        <span className="last_message_timedate">{lastMsg.created}</span>
                    </div>}
                </div>
            </div>
        </div>
        );
    }
    // creat connection on
    _connection.on("ReceiveMessage", async function (message) {
        //console.log(message);
        var dataMsg = JSON.parse(message);
        var sender = dataMsg["from"];
        //console.log(sender);
        if (sender == username) {
            var lastMessageid = messageList[messageList.length-1].id;
            var path = 'http://localhost:5034/api/contacts/'+ username + '/messages/'+ (lastMessageid+1) +'/?user=' + usernameinlogin;
            const response = await fetch(path);
            const data =  await response.json();
            messageList.push(data);
            setMessageList(messageList);
            const newChatScreen = <ChatScreen usernameinlogin={usernameinlogin} username={username} nickname={nickname} image={image}
                        messageList={messageList} server = {server} createScreen={createScreen} updateLastM={setMessageList}/>;
            createScreen(newChatScreen);
            //document.getElementById('messageid').value = '';
        } else {
            var path = 'http://localhost:5034/api/contacts/'+ sender + '/messages/?user=' + usernameinlogin;
            const response = await fetch(path);
            const data = await response.json();
            Users[usernameinlogin][sender]("render");
            console.log("in conetiction on part");
            console.log(Users[usernameinlogin][sender]);
            //document.getElementById('messageid').value = '';
        }
    })
    if(messageList.length==0){
        getMessages();
    }
    if(renderThis!==""){
        getMessages();
        setRenderThis("");
    }
    //getMessages();


    // function that insert the chat screen when we click on a sidebar chat to the function "setChatScreen" in chats.js
    const clickOnChat = function() {
        const newChatScreen = <ChatScreen usernameinlogin={usernameinlogin} username={username} nickname={nickname}
                                            image={image} messageList={messageList} server={server} createScreen={createScreen} updateLastM={setMessageList} connection={connection}/>;
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