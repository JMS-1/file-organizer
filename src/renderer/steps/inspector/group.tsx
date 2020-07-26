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
                <p>
                    Als erstes siehst Du die Liste der Ordner, in denen identische Duplikate gefunden wurden. Durch
                    Anklicken kannst Du festlegen, dass alle der unten angezeigten Duplikate aus dem Ordner entfernt
                    werden. Bei einem so ausgewählten Ordner ist der Mülleimer links dann rot markiert - ein weiterer
                    Klick auf den Ordner macht die Auswahl wirder rückgängig. Bitte beachte, dass Du nur Duplikate
                    entfernen kannst: sobald Du <strong>alle</strong> Ordner markiert hast, wird rechts unten{' '}
                    <strong>Löschen</strong> deaktiviert.
                </p>
                <div className={styles.folders}>
                    {group.dirs.map((d, i) => (
                        <Folder key={i} index={i} path={d} />
                    ))}
                </div>
                <p>
                    Ist kein Ordner zum Löschen von Duplikaten markiert, so kannst Du rechts unten mit{' '}
                    <strong>Weiter</strong> einfach zur nächsten Gruppe von Duplikaten wechseln. Mit{' '}
                    <strong>Zurück</strong> links unten gelangst Du zurück zur Suche nach Duplikaten.
                </p>
                <p>
                    Wenn Du Dir eines der Duplikate in der nun folgenden Liste anschauen möchtest, dann klicke es
                    einfach an. Handelt es sich um ein Bild, ein Video oder eine Tonaufzeichnung, so kannst Du sie Dir
                    dann rechts daneben anschauen respektive anhören.
                </p>
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
