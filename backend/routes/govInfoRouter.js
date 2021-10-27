import express from 'express'
import axios from 'axios'

const govInfoRouter = express.Router()

const apiKey = "&api_key=" + process.env.GOVAPIKEY

// fetching directly from bankruptcy filings
// optional query params include: offset, pageSize
govInfoRouter.get('/bankruptcies', async (req, res) => {
    try {
        axios.get(`https://api.govinfo.gov/collections/USCOURTS/2020-01-01T12%3A00%3A00Z?offset=${req.query.offset || 0}&pageSize=${req.query.pageSize <= 100 ? req.query.pageSize : 100}&courtType=Bankruptcy` + apiKey)
        .then(response => {
            res.send(response.data.packages)
        })
    } catch (e) {
        res.send(e.data.error)
    }
    
})



export default govInfoRouter