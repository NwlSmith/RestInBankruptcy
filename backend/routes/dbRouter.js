import express from 'express'
import axios from 'axios'

import { bolsterPackageData, filterPackages } from '../utils/filterData.js'

import { putDoc, getDoc, updateDoc, queryDocs, deleteDocAttribute, addFlowers, addComment } from '../utils/dynamoFuncs.js'

const dbRouter = express.Router()

const apiKey = "&api_key=" + process.env.GOVAPIKEY

// create a series of bankruptcies in Table = tableName
dbRouter.post('/bankruptcies/:earliestdate?/:latestdate?', async (req, res) => {
    axios.get(`https://api.govinfo.gov/collections/USCOURTS/${req.params.earliestdate || "2020-01-01"}T12%3A00%3A00Z${req.params.latestdate ? ("/" + req.params.latestdate + "T12%3A00%3A00Z") : ""}?offset=${req.query.offset || 0}&pageSize=${req.query.pageSize || 100}&courtType=Bankruptcy` + apiKey)
    .then(response => {
        filterPackages(response.data.packages).then(filtered => {
            let newitems = []
            for(let item of filtered) {
                if(item) {
                    newitems.push(item)
                }
            }
            bolsterPackageData(newitems).then(result => {
                if(result.length > 0) {
                    let promises = []
                    for(let item of result) {
                        let graveObj = {
                            "packageId": item.packageId,
                            "comments": {},
                            "flowers": 0
                        }
                        let promise = putDoc(req.body.tableName, item).catch(e => {
                            res.status(e.$metadata.httpStatusCode).send(e.message) 
                        })
                        putDoc("GravestoneOfferings", graveObj).catch(e => {
                            res.status(e.$metadata.httpStatusCode).send(e.message) 
                        })
                        promises.push(promise)
                    }
                    Promise.all(promises).then(() => {
                        res.status(200).send("OK")
                    })
                } else {
                    res.status(404).send("Nothing was found.")
                }
            })
        })
    }).catch(e => {
        res.status(e.response.status).send(e.response.data)
    })
    
})

// create single document in Table = tableName
dbRouter.post('/doc', async (req, res) => {
    try {
        let response = await putDoc(req.body.tableName, req.body.doc)
        res.status(response.$metadata.httpStatusCode).send(response)
    } catch (e) {
        res.status(e.$metadata.httpStatusCode).send(e.message)
    }
})

/* specific table selections (somewhat redundant) */ 
dbRouter.post('/doc/gravestone', async (req, res) => {
    try {
        let response = await putDoc("GravestoneOfferings", req.body)
        res.status(response.$metadata.httpStatusCode).send(response)
    } catch (e) {
        res.status(e.$metadata.httpStatusCode).send(e.message)
    }
})

dbRouter.post('/doc/bankruptcy', async (req, res) => {
    try {
        let response = await putDoc("RestInDatabase", req.body)
        res.status(response.$metadata.httpStatusCode).send(response)
    } catch (e) {
        res.status(e.$metadata.httpStatusCode).send(e.message)
    }
})
/**************/

// update a document in Table = tableName
dbRouter.put('/doc/:tablename', async (req, res) => {
    try {
        let response = await updateDoc(req.params.tablename, req.body.keyObj, req.body.fieldName, req.body.fieldValue)
        res.status(response.$metadata.httpStatusCode).send(response)
    } catch (e) {
        res.status(e.$metadata.httpStatusCode).send(e.message)
    }
})

// Increment flower counter
dbRouter.put('/doc/flowers/:flowernum', async (req, res) => {
    try {
        let response = await addFlowers(req.body.keyObj, parseInt(req.params.flowernum));
        res.status(response.$metadata.httpStatusCode).send(response)
    } catch (e) {
        res.status(e.$metadata.httpStatusCode).send(e.message)
    }
})

// update comment
dbRouter.put('/doc/comments/:username', async (req, res) => {
    try {
        let response = await addComment(req.body.keyObj, req.params.username, req.body.comment);
        res.status(response.$metadata.httpStatusCode).send(response)
    } catch (e) {
        res.status(e.$metadata.httpStatusCode).send(e.message)
    }
})

// deleting a selected attribute field from item in specified table
dbRouter.delete('/doc-attribute/:tablename/:keyName/:keyVal/:fieldName', async (req, res) => {
    let keyobj = {}
    keyobj[req.params.keyName] = req.params.keyVal
    try {
        let response = await deleteDocAttribute(req.params.tablename, keyobj, req.params.fieldName)
        res.status(response.$metadata.httpStatusCode).send(response)
    } catch (e) {
        res.status(e.$metadata.httpStatusCode).send(e.message)
    }

})

// query documents in Table = tableName by key and value
dbRouter.get('/docs/:tablename/:keyName/:keyVal', async (req, res) => {
    let filterObj
    if(req.query.filterValue && req.query.filterName) {
        filterObj = {}
        filterObj["fieldName"] = req.query.filterName
        filterObj["fieldValue"] = req.query.filterValue
    }
    try {
        let response = await queryDocs(
            req.params.tablename,
            req.params.keyName,
            req.params.keyVal,
            filterObj,
            req.query.limit
        )
        res.status(response.$metadata.httpStatusCode).send(response.Items)
    } catch (e) {
        res.status(e.$metadata.httpStatusCode).send(e.message)
    }
})

// get a single document by key and sortkey (if table has one)
dbRouter.get('/doc/:tablename/:keyName/:keyVal/:sortName?/:sortVal?', async (req, res) => {
    let keyobj = {}
    keyobj[req.params.keyName] = req.params.keyVal
    if(req.params.sortVal && req.params.sortName) {
        keyobj[req.params.sortName] = req.params.sortVal
    }
    try {
        let response = await getDoc(req.params.tablename, keyobj)
        res.status(response.$metadata.httpStatusCode).send(response.Item)
    } catch (e) {
        res.status(e.$metadata.httpStatusCode).send(e.message)
    }
})

export default dbRouter