import { observer } from 'mobx-react'
import * as React from 'react'

import styles from './progress.module.scss'

interface IProgressProps {
    max: number
    value: number
}

@observer
export default class Progress extends React.Component<IProgressProps> {
    render(): JSX.Element | null {
        const { max } = this.props

        const value = Math.max(0, Math.min(max, this.props.value))

        return (
            <progress className={styles.progress} max={max} value={value}>
                {value} von {max}
            </progress>
        )
    }
}
