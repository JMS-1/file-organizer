import classNames from 'classnames'
import { observer } from 'mobx-react'
import * as React from 'react'

import styles from './comparer.module.scss'
import Progress from './progress'

import { store } from '../store'

interface IFileComparerProps {}

@observer
export default class FileComparer extends React.Component<IFileComparerProps> {
    render(): JSX.Element {
        return (
            <div className={classNames(styles.compare, 'fo-step')}>
                <h1>Schritt 3: Duplikate ermitteln</h1>
                <div>
                    <p>
                        Im zeitlich aufwändigsten Schritt werden alle ermittelten Dateien miteinander verglichen. Du
                        kannst an dem Fortschrittsbalken erahnen, wie lange die Auswertung noch dauern wird. Rechts
                        unten bleibt <strong>Weiter</strong> inaktiv, solange der Vergleich noch nicht abgeschlossen
                        ist. Du kannst den Vergleich jederzeit links unten durch <strong>Abbrechen</strong> vorzeitig
                        beenden.
                    </p>
                    <Progress max={100} value={store.progress} />
                    <p>
                        Sind alle Dateien miteinander verglichen, so kannst Du rechts unten durch Drücken von{' '}
                        <strong>Weiter</strong> die Vergleichsergebnisse erst einmal in Aufgenschein nehmen. Wenn eine
                        Datei in mehreren Ordnern aufgefunden wurde, so wird dazu immer erst einmal die Liste der Ordner
                        aufgeführt, in denen die Datei gefunden wurde.
                    </p>
                </div>
            </div>
        )
    }
}
