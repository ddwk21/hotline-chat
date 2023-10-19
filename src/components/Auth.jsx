import {useState} from 'react'

import { auth } from "../config/firebase"
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { Center, Box, FormControl, FormLabel, FormErrorMessage, FormHelperText, Input, Button, Container, Flex } from '@chakra-ui/react'
// import '../App.css'

const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {signUp, currentUser, logOut, signIn, googleSignIn} = useAuth();
    const navigate = useNavigate();

    const newSignIn = async () => {
        console.log(currentUser)
        try {
            await signUp(auth, email, password);
            navigate('/')
        } catch (err) {
            console.error(err);
        }
    }
    const logIn = async () => {
        try{
            await signIn(auth, email, password);
            navigate('/')
            console.log()
        } catch (err) {
            console.error(err);
        }
    }
    const logInGoogle = async () => {
        try{
            await googleSignIn(auth);
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
                <Flex direction={'column'} justify={'center'} h='70%' mb={3} gap={10}  border='2px' borderColor='white' p='6' rounded='lg'display='flex' className="inputs">    
                    <Input 
                    border={'none'}
                    bg={'blue.200'}
                    placeholder="email" 
                    onChange={(e) => setEmail(e.target.value)}
                    />
                    
                    <Input 
                    border={'none'}
                    bg={'blue.200'}
                    placeholder="password" 
                    type='password'
                    onChange={(e) => setPassword(e.target.value)}
                    />
                </Flex>
                <Flex direction={'column'} gap={5} h='30%' className="buttons" alignItems={'center'}>
                    <Button py={3} w={'70%'} onClick={newSignIn}> Sign In </Button>

                    <Button py={3} w={'70%'} onClick={logInGoogle}> Sign In With Google </Button>

                    <Button py={3} w={'70%'} onClick={handleLogOut}> Logout </Button>
                </Flex>
            </Flex>
        </Center>
     );
}
 
export default Auth;