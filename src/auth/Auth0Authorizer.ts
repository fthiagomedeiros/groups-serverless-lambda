import {
    APIGatewayTokenAuthorizerEvent,
    APIGatewayTokenAuthorizerHandler
} from 'aws-lambda'
import { verify } from 'jsonwebtoken'
import 'source-map-support/register'
import {APIGatewayAuthorizerResult} from "aws-lambda/trigger/api-gateway-authorizer";
import {JwtToken} from "./JwtToken";
import * as AWS from 'aws-sdk';

const secretId = process.env.AUTH_0_SECRET_ID;
const secretField = process.env.AUTH_0_SECRET_FIELD;

const client = new AWS.SecretsManager();

let cachedSecret: string;

// @ts-ignore
export const handler: APIGatewayTokenAuthorizerHandler = async (event: APIGatewayTokenAuthorizerEvent): Promise<APIGatewayAuthorizerResult> => {
    console.log('Token type: ', event.authorizationToken);

    try {
        const decodedToken = await verifyToken(event.authorizationToken);
        console.log("User authorized ", event);

        return {
            principalId: decodedToken.sub,
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

async function verifyToken(authHeader: string): Promise<JwtToken> {
    if (!authHeader)
        throw new Error('No authentication header');

    const token = authHeader.split(' ')[1];

    const secretObject: any = await getSecret();
    const secret = secretObject[secretField];
    return verify(token, secret) as JwtToken
}

async function getSecret() {
    if (cachedSecret) return cachedSecret;

    const data = await client.getSecretValue({
        SecretId: secretId
    }).promise();

    cachedSecret = data.SecretString;
    return JSON.parse(cachedSecret);
}
