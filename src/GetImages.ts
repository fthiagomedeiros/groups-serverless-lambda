import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import * as AWS from 'aws-sdk'

const docClient = new AWS.DynamoDB.DocumentClient();

const  groupsTable = process.env.GROUPS_TABLE;
const imagesTable = process.env.IMAGES_TABLE;

export const handler: APIGatewayProxyHandler =
    async (event, _context) => {

      console.log('Caller event: ', event);
      const groupId = event.pathParameters.groupId;

      const isValidGroup = await groupExists(groupId);

      if (!isValidGroup) {
        return {
          statusCode: 404,
          headers: {
            'Access-Control-Allow-Origin': '*'
          },
          body: JSON.stringify({
            "error": "Group does not exist"
          })
        }
      }

      const images = await getImagesByGroup(groupId);

      return {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            "items": images
        })
      };


      async function groupExists(groupId: string) {

        const result = await docClient.get({
          TableName: groupsTable,
          Key: {
            id: groupId
          }
        }).promise();

        console.log('Get  group: ', result);
        return !!result.Item;
      }


      async function getImagesByGroup(groupId: string) {
          const result = await docClient.query({
              TableName: imagesTable,
              KeyConditionExpression: 'groupId = :groupId',
              ExpressionAttributeValues: {
                  ':groupId': groupId
              },
              ScanIndexForward: false
          }).promise();
          return result.Items;
      }

    };
