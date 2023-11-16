import { Box, Flex } from "@chakra-ui/react";

const Message = (props) => {

    if(props.sender==props.currentUser)
        return ( 

            <Box bgColor='blue.300' color='white' p={3} textAlign={"center"} display='block' className="message">
                <p>{props.text}</p>
                <p>{props.sender}</p>
                <div className="messageTail"></div>
            </Box>
        );
    else{
        return(

            <Box bgColor='gray.300' color='black' p={3} textAlign={"center"} display='block' className="message">
            <p>{props.text}</p>
            <p>{props.sender}</p>
            <div className="messageTailTwo"></div>
            </Box>

        )
    }
}
 
export default Message;