import classNames from 'classnames'
import { remote } from 'electron'
import { action } from 'mobx'
import { observer } from 'mobx-react'
import * as React from 'react'

import styles from './directoryChooser.module.scss'

import { store } from '../store'

interface IDirectoryChooserProps {}

@observer
export default class DirectoryChooser extends React.Component<IDirectoryChooserProps> {
    render(): JSX.Element {
        return (
            <div className={classNames(styles.directory, 'fo-step')}>
                <div className={styles.selector}>
                    <input readOnly value={store.rootPath} />
                    <button onClick={this.browse}>...</button>
                </div>
            </div>
        )
    }

    @action
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
