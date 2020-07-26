import { createHash } from 'crypto'
import { remote } from 'electron'
import { fromFile } from 'file-type'
import { statSync, readdir, stat, createReadStream } from 'fs'
import { observable, action, computed } from 'mobx'
import { join } from 'path'
import trash from 'trash'
import { pathToFileURL } from 'url'
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

    @observable selectedFolders: Record<number, boolean> = {}

    @observable selectedHash = ''

    @observable mimeType = ''

    @observable selectedPath = ''

    @observable pendingDeletes: string[] = []

    @observable deleteCount = 0

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
            this.mimeType = ''
            this.selectedFolders = {}
            this.selectedHash = ''
            this.selectedPath = ''

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
    private async deleteFiles(): Promise<void> {
        this.deleteCount = this.pendingDeletes.length

        for (;;) {
            const file = this.pendingDeletes[0]

            if (!file) {
                if (this.deleteCount > 0) {
                    this.groups.splice(this.groupIndex, 1)
                } else {
                    this.groupIndex += 1
                }

                this.mimeType = ''
                this.selectedFolders = {}
                this.selectedHash = ''
                this.selectedPath = ''

                this.step = this.groupIndex < this.groups.length ? 'inspect-duplicates' : 'finished'

                break
            }

            try {
                await trash(file)
            } catch (error) {
                console.error(error.message)
            }

            this.pendingDeletes.splice(0, 1)
        }
    }

    @action
    async selectHash(hash: string): Promise<void> {
        this.mimeType = ''
        this.selectedHash = hash
        this.selectedPath = ''
        this.selectedPath = this.groups[this.groupIndex].hashes[hash][0].path

        try {
            const result = await fromFile(this.selectedPath)
            const mimeType = result?.mime || ''

            if (this.selectedHash === hash) {
                this.mimeType = mimeType
            }
        } catch (error) {
            console.error(error.message)
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
        let index = stepOrder.findIndex((s) => s === this.step)

        switch (this.step) {
            case 'choose-root':
                this.scanFiles()

                break
            case 'find-files':
                this.createHash()

                break
            case 'inspect-duplicates':
                if (Object.keys(this.selectedFolders).length < 1) {
                    this.groupIndex += 1
                    this.mimeType = ''
                    this.selectedHash = ''
                    this.selectedPath = ''

                    if (this.groupIndex < this.groups.length) {
                        index -= 1
                    } else {
                        index += 1
                    }
                } else {
                    this.deleteCount = 0
                    this.pendingDeletes = []
                }

                break
            case 'confirm-delete':
                this.deleteFiles()

                return
        }

        this.step = stepOrder[(index + 1) % stepOrder.length]
    }

    @action
    enableDelete(enable: boolean): void {
        this.pendingDeletes.splice(0)

        if (!enable) {
            return
        }

        const index = new Set(Object.keys(this.selectedFolders).map((k) => parseInt(k, 10)))
        const group = this.groups[this.groupIndex]

        for (const hash of Object.keys(group.hashes)) {
            const files = group.hashes[hash].filter((f, i) => index.has(i)).map((f) => f.path)

            this.pendingDeletes.push(...files)
        }
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
            case 'inspect-duplicates':
                this.groupIndex = 0
                this.mimeType = ''
                this.selectedHash = ''
                this.selectedPath = ''

                break
            case 'confirm-delete':
                if (this.deleteCount > 0) {
                    this.deleteCount = 0
                    this.pendingDeletes.splice(0)

                    return
                }

                break
        }

        const index = stepOrder.findIndex((s) => s === this.step)

        this.step = stepOrder[(index + stepOrder.length - 1) % stepOrder.length]
    }

    @computed
    get backButtonText(): string {
        const cancel =
            (this.step == 'find-files' && this.scanning) ||
            (this.step == 'compare-files' && this.hashing) ||
            (this.step == 'confirm-delete' && this.deleteCount > 0)

        return cancel ? 'Abbrechen' : 'Zurück'
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
                return !this.hashing && this.groups.length > 0
            }
            case 'finished': {
                return true
            }
            case 'confirm-delete': {
                return this.deleteCount < 1 || this.pendingDeletes.length < 1
            }
            case 'inspect-duplicates': {
                return Object.keys(this.selectedFolders).length < this.groups[this.groupIndex].dirs.length
            }
        }

        return false
    }

    @computed
    get nextButtonText(): string {
        switch (this.step) {
            case 'choose-root':
                return 'Suchen'
            case 'find-files':
                return 'Vergleichen'
            case 'finished':
                return 'Nochmal'
            case 'inspect-duplicates':
                if (Object.keys(this.selectedFolders).length < 1) {
                    break
                }

                return 'Löschen'
            case 'confirm-delete':
                if (this.pendingDeletes.length < 1) {
                    break
                }

                return 'Löschen'
        }

        return 'Weiter'
    }

    @computed
    get selectedUri(): string {
        return this.selectedPath && pathToFileURL(this.selectedPath).href
    }
}

export const store = new RootStore()
