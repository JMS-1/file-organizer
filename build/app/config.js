"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const raw = fs_1.readFileSync(path_1.join(__dirname, '../config.json')).toString();
let json = JSON.parse(raw.substr(raw.indexOf('{')));
try {
    const usrConfig = fs_1.readFileSync(path_1.join(__dirname, '../config.custom.json')).toString();
    json = Object.assign(Object.assign({}, json), JSON.parse(usrConfig.substr(usrConfig.indexOf('{'))));
}
catch (error) {
}
exports.config = json;
//# sourceMappingURL=config.js.map