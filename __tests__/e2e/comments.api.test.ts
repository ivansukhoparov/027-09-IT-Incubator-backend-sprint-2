import request = require("supertest");
import {app} from "../../src/settings";
import {CreateUserType} from "../../src/types/users/input";
import {CreatePostDto} from "../../src/types/posts/input";
import {UserOutputType} from "../../src/types/users/output";
import {PostOutputType} from "../../src/types/posts/output";
import {HTTP_STATUSES} from "../../src/utils/comon";
import {CreateBlogDto} from "../../src/types/blogs/input";
import {BlogOutputType} from "../../src/types/blogs/output";

interface ITestUserType extends UserOutputType {
    accessToken?: string
}

const routerName = "/comments/"

const createTestUsers: Array<CreateUserType> = [
    {
        login: "user1",
        email: "qwe123@gmail.com",
        password: "qwerty"
    },
    {
        login: "user2",
        email: "qwe123@gmail.com",
        password: "qwerty1"
    }
];
const createTestBlogs: Array<CreateBlogDto> = [
    {
        "name": "Blog 1",
        "description": "blog about nothing",
        "websiteUrl": "http://www.test.com"
    }
];
const createTestPosts: Array<CreatePostDto> = [
    {
        title: "Post 1",
        shortDescription: "a very short description",
        content: "some content",
        blogId: "testBlogID"
    }
];

const testUsers: Array<ITestUserType> = [];
const testPosts: Array<PostOutputType> = [];
const testBlogs: Array<BlogOutputType> = [];

const testCommentsData = {
    validComment: {
        request: {
            content: "this string is grater then twenty and less then three hundreds letters"
        },
        response: {
            id: expect.any(String),
            content: 'this string is grater then twenty and less then three hundreds letters',
            commentatorInfo: {
                userId: 'userId',
                userLogin: 'user1'
            },
            createdAt: expect.any(String)
        }
    }
}
describe(routerName, () => {
    beforeAll(async () => {
        // Delete add data before tests
        await request(app).delete("/testing/all-data");
        // create users for tests
        for (let i = 0; i < createTestUsers.length; i++) {
            // Create user
            const createdUser = await request(app).post("/users/")
                .auth("admin", "qwerty")
                .send(createTestUsers[i])

            // Authenticate user
            const userToken = await request(app).post("/auth/login")
                .send({
                    loginOrEmail: createTestUsers[i].login,
                    password: createTestUsers[i].password
                })
            testUsers[i] = {...createdUser.body, ...userToken.body};
        }
        // Create new blog for tests
        for (let i = 0; i < createTestBlogs.length; i++) {
            const res = await request(app).post("/blogs/")
                .auth("admin", "qwerty")
                .send(createTestBlogs[i])
                .expect(HTTP_STATUSES.CREATED_201); // Check blog is created
            testBlogs[i] = res.body;
        }
        // Create new post for tests
        for (let i = 0; i < createTestPosts.length; i++) {
            const res = await request(app).post(`/posts/`)
                .auth("admin", "qwerty")
                .send({...createTestPosts[i], blogId: testBlogs[0].id})
                .expect(HTTP_STATUSES.CREATED_201); // Check post is created
            testPosts[i] = res.body;
        }

    });

    it("created arrays with test data should be contains data", () => {
        expect(testUsers[0].login).toBe(createTestUsers[0].login);
        expect(testUsers[1].login).toBe(createTestUsers[1].login);
        expect(testBlogs[0].name).toBe(createTestBlogs[0].name);
        expect(testPosts[0].title).toBe(createTestPosts[0].title);
    });

    it(" - create comment without authorization should return 401", async () => {
        await request(app).post(`/posts/${testPosts[0].id}/comments`).send(testCommentsData.validComment).expect(HTTP_STATUSES.UNAUTHORIZED_401);
    })

    it(" - create comment to post with invalid Id should return 404", async  () => {
        await request(app).post(`/posts/123456789/comments`)
            .set("Authorization", `Bearer ${testUsers[0].accessToken}`)
            .send(testCommentsData.validComment.request)
            .expect(HTTP_STATUSES.NOT_FOUND_404);
    })


    it("+ comment with valid data and post id should be created", async () => {
        const result = await request(app).post(`/posts/${testPosts[0].id}/comments`)
            .set("Authorization", `Bearer ${testUsers[0].accessToken}`)
            .send(testCommentsData.validComment.request)
            .expect(HTTP_STATUSES.CREATED_201);
        expect(result.body).toEqual({
            ...testCommentsData.validComment.response,
            commentatorInfo: {
                ...testCommentsData.validComment.response.commentatorInfo,
                userId: testUsers[0].id
            }
        })
    })

})




