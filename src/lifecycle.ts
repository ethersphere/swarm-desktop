interface State {
    process: any
    running: boolean
    abortController: any
}

const state: State = {
    process: null,
    running: false,
    abortController: null
}

export const BeeManager = {
    signalRunning: (abortController: any, process: any) => {
        state.abortController = abortController
        state.process = process
        state.running = true
    },
    signalStopped: () => {
        state.running = false
    },
    isRunning: () => state.running || (state.abortController && !state.abortController.signal.aborted),
    stop: () => {
        if (state.abortController) {
            state.abortController.abort()
        }
    },
    waitForSigtermToFinish: async () => {
        if (state.process) {
            await state.process
        }
    }
}
