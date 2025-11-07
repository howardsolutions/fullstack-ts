import { CreateTaskSchema, TaskSchema, UpdateTaskSchema } from 'busy-bee-schema';
import cors from 'cors';
import express, { Request, RequestHandler } from 'express';
import type { Database } from 'sqlite';
import { z, ZodSchema } from 'zod';
import { handleError } from './handle-error.js';

export async function createServer(database: Database) {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const incompleteTasks = await database.prepare('SELECT * FROM tasks whERE completed = 0');
  const completedTasks = await database.prepare('SELECT * FROM tasks WHERE completed = 1');
  const getTask = await database.prepare('SELECT * FROM tasks WHERE id = ?');
  const createTask = await database.prepare('INSERT INTO tasks (title, description) VALUES (?, ?)');
  const deleteTask = await database.prepare('DELETE FROM tasks WHERE id = ?');
  const updateTask = await database.prepare(
    `UPDATE tasks SET title = ?, description = ?, completed = ? WHERE id = ?`,
  );

  const validateParams = <T>(schema: ZodSchema<T>): RequestHandler<T> => (req, res, next) => {
    try {
      schema.parse(req.params);

      next();
    } catch (err) {
      return handleError(req, res, err)
    }
  }

  const validateBody = <T>(schema: ZodSchema<T>): RequestHandler<NonNullable<unknown>, unknown, T> => (req, res, next) => {
    try {
      schema.parse(req.body)

      next();
    } catch (err) {
      return handleError(req, res, err)
    }
  }

  type Query = Request['query'];

  const FilterTaskSchema = TaskSchema.pick({ completed: true }).partial()

  const validateQuery = <T>(schema: ZodSchema<T>): RequestHandler<NonNullable<unknown>, unknown, unknown, Query & T> => (req, res, next) => {
    try {
      schema.parse(req.query)

      next();
    } catch (err) {
      return handleError(req, res, err)
    }
  }

  app.get('/tasks', validateQuery(FilterTaskSchema), async (req, res) => {
    const { completed } = req.query;
    const query = completed ? completedTasks : incompleteTasks;

    try {
      const tasks = await query.all();
      return res.json(tasks);
    } catch (error) {
      return handleError(req, res, error);
    }
  });

  // Get a specific task
  app.get('/tasks/:id', validateParams(TaskSchema.pick({ id: true })), async (req, res) => {
    try {
      const { id } = req.params;
      const task = await getTask.get([id]);

      if (!task) return res.status(404).json({ message: 'Task not found' });

      return res.json(task);
    } catch (error) {
      return handleError(req, res, error);
    }
  });

  app.post('/tasks', validateBody(CreateTaskSchema), async (req, res) => {
    try {
      const task = CreateTaskSchema.parse(req.body);
      if (!task.title) return res.status(400).json({ message: 'Title is required' });

      await createTask.run([task.title, task.description]);
      return res.status(201).json({ message: 'Task created successfully!' });
    } catch (error) {
      return handleError(req, res, error);
    }
  });

  // Update a task
  app.put('/tasks/:id', async (req, res) => {
    try {
      const { id } = z.object({ id: z.coerce.number() }).parse(req.params);

      const previous = TaskSchema.parse(await getTask.get([id]));
      const updates = UpdateTaskSchema.parse(req.body);
      const task = { ...previous, ...updates };

      await updateTask.run([task.title, task.description, task.completed, id]);
      return res.status(200).json({ message: 'Task updated successfully' });
    } catch (error) {
      return handleError(req, res, error);
    }
  });

  // Delete a task
  app.delete('/tasks/:id', async (req, res) => {
    try {
      const { id } = req.params;
      await deleteTask.run([id]);
      return res.status(200).json({ message: 'Task deleted successfully' });
    } catch (error) {
      return handleError(req, res, error);
    }
  });

  return app;
}

// PUTTING THEM ALL TOGETHER 
// MIDDLEWARE FOR VALIDATE EVERYTHING FROM THE REQUEST (BODY, PARAMS, QUERY)

// import { type NextFunction, type Request, type Response } from 'express';
// import { type ZodSchema } from 'zod';
// import { handleError } from './handle-error.js';

// type ValidationOptions = { body?: ZodSchema; params?: ZodSchema; query?: ZodSchema };

/**
 * Creates a middleware to validate multiple parts of a request against Zod schemas
 * @param schemas Object containing optional Zod schemas for body, params, and query
 * @returns Express middleware that validates the specified parts of the request
 */
// export const validate = (schemas: ValidationOptions) => {
//   return (req: Request, res: Response, next: NextFunction) => {
//     try {
//       if (schemas.body) {
//         const validatedBody = schemas.body.parse(req.body);
//         req.body = validatedBody as Request['body'];
//       }

//       if (schemas.params) {
//         const validatedParams = schemas.params.parse(req.params);
//         req.params = validatedParams as Request['params'];
//       }

//       if (schemas.query) {
//         const validatedQuery = schemas.query.parse(req.query);
//         req.query = validatedQuery as Request['query'];
//       }

//       next();
//     } catch (error) {
//       return handleError(req, res, error);
//     }
//   };
// };