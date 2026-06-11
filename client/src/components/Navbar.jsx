import { useNavigate, Link, useLocation } from "react-router-dom"

function Navbar(){
  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  const location = useLocation()

  function handleLogout(){
    localStorage.removeItem('token')
    navigate("/login")
  }

  const linkClass = (path) =>
    `text-sm tracking-wide transition-colors duration-200 ${
      location.pathname === path
        ? "text-accent"
        : "text-muted-foreground hover:text-foreground"
    }`

  return(
    <nav className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/" className="font-serif text-2xl font-semibold tracking-tight">
          LUXE<span className="text-accent">.</span>
        </Link>

        <div className="flex items-center gap-8">
          <Link to="/" className={linkClass("/")}>Shop</Link>
          <Link to="/cart" className={linkClass("/cart")}>Cart</Link>
          <Link to="/orders" className={linkClass("/orders")}>Orders</Link>

          {token ? (
            <button
              onClick={handleLogout}
              className="rounded-md border border-border px-4 py-2 text-sm tracking-wide transition-colors duration-200 hover:bg-secondary hover:cursor-pointer"
            >
              Logout
            </button>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="text-sm tracking-wide text-muted-foreground transition-colors hover:text-foreground"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="rounded-md bg-primary px-4 py-2 text-sm tracking-wide text-primary-foreground transition-colors duration-200 hover:bg-accent"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar