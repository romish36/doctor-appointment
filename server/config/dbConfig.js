const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URL)

const connection = mongoose.connection;

connection.on("connected", () => {
    console.log("MongoDB is connected")
})
connection.on("error", (error) => {
    console.log("Error In MongoDB Connection", error)
})

module.exports = mongoose;