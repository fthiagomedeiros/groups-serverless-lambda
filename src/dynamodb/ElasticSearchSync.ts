import {DynamoDBStreamEvent, DynamoDBStreamHandler,} from 'aws-lambda';
import 'source-map-support/register';
import * as AWS from 'aws-sdk'

// @ts-ignore
const docClient = new AWS.DynamoDB.DocumentClient();

// @ts-ignore
const table = process.env.IMAGES_TABLE;

// @ts-ignore
//This function will read DynamoDBStreams events
export const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent ) => {
    console.log('Processing events batch from DynamoDB ', JSON.stringify(event));

    for (const record of event.Records) {
        console.log('Processing record', JSON.stringify(record))
    }

    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({})
    };

};
