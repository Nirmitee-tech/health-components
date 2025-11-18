import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cernerRoutes from "./routes/cernerRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use("/cerner", cernerRoutes);

app.get("/", (req, res) => res.send("Cerner Backend Running Successfully"));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));

dotenv.config();

console.log('AUTH_URL', process.env.AUTH_URL);
console.log('CLIENT_ID', process.env.CLIENT_ID);
console.log('REDIRECT_URI', process.env.REDIRECT_URI);
