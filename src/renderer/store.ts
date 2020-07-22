import { remote } from 'electron'
import { statSync } from 'fs'
import { observable, action, computed } from 'mobx'

export type TStep =
    | 'choose-root'
    | 'compare-files'
    | 'confirm-delete'
    | 'find-files'
    | 'finished'
    | 'inspect-duplicates'

const configName = remote.process.env['npm_package_build_appId'] || ''

const stepOrder: TStep[] = [
    'choose-root',
    'find-files',
    'compare-files',
    'inspect-duplicates',
    'confirm-delete',
    'finished',
]

interface IConfiguration {
    rootPath: string
}

class RootStore {
    @observable step: TStep = 'choose-root'

    @observable private readonly _configuration: IConfiguration = { rootPath: '' }

    @observable busy = 0

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

    @computed
    get isBackButtonVisible(): boolean {
        return this.step !== 'choose-root'
    }

    @action
    nextStep(): void {
        const index = stepOrder.findIndex((s) => s === this.step)

        this.step = stepOrder[(index + 1) % stepOrder.length]
    }

    @action
    prevStep(): void {
        const index = stepOrder.findIndex((s) => s === this.step)

        this.step = stepOrder[(index + stepOrder.length - 1) % stepOrder.length]
    }

    @computed
    get backButtonText(): string {
        return 'Zurück'
    }

    @computed
    get isBackButtonEnabled(): boolean {
        return false
    }

    @computed
    get isNextButtonEnabled(): boolean {
        switch (this.step) {
            case 'choose-root': {
                try {
                    return statSync(this.rootPath).isDirectory()
                } catch (error) {
                    return false
                }
            }
        }

        return false
    }

    @computed
    get nextButtonText(): string {
        return 'Weiter'
    }
}

export const store = new RootStore()
