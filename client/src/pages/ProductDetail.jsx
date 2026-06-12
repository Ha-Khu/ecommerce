import { Button } from "@/components/ui/button"
import { useEffect } from "react"
import { useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from "react-router-dom"

function ProductDetail(){
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [message, setMessage] = useState("")
  const navigate = useNavigate()
  const {id} = useParams()
  const token = localStorage.getItem('token')

  useEffect(()=>{
    async function fetchProducts(){
      try{
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/products/${id}`)
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
      navigate("/login")
      return
    }
    try{
      await axios.post(`${import.meta.env.VITE_API_URL}/api/cart`, {product_id: product.id, quantity: 1}, {
        headers: {Authorization: `Bearer ${token}`}
      })
      setMessage("Added to cart")
      setError("")
    } catch(err){
      setError("Adding to cart failed, please try again")
      setMessage("")
    }
  }

  if(loading) return(
    <div className="flex min-h-[60vh] items-center justify-center">
      <p className="text-sm tracking-widest text-muted-foreground uppercase">Loading</p>
    </div>
  )

  return(
    <div className="mx-auto max-w-6xl px-6 py-12">
      <button
        onClick={() => navigate("/")}
        className="mb-8 text-sm tracking-wide text-muted-foreground transition-colors hover:text-foreground hover:cursor-pointer"
      >
        ← Back to shop
      </button>

      <div className="grid gap-12 md:grid-cols-2">
        {/* Image */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-secondary">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs tracking-widest text-muted-foreground uppercase">
              No image
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col">
          {product.category_name && (
            <p className="mb-3 text-xs font-medium tracking-[0.2em] text-accent uppercase">
              {product.category_name}
            </p>
          )}

          <h1 className="font-serif text-4xl font-semibold tracking-tight">{product.name}</h1>

          <p className="mt-4 text-3xl font-light">€{product.price}</p>

          <div className="mt-6 border-t border-border pt-6">
            <p className="leading-relaxed text-muted-foreground">{product.description}</p>
          </div>

          <div className="mt-6 flex items-center gap-2 text-sm">
            <span className={product.quantity > 0 ? "text-foreground" : "text-destructive"}>
              {product.quantity > 0 ? `${product.quantity} in stock` : "Out of stock"}
            </span>
          </div>

          <div className="mt-8">
            <Button
              onClick={addToCart}
              disabled={product.quantity === 0}
              className="w-full bg-primary py-6 text-primary-foreground hover:bg-accent hover:cursor-pointer md:w-auto md:px-12"
            >
              Add to Cart
            </Button>
          </div>

          {message && (
            <p className="mt-4 text-sm font-medium text-accent">{message}</p>
          )}
          {error && (
            <p className="mt-4 text-sm text-destructive">{error}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductDetail