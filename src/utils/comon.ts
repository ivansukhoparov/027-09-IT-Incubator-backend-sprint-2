import dotenv from "dotenv";

dotenv.config();

let counter = 0

export const mongoUri = process.env.MONGO_URL! //|| "mongodb://0.0.0.0:27017"

export const port: number = 5001;

export const HTTP_STATUSES = {
    OK_200: 200,
    CREATED_201: 201,
    NO_CONTENT_204: 204,

    BAD_REQUEST_400: 400,
    NOT_FOUND_404: 404,
    UNAUTHORIZED_401: 401
}
