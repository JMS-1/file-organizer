import { Stats } from 'fs'
import { dirname } from 'path'

export interface IFileInfo {
    hash?: string
    readonly info: Stats
    readonly path: string
}

export interface IGroupInfo {
    readonly dirs: string[]
    readonly hashes: Record<string, IFileInfo[]>
}

export class HashMap {
    private readonly _map: Record<string, IFileInfo[]> = {}

    add(file: IFileInfo): void {
        if (!file.hash) {
            return
        }

        let list = this._map[file.hash]

        if (!list) {
            this._map[file.hash] = list = []
        }

        list.push(file)
    }

    finish(): IGroupInfo[] {
        const groups: Record<string, IGroupInfo> = {}

        for (const hash of Object.keys(this._map)) {
            const paths = this._map[hash]

            if (paths.length < 2) {
                continue
            }

            const dirs = paths
                .map((f, index) => ({ dir: dirname(f.path), index }))
                .sort((l, r) => l.dir.localeCompare(r.dir))

            const key = dirs
                .map((d) => d.dir.toLowerCase())
                .sort()
                .join('\n')

            let group = groups[key]

            if (!group) {
                groups[key] = group = { dirs: dirs.map((d) => d.dir), hashes: {} }
            }

            group.hashes[hash] = dirs.map((d) => paths[d.index])
        }

        return Object.keys(groups)
            .map((key) => groups[key])
            .sort((l, r) => {
                const lfiles = Object.keys(l.hashes).length
                const rfiles = Object.keys(r.hashes).length

                if (lfiles < rfiles) {
                    return +1
                }
                if (lfiles > rfiles) {
                    return -1
                }

                const ldirs = l.dirs.length
                const rdirs = r.dirs.length

                if (ldirs < rdirs) {
                    return +1
                }
                if (ldirs > rdirs) {
                    return -1
                }

                return 0
            })
    }
}
