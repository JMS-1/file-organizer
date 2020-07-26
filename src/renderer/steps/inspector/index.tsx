import classNames from 'classnames'
import { observer } from 'mobx-react'
import * as React from 'react'

import FolderGroup from './group'
import styles from './inspector.module.scss'

import { store } from '../../store'
import Progress from '../progress'

interface IFileInspectorProps {}

@observer
export default class FileInspector extends React.Component<IFileInspectorProps> {
    render(): JSX.Element {
        return (
            <div className={classNames(styles.inspector, 'fo-step')}>
                <h1>Schritt 4: Dateien zum Löschen auswählen.</h1>
                <div>
                    <p>
                        Der Fortschrittsbalken zeigt Dir, wie viele Gruppen von Duplikaten von dir schon bearbeitet und
                        bereinigt wurden.
                    </p>
                    <Progress max={store.groups.length} value={store.groupIndex + 1} />
                    <FolderGroup />
                </div>
            </div>
        )
    }
}
