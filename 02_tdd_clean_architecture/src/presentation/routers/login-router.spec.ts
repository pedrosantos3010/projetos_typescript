import {
    InternalServerError,
    MissingParamError,
    UnauthorizedError,
} from "../helpers/errors";
import { AccountRequestDTO, LoginRouter } from "./login-router";

export class AuthUseCaseSpy {
    public email?: string;
    public password?: string;
    public accessToken?: string;

    public auth(email: string, password: string): string | undefined {
        this.email = email;
        this.password = password;

        return this.accessToken;
    }
}

const makeLoginRouterSUT = (): {
    loginRouterSUT: LoginRouter;
    authUseCaseSpy: AuthUseCaseSpy;
} => {
    const authUseCaseSpy = new AuthUseCaseSpy();
    authUseCaseSpy.accessToken = "valid_token";
    const loginRouterSUT = new LoginRouter(authUseCaseSpy);
    return { loginRouterSUT, authUseCaseSpy };
};

const makeHttpRequest = (
    accountRequestDTO: AccountRequestDTO
): { body: AccountRequestDTO } => {
    return { body: accountRequestDTO };
};

describe("Login Router", () => {
    it("Should return 400 if no email is provided", async () => {
        const { loginRouterSUT } = makeLoginRouterSUT();

        const httpRequest = makeHttpRequest({ password: "any_password" });
        const httpResponse = await loginRouterSUT.route(httpRequest);

        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError("email"));
    });

    it("Should return 400 if no password is provided", async () => {
        const { loginRouterSUT } = makeLoginRouterSUT();

        const httpRequest = makeHttpRequest({ email: "any_email" });
        const httpResponse = await loginRouterSUT.route(httpRequest);

        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError("password"));
    });

    it("Should call AuthUseCase with correct params", async () => {
        const { loginRouterSUT, authUseCaseSpy } = makeLoginRouterSUT();

        const httpRequest = makeHttpRequest({
            email: "any_email",
            password: "any_password",
        });

        await loginRouterSUT.route(httpRequest);

        expect(authUseCaseSpy.email).toEqual(httpRequest.body.email);
        expect(authUseCaseSpy.password).toEqual(httpRequest.body.password);
    });

    it("Should return 401 when invalid credentials are provided", async () => {
        const { loginRouterSUT, authUseCaseSpy } = makeLoginRouterSUT();
        authUseCaseSpy.accessToken = undefined;

        const httpRequest = makeHttpRequest({
            email: "invalid_email@email.com",
            password: "invalid_password",
        });
        const httpResponse = await loginRouterSUT.route(httpRequest);

        expect(httpResponse.statusCode).toBe(401);
        expect(httpResponse.body).toEqual(new UnauthorizedError());
    });

    it("Should return 200 when valid credentials are provided", async () => {
        const { loginRouterSUT, authUseCaseSpy } = makeLoginRouterSUT();

        const httpRequest = makeHttpRequest({
            email: "any_email@email.com",
            password: "any_password",
        });
        const httpResponse = await loginRouterSUT.route(httpRequest);

        expect(httpResponse.statusCode).toBe(200);

        const returnedAccessToken =
            "accessToken" in httpResponse.body
                ? httpResponse.body.accessToken
                : null;
        expect(returnedAccessToken).toBe(authUseCaseSpy.accessToken);
    });

    it("Should return 500 if AuthUseCase throws", async () => {
        class AuthUseCaseWithError extends AuthUseCaseSpy {
            public override auth(): string {
                throw new Error();
            }
        }

        const httpRequest = makeHttpRequest({
            email: "any_email@email.com",
            password: "any_password",
        });

        const authUseCaseWithErrorSpy = new AuthUseCaseWithError();
        const loginRouterSUT = new LoginRouter(authUseCaseWithErrorSpy);
        const httpResponse = await loginRouterSUT.route(httpRequest);

        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse.body).toEqual(new InternalServerError());
    });
});
