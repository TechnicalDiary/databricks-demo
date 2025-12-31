import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import userRoutes from "./routes/user.routes.js";

const app = express();

/* ===============================
   ENV & PATH SETUP
================================ */
const PORT = process.env.PORT || 8000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ===============================
   MIDDLEWARES
================================ */
app.use(express.json());

app.use(
   cors({
      origin: "*", // Databricks App internal routing ke liye safe
      methods: ["GET", "POST", "PUT", "DELETE"],
   })
);

/* ===============================
   API ROUTES
================================ */
app.use("/api/users", userRoutes);
app.use('/api/contracts', contractRoutes);

/* ===============================
   REACT STATIC FILES
================================ */
app.use(express.static(path.join(__dirname, "client", "dist")));

/* React routing support */
app.get(/^(?!\/api).*/, (req, res) => {
   res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

/* ===============================
   SERVER START
================================ */
app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`);
});

