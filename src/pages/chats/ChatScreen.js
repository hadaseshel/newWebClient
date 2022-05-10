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
        <div className={`chat_message ${(own!="me")?"chat_reciever":""}`}>
            <MessageByType type={type} message={message}/>
            <span className="chat_message_timedate">{time}</span>
        </div>
    )
}

//create list of message
function MessagesList ({messages}) {
    // sync the chat list in the sidebar with the user's friends.
    const messageList = messages.map((message, key) => {
        return <Message type={message.type} message={message.message} own={message.own} time={message.time} key={key} />;
    });
    return (
        <div className="messageList">
            {messageList}
        </div>
    );
}

function ChatScreen({usernameinlogin, username, nickname, image, messageList,createScreen, updateLastM}){
    const massege=useRef();

    // need to take care on the rander
    const send = function({msgType, msg}){
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

        //need to take care of push to the list by the proper chat contact
        for(let i=0; i<Users[usernameinlogin].friends.length;i++){
            if (Users[usernameinlogin].friends[i].username===username){
                Users[usernameinlogin].friends[i].chat.push({type:msgType, message:msg, own:"me", time:time, date:date});
                newArray=[...Users[usernameinlogin].friends[i].chat];
                break;
            }
        }

    
        // add the chat in the list of the friends
        for(let i=0; i<Users[username].friends.length;i++){
            if (Users[username].friends[i].username===usernameinlogin){
                Users[username].friends[i].chat.push({type:msgType, message:msg, own: "not me", time:time, date:date});
                break;
            }
        }

        const newChatScreen = <ChatScreen usernameinlogin={usernameinlogin} username={username} nickname={nickname} image={image}
                                            messageList={newArray} createScreen={createScreen} updateLastM={updateLastM}/>;
        createScreen(newChatScreen);

        // update the chat with the new last message in order to show last message in the sidebarChat
        updateLastM(newArray);
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