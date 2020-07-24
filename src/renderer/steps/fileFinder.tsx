import classNames from 'classnames'
import { observer } from 'mobx-react'
import * as React from 'react'

import styles from './fileFinder.module.scss'

import { store } from '../store'

interface IFileFinderProps {}

@observer
export default class FileFinder extends React.Component<IFileFinderProps> {
    render(): JSX.Element {
        return <div className={classNames(styles.files, 'fo-step')}>{store.files.length}</div>
    }
}
