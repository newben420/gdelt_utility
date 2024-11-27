"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GRes = exports.Res = void 0;
class Res {
}
exports.Res = Res;
class GRes {
}
exports.GRes = GRes;
GRes.succ = (message) => {
    let r = { succ: true, message: message, };
    return r;
};
GRes.err = (message) => {
    let r = { succ: false, message: message, };
    return r;
};
