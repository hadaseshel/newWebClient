import React from "react";
import SideBarChat from "./SideBarChat.js";


export default function ChatListUpdate ( {usernameinlogin, chats, createScreen, connection} ) {
    // sync the chat list in the sidebar with the user's friends.
    const chatList = chats.map((friend, key) => {
        return <SideBarChat usernameinlogin={usernameinlogin} username={friend.id} nickname={friend.name} image={friend.image} server={friend.server} createScreen={createScreen} connection={connection} key={key}/>;
    });

    const getChatsList = function() {
        return chatList;
    }

    return (
        <div className="chatsList">
            {chatList}
        </div>
    );
}