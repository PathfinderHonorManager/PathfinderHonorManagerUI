import { describe, it, expect, beforeEach, vi } from 'vitest'
import clubsApi from '@/api/clubs'
import { API_CONFIG } from '@/config/api'
import axios from 'axios'

vi.mock('axios', () => ({
  default: {
    get: vi.fn()
  }
}))

const axiosMock = axios as unknown as {
  get: ReturnType<typeof vi.fn>
}

describe('clubs api', () => {
  beforeEach(() => {
    axiosMock.get.mockReset()
  })

  it('requests clubs with params', async () => {
    axiosMock.get.mockResolvedValue({ data: {} })
    await clubsApi.getClub({ clubcode: 'ABC123' })

    expect(axiosMock.get).toHaveBeenCalledWith(
      `${API_CONFIG.BASE_URL}/Clubs`,
      { params: { clubcode: 'ABC123' } }
    )
  })
})
