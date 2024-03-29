import { InvalidParamError, MissingParamError } from "../helpers/errors";
import { HttpResponse, Request, Response } from "../helpers/http";
import { AuthUseCaseSpy } from "./login-router.spec";
import { Router } from "./router";

export interface AccountRequestDTO {
    email?: string;
    password?: string;
}

interface AccountResponseDTO {
    accessToken: string;
}

export class LoginRouter implements Router {
    public constructor(
        private _authUseCase: AuthUseCaseSpy,
        private _emailValidator: EmailValidator
    ) {}

    public async route(
        request: Request
    ): Promise<Response<Error | AccountResponseDTO>> {
        try {
            const { email, password } = <AccountRequestDTO>request.body;
            if (!email) {
                return HttpResponse.badRequest(new MissingParamError("email"));
            }

            if (!this._emailValidator.isValid(email)) {
                return HttpResponse.badRequest(new InvalidParamError("email"));
            }

            if (!password) {
                return HttpResponse.badRequest(
                    new MissingParamError("password")
                );
            }

            const accessToken = this._authUseCase.auth(email, password);
            if (!accessToken) {
                return HttpResponse.unauthorized();
            }

            return HttpResponse.ok({ accessToken });
        } catch (e) {
            console.error(e);
            return HttpResponse.serverError();
        }
    }
}
