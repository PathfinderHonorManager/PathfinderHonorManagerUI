import { describe, it, expect, beforeEach, vi } from 'vitest'
import achievementsApi from '@/api/achievements'
import { API_CONFIG } from '@/config/api'
import axios from 'axios'

vi.mock('axios', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn()
  }
}))

const axiosMock = axios as unknown as {
  get: ReturnType<typeof vi.fn>
  post: ReturnType<typeof vi.fn>
  put: ReturnType<typeof vi.fn>
}

describe('achievements api', () => {
  beforeEach(() => {
    axiosMock.get.mockReset()
    axiosMock.post.mockReset()
    axiosMock.put.mockReset()
  })

  it('requests all achievements', async () => {
    axiosMock.get.mockResolvedValue({ data: [] })
    await achievementsApi.getAllAchievements()
    expect(axiosMock.get).toHaveBeenCalledWith(`${API_CONFIG.BASE_URL}/Achievements`)
  })

  it('requests a single achievement', async () => {
    axiosMock.get.mockResolvedValue({ data: {} })
    await achievementsApi.getAchievement('abc')
    expect(axiosMock.get).toHaveBeenCalledWith(`${API_CONFIG.BASE_URL}/Achievements/abc`)
  })

  it('requests all pathfinder achievements', async () => {
    axiosMock.get.mockResolvedValue({ data: [] })
    await achievementsApi.getAllPathfinderAchievements()
    expect(axiosMock.get).toHaveBeenCalledWith(`${API_CONFIG.BASE_URL}/PathfinderAchievements`)
  })

  it('requests pathfinder achievements by pathfinder', async () => {
    axiosMock.get.mockResolvedValue({ data: [] })
    await achievementsApi.getPathfinderAchievements('pf-1')
    expect(axiosMock.get).toHaveBeenCalledWith(`${API_CONFIG.BASE_URL}/Pathfinders/pf-1/PathfinderAchievements`)
  })

  it('creates and updates pathfinder achievements', async () => {
    axiosMock.post.mockResolvedValue({ data: {} })
    axiosMock.put.mockResolvedValue({ data: {} })

    await achievementsApi.postPathfinderAchievement('pf-1', { achievementID: 'a1', isAchieved: true })
    expect(axiosMock.post).toHaveBeenCalledWith(
      `${API_CONFIG.BASE_URL}/Pathfinders/pf-1/PathfinderAchievements`,
      { achievementID: 'a1', isAchieved: true }
    )

    await achievementsApi.putPathfinderAchievement('pf-1', 'a1', { isAchieved: false })
    expect(axiosMock.put).toHaveBeenCalledWith(
      `${API_CONFIG.BASE_URL}/Pathfinders/pf-1/PathfinderAchievements/a1`,
      { isAchieved: false }
    )
  })

  it('posts achievements for a grade', async () => {
    axiosMock.post.mockResolvedValue({ data: {} })
    await achievementsApi.postPathfinderAchievementsForGrade({
      pathfinderIds: ['pf-1'],
      achievementIds: ['a1']
    })
    expect(axiosMock.post).toHaveBeenCalledWith(
      `${API_CONFIG.BASE_URL}/PathfinderAchievements`,
      { pathfinderIds: ['pf-1'], achievementIds: ['a1'] }
    )
  })
})
