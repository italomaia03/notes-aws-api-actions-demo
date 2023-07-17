"use strict";

const init = require("./steps/init");
const { authenticatedUser } = require("./steps/given");
const {
    invokeCreateNote,
    invokeUpdateNote,
    invokeDeleteNote,
    invokeGetNote,
    invokeGetNotes,
} = require("./steps/when");
let idToken;

describe("Given an authenticated user", () => {
    beforeAll(async () => {
        await init();
        const user = await authenticatedUser();
        idToken = user.AuthenticationResult.IdToken;
    });

    it("Should create a new note", async () => {
        const note = {
            id: "1000",
            title: "My test note",
            body: "Test note body",
        };

        const result = await invokeCreateNote({ idToken, note });

        expect(result.statusCode).toEqual(201);
        expect(result.body).not.toBeNull();
    });

    it("Should update a given note", async () => {
        const noteId = "1000";

        const note = {
            title: "My test note",
            body: "Test note body updated",
        };

        const result = await invokeUpdateNote({ idToken, note, noteId });

        expect(result.statusCode).toEqual(200);
        expect(result.body).not.toBeNull();
    });

    it("Should get all notes", async () => {
        const result = await invokeGetNotes({ idToken });

        expect(result.statusCode).toEqual(200);
        expect(result.body).not.toBeNull();
    });

    it("Should get a given note", async () => {
        const noteId = "1000";

        const result = await invokeGetNote({ idToken, noteId });

        expect(result.statusCode).toEqual(200);
        expect(result.body).not.toBeNull();
    });

    it("Should delete a given note", async () => {
        const noteId = "1000";

        const result = await invokeDeleteNote({ idToken, noteId });

        expect(result.statusCode).toEqual(204);
    });
});
