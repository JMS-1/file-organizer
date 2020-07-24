import * as React from 'react'
import { render } from 'react-dom'

import { Root } from './root'

import './index.scss'

render(<Root />, document.querySelector('body > div#app'))
