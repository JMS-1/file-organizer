"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const config_1 = require("./config");
electron_1.app.allowRendererProcessReuse = true;
let win;
function createWindow() {
    win = new electron_1.BrowserWindow({
        autoHideMenuBar: true,
        useContentSize: true,
        webPreferences: {
            devTools: config_1.config.develop,
            nodeIntegration: true,
        },
    });
    win.loadFile('index.html');
    win.on('closed', () => (win = null));
    win.webContents.on('dom-ready', () => {
        win.webContents.executeJavaScript("require('./app')");
    });
    if (config_1.config.develop) {
        win.webContents.on('before-input-event', (ev, inp) => {
            if (inp.key === 'F12' && !inp.control) {
                win.webContents.openDevTools({ mode: 'detach' });
            }
        });
    }
}
electron_1.app.on('ready', createWindow);
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
electron_1.app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});
//# sourceMappingURL=index.js.map