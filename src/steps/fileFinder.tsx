import { observer } from 'mobx-react'
import * as React from 'react'

import { store } from '../store'

interface IFileFinderProps {}

@observer
export class FileFinder extends React.PureComponent<IFileFinderProps> {
    render(): JSX.Element {
        return (
            <div className='fo-find-files fo-step'>
                <button onClick={() => (store.step = 'compare-files')}>[Suche nach Dateien]</button>
            </div>
        )
    }
}
