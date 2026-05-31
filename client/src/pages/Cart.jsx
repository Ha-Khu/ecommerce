import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useEffect } from "react"
import {useState} from 'react'
import axios from 'axios'
import { useNavigate, Link } from "react-router-dom"

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

  if(loading) return(
    <p>Loading ...</p>
  )

  return(
    <Card>
      <CardHeader>
        <CardTitle>Cart</CardTitle>
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
      </CardContent>
    </Card>
  )
}

export default Cart