import { HttpResponse, Request, Response } from "../helpers/http";
import { Router } from "./router";

interface AccountRequestDTO {
    email?: string;
    password?: string;
}

export class LoginRouter implements Router {
    public async route(request: Request): Promise<Response> {
        const { email, password } = <AccountRequestDTO>request.body;
        if (!email) {
            return HttpResponse.badRequest("email");
        }

        if (!password) {
            return HttpResponse.badRequest("password");
        }

        return HttpResponse.created({});
    }
}
