import { describe, it, expect, beforeEach, vi } from 'vitest'
import api from '@/api/pathfinders'
import { API_CONFIG } from '@/config/api'
import { ValidationError } from '@/models/pathfinder'
import axios from 'axios'

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    isAxiosError: vi.fn()
  }
}))

const axiosMock = axios as unknown as {
  get: ReturnType<typeof vi.fn>
  post: ReturnType<typeof vi.fn>
  put: ReturnType<typeof vi.fn>
  isAxiosError: ReturnType<typeof vi.fn>
}

const baseUrl = `${API_CONFIG.BASE_URL}/pathfinders`

describe('pathfinders api', () => {
  beforeEach(() => {
    axiosMock.get.mockReset()
    axiosMock.post.mockReset()
    axiosMock.put.mockReset()
    axiosMock.isAxiosError.mockReset()
  })

  it('fetches pathfinders with params', async () => {
    axiosMock.get.mockResolvedValue({ data: [] })
    await api.getAll({ active: true })
    expect(axiosMock.get).toHaveBeenCalledWith(baseUrl, { params: { active: true } })
  })

  it('fetches a single pathfinder', async () => {
    axiosMock.get.mockResolvedValue({ data: {} })
    await api.get('pf-1')
    expect(axiosMock.get).toHaveBeenCalledWith(`${baseUrl}/pf-1`, { params: {} })
  })

  it('creates a pathfinder and supports the postPathfinder alias', async () => {
    axiosMock.post.mockResolvedValue({ data: { pathfinderID: 'pf-1' } })
    await api.postPathfinder({
      firstName: 'Alex',
      lastName: 'Smith',
      email: 'alex@example.com',
      grade: 8
    })
    expect(axiosMock.post).toHaveBeenCalledWith(baseUrl, {
      firstName: 'Alex',
      lastName: 'Smith',
      email: 'alex@example.com',
      grade: 8
    })
  })

  it('throws ValidationError on 400 responses', async () => {
    const error = {
      response: { status: 400, data: { errors: { Email: ['invalid'] } } }
    }
    axiosMock.isAxiosError.mockReturnValue(true)
    axiosMock.post.mockRejectedValue(error)

    await expect(
      api.post({
        firstName: 'Alex',
        lastName: 'Smith',
        email: 'alex@example.com',
        grade: 8
      })
    ).rejects.toBeInstanceOf(ValidationError)
  })

  it('posts and updates pathfinder honors', async () => {
    axiosMock.post.mockResolvedValue({ data: {} })
    axiosMock.put.mockResolvedValue({ data: {} })

    await api.postPathfinderHonor('pf-1', { honorID: 'h1', status: 'Planned' })
    expect(axiosMock.post).toHaveBeenCalledWith(
      `${baseUrl}/pf-1/PathfinderHonors`,
      { honorID: 'h1', status: 'Planned' }
    )

    await api.putPathfinderHonor('pf-1', 'h1', { honorID: 'h1', status: 'Earned' })
    expect(axiosMock.put).toHaveBeenCalledWith(
      `${baseUrl}/pf-1/PathfinderHonors/h1`,
      { honorID: 'h1', status: 'Earned' }
    )
  })

  it('uses post for plan actions when bulk managing honors', async () => {
    axiosMock.post.mockResolvedValue({ data: [] })
    await api.bulkManagePathfinderHonors([], 'plan')
    expect(axiosMock.post).toHaveBeenCalledWith(`${baseUrl}/PathfinderHonors`, [])
  })

  it('updates a pathfinder and throws on non-200 responses', async () => {
    axiosMock.put.mockResolvedValue({ status: 200 })
    await api.putPathfinder('pf-1', { grade: 7, isActive: true })
    expect(axiosMock.put).toHaveBeenCalledWith(`${baseUrl}/pf-1`, { grade: 7, isActive: true })

    axiosMock.put.mockResolvedValue({ status: 500 })
    await expect(api.putPathfinder('pf-1', { grade: 7, isActive: true })).rejects.toThrow(
      'API responded with status code 500'
    )
  })

  it('throws on partial failures in bulk updates', async () => {
    axiosMock.put.mockResolvedValue({
      status: 207,
      data: [{ status: 200, pathfinderId: '1' }, { status: 500, pathfinderId: '2' }]
    })

    await expect(api.bulkUpdatePathfinders({ items: [] })).rejects.toThrow(
      'Failed to update 1 pathfinders'
    )
  })
})
