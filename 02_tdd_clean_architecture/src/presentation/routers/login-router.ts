import { HttpResponse, Request, Response } from "../helpers/http";
import { AuthUseCaseSpy } from "./login-router.spec";
import { Router } from "./router";

interface AccountRequestDTO {
    email?: string;
    password?: string;
}

export class LoginRouter implements Router {
    public constructor(private _authUseCase: AuthUseCaseSpy) {}
    public async route(request: Request): Promise<Response> {
        const { email, password } = <AccountRequestDTO>request.body;
        if (!email) {
            return HttpResponse.badRequest("email");
        }

        if (!password) {
            return HttpResponse.badRequest("password");
        }

        this._authUseCase.auth(email, password);

        return HttpResponse.created({});
    }
}
