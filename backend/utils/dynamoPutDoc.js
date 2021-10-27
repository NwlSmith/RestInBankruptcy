import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { dynaDocClient } from "../utils/dynamoDocClient.js"


const putDoc = async (tableName, doc) => {
    const params = {
        TableName: tableName,
        Item: doc,
      };
    try {
        const data = await dynaDocClient.send(new PutCommand(params));
        console.log("Success - item added or updated", data);
        return data;
    } catch (err) {
        console.log("Error", err);
    }
};

export default putDoc