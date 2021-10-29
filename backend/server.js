import "dotenv/config"
import express from 'express'
import cors from 'cors'


// routes
import helloRouter from './routes/helloworldRouter.js'
import govInfoRouter from './routes/govInfoRouter.js'
import dbRouter from "./routes/dbRouter.js"

const app = express()

// port to listen on
const port = 8080

app.use(cors())
app.use(express.json())

// using routes
app.use('/', helloRouter)
app.use('/govinfo', govInfoRouter)
app.use('/dynamoDB', dbRouter)

// listening on
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`) // instance hosted on http://18.220.179.6:8080/
})