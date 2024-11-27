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
exports.CATS = exports.KILLSERVER = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const api_1 = require("./routes/api");
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const path_1 = __importDefault(require("path"));
const socket_1 = require("./utility/socket");
const Log_1 = require("./utility/Log");
const site_1 = require("./site");
const db_config_1 = require("./db_config");
const debi_1 = require("./db/debi");
const dotenv_1 = __importDefault(require("dotenv"));
const validate_categories_1 = require("./utility/validate_categories");
const resource_1 = require("./utility/resource");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = site_1.PORT || process.env.PORT;
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: site_1.IS_PROD ? "/" : "*",
    }
});
app.disable("x-powered-by");
app.disable('etag');
app.use(body_parser_1.default.json({ limit: "35mb" }));
app.use(body_parser_1.default.urlencoded({
    extended: true,
    limit: "35mb",
    parameterLimit: 50000,
}));
app.use(express_1.default.static(path_1.default.resolve(__dirname, "interface"), {
    maxAge: site_1.IS_PROD ? "1y" : "1d",
}));
app.use("/api", api_1.apiRoute);
app.use((req, res, next) => {
    res.status(404).send("Requested resource not found.");
});
app.use((err, req, res, next) => {
    res.status(500).send("Something went wrong.");
});
const KILLSERVER = () => {
    process.exit(1);
};
exports.KILLSERVER = KILLSERVER;
const CATS = () => {
    return site_1.categories;
};
exports.CATS = CATS;
server.listen(port, () => {
    (0, validate_categories_1.validateCategories)(site_1.categories, r => {
        if (r.succ) {
            Log_1.Log.flow(`CATEGORIES VALIDATION > Success > ${r.message} categor${site_1.categories.length == 1 ? 'y' : 'ies'} found.`);
            db_config_1.DBCONFIG.configCallback = (done) => __awaiter(void 0, void 0, void 0, function* () {
                if (done) {
                    (0, resource_1.initResource)(() => {
                        socket_1.MySocket.initialize(io);
                        Log_1.Log.flow(`${site_1.brand || 'APPLICATION'} > running at http://localhost:${port}`);
                    });
                }
                else {
                    Log_1.Log.flow(`DATABASE > Failed to initialize db.`);
                    (0, exports.KILLSERVER)();
                }
            });
            debi_1.Debi.config(db_config_1.DBCONFIG);
        }
        else {
            Log_1.Log.flow(`CATEGORIES VALIDATION > Error > ${r.message}`);
            (0, exports.KILLSERVER)();
        }
    });
});
