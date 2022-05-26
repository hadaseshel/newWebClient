import "./SideBar.css";
import { useEffect, useState } from "react";
import Avatar from "./icons/Avatar";
import NewChat from "./NewChat";
import ChatListUpdate from "./ChatListUpdate";
import * as signalR from "@microsoft/signalr";
import Users from "../../Users";

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


async function startSignalR({con, currentUser}) {
    // using signalR for recieving new message.
    await con.start();
    con.invoke("CreateConID", currentUser).catch(function (err) {
        return console.error(err.toString());})
}

function SideBar({user, createScreen}) {
    const [errorGetContacts, setErrorGetContacts] = useState("")
    const [chatList, setChatList] = useState([])
    Users[user.username]={};
    var connection;
    //var connection = new signalR.HubConnectionBuilder().withUrl("http://localhost:5034/chatHub").build();
    //startSignalR({con: connection, currentUser: user.username})

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
    //new
    if(chatList.length == 0){
        getContacts(); 
    }
    //getContacts();


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
            // new her
            .then(function(){
                fetch('http://localhost:5034/api/contacts/'+ newContact.id +'/?user='+ user.username)
                .then(handleErrors)
                .then(response => response.json())
                .then(data=>{
                    var newchatlist = [...chatList]
                    newchatlist.push(data);
                    setChatList(newchatlist);
                    // send signalR to the reciever
                    /*connection.invoke("SendMessage", newContact.id, JSON.stringify({from: user.username, to: newContact.id ,server: user.server})
                    ).catch(function (err) {
                        return console.error(err.toString());})*/
                })
                .then(response => setErrorGetContacts(""))
                .catch(
                    function(error){
                        if(error.message === '400' || error.message === '404'){
                            setErrorGetContacts("ERROR");
                        }
                    }
                );
            })
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

    // creat connection on
    /*connection.on("ReceiveMessage", async function (message) {
        //console.log(message);
        var dataMsg = JSON.parse(message);
        var sender = dataMsg["from"];
        const response = fetch('http://' + user.server +'/api/contacts/'+ sender +'/?user='+ user.username);
        const data =  await response.json();
        var newChatList = [...chatList];
        newChatList.push(data);
        setChatList(newChatList);
        //getContacts();
    })*/

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