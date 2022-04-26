import { MissingParamError } from "../helpers/missing-param-error";
import { LoginRouter } from "./login-router";

describe("Login Router", () => {
    it("Should return 400 if no email is provided", async () => {
        const loginRouterSUT = new LoginRouter();

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
        const loginRouterSUT = new LoginRouter();

        const httpRequest = {
            body: {
                email: "email@email.com",
            },
        };

        const httpResponse = await loginRouterSUT.route(httpRequest);

        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse.body).toEqual(new MissingParamError("password"));
    });
});
