import {DynamoDBStreamEvent, DynamoDBStreamHandler,} from 'aws-lambda';
import 'source-map-support/register';
import * as elasticsearch from 'elasticsearch'
import * as httpAwsEs from 'http-aws-es'
import * as AWS from 'aws-sdk'

// @ts-ignore
const docClient = new AWS.DynamoDB.DocumentClient();

// es aka ElasticSearch
const esHost = process.env.ES_ENDPOINT;

const es = new elasticsearch.Client({
    hosts: [ esHost ],
    connectionClass: httpAwsEs
});

//This function will read DynamoDBStreams events
// @ts-ignore
export const handler: DynamoDBStreamHandler = async (event: DynamoDBStreamEvent ) => {
    console.log('Processing events batch from DynamoDB ', JSON.stringify(event));

    for (const record of event.Records) {
        console.log('Processing record', JSON.stringify(record));

        if (record.eventName !== 'INSERT') {
            continue;
        }

        const newItem = record.dynamodb.NewImage;

        const imageId = newItem.imageId.S;

        const body = {
            imageId: newItem.imageId.S,
            groupId: newItem.groupId.S,
            imageUrl: newItem.imageUrl.S,
            title: newItem.title.S,
            timestamp: newItem.timestamp.S
        };

        await es.index({
            index: 'images-index',
            type: 'images',
            id: imageId,
            body
        })

    }

};

/**
 * EVENT RECEIVED
 *
 {
    "Records": [
        {
            "eventID": "d023dc7bc57977eda9d090b",
            "eventName": "INSERT",
            "eventVersion": "1.1",
            "eventSource": "aws:dynamodb",
            "awsRegion": "us-east-1",
            "dynamodb": {
                "ApproximateCreationDateTime": 1585713576,
                "Keys": {
                    "groupId": {
                        "S": "5519ca91-3516-4693-bff5-342baa78b1dc"
                    },
                    "timestamp": {
                        "S": "2020-04-01T03:59:35.776Z"
                    }
                },
                "NewImage": {
                    "imageId": {
                        "S": "65eae798-1dea-4880-b39a-cc22c1d06dae"
                    },
                    "groupId": {
                        "S": "5519ca91-3516-4693-bff5-342baa78b1dc"
                    },
                    "imageUrl": {
                        "S": "https://bucket-images-dev.s3.amazonaws.com/65eae798-1dea-4880-b39a-cc22c1d06dae"
                    },
                    "title": {
                        "S": "New image"
                    },
                    "timestamp": {
                        "S": "2020-04-01T03:59:35.776Z"
                    }
                },
                "SequenceNumber": "489720000000001004",
                "SizeBytes": 303,
                "StreamViewType": "NEW_IMAGE"
            },
            "eventSourceARN": "arn:aws:dynamodb:region:aws_account:table/Images-dev/stream/2020-04-01T03:05:29.030"
        }
    ]
}
 */
