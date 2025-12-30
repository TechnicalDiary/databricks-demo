import express from "express";
import { executeQuery } from "../services/databricks.service.js";

const router = express.Router();

// 1. GET: Fetch all users
router.get("/users", async (req, res) => {
    try {
        const data = await executeQuery("SELECT * FROM workspace.default.demo_users");
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch users", details: err.message });
    }
});

// 2. POST: Insert a new user
router.post("/users", async (req, res) => {
    const { id, name, email } = req.body;
    try {
        const query = `INSERT INTO workspace.default.demo_users (id, name, email) VALUES (${id}, '${name}', '${email}')`;
        await executeQuery(query);
        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        res.status(500).json({ error: "Insert failed", details: err.message });
    }
});

// 3. PUT: Update an existing user
router.put("/users/:id", async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    try {
        const query = `UPDATE workspace.default.demo_users SET name = '${name}', email = '${email}' WHERE id = ${id}`;
        await executeQuery(query);
        res.json({ message: "User updated successfully" });
    } catch (err) {
        res.status(500).json({ error: "Update failed", details: err.message });
    }
});

// 4. DELETE: Remove a user
router.delete("/users/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const query = `DELETE FROM workspace.default.demo_users WHERE id = ${id}`;
        await executeQuery(query);
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Delete failed", details: err.message });
    }
});

export default router;