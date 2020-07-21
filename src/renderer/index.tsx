import * as React from 'react'
import { render } from 'react-dom'

import { Root } from './root'

const isProduction = process.env.NODE_ENV === 'production'

import './index.scss'

render(<Root />, document.querySelector('body > div#app'))

// Kleine Hilfe zum Styling während der Entwicklung.
if (!isProduction) {
    document.addEventListener('keydown', (ev: KeyboardEvent) => {
        if (!ev.ctrlKey || ev.key !== 'F12') {
            return
        }

        const css = document.querySelectorAll('head > link[rel="stylesheet"]')

        for (let i = 0; i < css.length; i++) {
            const link = css[i] as HTMLLinkElement

            // eslint-disable-next-line no-self-assign
            link.href = link.href
        }
    })
}
