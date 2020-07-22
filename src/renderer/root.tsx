import { observer } from 'mobx-react'
import * as React from 'react'

import styles from './root.module.scss'
import { store } from './store'

interface IRootProps {}

const LazyDirectoryChooser = React.lazy(() => import('./steps/directoryChooser'))

const LazyFileFinder = React.lazy(() => import('./steps/fileFinder'))

const LazyFileComparer = React.lazy(() => import('./steps/comparer'))

const LazyFileInspector = React.lazy(() => import('./steps/inspector'))

const LazyFileCleaner = React.lazy(() => import('./steps/cleanup'))

const LazyFinished = React.lazy(() => import('./steps/done'))

@observer
export class Root extends React.Component<IRootProps> {
    render(): JSX.Element {
        return (
            <div className={styles['fo-root']}>
                <React.Suspense fallback={<div className='fo-step' />}>{this.createStep()}</React.Suspense>
            </div>
        )
    }

    private createStep(): JSX.Element {
        switch (store.step) {
            case 'choose-root':
                return <LazyDirectoryChooser />
            case 'find-files':
                return <LazyFileFinder />
            case 'compare-files':
                return <LazyFileComparer />
            case 'inspect-duplicates':
                return <LazyFileInspector />
            case 'confirm-delete':
                return <LazyFileCleaner />
            case 'finished':
                return <LazyFinished />
        }
    }
}
