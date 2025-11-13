// This file is to integrate tRPC with Express

import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { Router } from "express";
import { createContext } from "./trpc-context.js";
import { appRouter } from "./trpc.js";

export function createTRPCRouter() {
    const router = Router();

    router.use("/trpc", createExpressMiddleware({ router: appRouter, createContext }))

    return router;
}