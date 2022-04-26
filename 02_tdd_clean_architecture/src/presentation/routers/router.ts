import { Request, Response } from "../helpers/http";

export interface Router {
    route(request: Request): Promise<Response>;
}
