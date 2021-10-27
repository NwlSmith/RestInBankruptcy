import express from 'express'
import axios from 'axios'
import putDoc from '../utils/dynamoPutDoc.js'

const govInfoRouter = express.Router()

const apiKey = "&api_key=" + process.env.GOVAPIKEY

// fetching directly from bankruptcy filings
// optional query params include: offset, pageSize
govInfoRouter.get('/bankruptcies', async (req, res) => {
        axios.get(`https://api.govinfo.gov/collections/USCOURTS/2020-01-01T12%3A00%3A00Z?offset=${req.query.offset || 0}&pageSize=${req.query.pageSize || 100}&courtType=Bankruptcy` + apiKey)
        .then(response => {
            res.send(response.data.packages)
        }).catch(e => {
            res.status(e.response.status).send(e.response.data)
        })
})

govInfoRouter.post('/bankruptcies', async (req, res) => {
    res.send(putDoc(req.body.tableName, req.body.doc));
})



export default govInfoRouter