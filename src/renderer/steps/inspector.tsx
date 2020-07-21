import classNames from 'classnames'
import { observer } from 'mobx-react'
import * as React from 'react'

import styles from './inspector.module.scss'

import { store } from '../store'

interface IFileInspectorProps {}

@observer
export class FileInspector extends React.Component<IFileInspectorProps> {
    render(): JSX.Element {
        return (
            <div className={classNames(styles['fo-file-inspector'], 'fo-step')}>
                <button onClick={() => (store.step = 'confirm-delete')}>[Dateien zum Löschen auswählen]</button>
            </div>
        )
    }
}
