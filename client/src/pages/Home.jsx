import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useEffect } from "react"
import {useState} from 'react'
import axios from 'axios'
import { useNavigate, Link } from "react-router-dom"

function Home(){
  const [products, setProducts] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("")
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  useEffect(()=>{
    async function fetchProducts(){
      try{
      const response = await axios.get("http://localhost:5000/api/products")
      setProducts(response.data)
      const categoriesResponse = await axios.get("http://localhost:5000/api/categories")
      setCategories(categoriesResponse.data)
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

    const filteredProducts = products.filter((product)=>{
      if(selectedCategory === "") return true
      return product.category_id === Number(selectedCategory)
    })

  return(
    <Card>
      <CardHeader>
        <CardTitle>Home</CardTitle>
      </CardHeader>
      <CardContent>
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          <option value="">Vyber kategóriu</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
        {
          filteredProducts.map((product)=>(
            <div key={product.id} onClick={() => navigate(`/product/${product.id}`)}>
              <p>{product.name}</p>
              <p>{product.price}</p>
              <p>{product.category_name}</p>
              <img src={product.image_url} alt={product.name} />
            </div>
          ))
        }
      </CardContent>
    </Card>
  )
}

export default Home