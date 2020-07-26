import classNames from 'classnames'
import { observer } from 'mobx-react'
import * as React from 'react'

import styles from './done.module.scss'

interface IFinishedProps {}

@observer
export default class Finished extends React.Component<IFinishedProps> {
    render(): JSX.Element {
        return (
            <div className={classNames(styles.done, 'fo-step')}>
                <h1>Schritt 5: Geschafft!</h1>
                <div>
                    <p>
                        So, das war es nun, Du bist mit allen Schritten durch und hast hoffentlich erreicht, was Du
                        wolltest. Mit <strong>Nochmal</strong> rechts unten kannst wieder ganz von vorne mit der Auswahl
                        eines Ordners beginnen. Wenn Du das nicht willst, schließt Du einfach das Fenster des
                        Dateiorganisators.
                    </p>
                </div>
            </div>
        )
    }
}
