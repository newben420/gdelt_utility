"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Debi = exports.DebiConfig = exports.SetVal = exports.SortCond = exports.DebiCond = exports.SC = exports.MC = exports.DebiEntity = exports.METANAME = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
exports.METANAME = "metadata";
const defaults = {
    metadataName: exports.METANAME,
    version: "1.0.0",
    setReuse: "__{val}",
    memory: true,
    dev: true,
    path: 'debbiebase',
    tableNamePattern: /^[a-zA-Z0-9_]+$/,
    extension: ".json",
    encoding: "utf-8",
    ensureInitialized: "Database has not yet been initialized.",
};
class DebiEntity {
    constructor() {
        if (this.useMemory == null || this.useMemory == undefined) {
            this.useMemory = defaults.memory;
        }
    }
}
exports.DebiEntity = DebiEntity;
var MC;
(function (MC) {
    MC[MC["IsN"] = 0] = "IsN";
    MC[MC["IsNN"] = 1] = "IsNN";
    MC[MC["Eq"] = 2] = "Eq";
    MC[MC["NE"] = 3] = "NE";
    MC[MC["InN"] = 4] = "InN";
    MC[MC["NInN"] = 5] = "NInN";
    MC[MC["GT"] = 6] = "GT";
    MC[MC["GE"] = 7] = "GE";
    MC[MC["LT"] = 8] = "LT";
    MC[MC["LE"] = 9] = "LE";
    MC[MC["REGEXP"] = 10] = "REGEXP";
})(MC || (exports.MC = MC = {}));
var SC;
(function (SC) {
    SC[SC["ASC"] = 0] = "ASC";
    SC[SC["DESC"] = 1] = "DESC";
})(SC || (exports.SC = SC = {}));
class DebiCond {
}
exports.DebiCond = DebiCond;
class SortCond {
}
exports.SortCond = SortCond;
class SetVal {
}
exports.SetVal = SetVal;
class DebiConfig {
    constructor() {
        if (this.inMemory == null || this.inMemory == undefined) {
            this.inMemory = false;
        }
        if (this.tables == null || this.tables == undefined) {
            this.tables = [];
        }
        if (this.tables.filter(x => x.name == defaults.metadataName).length == 0) {
            this.tables.push({
                name: defaults.metadataName,
                useMemory: true,
            });
        }
        if (this.path == null || this.path == undefined) {
            this.path = path_1.default.resolve(__dirname, defaults.path);
        }
    }
}
exports.DebiConfig = DebiConfig;
class Debi {
}
exports.Debi = Debi;
_a = Debi;
Debi.cf = new DebiConfig();
Debi.initialized = false;
Debi.memoryDB = {};
Debi.pth = defaults.path;
Debi.config = (config = new DebiConfig()) => {
    _a.cf = config;
    _a.pth = config.path;
    _a.ensureDirectory(created => {
        if (created) {
            _a.loadTables(success => {
                if (success) {
                    _a.initialized = true;
                }
                if (config.configCallback) {
                    config.configCallback(success);
                }
            });
        }
        else {
            if (config.configCallback) {
                config.configCallback(created);
            }
        }
    });
};
Debi.ensureDirectory = (cb) => {
    if (fs_1.default.existsSync(_a.pth)) {
        cb(true);
    }
    else {
        fs_1.default.mkdir(_a.pth, { recursive: false }, (err) => {
            if (err) {
                if (defaults.dev) {
                    console.log(err);
                }
                cb(false);
            }
            else {
                cb(true);
            }
        });
    }
};
Debi.sort = (data, ss) => {
    if (ss.length == 0) {
        return data;
    }
    let sorted = data.sort((a, b) => {
        for (const s of ss) {
            const { c, i } = s;
            if ((a[c] == undefined || a[c] == null) && !(b[c] == undefined || b[c] == null)) {
                return i === SC.ASC ? 1 : -1;
            }
            if (!(a[c] == undefined || a[c] == null) && (b[c] == undefined || b[c] == null)) {
                return i === SC.ASC ? -1 : 1;
            }
            if ((a[c] == undefined || a[c] == null) && (b[c] == undefined || b[c] == null)) {
                continue;
            }
            if (a[c] < b[c]) {
                return i === SC.ASC ? -1 : 1;
            }
            else if (a[c] > b[c]) {
                return i === SC.ASC ? 1 : -1;
            }
        }
        return 0;
    });
    return sorted;
};
Debi.filter = (data, cs, callback) => {
    let filtered = data.map((x, i) => (Object.assign(Object.assign({}, x), { indicasativabs386d: i })));
    let l = cs.length;
    let i;
    let parseError = false;
    let errorCauser = [];
    try {
        for (i = 0; i < l; i++) {
            let c = cs[i];
            switch (c.i) {
                case MC.Eq:
                    if (c.a == null || c.a == undefined) {
                        parseError = true;
                        errorCauser.push(i + 1);
                    }
                    else {
                        filtered = filtered.filter(row => row[c.c] == c.a);
                    }
                    break;
                case MC.GE:
                    if (c.a == null || c.a == undefined) {
                        parseError = true;
                        errorCauser.push(i + 1);
                    }
                    else {
                        let object = parseFloat(c.a);
                        filtered = filtered.filter(row => parseFloat(row[c.c]) >= object);
                    }
                    break;
                case MC.GT:
                    if (c.a == null || c.a == undefined) {
                        parseError = true;
                        errorCauser.push(i + 1);
                    }
                    else {
                        let object = parseFloat(c.a);
                        filtered = filtered.filter(row => parseFloat(row[c.c]) > object);
                    }
                    break;
                case MC.InN:
                    if (c.a == null || c.a == undefined || !Array.isArray(c.a)) {
                        parseError = true;
                        errorCauser.push(i + 1);
                    }
                    else {
                        filtered = filtered.filter(row => c.a.indexOf(row[c.c]) != -1);
                    }
                    break;
                case MC.NInN:
                    if (c.a == null || c.a == undefined || !Array.isArray(c.a)) {
                        parseError = true;
                        errorCauser.push(i + 1);
                    }
                    else {
                        filtered = filtered.filter(row => c.a.indexOf(row[c.c]) == -1);
                    }
                    break;
                case MC.IsN:
                    filtered = filtered.filter(row => row[c.c] == null || row[c.c] != undefined || row[c.c] != "");
                    break;
                case MC.IsNN:
                    filtered = filtered.filter(row => row[c.c] != null && row[c.c] != undefined && row[c.c] != "");
                    break;
                case MC.LE:
                    if (c.a == null || c.a == undefined) {
                        parseError = true;
                        errorCauser.push(i + 1);
                    }
                    else {
                        let object = parseFloat(c.a);
                        filtered = filtered.filter(row => parseFloat(row[c.c]) <= object);
                    }
                    break;
                case MC.LT:
                    if (c.a == null || c.a == undefined) {
                        parseError = true;
                        errorCauser.push(i + 1);
                    }
                    else {
                        let object = parseFloat(c.a);
                        filtered = filtered.filter(row => parseFloat(row[c.c]) < object);
                    }
                    break;
                case MC.NE:
                    if (c.a == null || c.a == undefined) {
                        parseError = true;
                        errorCauser.push(i + 1);
                    }
                    else {
                        filtered = filtered.filter(row => row[c.c] != c.a);
                    }
                    break;
                case MC.REGEXP:
                    if (c.a == null || c.a == undefined || !(c.a instanceof RegExp)) {
                        parseError = true;
                        errorCauser.push(i + 1);
                    }
                    else {
                        filtered = filtered.filter(row => c.a.test(row[c.c] ? row[c.c].toString : ''));
                    }
                    break;
                default:
            }
        }
        if (parseError) {
            callback(false, ['An error was caused by the filter condition number(s) ' + errorCauser.join(", ") + "."]);
        }
        else {
            let index = [];
            filtered = filtered.map((_b) => {
                var { indicasativabs386d } = _b, rest = __rest(_b, ["indicasativabs386d"]);
                index.push(indicasativabs386d);
                return Object.assign({}, rest);
            });
            callback(true, [filtered, index]);
        }
    }
    catch (error) {
        callback(false, ['An unknown error was encountered during filtering.']);
    }
};
Debi.update = (tableName, setVals, callback, filt = []) => {
    _a.getTabfromName(tableName, (succ, tab) => {
        if (!succ) {
            callback(succ);
        }
        else {
            let t = tab;
            _a.fetchAll(tableName, (succ, rows) => {
                if (!succ) {
                    callback(succ);
                }
                else {
                    _a.filter(rows, filt, (success, result) => {
                        if (!success) {
                            callback(success);
                        }
                        else {
                            let fIndex = result[1];
                            let l = setVals.length;
                            let i = 0;
                            let biggerError = false;
                            let updatedRows = rows.map((row, i) => {
                                if (fIndex.indexOf(i) != -1) {
                                    for (i = 0; i < l; i++) {
                                        let s = setVals[i];
                                        if (row[s.c] != undefined) {
                                            let reuse = s.a.toString().match(/__\{[a-zA-Z0-9_]+\}/g);
                                            if (reuse == null) {
                                                row[s.c] = s.a;
                                            }
                                            else {
                                                let error = false;
                                                let str = s.a.toString();
                                                let reuseCols = reuse.map(x => {
                                                    let col = x.replace(/^__\{/, '').replace(/\}$/, '');
                                                    if (row[col] == undefined) {
                                                        error = true;
                                                    }
                                                    else {
                                                        str = str.replace(x, row[col]);
                                                    }
                                                    return col;
                                                });
                                                if (!error) {
                                                    let newVal = eval(str);
                                                    row[s.c] = newVal;
                                                }
                                                else {
                                                    biggerError = true;
                                                }
                                            }
                                        }
                                        else {
                                            row[s.c] = s.a;
                                        }
                                    }
                                }
                                return row;
                            });
                            if (biggerError) {
                                callback(false);
                            }
                            else {
                                _a.saveTable(t, updatedRows, (saved) => {
                                    callback(saved);
                                });
                            }
                        }
                    });
                }
            });
        }
    });
};
Debi.delete = (tableName, filt, callback) => {
    _a.getTabfromName(tableName, (succ, tab) => {
        if (!succ) {
            callback(succ);
        }
        else {
            let t = tab;
            _a.fetchAll(tableName, (succ, rows) => {
                if (!succ) {
                    callback(succ);
                }
                else {
                    _a.filter(rows, filt, (success, result) => {
                        if (!success) {
                            callback(success);
                        }
                        else {
                            let fIndex = result[1];
                            let updatedRows = rows.filter((row, i) => fIndex.indexOf(i) == -1);
                            if (updatedRows.length == rows.length) {
                                callback(true);
                            }
                            else {
                                _a.saveTable(t, updatedRows, (saved) => {
                                    callback(saved);
                                });
                            }
                        }
                    });
                }
            });
        }
    });
};
Debi.batchDelete = (tableName, filt, callback) => {
    _a.getTabfromName(tableName, (succ, tab) => {
        if (!succ) {
            callback(succ);
        }
        else {
            let t = tab;
            _a.fetchAll(tableName, (succ, rows) => {
                if (!succ) {
                    callback(succ);
                }
                else {
                    let dels = filt.filter(x => true);
                    let err = false;
                    let originalLength = rows.length + 0;
                    let run = (cb) => {
                        if (dels.length == 0) {
                            cb();
                        }
                        else {
                            let f = dels.shift();
                            _a.filter(rows, f, (succ, res) => {
                                if (!succ) {
                                    err = true;
                                    run(cb);
                                }
                                else {
                                    let fIndex = res[1];
                                    rows = rows.filter((row, i) => fIndex.indexOf(i) == -1);
                                    run(cb);
                                }
                            });
                        }
                    };
                    run(() => {
                        if (err) {
                            callback(false);
                        }
                        else {
                            if (originalLength == rows.length) {
                                callback(true);
                            }
                            else {
                                _a.saveTable(t, rows, (saved) => {
                                    callback(saved);
                                });
                            }
                        }
                    });
                }
            });
        }
    });
};
Debi.insertBatch = (tableName, rows, callback) => {
    if (_a.initialized) {
        _a.getTabfromName(tableName, (success, tab) => {
            if (success) {
                let t = tab;
                try {
                    let data = [];
                    let postPopulation = () => {
                        let newData = data.concat(rows);
                        _a.saveTable(t, newData, succ => {
                            callback(succ);
                        });
                    };
                    if (tab.useMemory) {
                        data = _a.memoryDB[t.name];
                        postPopulation();
                    }
                    else {
                        _a.loadTable(t, (success2, dt) => {
                            if (success2) {
                                data = dt;
                                postPopulation();
                            }
                            else {
                                callback(false);
                            }
                        });
                    }
                }
                catch (error) {
                    if (defaults.dev) {
                        console.log(error);
                        callback(false);
                    }
                }
            }
            else {
                callback(false);
            }
        });
    }
    else {
        callback(false);
    }
};
Debi.fetchByCondition = (tableName, filt, callback, sort = []) => {
    _a.fetchAll(tableName, (succ, rows) => {
        if (!succ) {
            callback(succ, rows);
        }
        else {
            _a.filter(rows, filt, (success, result) => {
                if (!success) {
                    callback(success, result);
                }
                else {
                    let filteredAndSorted = _a.sort(result[0], sort);
                    callback(success, filteredAndSorted);
                }
            });
        }
    });
};
Debi.fetchAll = (tableName, callback, sort = []) => {
    if (_a.initialized) {
        _a.getTabfromName(tableName, (success, tab) => {
            if (!success || tab == null) {
                callback(false, ["Entity could not be located."]);
            }
            else {
                let t = tab;
                if (t.useMemory) {
                    callback(true, _a.memoryDB[t.name]);
                }
                else {
                    _a.loadTable(tab, (succ, data) => {
                        if (succ) {
                            callback(true, _a.sort(data, sort));
                        }
                        else {
                            callback(false, ["Error retrieving entity data."]);
                        }
                    }, false);
                }
            }
        });
    }
    else {
        callback(false, [defaults.ensureInitialized]);
    }
};
Debi.getTabfromName = (tableName, callback) => {
    let filtered = _a.cf.tables.filter(x => x.name == tableName);
    callback(filtered.length > 0, (filtered.length > 0) ? filtered[0] : null);
};
Debi.loadTables = (callback) => {
    try {
        let tables = _a.cf.tables.filter(x => true);
        let error = false;
        let run = (cb) => {
            if (tables.length == 0 || error) {
                cb();
            }
            else {
                let tab = tables.shift();
                if (!defaults.tableNamePattern.test(tab.name)) {
                    error = true;
                    run(cb);
                }
                else {
                    _a.loadTable(tab, (succ, data) => {
                        if (!succ) {
                            error = true;
                        }
                        run(cb);
                    });
                }
            }
        };
        run(() => {
            callback(!error);
        });
    }
    catch (error) {
        if (defaults.dev) {
            console.log(error);
        }
        callback(false);
    }
};
Debi.loadTable = (tab, cb, init = false) => {
    let pth = path_1.default.join(_a.pth, `${tab.name}${defaults.extension}`);
    if (fs_1.default.existsSync(pth)) {
        if (init && !tab.useMemory) {
            cb(true, null);
        }
        else {
            fs_1.default.readFile(pth, defaults.encoding, (err, data) => {
                if (err) {
                    if (defaults.dev) {
                        console.log(err);
                    }
                    cb(false, null);
                }
                else {
                    try {
                        let dt = JSON.parse(data);
                        if (tab.useMemory) {
                            _a.memoryDB[tab.name] = dt;
                        }
                        cb(true, dt);
                    }
                    catch (error) {
                        if (defaults.dev) {
                            console.log(error);
                        }
                        cb(false, null);
                    }
                }
            });
        }
    }
    else {
        _a.saveTable(tab, [], succ => {
            cb(succ, []);
        });
    }
};
Debi.saveTable = (tab, data, cb) => {
    let pth = path_1.default.join(_a.pth, `${tab.name}${defaults.extension}`);
    try {
        let str = JSON.stringify(data);
        fs_1.default.writeFile(pth, str, defaults.encoding, (err) => {
            if (err) {
                if (defaults.dev) {
                    console.log(err);
                }
                cb(false);
            }
            else {
                if (tab.useMemory) {
                    _a.memoryDB[tab.name] = data;
                }
                cb(true);
            }
        });
    }
    catch (error) {
        if (defaults.dev) {
            console.log(error);
        }
        cb(false);
    }
};
