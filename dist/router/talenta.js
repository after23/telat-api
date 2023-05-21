"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const absen_1 = require("../service/absen");
const router = (0, express_1.default)();
dotenv_1.default.config();
router.use((req, res, next) => {
    const apikey = process.env.APIKEY;
    if (typeof apikey == "undefined")
        res.sendStatus(500);
    const key = req.query["api-key"];
    //api key is missing
    if (!key)
        res.status(400).json({ error: "apikey is required" });
    //invalid apikey
    if (key !== apikey)
        res.status(401).json({ error: "invalid api key" });
    if (typeof key === "string")
        req.key = key;
    next();
});
router.get("/absen", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.setTimeout(120000, () => {
        res.status(504).send("Server Timeout");
    });
    const result = yield (0, absen_1.absen)();
    console.log(result);
    res.status(200).send("OK");
}));
exports.default = router;
