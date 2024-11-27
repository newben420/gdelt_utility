"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateCategories = void 0;
const general_1 = require("./general");
const res_1 = require("./res");
const validateCategories = (cats, f) => {
    if (Array.isArray(cats) ? cats.length > 0 : false) {
        let c = cats;
        let n = c.length;
        let i;
        let error = false;
        let errorMessage = "";
        let foundIDs = [];
        let foundNames = [];
        let id_ins = `A category must have a unique number value for its "id" attribute.`;
        let name_ins = `A category must have a unique non-empty string value for its "name" attribute.`;
        let themes_ins = `A category must have a non-empty string array value for its "themes" attribute.`;
        for (i = 0; i < n; i++) {
            let ci = c[i];
            if (!(0, general_1.NInteger)(ci.id)) {
                errorMessage = `Category at index ${i} does not have an "id" which is a valid number. ${id_ins}`;
                error = true;
                break;
            }
            if (foundIDs.indexOf(ci.id) != -1) {
                errorMessage = `Category at index ${i} has a duplicate "id". ${id_ins}`;
                error = true;
                break;
            }
            if (!(ci.name ? typeof ci.name === "string" : false)) {
                errorMessage = `Category at index ${i} an invalid or missing "name". ${name_ins}`;
                error = true;
                break;
            }
            if (foundNames.indexOf(ci.name) != -1) {
                errorMessage = `Category at index ${i} has a duplicate "name". ${name_ins}`;
                error = true;
                break;
            }
            if (!(Array.isArray(ci.themes) ? ci.themes.length > 0 : false)) {
                errorMessage = `Category at index ${i} has an invalid "themes" value. ${themes_ins}`;
                error = true;
                break;
            }
            let isNotString = false;
            let t = ci.themes;
            let j = 0;
            for (j = 0; j < t.length; j++) {
                if (typeof t[j] !== "string") {
                    isNotString = true;
                    break;
                }
            }
            if (isNotString) {
                errorMessage = `Category at index ${i} has a non-string element of its "themes" attribute. ${themes_ins}`;
                error = true;
                break;
            }
            foundIDs.push(ci.id);
            foundNames.push(ci.name);
        }
        if (error) {
            f(res_1.GRes.err(errorMessage));
        }
        else {
            f(res_1.GRes.succ(c.length));
        }
    }
    else {
        f(res_1.GRes.err("Categories must be an array of at least 1 category."));
    }
};
exports.validateCategories = validateCategories;
