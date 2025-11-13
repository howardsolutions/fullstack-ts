// file to provide the necessary context to all tRPC procedures

import type { inferAsyncReturnType } from "@trpc/server";
import { getDatabase } from "@/database.js";
import { TaskClient } from "@/client.js";

export async function createContext() {
    const database = await getDatabase();

    const tasks = new TaskClient(database);

    return { tasks };
};

export type Context = inferAsyncReturnType<typeof createContext>;