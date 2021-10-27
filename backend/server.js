import "dotenv/config"
import express from 'express'
import cors from 'cors'


// routes
import helloRouter from './routes/helloworldRouter.js'
import govInfoRouter from './routes/govInfoRouter.js'


const app = express()

// port to listen on
const port = 8080

app.use(cors())

// using routes
app.use('/', helloRouter)
app.use('/govinfo', govInfoRouter)

// listening on
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`) // instance hosted on http://3.21.207.180:8080/
})