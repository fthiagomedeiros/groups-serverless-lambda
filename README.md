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
