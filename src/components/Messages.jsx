import React, { useEffect } from 'react';
import { useState } from 'react';
import Message from './Message';
import { auth, db} from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { addDoc, collection, onSnapshot, query, serverTimestamp, where} from 'firebase/firestore';



const Messages = () => {

    const room = 1;

    const {logOut, currentUser} = useAuth()

    const [newMessage, setNewMessage] = useState("")
    const messagesRef = collection(db, "messages")

    useEffect(() => {
        const messagesQuery = query(messagesRef, where("room", "==", room));
        onSnapshot(messagesQuery, (snapshot) => {
            let messages = []
            snapshot.forEach((doc) => {
                let message = doc.data()
                messages.push(message)
                
            })
            console.log(messages)
        })
    })

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
            })

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
                
                <div className="messageContainer">
                    <Message/>
                    <Message/>
                    <Message/>
                    <Message/>
                    <Message/>
                </div>
                
                <form onSubmit={handleSubmit} className="messageInput">
                    <input type="text"
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