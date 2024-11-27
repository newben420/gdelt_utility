"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Metadata = void 0;
const debi_1 = require("./debi");
class Metadata {
}
exports.Metadata = Metadata;
Metadata.tabName = debi_1.METANAME;
Metadata.get = (title, cb) => {
    debi_1.Debi.fetchByCondition(Metadata.tabName, [{ c: 'title', i: debi_1.MC.Eq, a: title }], (succ, data) => {
        if (!succ) {
            cb(null);
        }
        else {
            if (data.length == 0) {
                cb(null);
            }
            else {
                cb(data[0]['value']);
            }
        }
    });
};
Metadata.set = (title, value, cb = (b) => { }) => {
    Metadata.get(title, data => {
        if (data == null) {
            let meta = {};
            meta['title'] = title;
            meta['value'] = value;
            debi_1.Debi.insertBatch(Metadata.tabName, [meta], succ => {
                cb(succ);
            });
        }
        else {
            debi_1.Debi.update(Metadata.tabName, [{ c: 'value', a: value }], (updated) => {
                cb(updated);
            }, [{ c: 'title', i: debi_1.MC.Eq, a: title }]);
        }
    });
};
Metadata.setPR = (title, value) => {
    return new Promise((resolve, reject) => {
        Metadata.get(title, data => {
            if (data == null) {
                let meta = {};
                meta['title'] = title;
                meta['value'] = value;
                debi_1.Debi.insertBatch(Metadata.tabName, [meta], succ => {
                    resolve(succ);
                });
            }
            else {
                debi_1.Debi.update(Metadata.tabName, [{ c: 'value', a: value }], (updated) => {
                    resolve(updated);
                }, [{ c: 'title', i: debi_1.MC.Eq, a: title }]);
            }
        });
    });
};
Metadata.unset = (title, value, cb = (b) => { }) => {
    Metadata.get(title, data => {
        if (data == null) {
            cb(true);
        }
        else {
            debi_1.Debi.delete(Metadata.tabName, [{ c: 'title', i: debi_1.MC.Eq, a: title }], (deleted) => {
                cb(deleted);
            });
        }
    });
};
Metadata.unsetAll = (cb) => {
    debi_1.Debi.delete(Metadata.tabName, [], (deleted) => {
        cb(deleted);
    });
};
