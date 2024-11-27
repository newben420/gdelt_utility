"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DAOResource = exports.ResourceRecord = void 0;
const Log_1 = require("../../utility/Log");
const res_1 = require("../../utility/res");
const debi_1 = require("../debi");
class ResourceRecord {
}
exports.ResourceRecord = ResourceRecord;
class DAOResource {
}
exports.DAOResource = DAOResource;
DAOResource.tab = "resource";
DAOResource.add = (res, fx) => {
    debi_1.Debi.insertBatch(DAOResource.tab, [res], succ => {
        fx(succ);
    });
};
DAOResource.clearAll = (fx) => {
    debi_1.Debi.delete(DAOResource.tab, [], deleted => {
        fx(deleted);
    });
};
DAOResource.delete = (ts, catid, fx) => {
    debi_1.Debi.delete(DAOResource.tab, [
        { c: 'ts', i: debi_1.MC.Eq, a: ts },
        { c: 'catID', i: debi_1.MC.Eq, a: catid },
    ], deleted => {
        fx(deleted);
    });
};
DAOResource.fetchAllNewToOld = (fx) => {
    debi_1.Debi.fetchAll(DAOResource.tab, (succ, data) => {
        fx(succ ? res_1.GRes.succ(data) : res_1.GRes.err(data[0]));
    }, [{ c: 'ts', i: debi_1.SC.DESC }]);
};
DAOResource.countAll = (fx) => {
    debi_1.Debi.fetchAll(DAOResource.tab, (succ, data) => {
        if (!succ) {
            Log_1.Log.dev(data[0]);
        }
        fx(succ ? data.length : 0);
    });
};
