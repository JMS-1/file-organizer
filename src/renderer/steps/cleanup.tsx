import { observer } from 'mobx-react'
import * as React from 'react'

import { store } from '../store'

interface IFileCleanerProps {}

@observer
export class FileCleaner extends React.PureComponent<IFileCleanerProps> {
    render(): JSX.Element {
        return (
            <div className='fo-file-cleanup fo-step'>
                <button onClick={() => (store.step = 'finished')}>[Dateien löschen]</button>
            </div>
        )
    }
}
