import express from 'express'
import cors from 'cors'

const app = express()
const port = 8080

const helloRoutes = require('./routes/helloworldRouter').default

app.use(cors())

app.use('/', helloRoutes)

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})