import { remote } from 'electron'
import { observable, action } from 'mobx'

export type TSteps =
    | 'choose-root'
    | 'find-files'
    | 'compare-files'
    | 'inspect-duplicates'
    | 'confirm-delete'
    | 'finished'

const configName = remote.process.env['npm_package_build_appId'] || ''

interface IConfiguration {
    rootPath: string
}

class RootStore {
    @observable step: TSteps = 'choose-root'

    @observable private readonly _configuration: IConfiguration = { rootPath: '' }

    constructor() {
        const config = localStorage.getItem(configName) || JSON.stringify(this._configuration)

        this._configuration = JSON.parse(config)
    }

    get rootPath(): string {
        return this._configuration.rootPath
    }

    private writeStore(): void {
        localStorage.setItem(configName, JSON.stringify(this._configuration))
    }

    @action
    setRootPath(path: string): void {
        this._configuration.rootPath = path

        this.writeStore()
    }
}

export const store = new RootStore()
