import express from "express";
import userRoutes from "./routes/user.routes.js";
import cors from "cors";

const app = express();
const PORT = 8000;

app.use(express.json());

app.use(cors());
app.use("/api", userRoutes);

app.listen(PORT, () =>
    console.log(`Server running on port ${PORT}`)
);
