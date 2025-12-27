import express from "express";
import { executeQuery } from "../services/databricks.service.js";

const router = express.Router();

router.get("/users", async (req, res) => {
    try {
        // Databricks Apps ye header automatically inject karta hai
        const userToken = req.headers['x-forwarded-access-token'];
        console.log('headers', req.headers)
        // if (!userToken) {
        //     return res.status(401).json({ error: "No user token found in headers" });
        // }

        const data = await executeQuery("SELECT * FROM demo_users");
        res.json(data);
    } catch (err) {
        console.error('Database error', err);
        res.status(500).json({ error: "Failed to fetch users", details: err.message });
    }
});

export default router;