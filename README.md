# Serverless Framework project

This project creates lambda functions using the [serverless](https://serverless.com/) framework.
All the AWS infrastructure will be provisioned by the framework as a CloudFormation stack

## Getting setup

**1. Install serverless framework**

```shell
npm install -g serverless
```

**2. Set up the credentials for your cloud provider**

```shell
npm config credentials --provider aws --key your_key --secret your_secret_key --profile profile_name
  ```

**3. Deploying on AWS**

```shell
sls deploy -v
```

The AWS infrastructure will be created by CloudFormation service

**4. Running the client**

React client is provided to interact with the serverless. After the serverless deployed, access the folder [client](https://github.com/fthiagomedeiros/groups-serverless-lambda/tree/master/client) in project root to set up client.

```shell
npm install
```

After all dependencies downloaded, set the `ApiGatewayId` in the folder [config.ts](https://github.com/fthiagomedeiros/groups-serverless-lambda/blob/master/client/src/config.ts) and run the command below.

```shell
npm start
```
