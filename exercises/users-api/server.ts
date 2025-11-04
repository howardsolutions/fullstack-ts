import bodyParser from 'body-parser';
import express from 'express';
import getPort from 'get-port';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

export const app = express();
const port = await getPort({ port: 3000 });

app.use(bodyParser.json());

interface User {
  id: string;
  name: string;
  email: string;
}

const UserSchema = z.object({
  id: z.string({ message: 'ID is required' }),
  name: z.string({ message: 'Name is required' }),
  email: z.string().email({ message: 'Invalid email address' }),
}) satisfies z.ZodType<User>;

const CreateUserSchema = UserSchema.omit({ id: true });
const PartialUser = UserSchema.partial().omit({ id: true });

const UserListSchema = z.array(UserSchema);

export type CreateUser = z.infer<typeof CreateUserSchema>;
export type UpdateUser = z.infer<typeof PartialUser>;
export type UserList = z.infer<typeof UserListSchema>;

const users: User[] = [];

// Create a new user
app.post('/users', (req, res) => {
  const { name, email } = CreateUserSchema.parse(req.body);

  const newUser: User = UserSchema.parse({ id: uuidv4(), name, email });

  users.push(newUser);

  res.status(201).json(newUser);
});

// Read all users
app.get('/users', (req, res) => {
  const { name, email } = PartialUser.parse(req.query);

  let filteredUsers = users;

  if (name) {
    filteredUsers = filteredUsers.filter((user) =>
      user.name.toLowerCase().includes((name).toLowerCase()),
    );
  }

  if (email) {
    filteredUsers = filteredUsers.filter((user) =>
      user.email.toLowerCase().includes((email).toLowerCase()),
    );
  }

  res.json(filteredUsers);
});

// Read a single user by ID
app.get('/users/:id', (req, res) => {
  const { id } = UserSchema.pick({ id: true }).parse(req.params);

  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  res.json(user);
});

// Update a user by ID
app.put('/users/:id', (req, res) => {
  const { id } = req.params;

  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  const { name, email } = PartialUser.parse(req.body);

  if (name) user.name = name;
  if (email) user.email = email;

  res.json(user);
});

// Delete a user by ID
app.delete('/users/:id', (req, res) => {
  const { id } = UserSchema.pick({ id: true }).parse(req.params);

  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return res.status(404).json({ message: 'User not found' });
  }

  users.splice(index, 1);

  res.status(204).send();
});

const isMain = process.argv[1] === fileURLToPath(import.meta.url);

if (isMain) {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}
