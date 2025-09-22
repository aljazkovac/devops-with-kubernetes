const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// In-memory storage for todos
let todos = [
  { id: 1, text: "Learn about Kubernetes deployments", createdAt: new Date().toISOString() },
  { id: 2, text: "Set up persistent volumes for image storage", createdAt: new Date().toISOString() },
  { id: 3, text: "Implement todo functionality", createdAt: new Date().toISOString() },
  { id: 4, text: "Add input validation and character limits", createdAt: new Date().toISOString() },
  { id: 5, text: "Deploy the application to the cluster", createdAt: new Date().toISOString() }
];
let nextId = parseInt(process.env.INITIAL_TODO_ID) || 6;

// GET /todos - Return all todos from memory
app.get("/todos", (req, res) => {
  res.json({ todos });
});

// POST /todos - Create a new todo and add it to memory
app.post("/todos", (req, res) => {
  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }
  const newTodo = { id: nextId++, text, createdAt: new Date().toISOString() };
  todos.push(newTodo);
  res.status(201).json({ todo: newTodo });
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "healthy", service: process.env.SERVICE_NAME || "todo-backend" });
});

app.listen(port, () => {
  console.log(`Todo backend server started on port ${port}`);
  console.log(`Current todos in memory: ${todos.length}`);
});