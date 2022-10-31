require("dotenv").config()
const express = require("express")
const app = express()
const { MongoClient } = require("mongodb")

const PORT = process.env.PORT || 4000
const MONGO_URL = process.env.MONGO_URL

let client = new MongoClient(MONGO_URL)

async function dbConnect() {
    
    await client.connect()

    let db = await client.db("mongolesson")

    let collection = await db.collection("users")

    return collection
}
app.use(express.json())
app.post("/create", async (req, res) => {
    let body = req.body
    let connect = await dbConnect()
    let insertOne = await connect.insertOne(body)
    client.close()

    res.status(201).json({
        message: "User created",
        insertOne
    })
})

app.get("/", async (_, res) => {
    let connection = await dbConnect()
    let userList = await connection.find({}).toArray()
    res.status(200).json({userList})
})



app.listen(PORT, () => {
    console.log(`[server] listening on ${PORT}`)
})