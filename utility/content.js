"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContentsByResource = exports.initContent = exports.saveContentSummary = exports.saveContentBody = exports.loadContent = void 0;
const path_1 = __importDefault(require("path"));
const site_1 = require("../site");
const fs_1 = require("fs");
const Log_1 = require("./Log");
const res_1 = require("./res");
const __1 = require("..");
const dir = "content";
const encoding = "utf-8";
const loadContent = (filename, fx) => {
    let pth = path_1.default.join(site_1.ROOT_DIR, dir, filename);
    if ((0, fs_1.existsSync)(pth)) {
        (0, fs_1.readFile)(pth, encoding, (err, data) => {
            if (err) {
                Log_1.Log.dev(err);
                fx(res_1.GRes.err(`FS => ${err.message}`));
            }
            else {
                fx(res_1.GRes.succ(JSON.parse(data)));
            }
        });
    }
    else {
        fx(res_1.GRes.succ({ body: "", summary: "" }));
    }
};
exports.loadContent = loadContent;
const saveContentBody = (body, filename, fx) => {
    let pth = path_1.default.join(site_1.ROOT_DIR, dir, filename);
    if ((0, fs_1.existsSync)(pth)) {
        (0, exports.loadContent)(filename, r => {
            if (r.succ) {
                r.message.body = body;
                (0, fs_1.writeFile)(pth, JSON.stringify(r.message), encoding, (err) => {
                    if (err) {
                        Log_1.Log.dev(err);
                        fx(false);
                    }
                    else {
                        fx(true);
                    }
                });
            }
            else {
                fx(false);
            }
        });
    }
    else {
        let obj = {};
        obj.body = body;
        obj.summary = "";
        (0, fs_1.writeFile)(pth, JSON.stringify(obj), encoding, (err) => {
            if (err) {
                Log_1.Log.dev(err);
                fx(false);
            }
            else {
                fx(true);
            }
        });
    }
};
exports.saveContentBody = saveContentBody;
const saveContentSummary = (summary, filename, fx) => {
    let pth = path_1.default.join(site_1.ROOT_DIR, dir, filename);
    if ((0, fs_1.existsSync)(pth)) {
        (0, exports.loadContent)(filename, r => {
            if (r.succ) {
                r.message.summary = summary;
                (0, fs_1.writeFile)(pth, JSON.stringify(r.message), encoding, (err) => {
                    if (err) {
                        Log_1.Log.dev(err);
                        fx(false);
                    }
                    else {
                        fx(true);
                    }
                });
            }
            else {
                fx(false);
            }
        });
    }
    else {
        let obj = {};
        obj.summary = summary;
        obj.body = "";
        (0, fs_1.writeFile)(pth, JSON.stringify(obj), encoding, (err) => {
            if (err) {
                Log_1.Log.dev(err);
                fx(false);
            }
            else {
                fx(true);
            }
        });
    }
};
exports.saveContentSummary = saveContentSummary;
const initContent = (f) => {
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
exports.initContent = initContent;
const deleteContentsByResource = (catid, ts) => {
    let pth = path_1.default.join(site_1.ROOT_DIR, dir);
    if ((0, fs_1.existsSync)(pth)) {
        (0, fs_1.readdir)(pth, (err, files) => {
            if (err) {
                Log_1.Log.dev(err);
            }
            else {
                let sw = `${catid}-${ts}-`;
                let filtered = files.filter(x => x.startsWith(sw));
                if (filtered.length > 0) {
                    filtered.forEach(x => {
                        (0, fs_1.unlinkSync)(path_1.default.join(pth, x));
                    });
                }
            }
        });
    }
};
exports.deleteContentsByResource = deleteContentsByResource;
