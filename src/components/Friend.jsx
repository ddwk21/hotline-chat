import React from 'react';
import { Box, Flex, Image, Text } from '@chakra-ui/react';
import placeholderImg from '../assets/placeholderImg.png'
import { useAuth } from '../contexts/AuthContext';

const Friend = (props) => {
    const {currentUser} = useAuth();

    let photoURL = props.profilePhoto ? props.profilePhoto : placeholderImg;


    return ( 
        <Flex h={'80px'} bg={'gray.700'} rounded={'lg'} my={5} align={'center'} px={3} boxShadow={'md'} onClick={()=>props.chatHandle(props.id, currentUser.uid)}>
            <Image
                src={photoURL}
                referrerPolicy='no-referrer'
                h={'50px'}
                rounded={'lg'}
            />
            <Text textAlign={'center'} ml={'10%'}>
                {props.name}
            </Text>
        </Flex>
     );
}
 
export default Friend;