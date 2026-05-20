require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT
const authRouter = require('./routes/auth')
const productRouter = require('./routes/products')

app.use(cors())
app.use(express.json())
app.use('/api/auth', authRouter)
app.use('/api/products', authRouter)

app.listen(port, ()=>{
  console.log(`Example app listening on port ${port}`)
})
