import {
    InternalServerError,
    MissingParamError,
    UnauthorizedError,
} from "./errors";

export interface Response {
    statusCode: number;
    body: unknown;
}

export interface Request {
    body: unknown;
}

export class HttpResponse {
    public static created(body: unknown): Response {
        return {
            statusCode: 201,
            body,
        };
    }

    public static badRequest(paramName: string): Response {
        return {
            statusCode: 400,
            body: new MissingParamError(paramName),
        };
    }

    public static unauthorized(): Response {
        return {
            statusCode: 401,
            body: new UnauthorizedError(),
        };
    }

    public static internalError(): Response {
        return {
            statusCode: 500,
            body: new InternalServerError(),
        };
    }
}
