import express from "express";
import { executeQuery } from "../services/databricks.service.js";

const router = express.Router();

router.get("/users", async (req, res) => {
    try {
        // Use a specific table path if demo_users is in a specific catalog/schema
        // Example: SELECT * FROM main.default.demo_users
        const data = await executeQuery("SELECT * FROM demo_users");

        // Databricks returns data as an array of objects: [{ id: 1, name: 'John' }]
        // If your React code needs index-based access (user[1]), 
        // you might need to map it, but it's better to use property names in React.
        res.json(data);
    } catch (err) {
        console.error('Route Error:', err);
        res.status(500).json({
            error: "Failed to fetch users",
            details: err.message
        });
    }
});

export default router;