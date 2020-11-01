import classNames from 'classnames'
import { observer } from 'mobx-react'
import * as React from 'react'

import styles from './fileFinder.module.scss'

import { store } from '../store'

interface IFileFinderProps {}

function makeNumber(count: number): string {
    switch (count) {
        case 0:
            return 'wurde keine Datei'
        case 1:
            return 'wurde eine Datei'
        default:
            return `wurden ${count} Dateien`
    }
}

@observer
export default class FileFinder extends React.Component<IFileFinderProps> {
    render(): JSX.Element {
        return (
            <div className={classNames(styles.files, 'fo-step')}>
                <h1>Schritt 2: Dateien vergleichen</h1>
                <div>
                    <p>
                        Dein ausgewählter Ordner <strong>{store.rootPath}</strong> wird nun nach Dateien untersucht.
                        Solange der Ordnerbaum noch nicht vollständig untersucht wurde, ist <strong>Vergleichen</strong>{' '}
                        rechts unten deaktiviert. Du kannst den Suchvorgang links unten über <strong>Abbrechen</strong>{' '}
                        vorzeitig beenden.
                    </p>
                    <p>
                        Bisher {makeNumber(store.files.length)} gefunden - die Suche ist abgeschlossen, sobald rechts
                        unten <strong>Vergleichen</strong> aktiviert ist.
                    </p>
                    <p>
                        Wenn Du <strong>Vergleichen</strong> drückst werden Duplikate der gefundenen Dateien ermittelt.
                        Je nach Anzahl der Dateien kann das wieder eine ganze Weile dauern
                    </p>
                </div>
            </div>
        )
    }
}
