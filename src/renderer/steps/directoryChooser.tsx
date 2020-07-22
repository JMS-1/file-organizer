import classNames from 'classnames'
import { remote } from 'electron'
import { observer } from 'mobx-react'
import * as React from 'react'

import styles from './directoryChooser.module.scss'

import { store } from '../store'

interface IDirectoryChooserProps {}

@observer
export default class DirectoryChooser extends React.Component<IDirectoryChooserProps> {
    render(): JSX.Element {
        return (
            <div className={classNames(styles['fo-choose-directory'], 'fo-step')}>
                <button onClick={() => (store.step = 'find-files')}>[Verzeichnisauswahl]</button>
                <div style={{ height: 'calc(100% - 2em)', overflow: 'auto', whiteSpace: 'pre-wrap' }}>
                    {JSON.stringify(remote.process.env, null, 2)}
                </div>
            </div>
        )
    }
}
