import { MissingParamError } from "./missing-param-error";

export interface Response {
    statusCode: number;
    body: unknown;
}

export interface Request {
    body: unknown;
}

export class HttpResponse {
    public static badRequest(paramName: string): Response {
        return {
            statusCode: 400,
            body: new MissingParamError(paramName),
        };
    }

    public static internalError(): Response {
        return {
            statusCode: 500,
            body: { message: "internal server error." },
        };
    }

    public static created(body: unknown): Response {
        return {
            statusCode: 201,
            body,
        };
    }
}
