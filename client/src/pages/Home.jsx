import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useEffect } from "react"
import {useState} from 'react'
import axios from 'axios'

function Home(){
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(()=>{
    async function fetchProducts(){
      try{
      const response = await axios.get("http://localhost:5000/api/products")
      setProducts(response.data)
      setLoading(false)
      }catch(err){
        setError("Laoding of products failed, try again")
      }
    }
    fetchProducts()
  }, [])

  if(loading) return(
    <p>Loading...</p>
  )

  return(
    <Card>
      <CardHeader>
        <CardTitle>Home</CardTitle>
      </CardHeader>
      <CardContent>
        {
          products.map((products)=>(
            <div key={products.id}>
              <p>{products.name}</p>
              <p>{products.price}</p>
            </div>
          ))
        }
      </CardContent>
    </Card>
  )
}

export default Home