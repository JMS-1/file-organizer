import classNames from 'classnames'
import { observer } from 'mobx-react'
import { basename } from 'path'
import * as React from 'react'

import styles from './file.module.scss'

import { IFileInfo } from '../../hashMap'

interface IFolderGroupProps {
    files: IFileInfo[]
    select(hash: string): void
    selected: boolean
}

@observer
export default class DuplicateFile extends React.Component<IFolderGroupProps> {
    render(): JSX.Element | null {
        const file = this.props.files[0]

        if (!file.hash) {
            return null
        }

        return (
            <div className={classNames(styles.file, this.props.selected && styles.selected)} onClick={this.select}>
                {basename(file.path)}
            </div>
        )
    }

    private readonly select = (): void => this.props.select(this.props.files[0].hash || '')
}
