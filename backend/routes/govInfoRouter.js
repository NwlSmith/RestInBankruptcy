import express from 'express'
import axios from 'axios'

import { filterPackages } from '../utils/filterData.js'

import { createRequire } from "module"
const require = createRequire(import.meta.url)
const dummydata = require("../DummyData.json")

const govInfoRouter = express.Router()

const apiKey = "&api_key=" + process.env.GOVAPIKEY

// fetching directly from bankruptcy filings
// optional query params include: offset, pageSize
govInfoRouter.get('/bankruptcies/:earliestdate?/:latestdate?', async (req, res) => {
    axios.get(`https://api.govinfo.gov/collections/USCOURTS/${req.params.earliestdate || "2020-01-01"}T12%3A00%3A00Z${req.params.latestdate ? ("/" + req.params.latestdate + "T12%3A00%3A00Z") : ""}?offset=${req.query.offset || 0}&pageSize=${req.query.pageSize || 100}&courtType=Bankruptcy` + apiKey)
    .then(response => {
        filterPackages(response.data.packages).then(filtered => {
            res.send(filtered)
        })
    }).catch(e => {
        res.status(e.response.status).send(e.response.data)
    })
})

// optional query param "index" to select single array index
govInfoRouter.get("/dummydata", async (req, res) => {
    if(req.query.index) {
        res.send(dummydata.Items[req.query.index])
    } else {
        res.send(dummydata.Items)
    }
})



export default govInfoRouter