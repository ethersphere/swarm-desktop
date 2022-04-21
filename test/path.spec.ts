import { resolve } from 'path'
import { getPath } from '../src/path'

describe('resolvePath', () => {
  it('should read path ', async () => {
    const filename = 'test-file.txt'
    const expectedPath = resolve(filename)
    const path = getPath(filename)

    expect(path).toBe(expectedPath)
  })
})
