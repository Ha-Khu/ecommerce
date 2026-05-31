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

  function checkout(){
    navigate("/checkout")
  }

  async function removeItem(id){
    try{
    await axios.delete(`http://localhost:5000/api/cart/${id}`, {
      headers: {Authorization: `Bearer ${token}`}
    })
    setCartItems(cartItems.filter((item)=> item.id !== id))
    }catch(err){
      setError("Deleting Item failed, please try again")
    }
  }

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
              <Button onClick={()=> removeItem(cartItem.id)}>Remove</Button>
            </div>
          ))
        }
        <Button onClick={checkout}>Check Out</Button>
      </CardContent>
    </Card>
  )
}

export default Cart