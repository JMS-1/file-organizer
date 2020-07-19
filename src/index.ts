import { app, BrowserWindow } from 'electron'

import { config } from './config'

app.allowRendererProcessReuse = true

let win: BrowserWindow

function createWindow(): void {
    win = new BrowserWindow({
        autoHideMenuBar: true,
        useContentSize: true,
        webPreferences: {
            devTools: config.develop,
            nodeIntegration: true,
        },
    })

    win.loadFile('index.html')

    win.on('closed', (): void => (win = null))

    win.webContents.on('dom-ready', () => {
        win.webContents.executeJavaScript("require('./app')")
    })

    if (config.develop) {
        win.webContents.on('before-input-event', (ev, inp) => {
            if (inp.key === 'F12' && !inp.control) {
                win.webContents.openDevTools({ mode: 'detach' })
            }
        })
    }
}

app.on('ready', createWindow)

app.on('window-all-closed', (): void => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', (): void => {
    if (win === null) {
        createWindow()
    }
})
