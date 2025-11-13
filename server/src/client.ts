// Abstract the same database query for both the REST api server and TRPC server could consume

import { TaskListSchema } from "busy-bee-schema";
import { Database } from "sqlite";

export class TaskClient {

    constructor(private database: Database) { };


    async getAllTasks(completed: boolean) {
        const incompleteTasks = await this.database.prepare('SELECT * FROM tasks whERE completed = 0');
        const completedTasks = await this.database.prepare('SELECT * FROM tasks WHERE completed = 1');

        const tasks = completed ? completedTasks : incompleteTasks;

        const rows = TaskListSchema.parse(await tasks.all());

        return rows;
    }
}