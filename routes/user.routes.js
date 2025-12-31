import express from "express";
import { executeQuery } from "../services/databricks.service.js";

const router = express.Router();

// 1. GET: Fetch all users
router.get("/", async (req, res) => {
    try {
        const data = await executeQuery("SELECT * FROM workspace.default.demo_users");
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch users", details: err.message });
    }
});

// 2. POST: Insert a new user
router.post("/", async (req, res) => {
    const { name, email } = req.body; // No 'id' needed from frontend

    try {
        // Validation: Check if email already exists
        const checkQuery = `SELECT email FROM workspace.default.demo_users WHERE email = '${email}'`;
        const existing = await executeQuery(checkQuery);

        if (existing && existing.length > 0) {
            return res.status(400).json({ error: "A user with this email already exists!" });
        }

        // Insert: We omit 'id' so Databricks generates it automatically
        const insertQuery = `INSERT INTO workspace.default.demo_users (name, email) VALUES ('${name}', '${email}')`;
        await executeQuery(insertQuery);

        res.status(201).json({ message: "User created successfully" });
    } catch (err) {
        res.status(500).json({ error: "Server error", details: err.message });
    }
});

// 3. PUT: Update an existing user
router.put("/:id", async (req, res) => {
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
router.delete("/:id", async (req, res) => {
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