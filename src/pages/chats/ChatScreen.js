import Avatar from "./icons/Avatar";
import "./ChatScreen.css";
import Send from "./icons/Send";
import { useRef, useState } from "react";
import UploadImage from "./upload/UploadImage";
import UploadVideo from "./upload/UploadVideo"
import UploadAudio from "./upload/UploadAudio"
import Users from '../../Users';

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

function ChatScreen({usernameinlogin, username, nickname, image, messageList,server, createScreen, updateLastM}){
    const massege=useRef();

    // need to take care on the rander
    const send = async function({msgType, msg}){
        if(msgType === "Text" && msg===""){
            return;
        } else if((msgType === "Image" || msgType === "Video")&& msg==null){
            return;
        } else if(msgType === "Audio" && msg==""){
            return;
        } 

        // new array to render
        let newArray;

        // take care om the time
        var today = new Date();
        var hours = today.getHours();
        if(hours==0||hours==1||hours==2||hours==3||hours==4||hours==5||hours==6||hours==7||hours==8||hours==9){
            hours = "0" + hours;
        }
        var minutes = today.getMinutes();
        if(minutes==0||minutes==1||minutes==2||minutes==3||minutes==4||minutes==5||minutes==6||minutes==7||minutes==8||minutes==9){
            minutes = "0" + minutes;
        }
        var time = hours + ":" + minutes;

        var month = today.getMonth()+1;
        var date = today.getDate() + "/" + month + "/" + today.getFullYear();

        var time_and_date = time + date;
        //need to take care of push to the list by the proper chat contact
        // need to take care of faild
        const res = await fetch('http://localhost:5034/api/contacts/'+ username + '/messages/',{
            method: 'POST',
            headers:{
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({userid:usernameinlogin, content:msg})
        });

        // transfer need to take care if this faild
        var path = 'http://'+ server +'/api/transfer/';
        const res2 = fetch(path,{
            method: 'POST',
            headers:{
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({from: usernameinlogin, to: username ,content:msg})
        });
        // update the chat with the new last message in order to show last message in the sidebarChat
        // get the proper list now in server
        var path = 'http://localhost:5034/api/contacts/'+ username + '/messages/?user=' + usernameinlogin;
        const response = await fetch(path);
        const data =  await response.json();
        updateLastM(data);
        const newChatScreen = <ChatScreen usernameinlogin={usernameinlogin} username={username} nickname={nickname} image={image}
                                            messageList={data} createScreen={createScreen} updateLastM={updateLastM}/>;
        createScreen(newChatScreen);
        document.getElementById('messageid').value = '';
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
                <MessagesList messages={messageList}/>
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