import { DynamoDBClient } from "@aws-sdk/client-dynamodb"

const re = "us-east-2"

const dynaDB = new DynamoDBClient({region: re})

export { dynaDB }