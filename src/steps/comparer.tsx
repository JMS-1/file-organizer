import { observer } from 'mobx-react'
import * as React from 'react'

import { store } from '../store'

interface IFileComparerProps {}

@observer
export class FileComparer extends React.PureComponent<IFileComparerProps> {
    render(): JSX.Element {
        return (
            <div className='fo-compare-files fo-step'>
                <button onClick={() => (store.step = 'inspect-duplicates')}>[Dateien vergleichen]</button>
            </div>
        )
    }
}
