import { describe, it, expect, beforeEach } from 'vitest'
import { VersionService } from '../version'

const resetVersionService = () => {
  (VersionService as unknown as { instance?: VersionService }).instance = undefined
}

describe('VersionService', () => {
  beforeEach(() => {
    resetVersionService()
    delete (globalThis as Record<string, unknown>).__APP_VERSION__
    delete (globalThis as Record<string, unknown>).__BUILD_DATE__
    ;(globalThis as Record<string, unknown>).__COMMIT_HASH__ = undefined
  })

  it('uses global constants when env values are not provided', () => {
    ;(globalThis as Record<string, unknown>).__APP_VERSION__ = '1.2.3'
    ;(globalThis as Record<string, unknown>).__BUILD_DATE__ = '2024-01-02T00:00:00Z'
    ;(globalThis as Record<string, unknown>).__COMMIT_HASH__ = 'abc123'

    const service = VersionService.getInstance()

    expect(service.getVersion()).toBe('1.2.3')
    expect(service.getBuildDate()).toBe('2024-01-02T00:00:00Z')
    expect(service.getCommitHash()).toBe('abc123')
  })

  it('formats the version with the build date', () => {
    ;(globalThis as Record<string, unknown>).__APP_VERSION__ = '9.9.9'
    ;(globalThis as Record<string, unknown>).__BUILD_DATE__ = '2024-06-10T00:00:00Z'

    const service = VersionService.getInstance()
    const date = new Date('2024-06-10T00:00:00Z').toLocaleDateString()

    expect(service.getFormattedVersion()).toBe(`v9.9.9 (${date})`)
  })

  it('returns a copy of version info', () => {
    ;(globalThis as Record<string, unknown>).__APP_VERSION__ = '2.0.0'
    ;(globalThis as Record<string, unknown>).__BUILD_DATE__ = '2024-02-01T00:00:00Z'

    const service = VersionService.getInstance()
    const info = service.getVersionInfo()
    info.version = 'mutated'

    expect(service.getVersion()).toBe('2.0.0')
  })
})
