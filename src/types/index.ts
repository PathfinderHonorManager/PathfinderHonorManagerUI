export interface Pathfinder {
  pathfinderID: string;
  grade: number;
  isActive: boolean;
  pathfinderHonors: PathfinderHonor[];
}

export interface PathfinderHonor {
  honorID: string;
  status: string;
}

export interface Honor {
  honorID: string;
  name: string;
  image?: string;
}

export type SelectionType = 'plan' | 'earn' | 'award';

export interface HonorStoreType {
  honors: Honor[];
  loading: boolean;
  error: string | null;
  getHonors: () => Promise<void>;
  getHonorsByQuery: (query: string) => Honor[];
  getHonorsBySelection: (selectionType: SelectionType) => Honor[];
}

export interface PathfinderStoreType {
  pathfinders: Pathfinder[];
  loading: boolean;
  error: string | null;
  getPathfinders: () => Promise<void>;
  getPathfindersBySelection: (selectionType: SelectionType) => Pathfinder[];
  getPathfindersByGrade: (grade: number) => Pathfinder[];
  getPathfinderById: (id: string) => Pathfinder | undefined;
  updatePathfinder: (id: string, data: Partial<Pathfinder>) => Promise<void>;
  postPathfinderHonor: (pathfinderId: string, honorId: string, status: string) => Promise<void>;
  putPathfinderHonor: (pathfinderId: string, honorId: string, status: string) => Promise<void>;
  deletePathfinderHonor: (pathfinderId: string, honorId: string) => Promise<void>;
} 