import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useEffect } from "react"
import {useState} from 'react'
import axios from 'axios'
import { useNavigate, Link } from "react-router-dom"

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
      const response = await axios.get("http://localhost:5000/api/orders", {
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
    <p>Loading...</p>
  )

  return(
    <Card>
      <CardHeader>
        <CardTitle>Orders</CardTitle>
      </CardHeader>
      <CardContent>
        {
          orders.map((order)=>(
            <div key={order.id}>
              <p>{order.total_price}</p>
              <p>{order.status}</p>
              <p>{order.payment_method}</p>
              <p>{order.delivery_method}</p>
              <p>{new Date(order.created_at).toLocaleDateString("sk-SK")}</p>
            </div>
          ))
        }
      </CardContent>
    </Card>
  )
}

export default Orders