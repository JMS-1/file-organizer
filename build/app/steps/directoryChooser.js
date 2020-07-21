"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DirectoryChooser = void 0;
const mobx_react_1 = require("mobx-react");
const React = require("react");
const store_1 = require("../store");
let DirectoryChooser = class DirectoryChooser extends React.PureComponent {
    render() {
        return (React.createElement("div", { className: 'fo-choose-directory fo-step' },
            React.createElement("button", { onClick: () => (store_1.store.step = 'find-files') }, "[Verzeichnisauswahl]")));
    }
};
DirectoryChooser = __decorate([
    mobx_react_1.observer
], DirectoryChooser);
exports.DirectoryChooser = DirectoryChooser;
//# sourceMappingURL=directoryChooser.js.map