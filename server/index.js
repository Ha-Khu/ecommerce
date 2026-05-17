require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const port = process.env.PORT
const authRouter = require('./routes/auth')

app.use(cors())
app.use(express.json())
app.use('/api/auth', authRouter)

app.listen(port, ()=>{
  console.log(`Example app listening on port ${port}`)
})
