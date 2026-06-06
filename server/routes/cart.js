const express = require('express')
const router = express.Router()
const db = require('../db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const verifyToken = require('../middleware/verifyToken')

router.get("/", verifyToken, async (req, res)=>{
  try{
    const id = req.user.id
    let sql = "SELECT cart.id, cart.quantity, products.name, products.price FROM cart JOIN products ON cart.product_id = products.id WHERE cart.user_id = ?"
    const [rows] = await db.query(sql, [id])
    res.json(rows)
  }catch(err){
    res.status(500).json({err: "Loading Failed"})
  }
})

router.post("/", verifyToken, async (req, res)=>{
  try {
    const {quantity, product_id} = req.body
    const user_id = req.user.id
    const [existing] = await db.query("SELECT * FROM cart WHERE user_id = ? AND product_id = ?", [user_id, product_id])
    if(existing.length > 0){
      let sql = "UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?"
      await db.query(sql, [quantity, user_id, product_id])
    } else {
      let sql = "INSERT INTO cart(quantity, user_id, product_id) VALUES (?, ?, ?)"
      await db.query(sql, [quantity, user_id, product_id])
    }
    res.status(201).json({message: "Cart Inserted"})
  }catch(err){
    res.status(500).json({err: "Insert Failed"})
  }
})

router.put("/:id", verifyToken, async (req, res)=>{
  try{
    const id = req.params.id
    const {quantity} = req.body
    if(quantity < 1) {
      return res.status(400).json({err: "Quantity must be at least 1"})
    }
    let sql = "UPDATE cart SET quantity = ? WHERE id = ?"
    const [rows] = await db.query(sql, [quantity, id])
    res.status(200).json({message: "Quantity updated"})
  }catch(err){
    res.status(500).json({err: "Update Failed"})
  }
})

router.delete("/:id", verifyToken, async (req, res)=>{
  try{
    const id = req.params.id
    let sql = "DELETE FROM cart WHERE id = ?"
    const [rows] = await db.query(sql, [id])
    res.status(200).json({message: "Cart Deleted"})
  }catch(err){
    res.status(500).json({err: "Delete Failed"})
  }
})

module.exports = router