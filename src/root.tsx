import { observer } from 'mobx-react'
import * as React from 'react'

import { DirectoryChooser, FileFinder, FileComparer, FileCleaner, Finished, FileInspector } from './steps'
import { store } from './store'

interface IRootProps {}

@observer
export class Root extends React.PureComponent<IRootProps> {
    render(): JSX.Element {
        return <div className='fo-root'>{this.createStep()}</div>
    }

    private createStep(): JSX.Element {
        switch (store.step) {
            case 'choose-root':
                return <DirectoryChooser />
            case 'find-files':
                return <FileFinder />
            case 'compare-files':
                return <FileComparer />
            case 'inspect-duplicates':
                return <FileInspector />
            case 'confirm-delete':
                return <FileCleaner />
            case 'finished':
                return <Finished />
        }
    }
}
