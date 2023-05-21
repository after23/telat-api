import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { absen } from "./service/absen";

dotenv.config();

const app: Express = express();
const port = process.env.PORT;

app.get("/", async (req: Request, res: Response) => {
  const result: Boolean = await absen();
  console.log(result);
  res.status(200);
  res.send("OK");
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
