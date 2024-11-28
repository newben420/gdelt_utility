"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.summarizeFromBody = exports.extractfromURL = void 0;
const axios_1 = __importDefault(require("axios"));
const site_1 = require("../site");
const Log_1 = require("./Log");
const res_1 = require("./res");
const jsdom_1 = require("jsdom");
const readability_1 = require("@mozilla/readability");
const extractfromURL = (url, callback) => {
    axios_1.default.get(url, {
        timeout: site_1.GDConfig.timeout,
        headers: {
            Connection: 'keep-alive'
        }
    }).then((response) => {
        if (response.status == 200) {
            try {
                let res = response.data;
                const dom = new jsdom_1.JSDOM(res, { url });
                const document = dom.window.document;
                const reader = new readability_1.Readability(document);
                const article = reader.parse();
                if (!article || !article.content) {
                    callback(res_1.GRes.err("server_responses.errors.no_conn5"));
                }
                else {
                    const articleDOM = new jsdom_1.JSDOM(article.content);
                    const articleText = articleDOM.window.document.body.textContent;
                    callback(res_1.GRes.succ((articleText === null || articleText === void 0 ? void 0 : articleText.trim()) || ""));
                }
            }
            catch (error) {
                Log_1.Log.dev(error);
                callback(res_1.GRes.err("server_responses.errors.no_conn4"));
            }
        }
        else {
            callback(res_1.GRes.err(`HTTP STATUS ${response.status} - ${response.statusText}`));
        }
    }).catch((error) => {
        Log_1.Log.dev(error);
        callback(res_1.GRes.err("server_responses.errors.no_conn3"));
    });
};
exports.extractfromURL = extractfromURL;
const summarizeFromBody = (body, callback) => {
    axios_1.default.post(site_1.ContentConfig.summaryAPIURL, { text: body }, {
        timeout: site_1.GDConfig.timeout,
        headers: {
            "Content-Type": "application/json",
            Connection: 'keep-alive'
        }
    }).then((response) => {
        if (response.status == 200) {
            try {
                let res = response.data;
                if (res.summary) {
                    callback(res_1.GRes.succ(res.summary));
                }
                else if (res.error) {
                    callback(res_1.GRes.err(res.error));
                }
                else {
                    callback(res_1.GRes.err("server_responses.errors.no_conn6"));
                }
            }
            catch (error) {
                Log_1.Log.dev(error);
                callback(res_1.GRes.err("server_responses.errors.no_conn6"));
            }
        }
        else {
            callback(res_1.GRes.err(`HTTP STATUS ${response.status} - ${response.statusText}`));
        }
    }).catch((error) => {
        Log_1.Log.dev(error);
        callback(res_1.GRes.err("server_responses.errors.no_conn7"));
    });
};
exports.summarizeFromBody = summarizeFromBody;
