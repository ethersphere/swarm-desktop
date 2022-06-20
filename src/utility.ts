import { Readable } from 'stream'

export async function wait(ms: number): Promise<void> {
  return new Promise(resolve => {
    setTimeout(resolve, ms)
  })
}

export async function bufferRequest(red: Readable): Promise<string> {
  const arr = []
  for await (const redElement of red) {
    arr.push(redElement)
  }

  return Buffer.concat(arr).toString('utf8')
}
