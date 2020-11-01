import { configure } from 'mobx'
import * as React from 'react'
import { render } from 'react-dom'

import { Root } from './root'

import './index.scss'

configure({ enforceActions: 'never' })

render(<Root />, document.querySelector('body > div#app'))
