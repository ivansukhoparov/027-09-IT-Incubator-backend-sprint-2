import request = require("supertest");
import {app} from "../../src/settings";
import {ErrorsMessageType, ErrorType} from "../../src/types/common";
import {UsersRepository} from "../../src/repositories/users-repository";
const router = "/auth"
const routerRegistration = "/auth/registration"
const routerResend = "/auth/registration"
const routerConfirmation = "/auth/registration"
const errorMessages = (...fields: any) => {
    const errors: ErrorType = {errorsMessages: []}
    fields.forEach((field: any) => {
        const errorsMessage: ErrorsMessageType = {
            message: expect.any(String),
            field: field.toString()
        };
        errors.errorsMessages.push(errorsMessage);
    })
    return errors;
}

const testDataUsers = {
    valid_1: {
        request: {
            "login": "vaniko",
            "password": "qweasd",
            "email": "rbcdaaa@gmail.com"
        },
        response: {},
        responseCode: 204,
        confirmationCode_1: {code:""},
        confirmationCode_2:{code:""},
        isConfirmed:false,
    },
    valid_2: {
        request: {
            "login": "vaniko2",
            "password": "qweasdw",
            "email": "79117917524@yandex.ru"
        },
        response: {},
        responseCode: 204,
        confirmationCode_1:{code:""},
        confirmationCode_2:{code:""},
        isConfirmed:false,
    },
    emptyFields: {
        request: {
            "login": "",
            "password": "",
            "email": ""
        },
        response: errorMessages("login", "email","password"),
        responseCode: 400
    },
    emptyRequest: {
        request: {},
        response: errorMessages("login", "email","password"),
        responseCode: 400
    },
    longFields: {
        request: {
            "login": "123456789011",
            "password": "123456789012345678901",
            "email": "rbcdaaa@gmail.com"
        },
        response: errorMessages("login", "password"),
        responseCode: 400
    },
    shortFields: {
        request: {
            "login": "a1",
            "password": "qwerq",
            "email": "rbcdaaa@gmail.com"
        },
        response: errorMessages("login", "password"),
        responseCode: 400
    },
    notEmailField: {
        request: {
            "login": "vaniko",
            "password": "qweasd",
            "email": "www.fra.sdd"
        },
        response: errorMessages( "email"),
        responseCode: 400
    },
    alreadyExistLogin: {
        request: {
            "login": "vaniko",
            "password": "qweasd",
            "email": "79117917524@yandex.ru"
        },
        response: errorMessages("login"),
        responseCode: 400
    },
    alreadyExistEmail: {
        request: {
            "login": "vaniko1",
            "password": "qweasd",
            "email": "rbcdaaa@gmail.com"
        },
        response: errorMessages("email"),
        responseCode: 400
    },
}


describe(router, () => {
    beforeAll(async () => {
        // Delete add data before tests
        await request(app).delete("/testing/all-data");
    });
it (" - user registration with empty request should return 400 and errors messages", async () =>{
    const res = await request(app).
    post(routerRegistration).
    send(testDataUsers.emptyRequest.request).
    expect(testDataUsers.emptyRequest.responseCode);

    expect(res.body).toEqual(testDataUsers.emptyRequest.response);
})
    it (" - user registration with empty fields should return 400 and errors messages", async () =>{
        const res = await request(app).
        post(routerRegistration).
        send(testDataUsers.emptyFields.request).
        expect(testDataUsers.emptyFields.responseCode);

        expect(res.body).toEqual(testDataUsers.emptyFields.response);
    })

    it (" - user registration with too long login and email should return 400 and errors messages", async () =>{
        const res = await request(app).
        post(routerRegistration).
        send(testDataUsers.longFields.request).
        expect(testDataUsers.longFields.responseCode);

        expect(res.body).toEqual(testDataUsers.longFields.response);
    })

    it (" - user registration with too short login and email  data should return 400 and errors messages", async () =>{
        const res = await request(app).
        post(routerRegistration).
        send(testDataUsers.shortFields.request).
        expect(testDataUsers.shortFields.responseCode);

        expect(res.body).toEqual(testDataUsers.shortFields.response);
    })

    it (" - user registration with invalid email  data should return 400 and errors messages", async () =>{
        const res = await request(app).
        post(routerRegistration).
        send(testDataUsers.notEmailField.request).
        expect(testDataUsers.notEmailField.responseCode);

        expect(res.body).toEqual(testDataUsers.notEmailField.response);
    })

    it (" + user registration with valid request should return 204 and code to email", async () =>{
        const res = await request(app).
        post(routerRegistration).
        send(testDataUsers.valid_1.request).
        expect(testDataUsers.valid_1.responseCode);

        expect(res.body).toEqual(testDataUsers.valid_1.response);
        const user_1 = await UsersRepository.getUserByLoginOrEmail(testDataUsers.valid_1.request.login)
        expect(user_1).not.toBeNull()
        testDataUsers.valid_1.confirmationCode_1 = {code: user_1!.emailConfirmation.confirmationCode};
        expect(user_1!.emailConfirmation.isConfirmed).toBe(false);
        console.log(testDataUsers.valid_1.confirmationCode_1)
    })

    it (" + user registration second user with valid request should return 204 and code to email", async () =>{
        const res = await request(app).
        post(routerRegistration).
        send(testDataUsers.valid_2.request).
        expect(testDataUsers.valid_2.responseCode);

        expect(res.body).toEqual(testDataUsers.valid_2.response);
        const user_2 = await UsersRepository.getUserByLoginOrEmail(testDataUsers.valid_2.request.login)
        expect(user_2).not.toBeNull()
        testDataUsers.valid_2.confirmationCode_1 = {code: user_2!.emailConfirmation.confirmationCode};
        expect(user_2!.emailConfirmation.isConfirmed).toBe(false);
        console.log(testDataUsers.valid_2.confirmationCode_1)
    })

    it (" - user registration with existing login should return 400 and errors messages", async () =>{
        const res = await request(app).
        post(routerRegistration).
        send(testDataUsers.alreadyExistLogin.request).
        expect(testDataUsers.alreadyExistLogin.responseCode);

        expect(res.body).toEqual(testDataUsers.alreadyExistLogin.response);
    })

    it (" - user registration with existing email should return 400 and errors messages", async () =>{
        const res = await request(app).
        post(routerRegistration).
        send(testDataUsers.alreadyExistEmail.request).
        expect(testDataUsers.alreadyExistEmail.responseCode);

        expect(res.body).toEqual(testDataUsers.alreadyExistEmail.response);
    })


})
