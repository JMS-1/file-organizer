import classNames from 'classnames'
import { observer } from 'mobx-react'
import * as React from 'react'

import styles from './comparer.module.scss'

import { store } from '../store'

interface IFileComparerProps {}

@observer
export default class FileComparer extends React.Component<IFileComparerProps> {
    render(): JSX.Element {
        return (
            <div className={classNames(styles['fo-compare-files'], 'fo-step')}>
                <button onClick={() => (store.step = 'inspect-duplicates')}>[Dateien vergleichen]</button>
            </div>
        )
    }
}
