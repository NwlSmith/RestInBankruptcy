import { PutCommand } from "@aws-sdk/lib-dynamodb";
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

export { putDoc }