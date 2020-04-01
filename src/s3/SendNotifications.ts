import { S3Event, S3Handler } from 'aws-lambda'
import 'source-map-support/register'
import * as AWS from "aws-sdk";

const docClient = new AWS.DynamoDB.DocumentClient();

const table = process.env.CONNECTIONS_TABLE;
const stage = process.env.STAGE;
const apiId = process.env.API_ID;
const region = process.env.REGION;

const connectionParams = {
  apiVersion: '2018-11-29',
  endpoint: `${apiId}.execute-api.${region}.amazonaws.com/${stage}`
};

const apiGateway = new AWS.ApiGatewayManagementApi(connectionParams);

// @ts-ignore
const handler: S3Handler = async (event: S3Event) => {
    for (const record of event.Records) {
        const key = record.s3.object.key;
        console.log('Processing S3 Item with Key: ', key);

        const connections = await docClient.scan({
            TableName: table,
        }).promise();

        const payload = {
            imageId: key
        };

        for (const connection of connections.Items) {
            const connectionId = connection.id
            await sendMessageToClient(connectionId, payload);
        }
    }

    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            message: 'Notification has been sent.'
        })
    };


    async function sendMessageToClient(connectionId, payload) {
        try {
            console.log('Sending message to: ', connectionId);

            await apiGateway.postToConnection({
                ConnectionId: connectionId,
                Data: JSON.stringify(payload)
            }).promise();


        } catch (e) {
            console.log('Failed sending message to: ', JSON.stringify(e));

            if (e.statusCode == 410) {
                console.log('Stale connection: ', connectionId)

                await docClient.delete({
                    TableName: table,
                    Key: {
                        id: connectionId
                    }
                }).promise();
            }

        }

    }
};
