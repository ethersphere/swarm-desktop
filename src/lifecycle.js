const state = {
    process: null,
    running: false,
    abortController: null
}

const BeeManager = {
    signalRunning: (abortController, process) => {
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

module.exports = {
    BeeManager
}
