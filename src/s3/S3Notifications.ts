import { S3Event, S3Handler } from 'aws-lambda'
import 'source-map-support/register'


// @ts-ignore
export const handler: S3Handler = async (event: S3Event) => {
    console.log('Sending S3 event', event);
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            message: 'Notification has been sent.'
        })
    }
};
