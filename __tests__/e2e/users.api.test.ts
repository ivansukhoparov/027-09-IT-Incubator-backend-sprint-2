import request from "supertest"
import {app} from "../../src/settings";
import {HTTP_STATUSES} from "../../src/utils/comon";

const routerName = "/users/";

class createUserData {

    static valid = {
        data: {
            login: "login",
            email: "qwe123@gmail.com",
            password: "qwerty"
        },
        response:{     pagesCount: 0,
            page: 1,
            pageSize: 10,
            totalCount: 0,
            items: []}
    };

    static overLength = {
        data: {
            login: "login_over_10",
            email: "qwe123@gmail.com",
            password: "password_over_20_characters"
        },
        errors: this._errorsResponse(["login", "password"])
    };

    static lessRequireLength = {
        data: {
            login: "Lo",
            email: "qwe123@gmail.com",
            password: "pas"
        },
        errors: this._errorsResponse(["login", "password"])
    };

    static invalidEmail = {
        data: {
            login: "login",
            email: "qwe",
            password: "qwerty"
        },
        errors: this._errorsResponse(["email"])
    };

    static empty = {
        data: {
            login: "",
            email: "",
            password: ""
        },
        errors: this._errorsResponse(["login", "email", "password"])
    };

    static onlySpaces = {
        data: {
            login: "     ",
            email: "     ",
            password: "       "
        },
        errors: this._errorsResponse(["login", "email", "password"])
    };

    static _errorsResponse(fields: string[]) {
        const response: { errorsMessages: Object[] } = {errorsMessages: []};
        fields.forEach(f => {
            response.errorsMessages.push({message: "Invalid value", field: f})
        })
        return response
    }

}

class ViewModelResponse{
    static emptyBody = {
        pagesCount: 0,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        items: []
    }

}



describe(routerName, () => {
    beforeAll(async () => {
        await request(app).delete("/testing/all-data");
    })

    it("- should return empty model view after delete all", async () => {
        await request(app).get(routerName)
            .expect(HTTP_STATUSES.OK_200, ViewModelResponse.emptyBody);
    })

    it(" - POST doesn't create new user with invalid authorization", async () => {
        await request(app).post(routerName)
            .auth("Odmin", "qwerty")
            .send(createUserData.valid.data).expect(HTTP_STATUSES.UNAUTHORIZED_401);
    })

    it(" - POST doesn't create new user with empty data", async () => {
        await request(app).post(routerName)
            .auth("admin", "qwerty")
            .send(createUserData.empty.data)
            .expect(HTTP_STATUSES.BAD_REQUEST_400, createUserData.empty.errors);
    })
    it(" - POST doesn't create new user with spaces", async () => {
        await request(app).post(routerName).auth("admin", "qwerty")
            .send(createUserData.onlySpaces.data)
            .expect(HTTP_STATUSES.BAD_REQUEST_400, createUserData.onlySpaces.errors);
    })
    it(" - POST doesn't create new user with over length data", async () => {
        await request(app).post(routerName)
            .auth("admin", "qwerty")
            .send(createUserData.overLength.data)
            .expect(HTTP_STATUSES.BAD_REQUEST_400, createUserData.overLength.errors);
    })
    it(" - POST doesn't create new user with less then required length data", async () => {
        await request(app).post(routerName)
            .auth("admin", "qwerty")
            .send(createUserData.lessRequireLength.data)
            .expect(HTTP_STATUSES.BAD_REQUEST_400, createUserData.lessRequireLength.errors);
    })
    it(" - POST doesn't create new user with invalid email", async () => {
        await request(app).post(routerName).auth("admin", "qwerty")
            .send(createUserData.invalidEmail.data)
            .expect(HTTP_STATUSES.BAD_REQUEST_400, createUserData.invalidEmail.errors);
    })
    it(" - POST should create user with valid data and return created user", async () => {
        await request(app).post(routerName).auth("admin", "qwerty")
            .send(createUserData.valid.data)
            .expect(HTTP_STATUSES.OK_200);
    })

    it(" - GET should return all user ", async () => {
        await request(app).get(routerName)
            .expect(HTTP_STATUSES.OK_200);
    })


})


