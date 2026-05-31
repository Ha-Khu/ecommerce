import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useEffect } from "react"
import {useState} from 'react'
import axios from 'axios'
import { useNavigate, Link } from "react-router-dom"

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
        const response = await axios.get("http://localhost:5000/api/cart", {
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
      await axios.post("http://localhost:5000/api/orders", {total_price: total, payment_method: paymentMethod, delivery_method: deliveryMethod}, {
        headers: {Authorization: `Bearer ${token}`}
      })
      navigate('/orders')
    }catch(err){
      setError("Order failed")
    }
  }

  if(loading) return(
    <p>Loading...</p>
  )

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity , 0)

  return(
    <Card>
      <CardHeader>
        <CardTitle>Checkout</CardTitle>
      </CardHeader>
      <CardContent>
        {
          cartItems.map((cartItem)=>(
            <div key={cartItem.id}>
              <p>{cartItem.name}</p>
              <p>{cartItem.price}</p>
              <p>{cartItem.quantity}</p>
            </div>
          ))
        }
       {error && <p>{error}</p>}
        <p>Total: {total}</p>
        <p>Výber Platby:</p>
        <select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
          <option value="karta">Karta</option>
          <option value="dobierka">Dobierka</option>
        </select>
        <p>Donáška:</p>
        <select value={deliveryMethod} onChange={(e)=> setDeliveryMethod(e.target.value)}>
          <option value="kurier">Kuriér</option>
          <option value="packeta">Packeta</option>
        </select>
        <Button onClick={handleOrder}>Order</Button>
      </CardContent>
    </Card>
  )
}

export default Checkout