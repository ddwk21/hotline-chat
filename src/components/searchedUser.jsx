import { Box, Text } from "@chakra-ui/react";

const SearchedUser = (props) => {
    const isFriend = props.friendIds.includes(props.uid);

    return (
        <Box bg={isFriend ? 'green.800' : 'gray.800'} rounded={'lg'} h={'40px'} display={'flex'} alignItems={'center'} justifyContent={'center'} fontSize={'17px'} fontWeight={'bold'} onClick={() => {!isFriend && props.addFriend(props.uid)}}>
            {props.user}
            {isFriend && <Text ml={2} fontSize={12} fontWeight={'light'} color="gray.300">Already added</Text>}
        </Box>
    );
}
 
export default SearchedUser;