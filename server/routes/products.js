const express = require('express')
const router = express.Router()
const db = require('../db')
const verifyToken = require('../middleware/verifyToken.js')
const isAdmin = require('../middleware/isAdmin.js')


router.get("/", async (req, res)=>{
  try{
    let sql = "SELECT * FROM products"
    const [rows] = await db.query(sql)
    res.json(rows)
  } catch(err){
    res.status(500).json({err: "Loading failed"})
  }
})

router.get("/:id", async (req, res)=>{
  try{
    let sql = "SELECT * FROM products WHERE id = ?"
    const id = req.params.id
    const [rows] = await db.query(sql, [id])
    res.json(rows)
  } catch(err){
    res.status(500).json({err: "Loading failed"})
  }
})

router.post("/", verifyToken, isAdmin, async (req, res)=>{
  try{
    const {name, price, quantity, description, category_id} = req.body
    let sql = "INSERT INTO products (name, price, quantity, description, category_id) VALUES (?, ?, ?, ?, ?)"
    const [rows] = await db.query(sql, [name, price, quantity, description, category_id])
    res.status(201).json({message: "Product inserted"})
  } catch(err){
    res.status(500).json({err: "Insert failed"})
  }
})

router.delete("/:id", verifyToken, isAdmin, async (req, res)=>{
  try {
  const id = req.params.id
  let sql = "DELETE FROM products WHERE id = ?"
  const [rows] = await db.query(sql, [id])
  res.status(200).json({message: "Delete successful"})
  } catch(err){
    res.status(500).json({err: "Delete failed"})
  }
})

router.put("/:id", verifyToken, isAdmin, async (req, res)=>{
  try {
  const id = req.params.id
  const {name, price, quantity, description, category_id} = req.body
  let sql = "UPDATE products SET name = ?, price = ?, quantity = ?, description = ?, category_id = ? WHERE id = ?"
  const [rows] = await db.query(sql, [name, price, quantity, description, category_id, id])
  res.status(200).json({message: "Update successful"})
  } catch(err){
    res.status(500).json({err: "Update failed"})
  }
})