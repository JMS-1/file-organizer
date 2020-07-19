import * as React from 'react'

interface IRootProps {}

export class Root extends React.PureComponent<IRootProps> {
    render(): JSX.Element {
        return <div className='fo-root'>[ROOT]</div>
    }
}
