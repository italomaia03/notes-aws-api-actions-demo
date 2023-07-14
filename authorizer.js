// class 48
const { CognitoJwtVerifier } = require("aws-jwt-verify");
const userPoolId = process.env.COGNITO_USERPOOL_ID;
const clientId = process.env.COGNITO_WEB_CLIENT_ID;

const jwtVerifier = CognitoJwtVerifier.create({
    userPoolId,
    tokenUse: "id",
    clientId,
});

const generatePolicy = (principalId, effect, resource) => {
    const authResponse = {};
    authResponse.principalId = principalId;

    if (effect && resource) {
        const policyDocument = {
            Version: "2012-10-17",
            Statement: [
                {
                    Effect: effect,
                    Resource: resource,
                    Action: "execute-api:Invoke",
                },
            ],
        };

        authResponse.policyDocument = policyDocument;
    }

    return authResponse;
};

const handler = async (event, context, cb) => {
    const token = event.authorizationToken;

    try {
        const payload = await jwtVerifier.verify(token);
        cb(null, generatePolicy("user", "Allow", event.methodArn));
    } catch (error) {
        cb("Error: Invalid Token");
    }
};
module.exports = { handler };
