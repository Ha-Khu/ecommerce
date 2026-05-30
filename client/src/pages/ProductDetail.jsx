import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useEffect } from "react"
import {useState} from 'react'
import axios from 'axios'
import { useNavigate, Link } from "react-router-dom"
import { useParams } from 'react-router-dom'

function ProductDetail(){
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const {id} = useParams()
  const token = localStorage.getItem('token')

  useEffect(()=>{
    async function fetchProducts(){
      try{
        const response = await axios.get(`http://localhost:5000/api/products/${id}`)
        setProduct(response.data[0])
        setLoading(false)
      }catch(err){
        setError("Loading of product failed, please try again")
      }
    }
    fetchProducts()
  }, [])

  async function addToCart(){
    if(!token){
      navigate("login")
      return
    }
    try{
      await axios.post("http://localhost:5000/api/cart", {product_id: product.id, quantity: 1}, {
        headers: {Authorization: `Bearer ${token}`}
      })
    } catch(err){
      setError("")
    }
  } 

  if(loading) return(
    <p>Loading...</p>
  )

  return(
    <Card>
      <CardHeader>
        <CardTitle>Product Detail</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{product.name}</p>
        <p>{product.price}</p>
        <p>{product.quantity}</p>
        <p>{product.description}</p>
        <Button onClick={addToCart}>Add to Cart</Button>
      </CardContent>
    </Card>
  )
}

export default ProductDetail