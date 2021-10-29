import express from 'express'
import axios from 'axios'

import { filterPackages } from '../utils/filterData.js'

import { putDoc } from '../utils/dynamoFuncs.js'

const dbRouter = express.Router()

dbRouter.post('/bankruptcies/:earliestdate?/:latestdate?', async (req, res) => {
    axios.get(`https://api.govinfo.gov/collections/USCOURTS/${req.params.earliestdate || "2020-01-01"}T12%3A00%3A00Z${req.params.latestdate ? ("/" + req.params.latestdate + "T12%3A00%3A00Z") : ""}?offset=${req.query.offset || 0}&pageSize=${req.query.pageSize || 100}&courtType=Bankruptcy` + apiKey)
    .then(response => {
        filterPackages(response.data.packages).then(filtered => {
            let promises = []
            for(let item of filtered) {
                let promise = putDoc(req.body.tableName, item).catch(e => {
                    res.status(e.$metadata.httpStatusCode).send(e.message) 
                })
                promises.push(promise)
            }
            Promise.all(promises).then(() => {
                res.status(200).send("OK")
            })
        })
    }).catch(e => {
        res.status(e.response.status).send(e.response.data)
    })
    
})

dbRouter.post("/putsingledoc", async (req, res) => {
    let response = await putDoc(req.body.tableName, req.body.doc)
    res.status(response.$metadata.httpStatusCode).send(response.$metadata)

})

export default dbRouter