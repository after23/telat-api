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
  if (typeof apikey == "undefined") return res.sendStatus(500);
  const key = req.query["api-key"];
  //api key is missing
  if (!key) return res.status(400).json({ error: "apikey is required" });

  //invalid apikey
  if (key !== apikey) return res.status(401).json({ error: "invalid api key" });
  if (typeof key === "string") req.key = key;
  next();
});

router.get("/absen", async (req, res) => {
  res.setTimeout(240_000, () => {
    return res.status(504).send("Server Timeout");
  });
  const result: Buffer | string = await absen();
  // if (!result) return res.sendStatus(500);
  if (typeof result == "string") return res.status(500).send(result);
  res.set({ "Content-Type": "image/png", "Content-Length": result?.length });
  console.log(result);
  return res.status(200).send(result);
});

export default router;
