import { resolvePath } from '../src/path'
import {resolve} from "path"

describe('resolvePath', () => {
  it('should read path ', async () => {
    const filename = 'test-file.txt'
    const expectedPath = resolve(filename)
    const path = resolvePath(filename)

    expect(path).toBe(expectedPath)
  })
})
