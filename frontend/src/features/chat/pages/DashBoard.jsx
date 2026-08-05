import React from 'react'
import {useSelector} from "react-redux"
import { useChat } from '../hook/useChat'
import { useEffect } from 'react'

const DashBoard = () => {
  const {user} = useSelector(state=> state.auth)

  const chat = useChat();
  // console.log(user)

  useEffect(()=>{
    chat.initializeSocketConnection()
  },[])

  return (
    <div>
      <h1>Hello world</h1>
    </div>
  )
}

export default DashBoard
