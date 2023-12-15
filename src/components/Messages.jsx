import { useEffect, useRef } from 'react';
import { useState } from 'react';
import Message from './Message';
import Friend from './Friend';
import SearchedUser from './searchedUser';
import { auth, db} from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp, where, getDocs, or, doc, getDoc,setDoc, updateDoc, arrayUnion, runTransaction} from 'firebase/firestore';

import { Box, Button, Container, Flex, FormControl, IconButton, Input, InputGroup, Image, Center, Text, Icon, transition,   Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    PopoverAnchor,
    Textarea,
    filter,} from '@chakra-ui/react';
import {Search2Icon} from '@chakra-ui/icons'
import { color } from 'framer-motion';
import { NONE } from 'phaser';
import { auto } from '@popperjs/core';
import InfoBar from './InfoBar';



const Messages = () => {

    const [room, setRoom] = useState("1");

    const {logOut, currentUser} = useAuth();

    const [newMessage, setNewMessage] = useState("");
    const [messages, setMessages] = useState([]);

    const [search, setSearch] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const messagesRef = collection(db, "messages");
    const messageContainerRef = useRef(null);

    const userRef = collection(db, 'users');
    
    const [friendIds, setFriendIds] = useState([]);
    const [friends, setFriends] = useState([]);
    const friendsRef = collection(db, 'friends');
    const friendListRef = useRef(null);

    const [friendTarget, setFriendTarget] = useState([]);

    const [searchValue, setSearchValue] = useState('');

    const [status, setStatus] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    const [online, setOnline] = useState(false);

    const [roomFriendsObjects, setRoomFriendsObjects] = useState([]);



    
    const fetchData = async () => {
        console.log('fetchData!')
        console.log(search)
        if (search.length >= 4) {
            console.log('Search')
            const lowercasedSearch = search.toLowerCase();
            const prefixQuery = query(userRef, where("prefixes", "array-contains", lowercasedSearch));
            const querySnapshot = await getDocs(prefixQuery);
            const users = [];
            querySnapshot.forEach((doc) => {
                users.push(doc.data());
            });
            console.log(users)
    
            setSearchResults(users);
        } else {
            setSearchResults([]);
        }
    };

    const addFriend = async (targetUid) => {
        console.log("AddFriend function triggered");
    
        const updateFriendsList = async (userUid, friendUid) => {
            // Query for the user's friends document
            const userFriendsQuery = query(friendsRef, where("user", "==", userUid));
            const userFriendsSnap = await getDocs(userFriendsQuery);

            // check if the document is already on the user's friends list and filter it out if it is
            
            if (userFriendsSnap.empty) {
                // If document doesn't exist, create a new one with the friend UID
                await addDoc(friendsRef, {
                    user: userUid,
                    friends: [friendUid]
                });
            } else {
                // If document exists, update the friends array
                const userFriendsDoc = userFriendsSnap.docs[0]; // Assuming there's only one document per user
                await updateDoc(userFriendsDoc.ref, {
                    friends: arrayUnion(friendUid)
                });
            }
        };
    
        try {
            // Update the current user's and the target user's friends list
            await updateFriendsList(currentUser.uid, targetUid);
            await updateFriendsList(targetUid, currentUser.uid);
    
            console.log("Friends updated successfully");
        } catch (e) {
            console.error("Error updating friends: ", e);
        }
    };
    


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
        console.log(currentUser.uid)
        const userFriendsQuery = query(friendsRef, where("user", "==", currentUser.uid));
        const unsubscribe = onSnapshot(userFriendsQuery, (snapshot) => {
            let userFriendIds = snapshot.docs.flatMap(doc => doc.data().friends); // Assuming there's always one friend
            setFriendIds(userFriendIds);
            console.log(userFriendIds)
        });
    
        return () => unsubscribe(); // Cleanup the listener
    }, [currentUser.uid]);

    //fetch friend data if friendIds changes
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


    useEffect(() => {
        //fetch user's current status when component mounts 
        const fetchStatus = async () => {

            const userDoc = await getDoc(doc(userRef, currentUser.uid));

            setStatus(userDoc.data().status || ''); // If status is undefined, set it to an empty string
        }

        fetchStatus();

    },[]);

    const handleStatusChange = (event) => {
        setStatus(event.target.value);
    };

    const handleStatusSubmit = async (event) => {
        if (event.type === 'keydown' && event.key !== 'Enter') {
            return;
        }
    
        console.log('Status Submit!')
        //update user status in db 
        await updateDoc(doc(userRef, currentUser.uid), { status: status });
        //exit edit mode
        setIsEditing(false);
    };



    const searchData = async () => {
        
        let searchResult = [];

        const searchQuery = query(userRef,
            or(where('displayName', '==', searchValue),
            where('email', '==', searchValue)))
            const searchSnap = await getDocs(searchQuery);
            searchResult.push(...searchSnap.docs.map(doc => doc.data()))
            

    }

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
            const currentUserRef = doc(db, 'users', auth.currentUser.uid);
            updateDoc(currentUserRef, {
                online: false
            });
            await logOut(auth);
            console.log(currentUser)
        } catch (err) {
            console.error(err);
        }
    }


    //fires when a friend component is clicked and allows for creation of, or switching to an existing chat room.
    // also sets the friendTarget state to the friend or friends' uids, which is used to display info about the chat room in sidebarRight.
    const handleChatRoom = (...ids) => {
        console.log(ids);
        const sortedIDs = ids.sort();

        const chatID = sortedIDs.join('')

        console.log(chatID)
        setRoom(chatID);
        console.log(room);

        let friendsInRoom = ids.filter((id) => id !== currentUser.uid);
        console.log(friendsInRoom)

        setFriendTarget(friendsInRoom);
        console.log(friends)

        let friendObjectsInRoom = friends.filter((friend) => friendsInRoom.includes(friend.uid));
        setRoomFriendsObjects(friendObjectsInRoom);
        console.log(roomFriendsObjects);
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
                        <Center  pb={5}>
                            <p>{currentUser.displayName}</p>

                        </Center>
                        <Center borderBottom='1px' borderColor={'gray.700'} textAlign={'center'}>
                        {isEditing ? (
                                <Textarea value={status} onChange={handleStatusChange} onKeyDown={handleStatusSubmit} onBlur={handleStatusSubmit} textAlign={'center'} bg={'none'} outline={'none'}  fontSize={'15px'} color={'gray.500'} borderWidth={0} resize={'none'} 
                                minH={'30px'} height={auto}/>
                            ) : (
                                <Box onMouseDown={() => setIsEditing(true)} w={'100%'} h={auto} minH={'30px'} fontSize={'15px'} color={'gray.500'}>{status}</Box>
                            )}
                        </Center>
                        
                        
                        
                        <Flex alignItems={'center'} justifyContent={'space-between'} color={'gray.500'} py={3} position={'relative'}>
                            

                            <Popover>

                                <Input type='text' bg={'gray.700'} border={'none'} pr={10} onChange={(e) => {setSearch(e.target.value)}}></Input>
                                
                                <PopoverTrigger>
                                    <Icon as={Search2Icon} _hover={{color:'gray.400', transition:'0.3s ease-in'}} transition={'0.2s ease-in'} position={'absolute'} right={'4'} zIndex={'5'} onClick={() => {fetchData(search)}}/>
                                </PopoverTrigger>
                                <PopoverContent bg={'gray.700'} borderColor={'gray.800'}>
                                    <PopoverArrow bg={'gray.700'} borderColor={'gray.800'}></PopoverArrow>
                                    <PopoverCloseButton></PopoverCloseButton>
                                    <PopoverHeader borderColor={'gray.800'}>Results</PopoverHeader>
                                    <PopoverBody bgColor={'gray.700'}>
                                        {console.log(searchResults)}
                                        {searchResults.map((result) => <SearchedUser user={result.displayName} addFriend={addFriend} uid={result.uid} friendIds={friendIds}/>)}
                                    </PopoverBody>

                                </PopoverContent>
                            </Popover>

                        
                        
                        
                        </Flex>
                        <Flex alignItems={'center'}>
                            <Text my={5} fontWeight={'bold'}>Friends</Text> 
                            
                            <Box borderRadius={'50%'} bg={'gray.700'} display={'flex'} alignItems={'center'} w={'25px'} h={'25px'} fontWeight={'bold'} justifyContent={'center'} ml={'15px'}>0</Box>
                        </Flex>
                        

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
                        {messages.map((message) => <Message h='100%' text={message.text} sender={message.user.uid} currentUser={currentUser.uid}/>)}
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
                                focusBorderColor='gray.800'
                                _hover={{
                                    borderColor: 'gray.800',
                                }}
                                _focus={{
                                    boxShadow: 'none',
                                }}
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
                <Box flexGrow={1} className="sidebarRight">
                    <InfoBar friendTarget={friendTarget} roomFriends={roomFriendsObjects} currentUser={currentUser.uid} room={room} profilePhoto={friendTarget.map(id => friends.find(friend => friend.uid === id)?.photoURL)}/>
                </Box>
            </Flex>
        </Flex>
     );
}
 
export default Messages;