"use strict";

const makeHttpRequest = async (path, method, options) => {
    const { idToken, note, noteId } = options;
    const root = process.env.TEST_ROOT;
    const url = noteId ? `${root}/${path}/${noteId}` : `${root}/${path}`;

    try {
        const res = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
                Authorization: idToken,
            },
            body: JSON.stringify(note),
        });

        let result;

        if (res.body) {
            result = await res.json();
        }

        return {
            statusCode: res.status,
            body: result,
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: null,
        };
    }
};

const invokeCreateNote = async (options) => {
    return await makeHttpRequest("notes", "POST", options);
};

const invokeUpdateNote = async (options) => {
    return await makeHttpRequest("notes", "PUT", options);
};

const invokeGetNotes = async (options) => {
    return await makeHttpRequest("notes", "GET", options);
};

const invokeGetNote = async (options) => {
    return await makeHttpRequest("notes", "GET", options);
};

const invokeDeleteNote = async (options) => {
    return await makeHttpRequest("notes", "DELETE", options);
};
module.exports = {
    invokeCreateNote,
    invokeUpdateNote,
    invokeDeleteNote,
    invokeGetNote,
    invokeGetNotes,
};
