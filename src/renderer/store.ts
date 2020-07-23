import { remote } from 'electron'
import { statSync, readdir, stat, Stats } from 'fs'
import { observable, action, computed } from 'mobx'
import { join } from 'path'
import { promisify } from 'util'

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

interface IFileInfo {
    readonly info: Stats
    readonly path: string
}

class RootStore {
    @observable step: TStep = 'choose-root'

    @observable private readonly _configuration: IConfiguration = { rootPath: '' }

    @observable busy = 0

    @observable readonly files: IFileInfo[] = []

    @observable private _scanning = false

    constructor() {
        const config = localStorage.getItem(configName) || JSON.stringify(this._configuration)

        this._configuration = JSON.parse(config)
    }

    get rootPath(): string {
        return this._configuration.rootPath
    }

    get scanning(): boolean {
        return this._scanning
    }

    private writeStore(): void {
        localStorage.setItem(configName, JSON.stringify(this._configuration))
    }

    private async scanFiles(): Promise<void> {
        this._scanning = true

        try {
            this.files.splice(0)

            const folders = [this.rootPath]

            while (folders.length > 0 && this._scanning) {
                const folder = folders.splice(0, 1)[0]

                try {
                    const content = await promisify(readdir)(folder)
                    const infos = await Promise.all(
                        content
                            .map((name) => join(folder, name))
                            .map(
                                async (path): Promise<IFileInfo | undefined> => {
                                    try {
                                        return { info: await promisify(stat)(path), path }
                                    } catch (error) {
                                        return undefined
                                    }
                                }
                            )
                    )

                    const dirs = infos.filter((i) => i?.info.isDirectory()).map((i) => i?.path) as string[]
                    const files = infos.filter((i) => i?.info.isFile()) as IFileInfo[]

                    folders.push(...dirs)

                    this.files.push(...files)
                } catch (error) {
                    console.error(error.message)
                }
            }
        } catch (error) {
            this.files.splice(0)

            console.error(error.message)
        } finally {
            this._scanning = false
        }
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

        switch (this.step) {
            case 'choose-root':
                this.scanFiles()

                break
        }

        this.step = stepOrder[(index + 1) % stepOrder.length]
    }

    @action
    prevStep(): void {
        switch (this.step) {
            case 'find-files':
                this._scanning = false

                break
        }

        const index = stepOrder.findIndex((s) => s === this.step)

        this.step = stepOrder[(index + stepOrder.length - 1) % stepOrder.length]
    }

    @computed
    get backButtonText(): string {
        switch (this.step) {
            case 'find-files':
                return this.scanning ? 'Abbrechen' : 'Zurück'
        }

        return 'Zurück'
    }

    @computed
    get isBackButtonEnabled(): boolean {
        switch (this.step) {
            case 'find-files':
                return true
        }

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
