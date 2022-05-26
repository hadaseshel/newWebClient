import Avatar from "./icons/Avatar";
import "./ChatScreen.css";
import Send from "./icons/Send";
import {useEffect, useRef, useState } from "react";
import UploadImage from "./upload/UploadImage";
import UploadVideo from "./upload/UploadVideo";
import UploadAudio from "./upload/UploadAudio";
import * as signalR from "@microsoft/signalr";
import Users from "../../Users";

// alert if There was a problem with the contact's server
function ErrorContactsServerNotAilability(){
    return(
      <div className="alert" role="alert">There is a problem connecting to the contact's server, can not send the message.</div>
    );
}

// alert if There was a problem with the my server
function ErrorMyServerNotAilability(){
    return(
      <div className="alert" role="alert">There was a problem with your server, can not send the message.</div>
    );
}

// alert if There was a problem with the my server
function ErrorMyServerNotAilabilityByGet(){
    return(
      <div className="alert" role="alert">There was a problem with your server, the message has been sent,but the credible information about the chats could not be displayed.</div>
    );
}

// create the fit message to the proper type
const MessageByType = function({ type, message }){
    if(type === "Image"){
        return(
        <img id="sendimage" src={message}/>
        );
    }else if(type === "Video"){
        return(<video id="sendvideo" src={message} controls/>);
    }else if(type === "Audio"){
        return(<audio id="sendaudio" src={message} controls />);
    }else{
        return(<span>{message}</span>);
    }
}

// one message
function Message({type,message,own,time}){
    return(
        <div className={`chat_message ${(own!=true)?"chat_reciever":""}`}>
            <MessageByType type={type} message={message}/>
            <span className="chat_message_timedate">{time}</span>
        </div>
    )
}

//create list of message
function MessagesList ({messages}) {
    // sync the chat list in the sidebar with the user's friends.
    const messageList = messages.map((message, key) => {
        return <Message type={message.type} message={message.content} own={message.sent} time={message.created} key={key} />;
    });
    return (
        <div className="messageList">
            {messageList}
        </div>
    );
}

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



function ChatScreen({usernameinlogin, username, nickname, image, messageList, server, createScreen, updateLastM, connection}){
    const massege=useRef();
    const [errorConractServer,setErrorConractServer] = useState("")
    const [errortServer,setErrorServer] = useState("")
    const [errortServerGet,SetErrortServerGet]= useState("")

    // using signalR for recieving new message.
    var _connection = new signalR.HubConnectionBuilder().withUrl("http://localhost:5034/chatHub").build();
    startSignalR({con: _connection, currentUser: usernameinlogin})

    // in order to scroll down automaticly
    const messagesEndRef = useRef(null)

    const scrollToBottom = () => {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
    useEffect(scrollToBottom, [messageList]);

    // need to take care on the rander
    const send = async function({msgType, msg}){

        if(msgType === "Text" && msg===""){
            return;
        } else if((msgType === "Image" || msgType === "Video")&& msg==null){
            return;
        } else if(msgType === "Audio" && msg==""){
            return;
        } 

       var id;
        fetch('http://localhost:5034/api/contacts/'+ username + '/messages/?user=' + usernameinlogin,{
            method: 'POST',
            headers:{
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({content:msg})
        })
        .then(handleErrors)
        .then(response => response.json())
        .then(data => id=data.id)
        .then(function(){
            setErrorServer("");
            setErrorConractServer("");
            SetErrortServerGet("")
            fetch('http://'+ server +'/api/transfer/',{
            method: 'POST',
            headers:{
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({from: usernameinlogin, to: username ,content:msg})
            })
            .then(handleErrors)
            .then(async function(){
                // send signalR to the reciever
                _connection.invoke("SendMessage", username, JSON.stringify({from: usernameinlogin, to: username ,content:msg})
                ).catch(function (err) {
                    return console.error(err.toString());})
                var path = 'http://localhost:5034/api/contacts/'+ username + '/messages/'+ id +'/?user=' + usernameinlogin;
                const response = await fetch(path);
                const data =  await response.json();
                if(!response.ok){
                    SetErrortServerGet("error")
                }else{
                    messageList.push(data);
                    updateLastM(messageList);
                    const newChatScreen = <ChatScreen usernameinlogin={usernameinlogin} username={username} nickname={nickname} image={image}
                                                        messageList={messageList} server={server} createScreen={createScreen} updateLastM={updateLastM} connection={connection}/>;
                    createScreen(newChatScreen);
                    document.getElementById('messageid').value = '';  
                }
            })
            .catch(
                function(error){
                    fetch('http://localhost:5034/api/contacts/'+ username + '/messages/'+ id +'/?user=' + usernameinlogin,{method: 'DELETE'});
                    document.getElementById('messageid').value = '';
                    setErrorConractServer("error");
                }
            );
        })
        .catch(
            function(error){
                setErrorServer("error");
            }
        );
    }

    // handle the enter key , send message by press in enter key
    const handleKeypress = e => {
        //it triggers by pressing the enter key to send the massage
        if (e.key === "Enter") {
            send({msgType: "Text", msg: massege.current.value})
        }
    };

    return(
        <div className="chatScreen">
            <div className="chat_header">
            {(image!==null)?<img id="userimag" src={image} />:<Avatar/>}
                <div className="chat_headerinfo">{nickname}</div>
            </div>

            <div className="chat_body" id="chat_body">
                {(errorConractServer!="")?(<ErrorContactsServerNotAilability/>):""}
                {(errortServer!="")?(<ErrorMyServerNotAilability/>):""}
                {(errortServerGet!="")?(<ErrorMyServerNotAilabilityByGet/>):""}
                <MessagesList messages={messageList}/>
                {// get a message if another user send it to me. 
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
                            updateLastM(messageList);
                            const newChatScreen = <ChatScreen usernameinlogin={usernameinlogin} username={username} nickname={nickname} image={image}
                                           messageList={messageList} server = {server} createScreen={createScreen} updateLastM={updateLastM}/>;
                            createScreen(newChatScreen);
                        } else {
                            var path = 'http://localhost:5034/api/contacts/'+ sender + '/messages/?user=' + usernameinlogin;
                            const response = await fetch(path);
                            const data = await response.json();
                            Users[usernameinlogin][sender]("render");
                        }
                })}
                <div ref={messagesEndRef} />
            </div>

            <div className="chat_footer">
                <div className="chat_footer_from">
                    <UploadImage send={send}/>
                    <UploadVideo send={send}/>
                    <UploadAudio send={send}/>
                    <input type="text" id={"messageid"} onKeyPress={handleKeypress} ref={massege} placeholder="New message here.."></input>
                    <button type="botton" id="send_text" onClick={() => {send({msgType: "Text", msg: massege.current.value})}} 
                        className="btn btn-outline-secondary btn-sm"><Send />Send</button>
                </div>
            </div>
        </div>
    );
}

export default ChatScreen;