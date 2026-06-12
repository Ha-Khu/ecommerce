import { Button } from "@/components/ui/button"
import { useEffect } from "react"
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom"

function Checkout(){
  const [cartItems, setCartItems] = useState([])
  const [paymentMethod, setPaymentMethod] = useState("karta")
  const [deliveryMethod, setDeliveryMethod] = useState("kurier")
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

  async function handleOrder(){
    try{
      await axios.post("${import.meta.env.VITE_API_URL}/api/orders", {total_price: total, payment_method: paymentMethod, delivery_method: deliveryMethod}, {
        headers: {Authorization: `Bearer ${token}`}
      })
      navigate('/orders')
    }catch(err){
      setError("Order failed")
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
      <h1 className="mb-8 font-serif text-4xl font-semibold tracking-tight">Checkout</h1>

      {error && <p className="mb-6 text-sm text-destructive">{error}</p>}

      <div className="grid gap-8 md:grid-cols-3">
        {/* Left: order details + options */}
        <div className="space-y-6 md:col-span-2">
          {/* Order items */}
          <div className="rounded-xl border border-border bg-card p-6">
            <h2 className="mb-4 font-serif text-xl font-medium">Order Summary</h2>
            <div className="space-y-3">
              {cartItems.map((cartItem)=>(
                <div key={cartItem.id} className="flex items-center justify-between text-sm">
                  <span>
                    {cartItem.name}
                    <span className="text-muted-foreground"> × {cartItem.quantity}</span>
                  </span>
                  <span className="font-medium">€{(cartItem.price * cartItem.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div className="rounded-xl border border-border bg-card p-6">
            <label className="mb-3 block font-serif text-lg font-medium">Payment Method</label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent hover:cursor-pointer"
            >
              <option value="karta">Card</option>
              <option value="dobierka">Cash on Delivery</option>
            </select>
          </div>

          {/* Delivery */}
          <div className="rounded-xl border border-border bg-card p-6">
            <label className="mb-3 block font-serif text-lg font-medium">Delivery Method</label>
            <select
              value={deliveryMethod}
              onChange={(e)=> setDeliveryMethod(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent hover:cursor-pointer"
            >
              <option value="kurier">Courier</option>
              <option value="packeta">Packeta</option>
            </select>
          </div>
        </div>

        {/* Right: total + place order */}
        <div className="h-fit rounded-xl border border-border bg-card p-6">
          <h2 className="font-serif text-xl font-medium">Total</h2>
          <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
            <span className="text-sm text-muted-foreground">Amount</span>
            <span className="text-2xl font-light">€{total.toFixed(2)}</span>
          </div>
          <Button
            onClick={handleOrder}
            className="mt-6 w-full bg-primary text-primary-foreground hover:bg-accent hover:cursor-pointer"
          >
            Place Order
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Checkout