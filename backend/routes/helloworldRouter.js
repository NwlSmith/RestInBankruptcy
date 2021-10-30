import * as path from 'path'
import express from 'express'
const helloRouter = express.Router()

helloRouter.get('/', async (req, res) => {
    res.sendFile("/index.html", {root: path.resolve()})
})

export default helloRouter