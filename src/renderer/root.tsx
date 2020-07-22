import classNames from 'classnames'
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
            <div className={classNames(styles['fo-root'], store.busy > 0 && styles.busy)}>
                <React.Suspense fallback={<div className='fo-step' />}>
                    {this.createStep()}
                    <div className={styles.actions}>
                        <button
                            className={classNames(
                                !store.isBackButtonVisible && styles.hidden,
                                !store.isBackButtonEnabled && styles.disabled
                            )}
                            onClick={store.isBackButtonEnabled ? this.prevStep : undefined}
                        >
                            {store.backButtonText}
                        </button>
                        <button
                            className={classNames(!store.isNextButtonEnabled && styles.disabled)}
                            onClick={store.isNextButtonEnabled ? this.nextStep : undefined}
                        >
                            {store.nextButtonText}
                        </button>
                    </div>
                </React.Suspense>
            </div>
        )
    }

    private readonly nextStep = (): void => store.nextStep()

    private readonly prevStep = (): void => store.prevStep()

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
