import {useState, useRef} from 'react'

import { auth, db } from "../config/firebase"
import { addDoc, collection, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Center, Box, FormControl, FormLabel, FormErrorMessage, FormHelperText, Input, Button, Container, Flex, Heading} from '@chakra-ui/react'
// import '../App.css'


const Auth = () => {
    const [userEmail, setUserEmail] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDisplayName] = useState("");
    const {signUp, currentUser, logOut, signIn, googleSignIn} = useAuth();
    const navigate = useNavigate();
    const userRef = collection(db, 'users')

    const [creatingAccount, setCreatingAccount] = useState(false);
    const toggleSignUp = () => setCreatingAccount(!creatingAccount);

    const [error, setError] = useState("");

    const newSignIn = async () => {
        console.log(currentUser)

        const usernameRef = doc(db, 'usernames', displayName);
        const usernameSnap = await getDoc(usernameRef);
        const emailQuery = query(userRef, where('email', '==', userEmail))
        const emailQuerySnapshot = await getDocs(emailQuery);

        if(usernameSnap.exists()){
            console.log('Display name not available')
            setError('username taken!')
            return;
        }
        
        if(!emailQuerySnapshot.empty){
            console.log('Email already in use');
            setError('email already in use!')
            return;
        }
        
        //I DONT LIKE THIS DEBOUNCE AT IN PUT LEVEL INSTEAD LATER WHEN I HAVE TIME. K.

        try {



            const newUser = await signUp(auth, userEmail, password);
            console.log(newUser);
            console.log(newUser.user.uid)
            await addDoc(userRef,
                {
                    displayName: displayName,
                    email: newUser.user.email,
                    uid: newUser.user.uid,
                })

            await setDoc(doc(db, 'usernames', displayName), {
                userId: newUser.user.uid
            })
            navigate('/')
        } catch (err) {
            setError('error creating account')
            console.error(err);
        }
    }
    const logIn = async () => {
        try{
            await signIn(auth, userEmail, password);
            navigate('/')
            console.log()
        } catch (err) {
            console.error(err);
        }
    }
    const logInGoogle = async () => {
        try{
            await googleSignIn(auth, db)
            navigate('/')
            console.log()
        } catch (err) {
            console.error(err);
        }
    }
    const handleLogOut = async () => {
        try{
            await logOut(auth);
            console.log(currentUser)
        } catch (err) {
            console.error(err);
        }
    }

     
    return ( 
        <Center bg={'gray.100'} h='100vh' w='100vw' alignItems={'Center'}>
            <Flex direction={'column'} gap={5} p={5} bg={'blue.100'} h='50vh'w={450} className='loginForm' rounded='lg' boxShadow='lg'>
   

                {creatingAccount ? (

                <>
                    <Heading as='h2' size='md' textAlign={'center'}>Create Account</Heading>

                    <Flex direction={'column'} justify={'center'} h='70%' mb={3} gap={10}  border='2px' borderColor='white' p='6' rounded='lg'display='flex' className="inputs"> 
                        
                        <Input 
                        border={'none'}
                        bg={'blue.200'}
                        placeholder="display name" 
                        onChange={(e) => setDisplayName(e.target.value)}
                        />

                        <Input 
                        border={'none'}
                        bg={'blue.200'}
                        placeholder="email" 
                        onChange={(e) => setUserEmail(e.target.value)}
                        />
                        
                        <Input 
                        border={'none'}
                        bg={'blue.200'}
                        placeholder="password" 
                        type='password'
                        onChange={(e) => setPassword(e.target.value)}
                        />
                    </Flex>
                    <Flex direction={'column'} gap={5} h='30%' className="buttons" justifyContent={'space-evenly'} alignItems={'center'} py={5}>

                        <Button py={3} w={'70%'} onClick={newSignIn}> Confirm </Button>

                        <Button py={3} w={'70%'} onClick={logInGoogle}> Sign In With Google </Button>

                        <Button py={3} w={'70%'} onClick={toggleSignUp}> Return to Login </Button>
                    </Flex>
                </>



                ) : (

                    <>
                    <Heading as='h2' size='md' textAlign={'center'}>Sign In</Heading>

                    <Flex direction={'column'} justify={'center'} h='70%' mb={3} gap={10}  border='2px' borderColor='white' p='6' rounded='lg'display='flex' className="inputs"> 

                        <Input 
                        border={'none'}
                        bg={'blue.200'}
                        placeholder="email" 
                        onChange={(e) => setUserEmail(e.target.value)}
                        />
                        
                        <Input 
                        border={'none'}
                        bg={'blue.200'}
                        placeholder="password" 
                        type='password'
                        onChange={(e) => setPassword(e.target.value)}
                        />
                    </Flex>
                    <Flex direction={'column'} gap={5} h='30%' className="buttons" justifyContent={'space-evenly'} alignItems={'center'} py={5}>

                        <Button py={3} w={'70%'} onClick={logIn}> Sign In </Button>

                        <Button py={3} w={'70%'} onClick={logInGoogle}> Sign In With Google </Button>

                        <Button py={3} w={'70%'} onClick={toggleSignUp}> Create Account </Button>

                    </Flex>
                </>
                

                )}



                {error && <div style={{color:'red', textAlign:'center'}}>{error}</div>}
            </Flex>
        </Center>
     );
}
 
export default Auth;