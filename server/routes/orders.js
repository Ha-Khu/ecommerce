const express = require('express')
const router = express.Router()
const db = require('../db')
const verifyToken = require('../middleware/verifyToken')

router.get("/", verifyToken, async (req, res)=>{
  try {
    const user_id = req.user.id
    let sql = "SELECT * FROM orders WHERE user_id = ?"
    const [rows] = await db.query(sql, [user_id])
    res.json(rows)
  }catch(err){
    res.status(500).json({err: "Loading Failed"})
  }
})

router.post("/", verifyToken, async (req, res)=>{
  const connection = await db.getConnection()
  await connection.beginTransaction()
  try{
    const user_id = req.user.id
    const {total_price, payment_method, delivery_method} = req.body
    let sql = "INSERT INTO orders(total_price, status, payment_method, delivery_method, user_id) VALUES (?, ?, ?, ?, ?)"
    const [rows] = await connection.query(sql, [total_price, "pending", payment_method, delivery_method, user_id])
    const [cartItems] = await connection.query("SELECT * FROM cart WHERE user_id = ?", [user_id])
    const order_id = rows.insertId
    for (items of cartItems){
      const product_id = items.product_id
      const quantity = items.quantity
      const [product] = await connection.query("SELECT price FROM products WHERE id = ?", [product_id])
      const price = product[0].price
      const [order_items] = await connection.query("INSERT INTO order_items(quantity, price, order_id, product_id) VALUES(?, ?, ?, ?)", [quantity, price, order_id, product_id])
    }
    await connection.query("DELETE FROM cart WHERE user_id = ?", [user_id])
    await connection.commit()
    res.status(200).json({message: "Order Inserted"})
  }catch(err){
    await connection.rollback()
    res.status(500).json({err: "Insert Failed"})
  }
})

router.get("/:id", verifyToken, async (req, res)=>{
 try { 
    const id = req.params.id
    const user_id = req.user.id
    let sql = "SELECT * FROM orders WHERE id = ? and user_id = ?"
    const [rows] = await db.query(sql, [id, user_id])
    res.json(rows)
  }catch(err){
    res.status(500).json({err: "Loading Failed"})
  }
})

module.exports = router