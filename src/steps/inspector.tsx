import { observer } from 'mobx-react'
import * as React from 'react'

import { store } from '../store'

interface IFileInspectorProps {}

@observer
export class FileInspector extends React.PureComponent<IFileInspectorProps> {
    render(): JSX.Element {
        return (
            <div className='fo-file-inspector fo-step'>
                <button onClick={() => (store.step = 'confirm-delete')}>[Dateien zum Löschen auswählen]</button>
            </div>
        )
    }
}
