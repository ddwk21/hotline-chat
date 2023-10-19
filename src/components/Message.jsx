import { Box, Flex } from "@chakra-ui/react";

const Message = (props) => {
    return ( 
        <Box bgColor='blue.300' color='white' p={3} textAlign={"center"} display='block' className="message">
            <p>{props.text}</p>
            <div className="messageTail"></div>
        </Box>
     );
}
 
export default Message;