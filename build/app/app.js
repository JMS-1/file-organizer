"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_dom_1 = require("react-dom");
const config_1 = require("./config");
const root_1 = require("./root");
setTimeout(async () => {
    try {
        react_dom_1.render(React.createElement(root_1.Root, null), document.querySelector('app-root'));
    }
    catch (error) {
        alert(error);
    }
}, 1000);
if (config_1.config.develop) {
    document.addEventListener('keydown', (ev) => {
        if (!ev.ctrlKey || ev.key !== 'F12') {
            return;
        }
        const css = document.querySelectorAll('head > link[rel="stylesheet"]');
        for (let i = 0; i < css.length; i++) {
            const link = css[i];
            link.href = link.href;
        }
    });
}
//# sourceMappingURL=app.js.map