import classNames from 'classnames'
import { observer } from 'mobx-react'
import * as React from 'react'

import styles from './cleanup.module.scss'

import { store } from '../store'

interface IFileCleanerProps {}

@observer
export default class FileCleaner extends React.Component<IFileCleanerProps> {
    render(): JSX.Element {
        return (
            <div className={classNames(styles.cleanup, 'fo-step')}>
                {store.groupIndex + 1}/{store.groups.length}
            </div>
        )
    }
}
