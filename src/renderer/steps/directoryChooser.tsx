import classNames from 'classnames'
import { remote } from 'electron'
import { observer } from 'mobx-react'
import * as React from 'react'

import styles from './directoryChooser.module.scss'

import { store } from '../store'

interface IDirectoryChooserProps {}

function makeBytes(bytes: number): string {
    let str = `${bytes}`

    for (let n = 3; str.length > n; n += 4) {
        str = `${str.substr(0, str.length - n)}.${str.substr(str.length - n)}`
    }

    return str
}

@observer
export default class DirectoryChooser extends React.Component<IDirectoryChooserProps> {
    render(): JSX.Element {
        return (
            <div className={classNames(styles.directory, 'fo-step')}>
                <h1>Schritt 1: Ordner auswählen</h1>
                <div>
                    <p>Als erstes kannst Du einen Ordner auswählen, der nach Duplikaten durchsucht werden soll.</p>
                    <div className={styles.input}>
                        <input readOnly value={store.rootPath} />
                        <button onClick={this.browse}>...</button>
                    </div>
                    <p>
                        Sobald Du rechts unten <strong>Suchen</strong> drückst werden alle Dateien ermittelt, die sich
                        direkt in diesem Ordner oder einem darin enthaltenen Ordner befinden.
                    </p>
                    <p>
                        Berücksichtigt werden alle Dateien, die mindestens {makeBytes(store.minFileSize)} Bytes groß
                        sind, deren Größe allerdings {makeBytes(store.maxFileSize)} Bytes nicht überschreitet.
                    </p>
                    <p>
                        <strong>Achtung:</strong> die Verwendung dieser Anwendung erfolgt vollständig auf eigene Gefahr.
                        Sie wurde zwar mit größtmöglicher Sorgfalt erstellt und getestet, trotzdem kann keinerlei Gewähr
                        für möglicherweise fälschliche Löschoperationen übernommen werden.
                    </p>
                </div>
            </div>
        )
    }

    private readonly browse = async (): Promise<void> => {
        store.busy += 1

        try {
            const info = await remote.dialog.showOpenDialog({
                buttonLabel: 'Fertig',
                defaultPath: store.rootPath,
                properties: ['openDirectory'],
                title: 'Verzeichnis auswählen',
            })

            const dir = !info.canceled && info.filePaths?.[0]

            if (dir) {
                store.setRootPath(dir)
            }
        } finally {
            store.busy -= 1
        }
    }
}
