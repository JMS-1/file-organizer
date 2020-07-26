import classNames from 'classnames'
import { observer } from 'mobx-react'
import * as React from 'react'

import styles from './comparer.module.scss'
import Progress from './progress'

import { store } from '../store'

interface IFileComparerProps {}

@observer
export default class FileComparer extends React.Component<IFileComparerProps> {
    render(): JSX.Element {
        return (
            <div className={classNames(styles.compare, 'fo-step')}>
                <h1>Verzeichnisse zum Löschen auswählen</h1>
                <Progress max={100} value={store.progress} />
            </div>
        )
    }
}
