import { observer } from 'mobx-react'
import * as React from 'react'

import { store } from '../store'

interface IFinishedProps {}

@observer
export class Finished extends React.PureComponent<IFinishedProps> {
    render(): JSX.Element {
        return (
            <div className='fo-done fo-step'>
                <button onClick={() => (store.step = 'choose-root')}>[Fertig]</button>
            </div>
        )
    }
}
