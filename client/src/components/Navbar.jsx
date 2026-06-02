import { Button } from "@/components/ui/button"
import { useNavigate, Link } from "react-router-dom"

function Navbar(){
  const navigate = useNavigate()

  function handleLogout(){
    localStorage.removeItem('token')
    navigate("/login")
  }
  return(
    <nav>
      <Link to="/">Home</Link>
      <Link to="/cart">Cart</Link>
      <Link to="/orders">Orders</Link>
      <Link to="/login">Sign In</Link>
      <Link to="/register">Sign Up</Link>
      <Button onClick={handleLogout}>Logout</Button>
    </nav>
  )
}

export default Navbar