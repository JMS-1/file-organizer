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
        const folders = Object.keys(store.selectedFolders).sort()
        const files = Object.keys(group.hashes).length * folders.length

        return (
            <div className={classNames(styles.cleanup, 'fo-step')}>
                {folders.map((f) => (
                    <div key={f}>{f}</div>
                ))}
                <div>{files}</div>
            </div>
        )
    }
}
