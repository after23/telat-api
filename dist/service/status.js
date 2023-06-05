"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.status = void 0;
const puppeteer = __importStar(require("puppeteer"));
require("dotenv").config();
const url = "https://hr.talenta.co/employee/dashboard";
const liveAttendanceURL = "https://hr.talenta.co/live-attendance";
const singOutURL = "https://hr.talenta.co/site/sign-out";
//selector
const emailSelector = "#user_email";
const passwordSelector = "#user_password";
const loginBtn = "#new-signin-button";
const clockInBtn = "#tl-live-attendance-index > div > div.tl-content-max__600.my-3.my-md-5.mx-auto.px-3.px-md-0 > div.tl-card.hide-box-shadow-on-mobile.hide-border-on-mobile.text-center.p-0 > div.d-block.p-4.px-0-on-mobile > div > div:nth-child(1) > button";
const clockOutBtn = "#tl-live-attendance-index > div > div.tl-content-max__600.my-3.my-md-5.mx-auto.px-3.px-md-0 > div.tl-card.hide-box-shadow-on-mobile.hide-border-on-mobile.text-center.p-0 > div.d-block.p-4.px-0-on-mobile > div > div:nth-child(2) > button";
const clockInSuccessSelector = "#tl-live-attendance-index > div > div.tl-content-max__600.my-3.my-md-5.mx-auto.px-3.px-md-0 > div.mt-5 > ul > li > div > p";
const clockOutSuccessSelector = "#tl-live-attendance-index > div > div.tl-content-max__600.my-3.my-md-5.mx-auto.px-3.px-md-0 > div.mt-5 > ul > li:nth-child(2) > div > p";
const clockOutTime = 3600 * 17 + 30 * 60;
const run = (absenBtn, successSelector) => __awaiter(void 0, void 0, void 0, function* () {
    let browser = null;
    let page = null;
    let options = {
        args: [
            "--disable-setuid-sandbox",
            "--no-sandbox",
            "--single-process",
            "--no-zygote",
            "--disable-web-security",
            "--use-gl=egl",
        ],
        headless: true,
        ignoreHTTPSErrors: true,
        executablePath: process.env.NODE_ENV === "production"
            ? process.env.PUPPETEER_EXECUTABLE_PATH
            : puppeteer.executablePath(),
    };
    try {
        if (typeof process.env.EMAIL === "undefined" ||
            typeof process.env.PASSWORD === "undefined" ||
            typeof process.env.LATITUDE === "undefined" ||
            typeof process.env.LONGITUDE === "undefined")
            throw new Error("check your .env file ples");
        const email = process.env.EMAIL;
        const password = process.env.PASSWORD;
        const latitude = process.env.LATITUDE;
        const longitude = process.env.LONGITUDE;
        browser = yield puppeteer.launch(options);
        page = yield browser.newPage();
        page.setDefaultTimeout(180000);
        yield page.goto(url, { waitUntil: "domcontentloaded" });
        yield page.waitForSelector(emailSelector);
        console.log("login page");
        yield page.type(emailSelector, email);
        yield page.type(passwordSelector, password);
        yield page.click(loginBtn);
        const res = yield page.waitForNavigation();
        console.log("logged in!");
        yield page.setGeolocation({
            latitude: Number(latitude),
            longitude: Number(longitude),
        });
        const context = browser.defaultBrowserContext();
        yield context.overridePermissions(liveAttendanceURL, ["geolocation"]);
        if (!res || res.status() !== 200)
            throw new Error("Login Failed");
        yield page.goto(liveAttendanceURL);
        console.log("absen page");
        yield page.waitForSelector(absenBtn);
        const checker = yield page.$(successSelector);
        if (!checker) {
            const image = yield page.screenshot({ type: "png" });
            return image;
        }
        yield page.waitForSelector(successSelector);
        const result = yield page.$eval(successSelector, (el) => el.textContent);
        if (!result)
            throw new Error("clock in/out gagal");
        console.log(`${result} success`);
        const screenshotElement = yield page.$(successSelector);
        if (!screenshotElement)
            throw new Error("Element not found");
        yield page.evaluate((elem) => {
            elem.scrollIntoView(true);
        }, screenshotElement);
        const image = yield page.screenshot({ type: "png" });
        return image;
        // return true;
    }
    catch (err) {
        console.error(err);
        let message = "hmm";
        if (err instanceof Error)
            message = err.toString();
        return message;
    }
    finally {
        if (browser && page) {
            yield page.goto(singOutURL);
            console.log("signed out!");
            yield page.close();
            yield browser.close();
        }
    }
});
// console.log(arg);
const status = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let absenBtn = clockInBtn;
        let successSelector = clockInSuccessSelector;
        const today = new Date();
        const now = (today.getUTCHours() + 7) * 3600 + 60 * today.getMinutes();
        if (now < 5 * 3600)
            throw new Error("kepagian");
        if (now > clockOutTime) {
            absenBtn = clockOutBtn;
            successSelector = clockOutSuccessSelector;
        }
        return yield run(absenBtn, successSelector);
    }
    catch (err) {
        console.error(err);
        let message = "hmm";
        if (err instanceof Error)
            message = err.toString();
        return message;
    }
});
exports.status = status;
