import express from "express"
import cors from "cors"
import { connectToDb } from './config/db.js'
import foodRouter from './routes/foodRoute.js'
import userRouter from './routes/userRoute.js'
import "dotenv/config"
import cartRouter from './routes/cartRoute.js'
import orderRouter from './routes/orderRoute.js'
//app config
const app = express()
const port = process.env.PORT || 4000 

//middleware 
app.use(express.json())
app.use(cors())

//db-connection
connectToDb()


//api endpoints

app.use("/api/food", foodRouter)
app.use("/images",express.static("uploads")) // this api gives access to uploaded images in browser /images/---.png
app.use("/api/user",userRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)

app.get("/",(req ,res)=>{
    res.send("Api working ")
})



app.listen(port,()=>{
    console.log("server running on "+port)
})