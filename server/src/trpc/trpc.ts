import { initTRPC } from "@trpc/server";
import type { Context } from "./trpc-context.js";
import { TaskListSchema } from "busy-bee-schema";

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const taskRouter = router({
    getTasks: publicProcedure.input(TaskListSchema).query(async ({ ctx, input }) => {
        const tasks = ctx.tasks;

        return tasks.getAllTasks(input.completed)
    })
});

// Create the app router
export const appRouter = router({
    task: taskRouter,
});

// Export type definition of API for client usage
export type AppRouter = typeof appRouter;