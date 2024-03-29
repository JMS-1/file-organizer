'use strict'

import { app, BrowserWindow, protocol } from 'electron'
import * as path from 'path'
import { format as formatUrl } from 'url'

const isProduction = process.env.NODE_ENV === 'production'

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow: BrowserWindow | null

function createMainWindow(): BrowserWindow {
    const window = new BrowserWindow({
        autoHideMenuBar: true,
        height: 1024,
        useContentSize: true,
        webPreferences: {
            devTools: !isProduction,
            enableRemoteModule: true,
            nodeIntegration: true,
            webSecurity: false,
        },
        width: 1280,
    })

    window.setMenu(null)

    window.on('closed', () => {
        mainWindow = null
    })

    if (isProduction) {
        window.loadURL(
            formatUrl({
                pathname: path.join(__dirname, 'index.html'),
                protocol: 'file',
                slashes: true,
            })
        )
    } else {
        window.webContents.on('before-input-event', (_ev, inp) => {
            if (inp.key === 'F12' && !inp.control) {
                window.webContents.openDevTools({ mode: 'detach' })
            }
        })

        window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`)
    }

    return window
}

if (!isProduction) {
    app.commandLine.appendSwitch('remote-debugging-port', '29097')
}

// quit application when all windows are closed
app.on('window-all-closed', () => {
    // on macOS it is common for applications to stay open until the user explicitly quits
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // on macOS it is common to re-create a window even after all windows have been closed
    if (mainWindow === null) {
        mainWindow = createMainWindow()
    }
})

// create main BrowserWindow when electron is ready
app.on('ready', () => {
    protocol.registerFileProtocol('file', (request, callback) =>
        callback(decodeURIComponent(request.url.replace(/^file:\/\//, '')))
    )

    mainWindow = createMainWindow()
})
