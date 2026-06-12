import { useEffect } from "react"
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom"

function Orders(){
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(()=>{
    if(!token){
      navigate("/login")
      return
    }
    async function fetchOrders(){
      try{
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/orders`, {
          headers: {Authorization: `Bearer ${token}`}
        })
        setOrders(response.data)
        setLoading(false)
      }catch(err){
        setError("Loading orders failed, please try again")
      }
    }
    fetchOrders()
  }, [])

  if(loading) return(
    <div className="flex min-h-[60vh] items-center justify-center">
      <p className="text-sm tracking-widest text-muted-foreground uppercase">Loading</p>
    </div>
  )

  return(
    <div className="mx-auto max-w-4xl px-6 py-12">
      <h1 className="mb-8 font-serif text-4xl font-semibold tracking-tight">Your Orders</h1>

      {error && <p className="mb-6 text-sm text-destructive">{error}</p>}

      {orders.length === 0 ? (
        <div className="rounded-xl border border-border bg-card py-20 text-center">
          <p className="text-muted-foreground">You haven't placed any orders yet.</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 text-sm font-medium text-accent hover:underline hover:cursor-pointer"
          >
            Start shopping
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order)=>(
            <div
              key={order.id}
              className="rounded-xl border border-border bg-card p-6"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs tracking-wide text-muted-foreground uppercase">Order #{order.id}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {new Date(order.created_at).toLocaleDateString("sk-SK")}
                  </p>
                </div>
                <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium tracking-wide capitalize">
                  {order.status}
                </span>
              </div>

              <div className="mt-5 grid grid-cols-2 gap-4 border-t border-border pt-5 text-sm md:grid-cols-3">
                <div>
                  <p className="text-xs tracking-wide text-muted-foreground uppercase">Total</p>
                  <p className="mt-1 font-medium">€{Number(order.total_price).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs tracking-wide text-muted-foreground uppercase">Payment</p>
                  <p className="mt-1 capitalize">{order.payment_method}</p>
                </div>
                <div>
                  <p className="text-xs tracking-wide text-muted-foreground uppercase">Delivery</p>
                  <p className="mt-1 capitalize">{order.delivery_method}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Orders