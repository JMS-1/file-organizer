import { fromFile } from 'file-type'
import { observable, action } from 'mobx'
import { observer } from 'mobx-react'
import * as React from 'react'
import { pathToFileURL } from 'url'

import DuplicateFile from './file'
import Folder from './folder'
import styles from './group.module.scss'

import { store } from '../../store'

interface IFolderGroupProps {}

@observer
export default class FolderGroup extends React.Component<IFolderGroupProps> {
    @observable private _selected?: string = undefined

    @observable private _mimeType = ''

    render(): JSX.Element | null {
        const group = store.groups[store.groupIndex]

        if (!group) {
            return null
        }

        return (
            <div className={styles.group}>
                <div className={styles.folders}>{group && group.dirs.map((d) => <Folder key={d} path={d} />)}</div>
                <div className={styles.files}>
                    <div className={styles.list}>
                        {Object.keys(group.hashes).map((h) => (
                            <DuplicateFile
                                key={h}
                                files={group.hashes[h]}
                                select={this.select}
                                selected={h === this._selected}
                            />
                        ))}
                    </div>
                    <div className={styles.preview}>{this.createPreview()}</div>
                </div>
            </div>
        )
    }

    private createPreview(): JSX.Element | null {
        const path = this._selected && store.groups[store.groupIndex].hashes[this._selected][0].path
        const href = path && pathToFileURL(path).href

        if (href) {
            switch (this._mimeType.split('/')[0]) {
                case 'audio':
                    return <audio controls src={href} />
                case 'video':
                    return <video controls src={href} />
                case 'image':
                    return <img src={href} />
            }
        }

        return null
    }

    @action
    private readonly select = async (hash: string): Promise<void> => {
        this._selected = hash
        this._mimeType = ''

        try {
            const result = await fromFile(store.groups[store.groupIndex].hashes[hash][0].path)
            const mimeType = result?.mime || ''

            if (this._selected === hash) {
                this._mimeType = mimeType
            }
        } catch (error) {
            console.error(error.message)
        }
    }
}
