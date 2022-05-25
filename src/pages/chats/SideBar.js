import "./SideBar.css";
import { useEffect, useState } from "react";
import Avatar from "./icons/Avatar";
import NewChat from "./NewChat";
import ChatListUpdate from "./ChatListUpdate";
import * as signalR from "@microsoft/signalr";

function handleErrors(response) {
    if (!response.ok) {
        throw Error(response.status);
    }
    return response;
}

function ErrorGetContacts(){
    return(
      <div className="alert" role="alert">There is a problem with your server or with your request, the credible information about the chats could not be displayed.</div>
    );
}

/*

async function startSignalR({con, currentUser}) {
    // using signalR for recieving new message.
    await con.start();
    con.invoke("CreateConID", currentUser).catch(function (err) {
        return console.error(err.toString());})
}*/

function SideBar({user, createScreen}) {
    const [errorGetContacts, setErrorGetContacts] = useState("")
    const [chatList, setChatList] = useState([])
    function getContacts() {
        fetch('http://localhost:5034/api/contacts/?user='+ user.username)
        .then(handleErrors)
        .then(response => response.json())
        .then(data => setChatList(data))
        .then(response => setErrorGetContacts(""))
        .catch(
            function(error){
                if(error.message === '400' || error.message === '404'){
                    setErrorGetContacts("ERROR");
                }
            }
        );
    }
    getContacts();

    // using signalR for recieving new message.
    //var connection = new signalR.HubConnectionBuilder().withUrl("http://localhost:5034/chatHub").build();

    /*
    useEffect( () => {
        async function startSignalR(){
                    // using signalR for recieving new message.
                    await connection.start();
                    connection.invoke("CreateConID", user.username).catch(function (err) {
                        return console.error(err.toString());})

        }
        startSignalR();
    }, []);*/
    var connection;

    // update the chats list with the new contact
    const addChat = function(newContact) {
        fetch('http://localhost:5034/api/contacts/?user=' + user.username,{
            method: 'POST',
            headers:{
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({id:newContact.id, name:newContact.nickname, server:newContact.server})
        })
        .then(handleErrors)
        .then(function(){
            fetch('http://'+ newContact.server +'/api/invitations/',{
                method: 'POST',
                headers:{
                'Content-Type': 'application/json'
                },
                body: JSON.stringify({from: user.username, to: newContact.id ,server: user.server})
            })
            .then(handleErrors)
            .catch(
                function(error){
                    if(error.message === '404'){
                        newContact.setConExitEr("error");
                    }else if(error.message === 'Failed to fetch'){
                        newContact.setConEr("eror");
                    }
                    fetch('http://localhost:5034/api/contacts/'+ newContact.id +'/?user='+ user.username,{method: 'DELETE'});
                }
            );
        })
        .catch(
            function(error){
                newContact.setConExitEr("");
                newContact.setConEr("");
                newContact.setSerEr("eror");
            }
        );
    }


    return (
        <div className="sidebar">
            <div className="sidebar_header">
                {(user.image!==null)?<img id="userimag" src={user.image} />:<Avatar/>}
                <div className="sidebar_headerR">
                    <NewChat addChat={addChat} user={user} chatList={chatList}/>
                </div>
            </div>
            <div className="sidebar_chats">
                {(errorGetContacts!="")?(<ErrorGetContacts/>):""}
                <ChatListUpdate usernameinlogin={user.username} chats={chatList} createScreen={createScreen} connection={connection}/>
            </div>

        </div>
    );
}


export default SideBar;