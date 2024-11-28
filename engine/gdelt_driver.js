"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchArticles = void 0;
const axios_1 = __importDefault(require("axios"));
const site_1 = require("../site");
const general_1 = require("../utility/general");
const res_1 = require("../utility/res");
const Log_1 = require("../utility/Log");
const createQueryParams = (params) => {
    return Object.entries(params)
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join("&");
};
const fetchArticles = (catID, range, themes, callback) => {
    const base = site_1.GDConfig.baseURL;
    let query = "";
    if (site_1.GDConfig.country.length > 0) {
        if (query.length > 0) {
            query += ` AND `;
        }
        if (site_1.GDConfig.country.length > 1) {
            query += '(';
        }
        query += site_1.GDConfig.country.map(x => `sourcecountry:${x}`).join(" OR ");
        if (site_1.GDConfig.country.length > 1) {
            query += ')';
        }
    }
    if (site_1.GDConfig.language.length > 0) {
        if (query.length > 0) {
            query += ` AND `;
        }
        if (site_1.GDConfig.language.length > 1) {
            query += '(';
        }
        query += site_1.GDConfig.language.map(x => `sourcelang:${x}`).join(" OR ");
        if (site_1.GDConfig.language.length > 1) {
            query += ')';
        }
    }
    if (themes.length > 0) {
        if (query.length > 0) {
            query += ` AND `;
        }
        if (themes.length > 1) {
            query += '(';
        }
        query += themes.map(x => `theme:${x}`).join(" OR ");
        if (themes.length > 1) {
            query += ')';
        }
    }
    if (site_1.GDConfig.domains.length > 0) {
        if (query.length > 0) {
            query += ` AND `;
        }
        if (site_1.GDConfig.domains.length > 1) {
            query += '(';
        }
        query += site_1.GDConfig.domains.map(x => `domain:${x}`).join(" OR ");
        if (site_1.GDConfig.domains.length > 1) {
            query += ')';
        }
    }
    if (query.length == 0) {
        callback(res_1.GRes.err("server_responses.errors.noquery"));
    }
    else {
        let fullURL = `${base}?${createQueryParams({
            query,
            mode: site_1.GDConfig.mode,
            format: site_1.GDConfig.format,
            startdatetime: (0, general_1.timestamptoDateTimeNumerical)(range[0] + site_1.TimezoneShift),
            enddatetime: (0, general_1.timestamptoDateTimeNumerical)(range[1] + site_1.TimezoneShift),
            maxrecords: site_1.GDConfig.maxArticles.toString(),
            sort: site_1.GDConfig.sort,
        })}`;
        axios_1.default.get(fullURL, {
            timeout: site_1.GDConfig.timeout,
            headers: {
                Connection: 'keep-alive'
            }
        }).then((response) => {
            if (response.status == 200) {
                let res = response.data;
                if (res.articles) {
                    if (res.articles.length > 0) {
                        callback(res_1.GRes.succ(res.articles));
                    }
                    else {
                        callback(res_1.GRes.err("server_responses.errors.no_art"));
                    }
                }
                else {
                    callback(res_1.GRes.err(`${response.headers.server ? `${response.headers.server} => ` : ""}${response.data.length ? response.data : "EMPTY RESPONSE FOR YOUR QUERY"}.`));
                }
            }
            else {
                callback(res_1.GRes.err(`HTTP STATUS ${response.status} - ${response.statusText}`));
            }
        }).catch((error) => {
            Log_1.Log.dev(error);
            callback(res_1.GRes.err("server_responses.errors.no_conn2"));
        });
    }
};
exports.fetchArticles = fetchArticles;
