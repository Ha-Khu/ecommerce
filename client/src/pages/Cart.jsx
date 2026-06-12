import { Button } from "@/components/ui/button"
import { useEffect } from "react"
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom"

function Cart(){
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(()=>{
    if(!token){
      navigate("/login")
      return
    }
    async function fetchCartItems(){
      try{
        const response = await axios.get("${import.meta.env.VITE_API_URL}/api/cart", {
          headers: {Authorization: `Bearer ${token}`}
        })
        setCartItems(response.data)
        setLoading(false)
      }catch(err){
        setError("Loading cart failed, please try again")
      }
    }
    fetchCartItems()
  }, [])

  function checkout(){
    if(cartItems.length < 1){
      setError("Nothing in a cart")
    } else {
      navigate("/checkout")
    }
  }

  async function editQuantity(id, quantity){
    try{
      if(quantity < 1){
        setError("Quantity must be at least 1")
        return
      }
      await axios.put(`${import.meta.env.VITE_API_URL}/api/cart/${id}`, {quantity}, {
        headers: {Authorization: `Bearer ${token}`}
      })
      const cartResponse = await axios.get("${import.meta.env.VITE_API_URL}/api/cart", {
        headers: {Authorization: `Bearer ${token}`}
      })
      setCartItems(cartResponse.data)
    }catch(err){
      setError("Update failed, please try again")
    }
  }

  async function removeItem(id){
    try{
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/cart/${id}`, {
        headers: {Authorization: `Bearer ${token}`}
      })
      setCartItems(cartItems.filter((item)=> item.id !== id))
    }catch(err){
      setError("Deleting Item failed, please try again")
    }
  }

  if(loading) return(
    <div className="flex min-h-[60vh] items-center justify-center">
      <p className="text-sm tracking-widest text-muted-foreground uppercase">Loading</p>
    </div>
  )

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return(
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="mb-8 font-serif text-4xl font-semibold tracking-tight">Shopping Cart</h1>

      {error && <p className="mb-6 text-sm text-destructive">{error}</p>}

      {cartItems.length === 0 ? (
        <div className="rounded-xl border border-border bg-card py-20 text-center">
          <p className="text-muted-foreground">Your cart is empty.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 text-sm font-medium text-accent hover:underline hover:cursor-pointer"
          >
            Continue shopping
          </button>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-3">
          {/* Items */}
          <div className="space-y-4 md:col-span-2">
            {cartItems.map((cartItem)=>(
              <div
                key={cartItem.id}
                className="flex items-center justify-between rounded-lg border border-border bg-card p-5"
              >
                <div>
                  <h3 className="font-serif text-lg font-medium">{cartItem.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">€{cartItem.price}</p>
                </div>

                <div className="flex items-center gap-4">
                  <input
                    type="number"
                    min="1"
                    value={cartItem.quantity}
                    onChange={(e) => editQuantity(cartItem.id, Number(e.target.value))}
                    className="w-16 rounded-md border border-input bg-background px-3 py-2 text-center text-sm outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
                  />
                  <button
                    onClick={()=> removeItem(cartItem.id)}
                    className="text-sm text-muted-foreground transition-colors hover:text-destructive hover:cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="h-fit rounded-xl border border-border bg-card p-6">
            <h2 className="font-serif text-xl font-medium">Summary</h2>
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="text-2xl font-light">€{total.toFixed(2)}</span>
            </div>
            <Button
              onClick={checkout}
              className="mt-6 w-full bg-primary text-primary-foreground hover:bg-accent hover:cursor-pointer"
            >
              Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Cart