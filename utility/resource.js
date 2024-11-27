"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initResource = exports.deleteResource = exports.loadResource = exports.saveResource = void 0;
const path_1 = __importDefault(require("path"));
const site_1 = require("../site");
const fs_1 = require("fs");
const Log_1 = require("./Log");
const res_1 = require("./res");
const __1 = require("..");
const dir = "resource";
const encoding = "utf-8";
const saveResource = (articles, filename, fx) => {
    let pth = path_1.default.join(site_1.ROOT_DIR, dir, filename);
    (0, fs_1.writeFile)(pth, JSON.stringify(articles), encoding, (err) => {
        if (err) {
            Log_1.Log.dev(err);
            fx(false);
        }
        else {
            fx(true);
        }
    });
};
exports.saveResource = saveResource;
const loadResource = (filename, fx) => {
    let pth = path_1.default.join(site_1.ROOT_DIR, dir, filename);
    (0, fs_1.readFile)(pth, encoding, (err, data) => {
        if (err) {
            Log_1.Log.dev(err);
            fx(res_1.GRes.err(`FS => ${err.message}`));
        }
        else {
            fx(res_1.GRes.succ(JSON.parse(data)));
        }
    });
};
exports.loadResource = loadResource;
const deleteResource = (filename) => {
    let pth = path_1.default.join(site_1.ROOT_DIR, dir, filename);
    (0, fs_1.unlinkSync)(pth);
};
exports.deleteResource = deleteResource;
const initResource = (f) => {
    let pth = path_1.default.join(site_1.ROOT_DIR, dir);
    if (!(0, fs_1.existsSync)(pth)) {
        (0, fs_1.mkdir)(pth, (err) => {
            if (err) {
                Log_1.Log.dev(err);
                (0, __1.KILLSERVER)();
            }
            else {
                f();
            }
        });
    }
    else {
        f();
    }
};
exports.initResource = initResource;
