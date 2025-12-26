import express from "express";
import { executeQuery } from "../services/databricks.service.js";

const router = express.Router();

router.get("/users", async (req, res) => {
    try {
        const data = await executeQuery("SELECT * FROM demo_users");
        res.json(data);
    } catch (err) {
        console.error('Database error', err)
        res.status(500).json({ error: "Failed to fetch users from Databricks" });
    }
});

export default router;