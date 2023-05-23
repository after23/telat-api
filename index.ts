import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import talenta from "./router/talenta";
dotenv.config();

const app: Express = express();
const port = process.env.PORT;

//http://localhost:9090/talenta/absen/?api-key
app.use("/talenta", talenta);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
