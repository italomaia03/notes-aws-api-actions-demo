"use strict";

const DynamoDB = require("aws-sdk/clients/dynamodb");
const documentClient = new DynamoDB.DocumentClient({
    region: `us-east-1`,
    maxRetries: 3,
    httpOptions: {
        timeout: 5000,
    },
});
const NOTES_TABLE_NAME = process.env.NOTES_TABLE_NAME;

const send = (statusCode, data) => {
    return {
        statusCode,
        body: JSON.stringify(data),
    };
};

module.exports.createNote = async (event, context, cb) => {
    context.callbackWaitForEmptyEventLoop = false;
    const data = JSON.parse(event.body);
    try {
        const params = {
            TableName: NOTES_TABLE_NAME,
            Item: {
                notesId: data.id,
                title: data.title,
                body: data.body,
            },
            ConditionExpression: `attribute_not_exists(notesId)`,
        };
        await documentClient.put(params).promise();
        cb(null, send(201, data));
    } catch (error) {
        cb(null, send(500, error.message));
    }
};

module.exports.updateNote = async (event, context, cb) => {
    context.callbackWaitForEmptyEventLoop = false;
    const notesId = event.pathParameters.id;
    const data = JSON.parse(event.body);
    try {
        const params = {
            TableName: NOTES_TABLE_NAME,
            Key: {
                notesId,
            },
            UpdateExpression: "set #title = :title, #body = :body",
            ExpressionAttributeNames: {
                "#title": "title",
                "#body": "body",
            },
            ExpressionAttributeValues: {
                ":title": data.title,
                ":body": data.body,
            },
            ConditionExpression: `attribute_exists(notesId)`,
        };
        await documentClient.update(params).promise();
        cb(null, send(200, data));
    } catch (error) {
        cb(null, send(500, error.message));
    }
};

module.exports.deleteNote = async (event, context, cb) => {
    context.callbackWaitForEmptyEventLoop = false;

    const notesId = event.pathParameters.id;

    try {
        const params = {
            TableName: NOTES_TABLE_NAME,
            Key: {
                notesId,
            },
            ConditionExpression: `attribute_exists(notesId)`,
        };

        await documentClient.delete(params).promise();

        cb(null, send(204, null));
    } catch (error) {
        cb(null, send(500, error.message));
    }
};

module.exports.getNotes = async (_event, context, cb) => {
    context.callbackWaitForEmptyEventLoop = false;

    try {
        const params = {
            TableName: NOTES_TABLE_NAME,
        };

        const notes = await documentClient.scan(params).promise();

        cb(null, send(200, notes));
    } catch (error) {
        cb(null, send(500, error.message));
    }
};
module.exports.getNote = async (event) => {
    context.callbackWaitForEmptyEventLoop = false;
    const notesId = event.pathParameters.id;

    try {
        const params = {
            TableName: NOTES_TABLE_NAME,
            Key: {
                notesId,
            },
        };

        const note = await documentClient.scan(params).promise();

        cb(null, send(200, note));
    } catch (error) {
        cb(null, send(500, error.message));
    }
};
