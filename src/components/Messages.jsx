import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import Message from './Message';
import { auth, db} from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where} from 'firebase/firestore';



const Messages = () => {

    const room = "1";

    const {logOut, currentUser} = useAuth()

    const [newMessage, setNewMessage] = useState("")
    const [messages, setMessages] = useState([])

    const messagesRef = collection(db, "messages")
    const messageContainerRef = useRef(null)

    useEffect(() => {
        const messagesQuery = query(messagesRef, where("room", "==", room), orderBy("createdAt"));
        onSnapshot(messagesQuery, (snapshot) => {
            let messages = []
            snapshot.forEach((doc) => {
                let message = doc.data();
                messages.push(message);
                
            })
            setMessages(messages);
            console.log(messages);

            if(messageContainerRef.current){
                const element = messageContainerRef.current;
                element.scrollTop = element.scrollHeight;
            }
        })
    },[])

    const handleSubmit = async (e) => {

        e.preventDefault();
        if (newMessage === "") return
        console.log(currentUser)


        await addDoc(messagesRef,
            {
                room: room,
                text: newMessage,
                user: {
                    uid: currentUser.uid
                },
                createdAt: serverTimestamp(),
            })
        setNewMessage('');

    };

    const handleLogOut = async () => {
        try{
            await logOut(auth);
            console.log(currentUser)
        } catch (err) {
            console.error(err);
        }
    }
    return ( 
        <div className='mainParent'>
            <div className="sidebar">
                <button onClick={handleLogOut}>Logout</button>
            </div>
            <div className="messages">
                
                <div className="messageContainer" ref={messageContainerRef}>
                    {messages.map((message) => <Message text={message.text}/>)}
                </div>
                
                <form onSubmit={handleSubmit} className="messageInput">
                    <input 
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}/>
                    <button type="submit"></button>
                </form>
                
            </div>
            <div className="sidebarRight">
            </div>
        </div>
     );
}
 
export default Messages;