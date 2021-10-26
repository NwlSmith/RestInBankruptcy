import express from 'express'
import cors from 'cors'

// routes
import helloRouter from './routes/helloworldRouter.js'

const app = express()

// port to listen on
const port = 8080

app.use(cors())

// using routes
app.use('/', helloRouter)

// listening on
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})