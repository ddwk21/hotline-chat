import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import Message from './Message';
import Friend from './Friend';
import { auth, db} from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where, getDocs} from 'firebase/firestore';

import { Box, Button, Container, Flex, FormControl, IconButton, Input, InputGroup, Image, Center } from '@chakra-ui/react';



const Messages = () => {

    const [room, setRoom] = useState("1")

    const {logOut, currentUser} = useAuth()

    const [newMessage, setNewMessage] = useState("")
    const [messages, setMessages] = useState([])

    const messagesRef = collection(db, "messages")
    const messageContainerRef = useRef(null)

    const userRef = collection(db, 'users')
    
    const [friendIds, setFriendIds] = useState([])
    const [friends, setFriends] = useState([])
    const friendsRef = collection(db, 'friends')
    const friendListRef = useRef(null)

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
    },[room])

    useEffect(() => {
        // Fetch friendIds
        const userFriendsQuery = query(friendsRef, where("user", "==", currentUser.uid));
        const unsubscribe = onSnapshot(userFriendsQuery, (snapshot) => {
            let userFriendIds = snapshot.docs.map(doc => doc.data().friends[0]); // Assuming there's always one friend
            setFriendIds(userFriendIds);
            console.log(userFriendIds)
        });
    
        return () => unsubscribe(); // Cleanup the listener
    }, [currentUser.uid]);

    useEffect(() => {
        if(friendIds.length === 0) return;
    
        // Fetch user details for each friendId
        const fetchFriendsData = async () => {
            let userfiedFriends = [];
            for(let i = 0; i < friendIds.length; i++){
                const userfyFriendsQuery = query(userRef, where("uid", "==", friendIds[i]));
                const friendSnap = await getDocs(userfyFriendsQuery);
                userfiedFriends.push(...friendSnap.docs.map(doc => doc.data()));
            }
            setFriends(userfiedFriends);
            console.log(userfiedFriends)
        };
        console.log(friends)
        fetchFriendsData();
    }, [friendIds]);

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
        console.log(currentUser);

    };

    const handleLogOut = async () => {
        try{
            await logOut(auth);
            console.log(currentUser)
        } catch (err) {
            console.error(err);
        }
    }

    const handleChatRoom = (...ids) => {
        const sortedIDs = ids.sort();

        const chatID = sortedIDs.join('')

        console.log(chatID)
        setRoom(chatID);
        console.log(room)
    }
    
    
    
    return ( 
        <Flex w='100%' justify='center' overflow='hidden' bg='gray.700'>
            <Flex w='100%' className='mainParent'>
                <Flex direction='column' p='7' className="sidebar" w='25em' minWidth='15em' mr='3' h='100%' bg='gray.800'>
                    <Button bg={'gray.700'} color={'white'} _hover={{bg: 'gray.600'}} onClick={handleLogOut}>Logout</Button>
                    <Box color='white' py={5}>
                        <Center
                            my={5}
                        >
                            <Image
                            src={currentUser.photoURL}
                            referrerPolicy='no-referrer'
                            rounded={'3xl'}
                            >

                            </Image>
                        </Center>
                        <Center>
                            <p>{currentUser.displayName}</p>
                        </Center>

                        {friends.map((friend) => <Friend name={friend.displayName} profilePhoto={friend.photoURL} id={friend.uid} chatHandle={handleChatRoom}></Friend>)}
                        
                    </Box>

                    <Container
                    color={'white'}
                    >
                        
                    </Container>
                </Flex>
                <Box w='60em' className="messages">
                    
                    <Flex direction='column' alignItems='center' w='100%' h='70em' overflowY='scroll'   sx={{
                            '&::-webkit-scrollbar': {
                            width: '12px',
                            borderRadius: '6px',
                            backgroundColor: `rgba(0, 0, 0, 0.05)`,
                            },
                            '&::-webkit-scrollbar-thumb': {
                            backgroundColor: `rgba(0, 0, 0, 0.05)`,
                            borderRadius: '8px'
                            },
                        }} mt='10' className="messageContainer" ref={messageContainerRef}>
                        {messages.map((message) => <Message h='100%' text={message.text}/>)}
                    </Flex>
                    
                    <form onSubmit={handleSubmit}>
                        <InputGroup rounded='lg' mt={20} w='100%' h='70px'  className="messageInput">
                            <Input
                                color='gray.300'
                                borderColor='gray.800'
                                rounded='2xl'
                                px='20px'
                                pr='90px'
                                h='100%'
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}/>
                            <Button 
                            colorScheme='blue'
                            roundedRight='2xl'
                            roundedLeft='none'
                            type="submit" position='absolute' right='0' h='100%'
                            zIndex='10'
                            w='70px' fontSize='25px' fontWeight='thin'>&#62;</Button>
                        </InputGroup >
                    </form>
                    
                </Box>
                <Box w='15em' className="sidebarRight">
                </Box>
            </Flex>
        </Flex>
     );
}
 
export default Messages;