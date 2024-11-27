"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NInteger = exports.timestamptoDateTimeNumerical = exports.getDateTime = void 0;
const getDateTime = (ts = Date.now()) => {
    var a = new Date(ts);
    var dd = a.getDate();
    var mm = a.getMonth();
    var yyyy = a.getFullYear();
    var hh = a.getHours();
    var ss = (a.getSeconds()).toString();
    if (ss.length == 1) {
        ss = "0" + ss;
    }
    var am;
    if (hh > 11) {
        am = "PM";
        if (hh > 12) {
            hh = hh - 12;
        }
    }
    else {
        am = "AM";
        if (hh < 1) {
            hh = 12;
        }
    }
    var mx = a.getMinutes();
    if (hh.toString().length == 1) {
        hh = "0" + hh;
    }
    if (mx.toString().length == 1) {
        mx = "0" + mx;
    }
    var m = '' + (mm + 1);
    var b = dd + "/" + m + " " + hh + ":" + mx + ":" + ss + ' ' + am;
    return b;
};
exports.getDateTime = getDateTime;
const timestamptoDateTimeNumerical = (timestamp) => {
    let d = new Date(timestamp);
    let y = d.getFullYear().toString();
    let m = (d.getMonth() + 1).toString();
    let dd = d.getDate().toString();
    let h = d.getHours().toString();
    let mm = d.getMinutes().toString();
    m = m.length == 1 ? `0${m}` : m;
    dd = dd.length == 1 ? `0${dd}` : dd;
    h = h.length == 1 ? `0${h}` : h;
    mm = mm.length == 1 ? `0${mm}` : mm;
    return `${y}${m}${dd}${h}${mm}00`;
};
exports.timestamptoDateTimeNumerical = timestamptoDateTimeNumerical;
const NInteger = (x) => {
    let y = parseInt(x);
    return !Number.isNaN(y);
};
exports.NInteger = NInteger;
