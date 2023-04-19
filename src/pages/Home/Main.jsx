import './Main.scss'
import { NavLink } from 'react-router-dom'

function Main() {
  return (
    <div className="Home">
      <NavLink to="/login">Login</NavLink>
      <NavLink to="/signup">Sign up</NavLink>
    </div>
  )
}

export default Main
