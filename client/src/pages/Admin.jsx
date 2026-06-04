import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { useEffect } from "react"
import {useState} from 'react'
import axios from 'axios'
import { useNavigate, Link } from "react-router-dom"

function Admin(){
  const [products, setProducts] = useState([])
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [quantity, setQuantity] = useState("")
  const [description, setDescription] = useState("")
  const [category_id, setCategoryId] = useState("")
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

  async function addProduct(){
    try{
      await axios.post("http://localhost:5000/api/products", {name, price, quantity, description, category_id},{
        headers: {Authorization: `Bearer ${token}`}
      })
      const productResponse = await axios.get("http://localhost:5000/api/products")
      setProducts(productResponse.data)
      setName("")
      setPrice("")
      setQuantity("")
      setDescription("")
      setCategoryId("")
    }catch(err){
      setError("Insert failed")
    }
  }

  async function editProduct(id){
    try{
      await axios.put(`http://localhost:5000/api/products/${id}`, {name, price, quantity, description, category_id}, {
        headers: {Authorization: `Bearer ${token}`}
      })
      const productResponse = await axios.get("http://localhost:5000/api/products")
      setProducts(productResponse.data)
      setName("")
      setPrice("")
      setQuantity("")
      setDescription("")
      setCategoryId("")
    }catch(err){
      setError("Update failed")
    }
  }

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
              <Button onClick={() => editProduct(product.id)}>Edit product</Button>
            </div>
          ))
        }
        {error && <p>{error}</p>}
        <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} />
        <Input placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
        <Input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <Input placeholder="Category ID" value={category_id} onChange={(e) => setCategoryId(e.target.value)} />
        <Button onClick={addProduct}>Add Product</Button>
      </CardContent>
    </Card>
  )
}

export default Admin