"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimezoneShift = exports.ContentConfig = exports.GDConfig = exports.IS_PROD = exports.MODE = exports.PORT = exports.brand = exports.ROOT_DIR = exports.categories = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const categories_json_1 = __importDefault(require("./categories.json"));
dotenv_1.default.config();
exports.categories = categories_json_1.default;
exports.ROOT_DIR = process.cwd();
exports.brand = process.env.BRAND || "";
exports.PORT = parseInt(process.env.PORT || "5000");
exports.MODE = (process.env.MODE || "DEV");
exports.IS_PROD = exports.MODE == "PROD";
class GDConfig {
}
exports.GDConfig = GDConfig;
GDConfig.country = process.env.GD_COUNTRY ? (process.env.GD_COUNTRY.split(" ").filter(x => x.length > 0)) : [];
GDConfig.language = process.env.GD_LANGUAGE ? (process.env.GD_LANGUAGE.split(" ").filter(x => x.length > 0)) : [];
GDConfig.domains = process.env.GD_DOMAINS ? (process.env.GD_DOMAINS.split(" ").filter(x => x.length > 0)) : [];
GDConfig.baseURL = (process.env.GD_BASE_URL || "https://api.gdeltproject.org/api/v2/doc/doc").trim();
GDConfig.mode = (process.env.GD_MODE || "artlist").trim();
GDConfig.format = (process.env.GD_FORMAT || "json").trim();
GDConfig.sort = (process.env.GD_SORT || "datedesc").trim();
GDConfig.maxArticles = parseInt(process.env.GD_MAX_ARTICLES || "75");
GDConfig.timeout = parseInt(process.env.GD_FETCH_TIMEOUT_MILLISEC || "5000");
let timezoneShift = 0;
let msToHr = 1000 * 60 * 60;
const reg = /^UTC([\+\-])(\d)+$/;
if (process.env.TIMEZONE_SET ? reg.test(process.env.TIMEZONE_SET) : false) {
    let match = (_a = process.env.TIMEZONE_SET) === null || _a === void 0 ? void 0 : _a.match(reg);
    if (match) {
        const [_, sym, hr] = match;
        timezoneShift = msToHr * parseInt(hr);
        if (sym == "+") {
            timezoneShift *= -1;
        }
    }
}
class ContentConfig {
}
exports.ContentConfig = ContentConfig;
ContentConfig.maxTokens = parseInt(process.env.MAX_TOKENS || "400");
ContentConfig.maxTokensStrict = (process.env.MAX_TOKENS_STRICT == "YES") ? true : ((process.env.MAX_TOKENS == "NO") ? false : false);
ContentConfig.summaryAPIURL = process.env.SUMMARY_API_URL || "";
exports.TimezoneShift = timezoneShift;
