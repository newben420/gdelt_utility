"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomRange = void 0;
const metadata_1 = require("../db/metadata");
class CustomRange {
}
exports.CustomRange = CustomRange;
CustomRange.key = "CUSTOM_RANGE_FLAG";
CustomRange.getBoolValue = () => {
    return new Promise((resolve, reject) => {
        metadata_1.Metadata.get(CustomRange.key, r => {
            if (r == null) {
                resolve(false);
            }
            else {
                resolve(r == "YES");
            }
        });
    });
};
CustomRange.setCustomRange = (val) => {
    return new Promise((resolve, reject) => {
        metadata_1.Metadata.set(CustomRange.key, val ? "YES" : "NO", r => {
            resolve(r);
        });
    });
};
