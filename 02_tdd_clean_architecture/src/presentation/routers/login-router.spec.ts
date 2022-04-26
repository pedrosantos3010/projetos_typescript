import { MissingParamError, UnauthorizedError } from "../helpers/errors";
import { LoginRouter } from "./login-router";

export class AuthUseCaseSpy {
    private _email = "";
    private _password = "";

    public get email(): string {
        return this._email;
    }

    public get password(): string {
        return this._password;
    }

    public auth(email: string, password: string): void {
        this._email = email;
        this._password = password;
    }
}

const makeLoginRouterSUT = (): {
    loginRouterSUT: LoginRouter;
    authUseCaseSpy: AuthUseCaseSpy;
} => {
    const authUseCase = new AuthUseCaseSpy();
    const loginRouterSUT = new LoginRouter(authUseCase);
    return { loginRouterSUT, authUseCaseSpy: authUseCase };
};

describe("Login Router", () => {
    it("Should return 400 if no email is provided", async () => {
        const { loginRouterSUT } = makeLoginRouterSUT();

        const httpRequest = {
            body: {
                password: "any_password",
            },
        };

        const httpResponse = await loginRouterSUT.route(httpRequest);

        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError("email"));
    });

    it("Should return 400 if no password is provided", async () => {
        const { loginRouterSUT } = makeLoginRouterSUT();

        const httpRequest = {
            body: {
                email: "any_email@email.com",
            },
        };

        const httpResponse = await loginRouterSUT.route(httpRequest);

        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError("password"));
    });

    it("Should call AuthUseCase with correct params", async () => {
        const { loginRouterSUT, authUseCaseSpy } = makeLoginRouterSUT();

        const httpRequest = {
            body: {
                email: "any_email@email.com",
                password: "any_password",
            },
        };

        await loginRouterSUT.route(httpRequest);

        expect(authUseCaseSpy.email).toEqual(httpRequest.body.email);
        expect(authUseCaseSpy.password).toEqual(httpRequest.body.password);
    });

    it("Should return 401 when invalid credentials are provided", async () => {
        const { loginRouterSUT, authUseCaseSpy } = makeLoginRouterSUT();

        const httpRequest = {
            body: {
                email: "invalid_email@email.com",
                password: "invalid_password",
            },
        };

        const httpResponse = await loginRouterSUT.route(httpRequest);

        expect(httpResponse.statusCode).toBe(401);
        expect(httpResponse.body).toEqual(new UnauthorizedError());
    });
});
