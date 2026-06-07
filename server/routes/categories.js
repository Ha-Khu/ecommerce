const express = require('express')
const router = express.Router()
const db = require('../db')

router.get("/", async (req, res)=>{
  try{
    let sql = "SELECT * FROM categories"
    const [rows] = await db.query(sql)
    res.json(rows)
  }catch(err){
    res.status(500).json({err: "Loading failed"})
  }
})

module.exports = router