import { Button } from "@/components/ui/button"
import { useNavigate, Link } from "react-router-dom"

function Navbar(){
  const token = localStorage.getItem('token')
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
      {token ? (
        <Button onClick={handleLogout}>Logout</Button>
      ) : (
        <div>
          <Link to="/login">Sign In</Link>
          <Link to="/register">Sign Up</Link>
        </div>
      )}
    </nav>
  )
}

export default Navbar