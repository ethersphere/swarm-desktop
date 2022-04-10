import request from 'supertest'
import type { Server } from 'http'
import { createApp } from '../src/server'

const app = createApp()
let server: Server

beforeAll(async () => {
  server = await new Promise((resolve, _reject) => {
    const server = createApp().listen(async () => resolve(server))
  })
})

afterAll(async () => {
  await new Promise(resolve => server.close(resolve))
})

describe('status', () => {
  it('should get status', async () => {
    const res = await request(app).get('/status')
    expect(res).toBeGreaterThan(0)
  })
})
