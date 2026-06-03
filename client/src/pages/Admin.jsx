import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useEffect } from "react"
import {useState} from 'react'
import axios from 'axios'
import { useNavigate, Link } from "react-router-dom"

function Admin(){
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(()=>{
    if(!token){
      navigate("/login")
      return      
    }
    async function adminCheck(){
      try{
        const response = await axios.get("http://localhost:5000/api/auth/me", {
          headers: {Authorization: `Bearer ${token}`}
        })
        const role = response.data.role
        if(role !== "admin"){
          navigate("/")
          return
        }
        const productResponse = await axios.get("http://localhost:5000/api/products")
        setLoading(false)
        setProducts(productResponse.data)
      }catch(err){
        setError("Check failed")
      }
    }
    adminCheck()
  }, [])

  async function deleteProduct(id){
    try{
     await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: {Authorization: `Bearer ${token}`}
      })
      setProducts(products.filter((item) => item.id !== id))
    }catch(err){
      setError("Deleting failed")
    }
  }

  if(loading) return(
    <p>Loading...</p>
  )

  return(
    <Card>
      <CardContent>
        {
          products.map((product)=> (
            <div key={product.id}>
              <p>{product.name}</p>
              <p>{product.price}</p>
              <p>{product.quantity}</p>
              <p>{product.description}</p>
              <Button onClick={() => deleteProduct(product.id)}>Delete Product</Button>
            </div>
          ))
        }
        {error && <p>{error}</p>}
      </CardContent>
    </Card>
  )
}

export default Admin