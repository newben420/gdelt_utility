"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UUIDHelper = void 0;
const uuid_1 = require("uuid");
class UUIDHelper {
}
exports.UUIDHelper = UUIDHelper;
UUIDHelper.generate = () => {
    return (0, uuid_1.v4)();
};
UUIDHelper.validate = (ud) => {
    return (0, uuid_1.validate)(ud);
};
