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
                <h1>Fertig</h1>
                <div />
            </div>
        )
    }
}
