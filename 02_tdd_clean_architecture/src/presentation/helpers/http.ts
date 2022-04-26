import {
    InternalServerError,
    MissingParamError,
    UnauthorizedError,
} from "./errors";

export interface Response<T> {
    statusCode: number;
    body: T;
}

export interface Request {
    body: unknown;
}

export class HttpResponse {
    public static ok<T>(body: T): Response<T> {
        return {
            statusCode: 200,
            body,
        };
    }

    public static created<T>(body: T): Response<T> {
        return {
            statusCode: 201,
            body,
        };
    }

    public static badRequest(error: Error): Response<MissingParamError> {
        return {
            statusCode: 400,
            body: error,
        };
    }

    public static unauthorized(): Response<UnauthorizedError> {
        return {
            statusCode: 401,
            body: new UnauthorizedError(),
        };
    }

    public static serverError(): Response<UnauthorizedError> {
        return {
            statusCode: 500,
            body: new InternalServerError(),
        };
    }
}
