import { describe, it, expect, beforeEach, vi } from 'vitest'
import honorsApi from '@/api/honors'
import { API_CONFIG } from '@/config/api'
import axios from 'axios'

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn()
  }
}))

const axiosMock = axios as unknown as {
  get: ReturnType<typeof vi.fn>
  post: ReturnType<typeof vi.fn>
}

describe('honors api', () => {
  beforeEach(() => {
    axiosMock.get.mockReset()
    axiosMock.post.mockReset()
  })

  it('fetches all honors with params', async () => {
    axiosMock.get.mockResolvedValue({ data: [] })
    await honorsApi.getAll({ level: 1 })

    expect(axiosMock.get).toHaveBeenCalledWith(
      `${API_CONFIG.BASE_URL}/honors`,
      { params: { level: 1 } }
    )
  })

  it('fetches an honor by id', async () => {
    axiosMock.get.mockResolvedValue({ data: {} })
    await honorsApi.get(5)

    expect(axiosMock.get).toHaveBeenCalledWith(
      `${API_CONFIG.BASE_URL}/honors/5`,
      { params: {} }
    )
  })

  it('posts a new honor payload', async () => {
    axiosMock.post.mockResolvedValue({ data: {} })
    await honorsApi.post({ name: 'Test Honor' })

    expect(axiosMock.post).toHaveBeenCalledWith(
      `${API_CONFIG.BASE_URL}/honors`,
      { name: 'Test Honor' }
    )
  })
})
