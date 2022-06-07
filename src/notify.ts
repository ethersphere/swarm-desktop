import Notifier from 'node-notifier'

export function createNotification(message: string): void {
  Notifier.notify({ title: 'Swarm', message })
}
