import { useState } from 'react'
import './Home.scss'
import { NavLink } from 'react-router-dom'

function Home() {
  return (
    <div className="Home">
      <NavLink to="/login">Login</NavLink>
      <NavLink to="/signup">Sign up</NavLink>
    </div>
  )
}

export default Home
