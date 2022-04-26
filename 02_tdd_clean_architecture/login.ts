import express, { Request, Response } from "express";
import mongoose from "mongoose";

const accountModel = mongoose.model("Account");

const router = express.Router();

export default (): void => {
    const signUpRouter = new SignUpRouter();

    router.post("/signup", ExpressRouterAdapter.adapt(signUpRouter));
};

type ExpressAdaptedRoute = (req: Request, res: Response) => Promise<Response>;

class ExpressRouterAdapter {
    public static adapt(router: Router): ExpressAdaptedRoute {
        return async (req: Request, res: Response): Promise<Response> => {
            const httpRequest = {
                body: req.body,
            };

            const response = await router.route(httpRequest);

            return res.status(response.statusCode).json(response.body);
        };
    }
}

interface HttpRequest {
    body: unknown;
}

interface HttpResponse {
    statusCode: number;
    body: unknown;
}

interface Router {
    route(request: HttpRequest): Promise<HttpResponse>;
}

class SignUpRouter implements Router {
    public async route(request: HttpRequest): Promise<HttpResponse> {
        const { email, password, repeatPassword } = <SignUpRequest>request.body;

        try {
            const createAccountRepository = new MongoCreateAccountRepository();
            const user = await new SignUpUseCase(
                createAccountRepository
            ).signUp({
                email,
                password,
                repeatPassword,
            });
            return {
                statusCode: 201,
                body: user,
            };
        } catch (e) {
            return {
                statusCode: 400,
                body: {
                    error: "password must be equal to repeatPassword",
                },
            };
        }
    }
}

interface SignUpRequest {
    email: string;
    password: string;
    repeatPassword: string;
}

class SignUpUseCase {
    public constructor(
        private createAccountRepository: CreateAccountRepository
    ) {}

    public async signUp({
        email,
        password,
        repeatPassword,
    }: SignUpRequest): Promise<typeof user> {
        if (password !== repeatPassword) {
            throw new Error("password must be equal to repeatPassword");
        }

        const user = await this.createAccountRepository.create({
            email,
            password,
        });
        return user;
    }
}

export interface AccountData {
    email: string;
    password: string;
}

export interface CreateAccountRepository {
    create({ email, password }): Promise<
        mongoose.Document<unknown, unknown, unknown> & {
            _id: unknown;
        }
    >;
}

class MongoCreateAccountRepository implements CreateAccountRepository {
    public async create({
        email,
        password,
    }: SignUpRequest): Promise<typeof user> {
        const user = await accountModel.create({ email, password });
        return user;
    }
}
