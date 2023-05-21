import express, { Express } from "express";
import dotenv from "dotenv";
import { absen } from "../service/absen";

const router: Express = express();

dotenv.config();

declare global {
  namespace Express {
    interface Request {
      key: string;
    }
  }
}

router.use((req, res, next) => {
  const apikey: string | undefined = process.env.APIKEY;
  if (typeof apikey == "undefined") res.sendStatus(500);
  const key = req.query["api-key"];
  //api key is missing
  if (!key) res.status(400).json({ error: "apikey is required" });

  //invalid apikey
  if (key !== apikey) res.status(401).json({ error: "invalid api key" });
  if (typeof key === "string") req.key = key;
  next();
});

router.get("/absen", async (req, res) => {
  const result: Boolean = await absen();
  console.log(result);
  res.status(200).send("OK");
});

export default router;
