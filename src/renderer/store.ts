import { createHash } from 'crypto'
import { remote } from 'electron'
import { statSync, readdir, stat, createReadStream } from 'fs'
import { observable, action, computed } from 'mobx'
import { join } from 'path'
import { promisify } from 'util'

import { HashMap, IFileInfo, IGroupInfo } from './hashMap'

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
    maxFileSize: number
    minFileSize: number
    rootPath: string
}

function getHash(path: string, abort: () => boolean): Promise<string> {
    return new Promise<string>((success, failure) => {
        try {
            const algo = createHash('sha1')
            const stream = createReadStream(path)

            stream.on('data', (data) => {
                if (abort()) {
                    stream.emit('end')
                } else {
                    algo.update(data)
                }
            })

            stream.on('end', () => {
                const hash = algo.digest('hex')

                success(hash)
            })
        } catch (error) {
            failure(error)
        }
    })
}

class RootStore {
    @observable step: TStep = 'choose-root'

    @observable private readonly _configuration: IConfiguration = {
        maxFileSize: 100 * 1024 * 1024,
        minFileSize: 10 * 1024,
        rootPath: '',
    }

    @observable busy = 0

    @observable readonly files: IFileInfo[] = []

    @observable readonly groups: IGroupInfo[] = []

    @observable private _scanning = false

    @observable private _hash = 0

    @observable groupIndex = 0

    constructor() {
        const config = localStorage.getItem(configName) || '{}'

        this._configuration = { ...this._configuration, ...JSON.parse(config) }
    }

    get rootPath(): string {
        return this._configuration.rootPath
    }

    get maxFileSize(): number {
        return this._configuration.maxFileSize
    }

    get minFileSize(): number {
        return this._configuration.minFileSize
    }

    get scanning(): boolean {
        return this._scanning
    }

    get hashing(): boolean {
        return this._hash > 0
    }

    get progress(): number {
        if (this._hash < 1) {
            return 100
        }

        const count = this._hash - 1 || this.files.length

        return Math.max(0, Math.min(100, Math.round((count * 100) / this.files.length)))
    }

    private writeStore(): void {
        localStorage.setItem(configName, JSON.stringify(this._configuration))
    }

    @action
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

                    const files = infos.filter(
                        (i) => i?.info.isFile() && i.info.size >= this.minFileSize && i.info.size <= this.maxFileSize
                    ) as IFileInfo[]

                    folders.push(...dirs)

                    this.files.push(...files)
                } catch (error) {
                    console.error(error.message)
                }
            }
        } catch (error) {
            this._scanning = false

            console.error(error.message)
        } finally {
            if (this._scanning) {
                this._scanning = false
            } else {
                this.files.splice(0)
            }
        }
    }

    @action
    private async createHash(): Promise<void> {
        this._hash = 1

        try {
            this.groups.splice(0)
            this.groupIndex = 0

            const hashes = new HashMap()

            for (const file of this.files) {
                if (!this.hashing) {
                    break
                }

                try {
                    file.hash = await getHash(file.path, () => !this.hashing)

                    hashes.add(file)
                } catch (error) {
                    console.error(error.message)
                }

                if (this.hashing) {
                    this._hash += 1
                }
            }

            this.groups.push(...hashes.finish())
        } catch (error) {
            this._hash = 0

            console.error(error.message)
        } finally {
            if (this._hash > 0) {
                this._hash = 0
            }
        }
    }

    @action
    setRootPath(path: string): void {
        this._configuration.rootPath = path

        this.writeStore()
    }

    @computed
    get isBackButtonVisible(): boolean {
        return this.step !== 'choose-root' && this.step !== 'finished'
    }

    @action
    nextStep(): void {
        switch (this.step) {
            case 'choose-root':
                this.scanFiles()

                break
            case 'find-files':
                this.createHash()

                break
            case 'confirm-delete':
                this.groupIndex += 1

                if (this.groupIndex < this.groups.length) {
                    this.step = 'inspect-duplicates'

                    return
                }

                break
        }

        const index = stepOrder.findIndex((s) => s === this.step)

        this.step = stepOrder[(index + 1) % stepOrder.length]
    }

    @action
    prevStep(): void {
        switch (this.step) {
            case 'find-files':
                this._scanning = false

                break
            case 'compare-files':
                this._hash = 0

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
            case 'compare-files':
                return this.hashing ? 'Abbrechen' : 'Zurück'
        }

        return 'Zurück'
    }

    @computed
    get isBackButtonEnabled(): boolean {
        switch (this.step) {
            case 'compare-files':
            case 'confirm-delete':
            case 'find-files':
            case 'inspect-duplicates':
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
            case 'find-files': {
                return !this.scanning && this.files.length > 0
            }
            case 'compare-files': {
                return !this.hashing
            }
            case 'confirm-delete':
            case 'finished':
            case 'inspect-duplicates': {
                return true
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
