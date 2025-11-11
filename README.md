## Fullstack TypeScript

## Setup Instructions

This repo requires Node.js version 22 or higher. Clone the repo and install the dependencies:

```bash
git clone https://github.com/stevekinney/full-stack-typescript.git
cd full-stack-typescript
npm install
```

## Zod Exercises

To start the Zod exercise, `cd` into the `exercises/zod` directory and run the tests: `npm test zod-exercises.test`. Note: You'll need to remove the `todos` in the test when you begin the

## Todo API Application

To start the Todo application, both the client and server applications need to be started. VS Code users can use the provide `Start` task. Open the Command Palette > Run Task > Start. Alternatively, open two terminal tabs and run each project:

```bash
# Terminal 1: Client App
cd client
npm run dev

# Terminal 2: Server App
cd server
npm run dev

```

# NOTES

## Type Guard

A native TypeScript strategy for ensuring type safety and verifying the structure of objects at runtime, helping to validate that data matches expected type definitions.

## Zod

Zod provides an abstraction for validating object structures

Simplifying complex type checking by allowing developers to define schemas that can parse and validate data with minimal code.

Zod offers two parsing methods: 'parse' (which throws an error if validation fails)
and 'safeParse' (which returns an object with a success flag and potential error details without throwing an exception).

Zod allows optional type coercion, such as converting string representations of numbers or booleans into their correct types, with developers choosing to opt into these transformations.

## The recommended approach for type parsing and validation?

Parse data at the entry points or 'gates' of the application, but avoid excessive parsing throughout the entire codebase to maintain performance.

Once data is validated, normal type safety should apply

Remember the golden rule of Performance => Not doing stuff is faster than doing them.

## the primary challenge when moving types between client and server in TypeScript?

Ensuring type consistency and validation across different environments, which initially requires manual copying or type sharing strategies

### What advantages does Zod provide for type validation beyond TypeScript?

Zod offers runtime validation, can enforce specific constraints like email format or UUID, provides detailed error messages, and ensures type safety at both compile-time and runtime with minimal additional code.

## Working Backwards from Types

We know that we can create types out of Zod schemas using z.infer(), but sometimes, we find ourselves in the position where we ALREADY have the types and we want to create schemas and be 100% positive that those schemas match the types.

Let’s say we have the following type:

```ts
type Task = {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
};
```

We can use `satisfies` to make sure that our schema matches.

```ts
const taskSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string().optional(),
  completed: z.boolean(),
}) satisfies z.ZodType<Task>;
```

If our schema does not match the type that it’s supposed to satisfy, then TypeScript will be the one yelling at us.

### What type complexity exists with Express query parameters?

Query parameters can be a string, an array of strings, an object with key sets of strings, or undefined, which makes type validation complex

## What benefits does using an API contract provide for frontend and backend development?

An API contract enables type-safe client generation, automatic validation of requests and responses, ensures CONSISTENCY between frontend and backend, and reduces the likelihood of errors by providing shared type definitions and validation.

## What is the purpose of Mock Service Worker (MSW) in API development?

Mock Service Worker allows developers to stub out API responses based on the API contract when the backend is not yet complete. It can hijack network requests, generate fake API responses, and can be removed once the actual API is ready.

## How can Zod schemas be generated from an OpenAPI specification?

Using specific libraries, developers can generate Zod schemas directly from an OpenAPI specification. 

This process can automatically create type-safe schemas that match the API contract, reducing manual schema creation and potential errors

## What are the advantages of generating API clients and schemas automatically?

Automatically generated API clients and schemas provide more accuracy, reduce manual work, ensure type safety, minimize human error, and create consistent type definitions across frontend and backend development.

# TRPC

## What is the core concept behind RPC (Remote Procedure Call)?

The ability to call functions remotely on a server as if they were local functions, with the transport details handled automatically

## What is the 'Backend for Frontend' pattern primarily used for?

To create an abstraction layer over legacy or complex backend APIs

allowing easier integration and reducing complexity for frontend developers

## What advantage does tRPC provide in terms of type safety and contract definition?

It allows developers to define `API contracts using TypeScript types`

which can be used both for implementation and type generation on the client side
