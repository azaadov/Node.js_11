const express = require("express")
const cors = require("cors")
const productRouter = require("./router/product.route")
const authRouter = require("./router/auth.route")
require("dotenv").config()



const app=express()
const PORT=process.env.PORT || 3000
app.use(cors())
app.use(express.json())
app.use(productRouter)
app.use(authRouter)

app.listen(PORT, ()=>{
    console.log("server running: "+PORT);
})