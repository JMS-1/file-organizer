import { observer } from 'mobx-react'
import * as React from 'react'

import { store } from '../store'

interface IDirectoryChooserProps {}

@observer
export class DirectoryChooser extends React.PureComponent<IDirectoryChooserProps> {
    render(): JSX.Element {
        return (
            <div className='fo-choose-directory fo-step'>
                <button onClick={() => (store.step = 'find-files')}>[Verzeichnisauswahl]</button>
            </div>
        )
    }
}
