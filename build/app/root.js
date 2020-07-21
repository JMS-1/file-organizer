"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Root = void 0;
const mobx_react_1 = require("mobx-react");
const React = require("react");
const steps_1 = require("./steps");
const store_1 = require("./store");
let Root = class Root extends React.PureComponent {
    render() {
        return React.createElement("div", { className: 'fo-root' }, this.createStep());
    }
    createStep() {
        switch (store_1.store.step) {
            case 'choose-root':
                return React.createElement(steps_1.DirectoryChooser, null);
            case 'find-files':
                return React.createElement(steps_1.FileFinder, null);
            case 'compare-files':
                return React.createElement(steps_1.FileComparer, null);
            case 'inspect-duplicates':
                return React.createElement(steps_1.FileInspector, null);
            case 'confirm-delete':
                return React.createElement(steps_1.FileCleaner, null);
            case 'finished':
                return React.createElement(steps_1.Finished, null);
        }
    }
};
Root = __decorate([
    mobx_react_1.observer
], Root);
exports.Root = Root;
//# sourceMappingURL=root.js.map