import classNames from 'classnames'
import { observer } from 'mobx-react'
import * as React from 'react'

import styles from './cleanup.module.scss'

import { store } from '../store'

interface IFileCleanerProps {}

@observer
export default class FileCleaner extends React.Component<IFileCleanerProps> {
    render(): JSX.Element {
        const group = store.groups[store.groupIndex]

        const folders = Object.keys(store.selectedFolders)
            .map((k) => group.dirs[parseInt(k, 10)])
            .sort()

        const files = Object.keys(group.hashes).length * folders.length

        return (
            <div className={classNames(styles.cleanup, 'fo-step')}>
                {folders.map((f) => (
                    <div key={f}>{f}</div>
                ))}
                <div>{files}</div>
                <div className={styles.action}>
                    <div
                        className={classNames(
                            styles.button,
                            styles.yes,
                            store.pendingDeletes.length > 0 && styles.active
                        )}
                        onClick={this.toggleDelete}
                    >
                        Löschen
                    </div>
                    <div
                        className={classNames(
                            styles.button,
                            styles.no,
                            store.pendingDeletes.length < 1 && styles.active
                        )}
                        onClick={this.toggleDelete}
                    >
                        Nicht löschen
                    </div>
                </div>
                {store.deleteCount > 0 && (
                    <div>
                        {store.deleteCount - store.pendingDeletes.length}/{store.deleteCount}
                    </div>
                )}
            </div>
        )
    }

    private readonly toggleDelete = (): void => store.toggleDelete()
}
