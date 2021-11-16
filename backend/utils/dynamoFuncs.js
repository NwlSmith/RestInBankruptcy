import { PutCommand, GetCommand, UpdateCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { dynaDocClient } from "./dynamoDocClient.js"


const putDoc = async (tableName, doc) => {
    const params = {
        TableName: tableName,
        Item: doc,
      };
    try {
        const data = await dynaDocClient.send(new PutCommand(params));
        return data;
    } catch (err) {
        throw err;
    }
};

const getDoc = async (tableName, keyObj) => {
    let params = {
        TableName: tableName,
        Key: keyObj
    };
    try {
        const data = await dynaDocClient.send(new GetCommand(params));
        return data;
    } catch (err) {
        throw err;
    }
};

const updateDoc = async (tableName, keyObj, field, fieldValue) => {
    const params = {
        TableName: tableName,
        Key: keyObj,
        UpdateExpression: `set ${field} = :fieldVal`, // not secure but lazy
        ExpressionAttributeValues: {
            ":fieldVal": fieldValue
        },
        ReturnValues: "UPDATED_NEW"
      };
    try {
        const data = await dynaDocClient.send(new UpdateCommand(params));
        return data;
    } catch (err) {
        throw err;
    }
};

const addFlowers = async (keyObj, fieldValue) => {
    const params = {
        TableName: "GravestoneOfferings",
        Key: keyObj,
        UpdateExpression: `set flowers = flowers + :fieldVal`, // not secure but lazy
        ExpressionAttributeValues: {
            ":fieldVal": fieldValue
        },
        ReturnValues: "UPDATED_NEW"
      };
    try {
        const data = await dynaDocClient.send(new UpdateCommand(params));
        return data;
    } catch (err) {
        throw err;
    }
};

const addComment = async (keyObj, fieldName, fieldValue) => {
    const params = {
        TableName: "GravestoneOfferings",
        Key: keyObj,
        UpdateExpression: `set comments.#user = :fieldVal`, // not secure but lazy
        ExpressionAttributeNames: {
            "#user": fieldName
        },
        ExpressionAttributeValues: {
            ":fieldVal": fieldValue
        },
        ReturnValues: "UPDATED_NEW"
      };
    try {
        const data = await dynaDocClient.send(new UpdateCommand(params));
        return data;
    } catch (err) {
        throw err;
    }
};

const deleteDocAttribute = async (tableName, keyObj, field) => {
    const params = {
        TableName: tableName,
        Key: keyObj,
        UpdateExpression: `remove ${field}`, // not secure but lazy
        ReturnValues: "UPDATED_NEW"
      };
    try {
        const data = await dynaDocClient.send(new UpdateCommand(params));
        return data;
    } catch (err) {
        throw err;
    }
};

const queryDocs = async (tableName, pKeyName, pKey, filterObj, lim) => {
    let params = {
        TableName: tableName,
        KeyConditionExpression: `#keyName = :key`,
        FilterExpression: filterObj ? "#filterField = :filterVal" : undefined,
        Limit: lim,
        ExpressionAttributeNames: {
            "#keyName": pKeyName,
        },
        ExpressionAttributeValues: {
            ":key": pKey,
        }
    };
    if(filterObj) {
        params.ExpressionAttributeNames["#filterField"] = filterObj.fieldName,
        params.ExpressionAttributeValues[":filterVal"] = filterObj.fieldValue
    }
    try {
        const data = await dynaDocClient.send(new QueryCommand(params));
        return data;
    } catch (err) {
        throw err;
    }
};




export { putDoc, getDoc, updateDoc, addFlowers, addComment, deleteDocAttribute, queryDocs }