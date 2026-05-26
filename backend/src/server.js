import dotenv from "dotenv";
import express from "express";
import { connectDB } from "./Config/db.js";
import productRoute from "./Routes/productRoute.js";
import orderRoute from "./Routes/orderRoute.js";
import userRoute from "./Routes/userRoute.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

app.use("/api/products", productRoute);
app.use("/api/orders", orderRoute);
app.use("/api/user", userRoute);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("[Global Error Handler]", err.message);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
});

// ✅ Connect to DB once (Vercel reuses this between requests)
await connectDB();

// ✅ Local dev only — Vercel does NOT use this
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log("Server started on port", PORT);
  });
}

// ✅ This is what Vercel needs — export the app
export default app;
