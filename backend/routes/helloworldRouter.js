import express from 'express'
const helloRouter = express.Router()

helloRouter.get('/', async (req, res) => {
    res.send('Hello World!')
})

export default helloRouter