import { Link } from "react-router-dom"

function Navbar(){
  return(
    <nav>
      <Link to="/">Home</Link>
      <Link to="/cart">Cart</Link>
      <Link to="/orders">Orders</Link>
      <Link to="/login">Sign In</Link>
      <Link to="/register">Sign Up</Link>
    </nav>
  )
}

export default Navbar