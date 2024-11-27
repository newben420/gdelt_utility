"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DBCONFIG = void 0;
const path_1 = __importDefault(require("path"));
const resource_1 = require("./db/dao/resource");
const debi_1 = require("./db/debi");
const dotenv_1 = __importDefault(require("dotenv"));
const site_1 = require("./site");
dotenv_1.default.config();
let dbc = new debi_1.DebiConfig();
if (process.env.DBDIR) {
    dbc.path = path_1.default.join(site_1.ROOT_DIR, process.env.DBDIR);
}
else {
    dbc.path = path_1.default.join(site_1.ROOT_DIR, "database");
}
(_a = dbc.tables) === null || _a === void 0 ? void 0 : _a.push({
    name: resource_1.DAOResource.tab,
    useMemory: false,
});
exports.DBCONFIG = dbc;
