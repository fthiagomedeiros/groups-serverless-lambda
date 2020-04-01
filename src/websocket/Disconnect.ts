import {APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult} from 'aws-lambda';
import 'source-map-support/register';
import * as AWS from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient();

const table = process.env.CONNECTIONS_TABLE;

export const handler:APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const connectionId = event.requestContext.connectionId;

    console.log('Disconnection. Id: ', connectionId);

    const key = {
        id: connectionId
    };

    await docClient.delete({
        TableName: table,
        Key: key
    }).promise();

    return {
        statusCode: 200,
        body: ''
    };
};
