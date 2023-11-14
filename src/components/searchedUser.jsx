import { Box } from "@chakra-ui/react";

const SearchedUser = (props) => {

    return (
        <Box bg={'gray.800'} rounded={'lg'} h={'40px'} display={'flex'} alignItems={'center'} justifyContent={'center'} fontSize={'17px'} fontWeight={'bold'} onClick={() => {props.addFriend(props.uid)}}>

            {props.user}

        </Box>
      );
}
 
export default SearchedUser;