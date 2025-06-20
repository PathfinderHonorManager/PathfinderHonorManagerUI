import { defineStore } from 'pinia';
import achievementsApi, { type AchievementDto, type PathfinderAchievementDto } from '@/api/achievements';

interface AchievementState {
  achievements: AchievementDto[];
  pathfinderAchievements: PathfinderAchievementDto[];
  loading: boolean;
  error: string | null;
}

export const useAchievementsStore = defineStore('achievements', {
  state: (): AchievementState => ({
    achievements: [],
    pathfinderAchievements: [],
    loading: false,
    error: null
  }),

  getters: {
    getAchievementById: (state) => (id: string) => {
      return state.achievements.find(a => a.achievementID === id);
    },

    getPathfinderAchievementsByClass: (state) => (className: string) => {
      const achievementsInClass = state.achievements.filter(a => a.className === className);
      const achievementIds = new Set(achievementsInClass.map(a => a.achievementID));
      return state.pathfinderAchievements.filter(pa => achievementIds.has(pa.achievementID));
    },

    getPathfinderAchievementsByGrade: (state) => (grade: number) => {
      const achievementsInGrade = state.achievements.filter(a => a.grade === grade);
      const achievementIds = new Set(achievementsInGrade.map(a => a.achievementID));
      return state.pathfinderAchievements.filter(pa => achievementIds.has(pa.achievementID));
    }
  },

  actions: {
    async loadAllAchievements(forceReload = false) {
      if (this.achievements.length > 0 && !forceReload) return; // Only skip if not forcing reload
      
      this.loading = true;
      this.error = null;
      
      try {
        const [achievementsResponse, pathfinderAchievementsResponse] = await Promise.all([
          achievementsApi.getAllAchievements(),
          achievementsApi.getAllPathfinderAchievements()
        ]);
        
        this.achievements = achievementsResponse.data;
        this.pathfinderAchievements = pathfinderAchievementsResponse.data;
      } catch (err) {
        console.error('Failed to load achievements:', err);
        this.error = 'Failed to load achievements';
      } finally {
        this.loading = false;
      }
    }
  }
}); 