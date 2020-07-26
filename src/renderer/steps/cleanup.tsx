import classNames from 'classnames'
import { observer } from 'mobx-react'
import * as React from 'react'

import styles from './cleanup.module.scss'
import Progress from './progress'

import { store } from '../store'

interface IFileCleanerProps {}

function makeCount(count: number): string {
    return count === 1 ? 'wird ein Duplikat' : `werden ${count} Duplikate`
}

@observer
export default class FileCleaner extends React.Component<IFileCleanerProps> {
    render(): JSX.Element | null {
        const group = store.groups[store.groupIndex]

        if (!group) {
            return null
        }

        const folders = Object.keys(store.selectedFolders)
            .map((k) => group.dirs[parseInt(k, 10)])
            .sort()

        const files = Object.keys(group.hashes).length * folders.length

        return (
            <div className={classNames(styles.cleanup, 'fo-step')}>
                <h1>Schritt 5: Löschen bestätigen</h1>
                <div>
                    <p>
                        Du hast im vorherigen Schritt mindestens einen Ordner zum Entfernen von Duplikaten ausgewählt:
                    </p>
                    {folders.map((f) => (
                        <div key={f} className={styles.folder}>
                            {f}
                        </div>
                    ))}
                    <p>
                        Falls Du Dich dabei vertan hast, dann kannst Du links unten über <strong>Zurück</strong> Deine
                        Auswahl jetzt noch korrigieren.
                    </p>
                    <p>
                        Wenn Du rechts unten <strong>Löschen</strong> drückst, dann {makeCount(files)} in den Papierkorb
                        verschoben. Es wird zwar während des Löschvorgangs ein Fortschrittsbalken angezeigt und der
                        Vorgang kann links unten durch <strong>Abbrechen</strong> vorzeitig beendet werden, allerdings
                        ist der Ablauf im Allgemeinen sehr zügig, so dass eine vorschnelle Entscheidung selten
                        korrigiert werden kann.
                    </p>
                    <p>
                        Zu Deiner eigenen Sicherheit musst Du daher hier das Löschen noch einmal explizit durch Klicken
                        auf <strong>Löschen</strong> bestätigen - <strong>Nicht löschen</strong> macht das wieder
                        rückgängig. Mit der Bestätigung zum Löschen ändert sich rechts unten die Beschriftung von{' '}
                        <strong>Weiter</strong> auf <strong>Löschen</strong> und es wird Dir optisch signalisiert, dass
                        es nun gefährlich wird. Es gibt keine weitere Sicherheitsabfragen mehr, <strong>Löschen</strong>{' '}
                        rechts unten beginnt mit dem Entfernen der Duplikate und zeigt dann im Allgemeinen die nächste
                        Gruppe von Duplikaten zur Untersuchung durch Dich an.
                    </p>
                    <div className={styles.action}>
                        <div
                            className={classNames(
                                styles.button,
                                styles.yes,
                                store.pendingDeletes.length > 0 && styles.active
                            )}
                            onClick={this.enable}
                        >
                            Löschen
                        </div>
                        <div
                            className={classNames(
                                styles.button,
                                styles.no,
                                store.pendingDeletes.length < 1 && styles.active
                            )}
                            onClick={this.disable}
                        >
                            Nicht löschen
                        </div>
                    </div>
                    {store.deleteCount > 0 && (
                        <Progress max={store.deleteCount} value={store.deleteCount - store.pendingDeletes.length} />
                    )}
                </div>
            </div>
        )
    }

    private readonly enable = (): void => store.enableDelete(true)

    private readonly disable = (): void => store.enableDelete(false)
}
