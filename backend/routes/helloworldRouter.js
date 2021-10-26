const helloRouter = require('express').Router()

helloRouter.get(async (req, res) => {
    res.send('Hello World!')
})

export default helloRouter