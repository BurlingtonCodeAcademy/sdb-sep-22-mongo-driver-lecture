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

    // let collection = await db.collection("users")

    let collection = await db.collection("inventory")

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

// Find One
app.get("/findone/:status", async (req, res) => {
    let status = req.params.status
    let c =  await dbConnect()
    // finds all instances of db query we're passing thru our parameter
    // let result = await c.find({status}).toArray()

    // aggregates the search to look for our parameter or hardcoded paper value
    // let result = await c.find({
    //     $or: [
    //         { status },
    //         { item: "paper" }
    //     ]
    // }).toArray()
    // we need .toArray() method or wrap into forEach/loop if db query returns > 1 document

    // Using aggregates to further filter our db query
    // let result = await c.find({status, qty: { $gt: 50 }}).toArray()

    // Querying nested documents
    let result = await c.find({ status, "size.h": { $gt: 8}}).toArray()
    
    console.log(result)
    
    if (!result.length) {
        res.status(404).json({
            message: "Content not found"
        })
    } else {
        res.status(200).json({
            result
        })
    }
})


app.listen(PORT, () => {
    console.log(`[server] listening on ${PORT}`)
})