import {APIGatewayProxyHandler} from 'aws-lambda';
import 'source-map-support/register';
import * as AWS from 'aws-sdk'
import * as uuid from 'uuid'

const docClient = new AWS.DynamoDB.DocumentClient();

const table = process.env.TABLE;

export const handler: APIGatewayProxyHandler = async (event, _context) => {
    console.log('Creating a group');
    const itemId = uuid.v4();

    const parsedBody = JSON.parse(event.body);

    const newItem = {
        id: itemId,
        name: parsedBody.name,
        description: parsedBody.description
    };

    await docClient.put({
        TableName: table,
        Item: newItem
    }).promise();


    // TODO implement
    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            newItem
        })
    };

};
