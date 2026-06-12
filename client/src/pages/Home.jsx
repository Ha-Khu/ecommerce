import { useEffect } from "react"
import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from "react-router-dom"

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
        const response = await axios.get("${import.meta.env.VITE_API_URL}/api/products")
        setProducts(response.data)
        const categoriesResponse = await axios.get("${import.meta.env.VITE_API_URL}/api/categories")
        setCategories(categoriesResponse.data)
        setLoading(false)
      }catch(err){
        setError("Loading of products failed, try again")
      }
    }
    fetchProducts()
  }, [])

  if(loading) return(
    <div className="flex min-h-[60vh] items-center justify-center">
      <p className="text-sm tracking-widest text-muted-foreground uppercase">Loading</p>
    </div>
  )

  const filteredProducts = products.filter((product)=>{
    if(selectedCategory === "") return true
    return product.category_id === Number(selectedCategory)
  })

  return(
    <div className="mx-auto max-w-6xl px-6 py-12">
      {/* Hero */}
      <div className="mb-16 text-center">
        <p className="mb-3 text-xs font-medium tracking-[0.3em] text-accent uppercase">New Collection</p>
        <h1 className="font-serif text-5xl font-semibold tracking-tight md:text-6xl">
          Timeless Pieces
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted-foreground">
          Curated essentials from the world's finest brands, crafted to last.
        </p>
      </div>

      {/* Filter */}
      <div className="mb-10 flex items-center justify-between border-b border-border pb-6">
        <p className="text-sm text-muted-foreground">
          {filteredProducts.length} {filteredProducts.length === 1 ? "item" : "items"}
        </p>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-md border border-input bg-card px-4 py-2 text-sm tracking-wide outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent hover:cursor-pointer"
        >
          <option value="">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>{category.name}</option>
          ))}
        </select>
      </div>

      {error && <p className="mb-6 text-sm text-destructive">{error}</p>}

      {/* Product grid */}
      <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 lg:grid-cols-4">
        {filteredProducts.map((product)=>(
          <div
            key={product.id}
            onClick={() => navigate(`/product/${product.id}`)}
            className="group cursor-pointer"
          >
            <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-secondary">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-xs tracking-widest text-muted-foreground uppercase">
                  No image
                </div>
              )}
            </div>
            <div className="mt-4 space-y-1">
              {product.category_name && (
                <p className="text-xs tracking-wide text-muted-foreground uppercase">{product.category_name}</p>
              )}
              <h3 className="font-serif text-lg font-medium leading-tight">{product.name}</h3>
              <p className="text-sm font-medium">€{product.price}</p>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-muted-foreground">No products in this category yet.</p>
        </div>
      )}
    </div>
  )
}

export default Home