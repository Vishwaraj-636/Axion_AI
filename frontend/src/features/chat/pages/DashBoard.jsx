import React from 'react'
import {useSelector} from "react-redux"

const DashBoard = () => {
  const {user} = useSelector(state=> state.auth)
  console.log(user)
  return (
    <div>
      <h1>Hello world</h1>
    </div>
  )
}

export default DashBoard
