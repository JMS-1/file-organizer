import classNames from 'classnames'
import { observer } from 'mobx-react'
import * as React from 'react'

import styles from './folder.module.scss'

import trash from '../../icons/trash-alt.svg'
import { store } from '../../store'

const trashSvg = Buffer.from(trash.match(/^data:.+\/(.+);base64,(.*)$/)?.[2] || '', 'base64').toString()

interface IFolderProps {
    path: string
}

@observer
export default class Folder extends React.Component<IFolderProps> {
    render(): JSX.Element | null {
        const { path } = this.props

        return (
            <div className={styles.folder} onClick={this.onClick}>
                <div
                    className={classNames(styles.icon, store.selectedFolders[path] && styles.selected)}
                    dangerouslySetInnerHTML={{ __html: trashSvg }}
                />
                {this.props.path}
            </div>
        )
    }

    private readonly onClick = (): void => {
        const { path } = this.props
        const { selectedFolders } = store

        selectedFolders[path] = !selectedFolders[path]
    }
}
