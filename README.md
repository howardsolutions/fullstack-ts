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

