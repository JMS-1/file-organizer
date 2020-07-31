import classNames from 'classnames'
import { observer } from 'mobx-react'
import { basename } from 'path'
import * as React from 'react'

import styles from './file.module.scss'

import { IFileInfo } from '../../hashMap'
import { store } from '../../store'

interface IDuplicateFileProps {
    files: IFileInfo[]
    selected: boolean
}

@observer
export default class DuplicateFile extends React.Component<IDuplicateFileProps> {
    render(): JSX.Element | null {
        const file = this.props.files[0]

        if (!file.hash) {
            return null
        }

        const name = basename(file.path)

        return (
            <div
                className={classNames(styles.file, this.props.selected && styles.selected)}
                title={name}
                onClick={this.select}
            >
                {name}
            </div>
        )
    }

    private readonly select = (): Promise<void> => store.selectHash(this.props.files[0].hash || '')
}
