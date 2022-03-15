type BeeManagerState = {
    process: null | Promise<number>
    running: boolean
    abortController: AbortController | null
}

const state: BeeManagerState = {
    process: null,
    running: false,
    abortController: null
}

export const BeeManager = {
    signalRunning: (abortController: AbortController, process: Promise<number>) => {
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
