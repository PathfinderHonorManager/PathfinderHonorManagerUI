// src/models/Pathfinder.ts
export enum status {
  Planned = "Planned",
  Earned = "Earned",
  Awarded = "Awarded",
}

export interface PathfinderHonors {
  pathfinderHonorID: string;
  pathfinderID: string;
  honorID: string;
  name: string;
  status: status;
  patchFilename: string;
}

export interface Pathfinder {
  pathfinderID: string;
  firstName: string;
  lastName: string;
  className: string;
  grade: number;
  pathfinderHonors: PathfinderHonors[];
}

export interface PutPathfinder {
  isActive?: boolean;
  grade?: number;
}

export interface PathfinderHonorPostPut {
  honorID: string;
  status: status;
}

export interface BulkAdd {
  pathfinderID: string;
  honors: PathfinderHonorPostPut[];
}

export interface BulkAddResponse {
  status: number;
  error?: string;
  pathfinderHonor?: PathfinderHonors[];
}

export interface PathfinderPost {
  firstName: string;
  lastName: string;
  email: string;
  grade: number;
}
