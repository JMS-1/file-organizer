import classNames from 'classnames'
import { observer } from 'mobx-react'
import * as React from 'react'

import styles from './inspector.module.scss'

import { store } from '../store'

interface IFileInspectorProps {}

@observer
export default class FileInspector extends React.Component<IFileInspectorProps> {
    render(): JSX.Element {
        const group = store.groups[store.groupIndex]

        return (
            <div className={classNames(styles['fo-file-inspector'], 'fo-step')}>
                <div>
                    {store.groupIndex + 1}/{store.groups.length}
                </div>
                {group && group.dirs.map((d) => <div key={d}>{d}</div>)}
                <hr />
                {group &&
                    Object.keys(group.hashes).map((h) => (
                        <ul key={h}>
                            {group.hashes[h].map((f) => (
                                <li key={f.path}>{f.path}</li>
                            ))}
                        </ul>
                    ))}
            </div>
        )
    }
}
