const Message = (props) => {
    return ( 
        <div className="message">
            {props.text}
            <div className="messageTail"></div>
        </div>
     );
}
 
export default Message;