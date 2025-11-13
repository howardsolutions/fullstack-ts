import { initTRPC } from "@trpc/server";
import { CreateTaskSchema, TaskListQuerySchema } from "busy-bee-schema";
import type { Context } from "./trpc-context.js";

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const taskRouter = router({
    getTasks: publicProcedure.input(TaskListQuerySchema).query(async ({ input, ctx }) => {
        const tasks = ctx.tasks;

        return tasks.getAllTasks({ completed: !!input.completed })
    }),
    createTask: publicProcedure.input(CreateTaskSchema).mutation(async ({ input, ctx }) => {
        const tasks = ctx.tasks;

        return tasks.createTask(input)
    })
});

// Create the app router
export const appRouter = router({
    task: taskRouter,
});

// Export type definition of API for client usage
export type AppRouter = typeof appRouter;