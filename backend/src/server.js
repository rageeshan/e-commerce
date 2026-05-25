import "dotenv/config";
import express from "express";
import userRoute from "./Routes/userRoute.js";
import { connectDB } from "./Config/db.js";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json()); //Middleware

app.use("/api/user", userRoute);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log("Server started in port", PORT);
  });
});
