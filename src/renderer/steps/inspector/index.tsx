import classNames from 'classnames'
import { observer } from 'mobx-react'
import * as React from 'react'

import FolderGroup from './group'
import styles from './inspector.module.scss'

import { store } from '../../store'

interface IFileInspectorProps {}

@observer
export default class FileInspector extends React.Component<IFileInspectorProps> {
    render(): JSX.Element {
        return (
            <div className={classNames(styles.inspector, 'fo-step')}>
                <div>
                    {store.groupIndex + 1}/{store.groups.length}
                </div>
                <FolderGroup />
            </div>
        )
    }
}
