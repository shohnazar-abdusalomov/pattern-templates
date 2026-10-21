/**
 * Factory Pattern - Developer Interfaces & Domain Types
 */

export type DeveloperRole = 
  | 'FRONTEND' 
  | 'BACKEND' 
  | 'MOBILE' 
  | 'DEVOPS' 
  | 'FULLSTACK';

export type DeveloperLevel = 
  | 'JUNIOR' 
  | 'MID' 
  | 'SENIOR' 
  | 'LEAD' 
  | 'PRINCIPAL';

export interface ITaskEstimation {
  readonly storyPoints: number;
  readonly estimatedDays: number;
  readonly confidence: 'LOW' | 'MEDIUM' | 'HIGH';
  readonly notes: string;
}

export interface IDeveloperConfig {
  readonly name: string;
  readonly level?: DeveloperLevel;
  readonly customSkills?: string[];
  readonly hourlyRate?: number;
  readonly yearsOfExperience?: number;
}

export interface IDeveloper {
  readonly id: string;
  readonly name: string;
  readonly role: DeveloperRole;
  readonly level: DeveloperLevel;
  readonly primaryStack: readonly string[];
  readonly hourlyRate: number;
  readonly yearsOfExperience: number;

  /**
   * Berilgan vazifa bo'yicha kod yozish jarayoni
   */
  writeCode(task: string): string;

  /**
   * Boshqa dasturchining PR'ini ko'rib chiqish
   */
  reviewPullRequest(prNumber: number, author: string): string;

  /**
   * Vazifaning murakkabligini baholash (Sprint Estimation)
   */
  estimateTask(storyPoints: number): ITaskEstimation;

  /**
   * Loyihani muhitga chiqarish (Deploy)
   */
  deploy(): string;

  /**
   * Dasturchi haqida to'liq kartochka ma'lumotini olish
   */
  getProfile(): string;
}

export interface ITeamRequirement {
  readonly role: DeveloperRole;
  readonly name: string;
  readonly level?: DeveloperLevel;
  readonly customSkills?: string[];
}

export interface ITeamBudget {
  readonly totalDevelopers: number;
  readonly totalHourlyCost: number;
  readonly estimatedMonthlyCost: number;
  readonly roleBreakdown: Record<DeveloperRole, number>;
}
