import React, { useEffect, useRef, useState } from "react"
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import {io} from 'socket.io-client'
import { getProjectMessages } from "../../http/projectApi";
import './chat.scss'
import Message from "./Message";

import grabIcon from '../../svgIcons/up-down-left-right-solid.svg'
import hideIcon from '../../svgIcons/grip-lines-solid.svg'
import sendIcon from '../../svgIcons/arrow-up-solid.svg'

import notify from '../../audio/message-tone-checked-off.ogg'
import notification from '../../audio/meet-message-sound-1.mp3'

import { HandySvg } from "handy-svg";

const Chat = ({connect, projectId, loading, setLoading}) => {

    const [connected, setConnected] = useState(false)
    const [messages, setMessages] = useState([])
    const [hidden, setHidden] = useState(true)
    const [position, setPosition] = useState([600, 50])
    const token = localStorage.getItem('token')
    const userId = useSelector(state => state.user.id)
    const chat = useRef()
    const messageInput = useRef()
    const chatMessages = useRef()
    const sideNotification = useRef()
    const myNotification = useRef()

    const [socket, setSocket] = useState(io(process.env.REACT_APP_SERVER_URL, {
      autoConnect: false
    }))

    const initWebSocket = () => {

      socket.auth = {
        token,
        projectId,
        userId
      }
      socket.connect()

      socket.on('connect', () => {
        console.log('connected');
        setConnected(true)
        socket.emit('chats', {})
      });
  
      socket.on('disconnect', () => {
        setConnected(false)
      });

      socket.on('projectUpdate', ({dontUpdateId}) => {
        if(dontUpdateId != userId){
          setLoading(true)
        }
      })
  
      socket.on('pong', () => {
        //setLastPong(new Date().toISOString());
      });

      socket.on('private_message', (message) => {
        if(message.senderId != userId){
          sideNotification.current.play()
        }
        else{
          myNotification.current.play()
        }
        setMessages(messages => [...messages, message])

      })

  
      return () => {
        socket.off('connect');
        socket.off('disconnect');
        socket.off('pong');
      };
    }

    useEffect(() => {

      if(connect){

        initWebSocket()

        getProjectMessages({projectId}).then(data => {
          setMessages(data)
        })

        return () => {
          socket.disconnect()
          console.log('disconnected');
        };

      }

    }, [])

    useEffect(() => {

      if(loading){
        socket.emit('projectUpdate')
      }

    }, [loading])

    const sendMessage = (e) => {
      e.preventDefault()

      const message = messageInput.current.value

      if(message.replaceAll(' ', '').length > 0){
        socket.emit('private_message', {message})
        messageInput.current.value = ""
      }
      else{
        messageInput.current.focus()
      }
    }

    const moveEvent = (e) => {
      let mousePos = { x: e.clientX, y: e.clientY };
      setPosition([mousePos.x - 17, mousePos.y-82 + window.pageYOffset])
    }

    const stopMoveChat = (e) => {
      window.removeEventListener('mousemove', moveEvent);
      window.removeEventListener('mouseup', stopMoveChat);
      document.body.style.userSelect = 'auto'
    } 

    const startMoveChat = (e) => {
      e.stopPropagation()
      document.body.style.userSelect = 'none'
      window.addEventListener('mousemove', moveEvent);

      window.addEventListener('mouseup', stopMoveChat)
    }

    const scrollToBottom = () => {
      try{
        setTimeout(() => {
          const height = chatMessages.current.scrollHeight
          chatMessages.current.scrollTo(0, height+100)
        }, 100)
      }
      catch(e){

      }
      return ""
    }

    return (
      <div className="chat" ref={chat} style={{left: position[0] + 'px', top: position[1] + 'px'}}>
        <div className="chatBody">
          <div className="chatHeader">
            <div className="chatConrolls">
              <HandySvg className="chatsIcons" style={{cursor: 'move'}} src={grabIcon} onMouseDown={startMoveChat}/>
              <HandySvg className="chatsIcons" style={{cursor: 'pointer'}} src={hideIcon} onClick={() => setHidden(!hidden)}/>
            </div>
            <p className="chatName">Project chat</p>
            </div>
          <div ref={chatMessages} className="chatMessages" hidden={hidden}>
            {messages.map(({senderId, id, text, createdAt}, index, arr) => {
              return <Message key={id} sender={senderId} message={text} creationDate={createdAt} />
            })}
            {scrollToBottom()}
          </div>
          <div className="chatInput" hidden={hidden}>
            <form className="formInput" onSubmit={sendMessage}>
              <input ref={messageInput} name="message" className="messageInput" placeholder="Put your message here..." autoComplete="off"></input>
              <button type="submit">
                <HandySvg className="sendButton" src={sendIcon} />
              </button>
            </form>
          </div>
        </div>
        <audio ref={sideNotification} hidden>
          <source src={notification} type="audio/mp3"/>
        </audio>
        <audio ref={myNotification} hidden>
          <source src={notify} type="audio/ogg"/>
        </audio>
      </div>
    )
};

export default Chat;
