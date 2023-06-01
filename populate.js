require('dotenv').config()
const connectDB = require("./db/connect")
const Job = require('./models/Job')
const mockData = require('./mock-data.json')


const populateDb = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    await Job.create(mockData)
    console.log('database has been populated successfuly')
    process.exit(0)
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}


populateDb()