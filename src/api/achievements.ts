import axios from "axios";
import type { AxiosResponse } from "axios";

const BASE_URL = "https://pathfinderhonormanager.azurewebsites.net/api";

export interface AchievementDto {
  achievementID: string;
  level: number;
  levelName: string | null;
  achievementSequenceOrder: number;
  grade: number;
  className: string | null;
  description: string | null;
  categoryName: string | null;
  categorySequenceOrder: number;
}

export interface PathfinderAchievementDto {
  pathfinderAchievementID: string;
  pathfinderID: string;
  achievementID: string;
  isAchieved: boolean;
  createTimestamp: string;
  achieveTimestamp: string | null;
  level: number;
  levelName: string | null;
  achievementSequenceOrder: number;
  grade: number;
  className: string | null;
  description: string | null;
  categoryName: string | null;
  categorySequenceOrder: number;
}

export interface PostPathfinderAchievementDto {
  achievementID: string;
  isAchieved: boolean;
}

export interface PutPathfinderAchievementDto {
  isAchieved: boolean;
}

export interface PostPathfinderAchievementForGradeDto {
  pathfinderIds: string[];
  achievementIds: string[];
}

export default {
  getAllAchievements: () => {
    return axios.get<AchievementDto[]>(`${BASE_URL}/Achievements`, {
      params: {
        includeCategories: true
      }
    });
  },

  getAchievement: (id: string) => {
    return axios.get<AchievementDto>(`${BASE_URL}/Achievements/${id}`);
  },

  getAllPathfinderAchievements: () => {
    return axios.get<PathfinderAchievementDto[]>(`${BASE_URL}/PathfinderAchievements`);
  },

  getPathfinderAchievements: (pathfinderId: string) => {
    return axios.get<PathfinderAchievementDto[]>(`${BASE_URL}/Pathfinders/${pathfinderId}/PathfinderAchievements`);
  },

  getPathfinderAchievement: (pathfinderId: string, achievementId: string) => {
    return axios.get<PathfinderAchievementDto>(`${BASE_URL}/Pathfinders/${pathfinderId}/PathfinderAchievements/${achievementId}`);
  },

  postPathfinderAchievement: (pathfinderId: string, data: PostPathfinderAchievementDto) => {
    return axios.post<PathfinderAchievementDto>(`${BASE_URL}/Pathfinders/${pathfinderId}/PathfinderAchievements`, data);
  },

  putPathfinderAchievement: (pathfinderId: string, achievementId: string, data: PutPathfinderAchievementDto) => {
    return axios.put<PathfinderAchievementDto>(`${BASE_URL}/Pathfinders/${pathfinderId}/PathfinderAchievements/${achievementId}`, data);
  },

  postPathfinderAchievementsForGrade: (data: PostPathfinderAchievementForGradeDto) => {
    return axios.post(`${BASE_URL}/PathfinderAchievements`, data);
  }
}; 