"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileComparer = void 0;
const mobx_react_1 = require("mobx-react");
const React = require("react");
const store_1 = require("../store");
let FileComparer = class FileComparer extends React.PureComponent {
    render() {
        return (React.createElement("div", { className: 'fo-compare-files fo-step' },
            React.createElement("button", { onClick: () => (store_1.store.step = 'inspect-duplicates') }, "[Dateien vergleichen]")));
    }
};
FileComparer = __decorate([
    mobx_react_1.observer
], FileComparer);
exports.FileComparer = FileComparer;
//# sourceMappingURL=comparer.js.map