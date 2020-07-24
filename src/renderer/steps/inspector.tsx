import classNames from 'classnames'
import { observer } from 'mobx-react'
import * as React from 'react'

import styles from './inspector.module.scss'

import { store } from '../store'

interface IFileInspectorProps {}

@observer
export default class FileInspector extends React.Component<IFileInspectorProps> {
    render(): JSX.Element {
        return (
            <div className={classNames(styles['fo-file-inspector'], 'fo-step')}>
                {store.groups.map((g, i) => (
                    <div key={i}>
                        {g.dirs.length}/{Object.keys(g.hashes).length}
                    </div>
                ))}
            </div>
        )
    }
}
