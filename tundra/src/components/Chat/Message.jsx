import React from "react"
import { useSelector } from "react-redux";

const getSender = (senderId, senders) => {

  let sender = {}
  senders.forEach((user) => {
    if(user.id == senderId){
      sender = user
    }
  })

  if(sender.email == undefined){
    sender.fullName = "L"
    sender.email = 'User left'
  }

  return sender
}

const Message = ({sender, message, creationDate}) => {

  const senders = useSelector(state => state.project.executors)
  const userId = useSelector(state => state.user.id)
  const senderInfo = getSender(sender, senders)

  const myMessage = sender == userId;

  const messageStyle = myMessage ? "message myMessage" : "message";
  return (
    <div className={messageStyle}>
      {!myMessage && <div className="messageSender">
        <div className="senderImg">
          <p>{senderInfo.fullName[0]}</p>
        </div>
        <p className="senderEmail">{senderInfo.email}</p>
      </div>}
      <div className="messageText">
        {message}
      </div>
    </div>
  )
};

export default Message;
