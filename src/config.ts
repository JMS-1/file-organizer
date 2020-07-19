import { readFileSync } from 'fs'
import { join } from 'path'

export interface IConfiguration {
    develop: boolean
}

const raw = readFileSync(join(__dirname, '../config.json')).toString()

let json = JSON.parse(raw.substr(raw.indexOf('{')))

try {
    const usrConfig = readFileSync(join(__dirname, '../config.custom.json')).toString()

    json = { ...json, ...JSON.parse(usrConfig.substr(usrConfig.indexOf('{'))) }
} catch (error) {
    // Das ist in Ordnung
}

export const config: IConfiguration = json
