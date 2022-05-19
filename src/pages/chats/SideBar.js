import "./SideBar.css";
import { useEffect, useState } from "react";
import Avatar from "./icons/Avatar";
import NewChat from "./NewChat";
import ChatListUpdate from "./ChatListUpdate";
import Users from "../../Users";

function SideBar({user, createScreen}) {
    const [chats, setCaths] = useState([])
    useEffect(() => {
        async function fetchData() {
            const response = await fetch('http://localhost:5034/api/contacts/');
            const data =  await response.json();
            setCaths(data);
        }
        fetchData();
      }, []); // Or [] if effect doesn't need props or state
    console.log(chats);

    // load the page with the new chat list after adding a new chat.
    const [chatList, setChatList] = useState(chats);

    // update the chats list with the new contact
    const addChat = function(newContact) {
        // change the state of the chatList
        let newArray=[...chatList];
        newArray.push(newContact);
        setChatList(newArray);
        // add to the list of chat in the users Array
        Users[user.username].friends.push(newContact);
        // add mySelf to the other list of friends
        Users[newContact.username].friends.push({username:user.username, nickname: user.nickname, image: user.image, chat: []});
    }

    return (
        <div className="sidebar">
            <div className="sidebar_header">
                {(user.image!==null)?<img id="userimag" src={user.image} />:<Avatar/>}
                <div className="sidebar_headerR">
                    <NewChat addChat={addChat} user={user}/>
                </div>
            </div>
            <div className="sidebar_chats">
                <ChatListUpdate usernameinlogin={user.id} chats={chatList} createScreen={createScreen}/>
            </div>

        </div>
    );
}


export default SideBar;