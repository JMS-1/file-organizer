import { observable } from 'mobx'

export type TSteps =
    | 'choose-root'
    | 'find-files'
    | 'compare-files'
    | 'inspect-duplicates'
    | 'confirm-delete'
    | 'finished'

class RootStore {
    @observable step: TSteps = 'choose-root'
}

export const store = new RootStore()
