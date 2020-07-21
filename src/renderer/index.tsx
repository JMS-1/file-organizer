import * as React from 'react'
import { render } from 'react-dom'

import { Root } from './root'

import { config } from '../host/config'

setTimeout(async () => {
    try {
        render(<Root />, document.querySelector('app-root'))
    } catch (error) {
        alert(error)
    }
}, 1000)

// Kleine Hilfe zum Styling während der Entwicklung.
if (config.develop) {
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
