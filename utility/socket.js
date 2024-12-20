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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MySocket = void 0;
const Log_1 = require("./Log");
const res_1 = require("./res");
const resource_1 = require("../db/dao/resource");
const site_1 = require("../site");
const custom_range_1 = require("./custom_range");
const gdelt_driver_1 = require("../engine/gdelt_driver");
const uuid_1 = require("./uuid");
const resource_2 = require("./resource");
const __1 = require("..");
const content_1 = require("./content");
const content_helper_1 = require("./content_helper");
class MySocket {
}
exports.MySocket = MySocket;
_a = MySocket;
MySocket.io = null;
MySocket.initialize = (ioInst) => {
    _a.io = ioInst;
    console.log();
    _a.runOnce();
};
MySocket.runOnce = () => {
    if (_a.io != null) {
        _a.io.on("connection", (socket) => {
            Log_1.Log.dev(`Interface connected with id ${socket.id}.`);
            socket.on("disconnect", () => {
                Log_1.Log.dev(`Interface with id ${socket.id} disconnected.`);
            });
            socket.on("categories", (f) => {
                f((0, __1.CATS)());
            });
            socket.on("articles", (filename, f) => {
                (0, resource_2.loadResource)(filename, r => {
                    f(r);
                });
            });
            socket.on("delete_resource", (catid, filename, ts, f) => {
                resource_1.DAOResource.delete(ts, catid, deleted => {
                    (0, resource_2.deleteResource)(filename);
                    (0, content_1.deleteContentsByResource)(catid, ts);
                    f(deleted);
                    if (deleted) {
                        _a.broadcastDelete(catid, ts);
                    }
                });
            });
            socket.on("load_stat", (f) => {
                resource_1.DAOResource.countAll((count) => __awaiter(void 0, void 0, void 0, function* () {
                    f(res_1.GRes.succ({
                        count,
                        country: `${site_1.GDConfig.country.join(", ")}`,
                        language: `${site_1.GDConfig.language.join(", ")}`,
                        domains: site_1.GDConfig.domains,
                        maxart: site_1.GDConfig.maxArticles,
                        brand: site_1.brand.substring(0, 20),
                        cr: yield custom_range_1.CustomRange.getBoolValue(),
                        maxTokens: site_1.ContentConfig.maxTokens,
                        maxTokensStrict: site_1.ContentConfig.maxTokensStrict,
                    }));
                }));
            });
            socket.on("fetch", (catID, range, themes, cr, callback) => {
                const ts = Date.now();
                (0, gdelt_driver_1.fetchArticles)(catID, range, themes, (r) => {
                    if (!r.succ) {
                        callback(r);
                    }
                    else {
                        let filename = `${ts}-${uuid_1.UUIDHelper.generate()}.json`;
                        let res = {
                            articles: r.message.length,
                            catID: catID,
                            fetchTimestamp: range[1],
                            file: filename,
                            fromTimestamp: range[0],
                            usedCR: cr,
                            ts: ts,
                        };
                        (0, resource_2.saveResource)(r.message, filename, saved => {
                            if (saved) {
                                resource_1.DAOResource.add(res, saved2 => {
                                    if (!saved2) {
                                        (0, resource_2.deleteResource)(filename);
                                        callback(res_1.GRes.err("server_responses.errors.no_save"));
                                    }
                                    else {
                                        _a.broadcastNewResource(res);
                                        callback(res_1.GRes.succ({}));
                                    }
                                });
                            }
                            else {
                                callback(res_1.GRes.err("server_responses.errors.no_save"));
                            }
                        });
                    }
                });
            });
            socket.on("load_res", (f) => {
                resource_1.DAOResource.fetchAllNewToOld(r => {
                    if (!r.succ) {
                        Log_1.Log.dev(r.message);
                    }
                    f(r.succ ? r.message : []);
                });
            });
            socket.on("open_content", (index, catID, rowTS, f) => {
                let filename = `${catID}-${rowTS}-${index}.json`;
                (0, content_1.loadContent)(filename, r => {
                    f(r);
                });
            });
            socket.on("extract_body", (rowTS, catID, url, index, f) => {
                let filename = `${catID}-${rowTS}-${index}.json`;
                (0, content_helper_1.extractfromURL)(url, r => {
                    if (r.succ) {
                        (0, content_1.saveContentBody)(r.message, filename, saved => {
                            f(r);
                        });
                    }
                    else {
                        f(r);
                    }
                });
            });
            socket.on("summarize", (rowTS, catID, body, index, f) => {
                let filename = `${catID}-${rowTS}-${index}.json`;
                (0, content_helper_1.summarizeFromBody)(body, r => {
                    if (r.succ) {
                        (0, content_1.saveContentSummary)(r.message, filename, saved => {
                            f(r);
                        });
                    }
                    else {
                        f(r);
                    }
                });
            });
            socket.on("save_body", (rowTS, catID, index, body, f) => {
                let filename = `${catID}-${rowTS}-${index}.json`;
                (0, content_1.saveContentBody)(body || "", filename, saved => {
                    f(saved);
                });
            });
            socket.on("save_summary", (rowTS, catID, index, summary, f) => {
                let filename = `${catID}-${rowTS}-${index}.json`;
                (0, content_1.saveContentSummary)(summary || "", filename, saved => {
                    f(saved);
                });
            });
            socket.on("set_custom_range", (v, f) => __awaiter(void 0, void 0, void 0, function* () {
                f(yield custom_range_1.CustomRange.setCustomRange(v));
            }));
        });
    }
};
MySocket.broadcastNewResource = (res) => {
    if (_a.io != null) {
        _a.io.emit('new_res', res);
    }
};
MySocket.broadcastDelete = (catID, ts) => {
    if (_a.io != null) {
        _a.io.emit('del_res', { catID, ts });
    }
};
