import {
    APIGatewayTokenAuthorizerEvent,
    APIGatewayTokenAuthorizerHandler
} from 'aws-lambda'
import 'source-map-support/register'
import {APIGatewayAuthorizerResult} from "aws-lambda/trigger/api-gateway-authorizer";


// @ts-ignore
export const handler: APIGatewayTokenAuthorizerHandler = async (event: APIGatewayTokenAuthorizerEvent): Promise<APIGatewayAuthorizerResult> => {
    console.log('Token type: ', event.authorizationToken);

    try {
        verifyToken(event.authorizationToken);
        console.log("User authorized ", event);

        return {
            principalId: 'user',
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Allow',
                        Resource: '*'
                    }
                ]
            }
        };
    } catch (e) {
        console.log('Unauthorized ', event);

        return {
            principalId: 'user',
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Deny',
                        Resource: '*'
                    }
                ]
            }
        };
    }


};

function verifyToken(authHeader: string) {
    if (!authHeader)
        throw new Error('No auth header');

    const token = authHeader.split(' ');

    if (token[1] !== '123') {
        throw new Error('Invalid token')
    }

    // Valid request
}
