interface State {
  process: Promise<number | void> | null
  running: boolean
  shouldRun: boolean
  abortController: AbortController | null
}

const state: State = {
  process: null,
  running: false,
  shouldRun: false,
  abortController: null,
}

export const BeeManager = {
  setUserIntention: (newState: boolean) => {
    state.shouldRun = newState
  },
  shouldRestart: () => state.shouldRun,
  signalRunning: (abortController: AbortController, process: Promise<number | void>) => {
    state.abortController = abortController
    state.process = process
    state.running = true
  },
  signalStopped: () => {
    state.running = false
  },
  isRunning: () => state.running || (state.abortController && !state.abortController.signal.aborted),
  stop: () => {
    state.shouldRun = false

    if (state.abortController) {
      state.abortController.abort()
    }
  },
  waitForSigtermToFinish: async () => {
    if (state.process) {
      await state.process
    }
  },
}
