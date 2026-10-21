/**
 * Developer Factory - Factory Pattern Implementation
 * 
 * Ushbu sinf dasturchi obyektlarini to'g'ridan-to'g'ri 'new' orqali emas,
 * yagona markaziy Factory orqali roliga, darajasiga va xususiyatlariga
 * qarab dinamik va xavfsiz tarzda yaratish imkonini beradi.
 */

import {
  DeveloperLevel,
  DeveloperRole,
  IDeveloper,
  IDeveloperConfig,
  ITeamBudget,
  ITeamRequirement,
} from './developer.interface.js';
import {
  BackendDeveloper,
  DevOpsEngineer,
  FrontendDeveloper,
  FullStackDeveloper,
  MobileDeveloper,
} from './developers.js';

type DeveloperConstructor = new (config: IDeveloperConfig) => IDeveloper;

export class DeveloperFactory {
  /**
   * Dinamik ro'yxatga olish reyestri (Open/Closed Principle bo'yicha yangi rollar qo'shish imkoni)
   */
  private static readonly registry = new Map<DeveloperRole, DeveloperConstructor>([
    ['FRONTEND', FrontendDeveloper],
    ['BACKEND', BackendDeveloper],
    ['MOBILE', MobileDeveloper],
    ['DEVOPS', DevOpsEngineer],
    ['FULLSTACK', FullStackDeveloper],
  ]);

  /**
   * Asosiy Factory Metodi: Berilgan rolga asosan mos dasturchi nusxasini yaratadi.
   */
  public static create(role: DeveloperRole, config: IDeveloperConfig): IDeveloper {
    const DeveloperClass = this.registry.get(role);

    if (!DeveloperClass) {
      const allowedRoles = Array.from(this.registry.keys()).join(', ');
      throw new Error(
        `Noma'lum dasturchi roli: "${role}". Faqat quyidagi rollar mavjud: [${allowedRoles}]`
      );
    }

    if (!config.name || config.name.trim().length === 0) {
      throw new Error("Dasturchi ismi (name) ko'rsatilishi majburiy!");
    }

    return new DeveloperClass(config);
  }

  /**
   * Qulay yordamchi factory metodlar (Specialized Factory Methods)
   */
  public static createFrontend(
    name: string,
    level: DeveloperLevel = 'MID',
    customSkills?: string[]
  ): FrontendDeveloper {
    return this.create('FRONTEND', { name, level, customSkills }) as FrontendDeveloper;
  }

  public static createBackend(
    name: string,
    level: DeveloperLevel = 'MID',
    customSkills?: string[]
  ): BackendDeveloper {
    return this.create('BACKEND', { name, level, customSkills }) as BackendDeveloper;
  }

  public static createMobile(
    name: string,
    level: DeveloperLevel = 'MID',
    customSkills?: string[]
  ): MobileDeveloper {
    return this.create('MOBILE', { name, level, customSkills }) as MobileDeveloper;
  }

  public static createDevOps(
    name: string,
    level: DeveloperLevel = 'MID',
    customSkills?: string[]
  ): DevOpsEngineer {
    return this.create('DEVOPS', { name, level, customSkills }) as DevOpsEngineer;
  }

  public static createFullStack(
    name: string,
    level: DeveloperLevel = 'MID',
    customSkills?: string[]
  ): FullStackDeveloper {
    return this.create('FULLSTACK', { name, level, customSkills }) as FullStackDeveloper;
  }

  /**
   * Butun bir loyiha jamoasini (Team) birdaniga yaratish
   */
  public static createTeam(requirements: ITeamRequirement[]): IDeveloper[] {
    console.log(`👥 [DeveloperFactory] ${requirements.length} kishilik jamoa yig'ilmoqda...`);
    return requirements.map((req) =>
      this.create(req.role, {
        name: req.name,
        level: req.level || 'MID',
        customSkills: req.customSkills,
      })
    );
  }

  /**
   * Jamoaning oylik byudjetini hisoblab chiqish
   */
  public static calculateTeamBudget(team: IDeveloper[], hoursPerMonth: number = 160): ITeamBudget {
    let totalHourly = 0;
    const breakdown: Record<DeveloperRole, number> = {
      FRONTEND: 0,
      BACKEND: 0,
      MOBILE: 0,
      DEVOPS: 0,
      FULLSTACK: 0,
    };

    for (const dev of team) {
      totalHourly += dev.hourlyRate;
      breakdown[dev.role] = (breakdown[dev.role] || 0) + 1;
    }

    return {
      totalDevelopers: team.length,
      totalHourlyCost: totalHourly,
      estimatedMonthlyCost: totalHourly * hoursPerMonth,
      roleBreakdown: breakdown,
    };
  }

  /**
   * Yangi rol qo'shish (Extensibility / Open-Closed Principle)
   */
  public static registerRole(role: DeveloperRole, constructor: DeveloperConstructor): void {
    this.registry.set(role, constructor);
    console.log(`✅ [DeveloperFactory] Yangi rol muvaffaqiyatli ro'yxatdan o'tkazildi: ${role}`);
  }
}
