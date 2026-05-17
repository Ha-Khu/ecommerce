const express = require('express')
const router = express.Router()
const db = require('../db')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


router.post("/register", async (req, res) =>{
  try {
    const { firstName, lastName, email, password} = req.body
    let checkMail = "SELECT * FROM users WHERE email = ?"
    const [rows] = await db.query(checkMail, [email])
    if(rows.length > 0){
      res.status(400).json({error: "Email already exists"})
      return
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    let sql = "INSERT INTO users (name, surname, email, password) VALUES (?, ?, ?, ?)"
    await db.query(sql, [firstName, lastName, email, hashedPassword])
    res.status(201).json({ message: 'User registered successfully' })
  } catch (err) {
    res.status(500).json({ err: 'Registration failed' })
  }
})

router.post("/login", async (req, res)=>{
  try {
    const {email, password} = req.body
    let sql = "SELECT * FROM users WHERE email = ?"
    const [rows] = await db.query(sql, [email])
    if(rows.length === 0){
      res.status(401).json({error: "Email neexistuje"})
      return
    }
    const passwrodMatch = await bcrypt.compare(password, rows[0].password)
    if(!passwrodMatch){
      res.status(401).json({ error: "Password is wrong"})
    }
    const token = jwt.sign({id: rows[0].id, email: rows[0].email},
      process.env.JWT_SECRET, {expiresIn: '1d'}
    )
  } catch(err){
    res.status(500).json({ err: "Login failed"})
  }
})

module.exports = router