import { observer } from 'mobx-react'
import * as React from 'react'

import DuplicateFile from './file'
import Folder from './folder'
import styles from './group.module.scss'

import { store } from '../../store'

interface IFolderGroupProps {}

@observer
export default class FolderGroup extends React.Component<IFolderGroupProps> {
    render(): JSX.Element | null {
        const group = store.groups[store.groupIndex]

        if (!group) {
            return null
        }

        return (
            <div className={styles.group}>
                <div className={styles.folders}>
                    {group.dirs.map((d, i) => (
                        <Folder key={i} index={i} path={d} />
                    ))}
                </div>
                <div className={styles.files}>
                    <div className={styles.list}>
                        {Object.keys(group.hashes).map((h) => (
                            <DuplicateFile key={h} files={group.hashes[h]} selected={h === store.selectedHash} />
                        ))}
                    </div>
                    <div className={styles.preview}>{this.createPreview()}</div>
                </div>
            </div>
        )
    }

    private createPreview(): JSX.Element | null {
        const href = store.selectedUri

        if (href) {
            switch (store.mimeType.split('/')[0]) {
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
}
