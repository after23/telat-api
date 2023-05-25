import express, { Express } from "express";
import dotenv from "dotenv";
dotenv.config();

const router: Express = express();

router.get("/", (req, res) => {
  res.send("🏓Pong🏓");
});

export default router;
