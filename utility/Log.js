"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const general_1 = require("./general");
dotenv_1.default.config();
const prod = (process.env.MODE == "PROD");
class Log {
}
exports.Log = Log;
Log.dev = (message) => {
    if (!prod) {
        console.log(message);
    }
};
Log.flow = (message) => {
    console.log((0, general_1.getDateTime)() + " FLOW: " + message);
};
