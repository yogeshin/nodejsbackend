import express from "express";
import { PORT } from "./config/env.js";

import userRouter from "./routes/user.routes.js";
import authRouter from "./routes/auth.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";

const app = express();

app.use

app.get("/", (req, res) => {
  res.send("Welcome to Subscription Tracker API 🚀 ");
});

app.listen(PORT, () => {
  console.log(`Subsciption Tracker API is running on http://localhost:${PORT}`);
});

export default app;
