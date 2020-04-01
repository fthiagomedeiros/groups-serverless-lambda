import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda';
import 'source-map-support/register';
import * as AWS from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient();

const table = process.env.CONNECTIONS_TABLE;

export const handler:APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const connectionId = event.requestContext.connectionId;
    const timestamp = new Date().toISOString();

    console.log('Connection established. Id: ', connectionId);

    const item = {
        id: connectionId,
        timestamp
    };

    await docClient.put({
        TableName: table,
        Item: item
    }).promise();

    return {
        statusCode: 200,
        body: ''
    };
};
