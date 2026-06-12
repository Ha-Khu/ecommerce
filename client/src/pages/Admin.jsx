import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useEffect } from "react"
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom"

function Admin(){
  const [products, setProducts] = useState([])
  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [quantity, setQuantity] = useState("")
  const [description, setDescription] = useState("")
  const [category_id, setCategoryId] = useState("")
  const [categories, setCategories] = useState([])
  const [image_url, setImage] = useState("")
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
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/auth/me`, {
          headers: {Authorization: `Bearer ${token}`}
        })
        const role = response.data.role
        if(role !== "admin"){
          navigate("/")
          return
        }
        const productResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`)
        setProducts(productResponse.data)
        const categoriesResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/categories`)
        setCategories(categoriesResponse.data)
        setLoading(false)
      }catch(err){
        setError("Check failed")
      }
    }
    adminCheck()
  }, [])

  async function addProduct(){
    try{
      await axios.post(`${import.meta.env.VITE_API_URL}/api/products`, {name, price, quantity, description, category_id, image_url},{
        headers: {Authorization: `Bearer ${token}`}
      })
      const productResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`)
      setProducts(productResponse.data)
      setName("")
      setPrice("")
      setQuantity("")
      setDescription("")
      setCategoryId("")
      setImage("")
    }catch(err){
      setError("Insert failed")
    }
  }

  async function editProduct(id){
    try{
      await axios.put(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {name, price, quantity, description, category_id, image_url}, {
        headers: {Authorization: `Bearer ${token}`}
      })
      const productResponse = await axios.get(`${import.meta.env.VITE_API_URL}/api/products`)
      setProducts(productResponse.data)
      setName("")
      setPrice("")
      setQuantity("")
      setDescription("")
      setCategoryId("")
      setImage("")
    }catch(err){
      setError("Update failed")
    }
  }

  async function deleteProduct(id){
    try{
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/products/${id}`, {
        headers: {Authorization: `Bearer ${token}`}
      })
      setProducts(products.filter((item) => item.id !== id))
    }catch(err){
      setError("Deleting failed")
    }
  }

  if(loading) return(
    <div className="flex min-h-[60vh] items-center justify-center">
      <p className="text-sm tracking-widest text-muted-foreground uppercase">Loading</p>
    </div>
  )

  return(
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="mb-8 font-serif text-4xl font-semibold tracking-tight">Admin Dashboard</h1>

      {error && <p className="mb-6 text-sm text-destructive">{error}</p>}

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Add product form */}
        <div className="h-fit rounded-xl border border-border bg-card p-6 lg:sticky lg:top-20">
          <h2 className="mb-5 font-serif text-xl font-medium">Add / Edit Product</h2>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Name</label>
              <Input placeholder="Product name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Price</label>
                <Input placeholder="0.00" value={price} onChange={(e) => setPrice(e.target.value)} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Quantity</label>
                <Input placeholder="0" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Description</label>
              <Input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Image URL</label>
              <Input placeholder="https://..." value={image_url} onChange={(e) => setImage(e.target.value)} />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Category</label>
              <select
                value={category_id}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-4 py-2 text-sm outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent hover:cursor-pointer"
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>{category.name}</option>
                ))}
              </select>
            </div>
            <Button
              onClick={addProduct}
              className="w-full bg-primary text-primary-foreground hover:bg-accent hover:cursor-pointer"
            >
              Add Product
            </Button>
          </div>
        </div>

        {/* Product list */}
        <div className="space-y-4 lg:col-span-2">
          {products.map((product)=> (
            <div
              key={product.id}
              className="flex items-center gap-4 rounded-lg border border-border bg-card p-4"
            >
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-secondary">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[10px] tracking-wide text-muted-foreground uppercase">
                    No img
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="font-serif text-lg font-medium leading-tight">{product.name}</h3>
                <p className="text-sm text-muted-foreground">
                  €{product.price} · {product.quantity} pcs · {product.category_name}
                </p>
              </div>

              <div className="flex shrink-0 gap-2">
                <button
                  onClick={() => editProduct(product.id)}
                  className="rounded-md border border-border px-3 py-1.5 text-sm transition-colors hover:bg-secondary hover:cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => deleteProduct(product.id)}
                  className="rounded-md border border-border px-3 py-1.5 text-sm text-destructive transition-colors hover:bg-destructive hover:text-destructive-foreground hover:cursor-pointer"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Admin