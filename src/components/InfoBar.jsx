import React from 'react';
import placeholderImg from '../assets/placeholderImg.png'
import { Box, Flex, Image, Text, Center } from '@chakra-ui/react';
import { auto } from '@popperjs/core';

const InfoBar = (props) => {

    let photoURLs = (props.profilePhoto && props.profilePhoto.length > 0) ? props.profilePhoto : [placeholderImg];

    // let status = props.roomFriends[0].status ? props.roomFriends[0].status : 'Hanging Out';

    if(props.friendTarget.length === 1){
        return (
            <Box w={'100%'} h={'100%'} color={'white'}>

                <Flex flexDir={'column'} alignItems={'center'} gap={10} py={20}>
                {photoURLs.map((url, index) => (
                    <Box boxSize="25%" aspectRatio={1}>
                        <Image
                            key={index}
                            src={url || placeholderImg}
                            referrerPolicy='no-referrer'
                            rounded={'lg'}
                            objectFit="cover"
                        />
                    </Box>
                ))}
                    {/* <p>{status}</p> */}
                </Flex>
            </Box>
        );
    }
};

export default InfoBar;
