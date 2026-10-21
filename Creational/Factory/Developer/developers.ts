/**
 * Concrete Developer Classes for Factory Pattern
 */

import {
  DeveloperLevel,
  DeveloperRole,
  IDeveloper,
  IDeveloperConfig,
  ITaskEstimation,
} from './developer.interface.js';

export abstract class BaseDeveloper implements IDeveloper {
  public readonly id: string;
  public readonly name: string;
  public abstract readonly role: DeveloperRole;
  public readonly level: DeveloperLevel;
  public abstract readonly primaryStack: readonly string[];
  public readonly hourlyRate: number;
  public readonly yearsOfExperience: number;

  constructor(config: IDeveloperConfig, defaultHourlyRate: number, defaultExp: number) {
    this.id = `dev_${Math.random().toString(36).substring(2, 8)}`;
    this.name = config.name;
    this.level = config.level || 'MID';
    this.hourlyRate = config.hourlyRate || this.calculateRateByLevel(defaultHourlyRate, this.level);
    this.yearsOfExperience = config.yearsOfExperience || defaultExp;
  }

  public abstract writeCode(task: string): string;
  public abstract deploy(): string;

  public reviewPullRequest(prNumber: number, author: string): string {
    return `[${this.level} ${this.role}] ${this.name} PR #${prNumber} (muallif: ${author}) bo'yicha kod sifatini va arxitekturani tekshirdi. Holat: LGTM! ✅`;
  }

  public estimateTask(storyPoints: number): ITaskEstimation {
    const factor = this.getExperienceMultiplier();
    const days = Math.max(0.5, Number(((storyPoints * 0.4) / factor).toFixed(1)));
    const confidence = this.level === 'SENIOR' || this.level === 'LEAD' || this.level === 'PRINCIPAL' 
      ? 'HIGH' 
      : this.level === 'MID' 
      ? 'MEDIUM' 
      : 'LOW';

    return {
      storyPoints,
      estimatedDays: days,
      confidence,
      notes: `${this.name} (${this.level}) ushbu vazifani ${days} ish kunida bajarishni rejalashtirdi.`,
    };
  }

  public getProfile(): string {
    return [
      `┌────────────────────────────────────────────────────────┐`,
      `│ 👨‍💻 DASTURCHI PROFILI: ${this.name.padEnd(31)}│`,
      `├────────────────────────────────────────────────────────┤`,
      `│ • Mutaxassislik (Role)  : ${this.role.padEnd(28)} │`,
      `│ • Malaka darajasi (Level): ${this.level.padEnd(27)} │`,
      `│ • Tajriba (Yil)         : ${(this.yearsOfExperience + ' yil').padEnd(28)} │`,
      `│ • Soatlik stavka ($/soat): ${('$' + this.hourlyRate).padEnd(28)} │`,
      `│ • Asosiy texnologiyalar : ${this.primaryStack.slice(0, 3).join(', ').padEnd(28)} │`,
      `└────────────────────────────────────────────────────────┘`,
    ].join('\n');
  }

  private calculateRateByLevel(baseRate: number, level: DeveloperLevel): number {
    switch (level) {
      case 'JUNIOR': return Math.round(baseRate * 0.6);
      case 'MID': return baseRate;
      case 'SENIOR': return Math.round(baseRate * 1.5);
      case 'LEAD': return Math.round(baseRate * 2.0);
      case 'PRINCIPAL': return Math.round(baseRate * 2.5);
    }
  }

  private getExperienceMultiplier(): number {
    switch (this.level) {
      case 'JUNIOR': return 0.8;
      case 'MID': return 1.0;
      case 'SENIOR': return 1.4;
      case 'LEAD': return 1.7;
      case 'PRINCIPAL': return 2.0;
    }
  }
}

/**
 * 1. Frontend Dasturchi
 */
export class FrontendDeveloper extends BaseDeveloper {
  public readonly role: DeveloperRole = 'FRONTEND';
  public readonly primaryStack: readonly string[];

  constructor(config: IDeveloperConfig) {
    super(config, 35, 3);
    this.primaryStack = Object.freeze(
      config.customSkills || ['React', 'Next.js', 'TypeScript', 'TailwindCSS', 'Vite', 'Redux/Zustand']
    );
  }

  public writeCode(task: string): string {
    return `🎨 [Frontend] ${this.name} "${task}" uchun responsive UI komponentlar, CSS dizayn va state management yaratdi.`;
  }

  public deploy(): string {
    return `🚀 [Frontend] ${this.name} Vercel / Cloudflare Pages orqali CDN keshini yangilab frontendni prodga chiqardi.`;
  }
}

/**
 * 2. Backend Dasturchi
 */
export class BackendDeveloper extends BaseDeveloper {
  public readonly role: DeveloperRole = 'BACKEND';
  public readonly primaryStack: readonly string[];

  constructor(config: IDeveloperConfig) {
    super(config, 40, 4);
    this.primaryStack = Object.freeze(
      config.customSkills || ['Node.js', 'NestJS', 'PostgreSQL', 'Redis', 'Kafka', 'Docker']
    );
  }

  public writeCode(task: string): string {
    return `⚙️ [Backend] ${this.name} "${task}" uchun xavfsiz REST/gRPC API, DB migratsiya va caching logikasini yozdi.`;
  }

  public deploy(): string {
    return `🚀 [Backend] ${this.name} Microservice Docker konteynerini yaratdi va Kubernetes podlarida ishga tushirdi.`;
  }
}

/**
 * 3. Mobile Dasturchi
 */
export class MobileDeveloper extends BaseDeveloper {
  public readonly role: DeveloperRole = 'MOBILE';
  public readonly primaryStack: readonly string[];

  constructor(config: IDeveloperConfig) {
    super(config, 38, 3);
    this.primaryStack = Object.freeze(
      config.customSkills || ['Flutter', 'Dart', 'React Native', 'Swift', 'Kotlin', 'SQLite/Hive']
    );
  }

  public writeCode(task: string): string {
    return `📱 [Mobile] ${this.name} "${task}" uchun iOS va Android platformalarida offline-first mobil ekranlarni ishlab chiqdi.`;
  }

  public deploy(): string {
    return `🚀 [Mobile] ${this.name} TestFlight (iOS) va Google Play Console (Android) release buildlarini yukladi.`;
  }
}

/**
 * 4. DevOps Muhandisi
 */
export class DevOpsEngineer extends BaseDeveloper {
  public readonly role: DeveloperRole = 'DEVOPS';
  public readonly primaryStack: readonly string[];

  constructor(config: IDeveloperConfig) {
    super(config, 50, 5);
    this.primaryStack = Object.freeze(
      config.customSkills || ['Kubernetes', 'Terraform', 'AWS', 'GitHub Actions', 'Prometheus', 'Grafana']
    );
  }

  public writeCode(task: string): string {
    return `☁️ [DevOps] ${this.name} "${task}" uchun Terraform IaC skriptlari va CI/CD avtomatlashtirish quvurini sozlagan.`;
  }

  public deploy(): string {
    return `🚀 [DevOps] ${this.name} Zero-downtime rolling update orqali AWS EKS klasteriga yangi release'ni joylashtirdi.`;
  }
}

/**
 * 5. FullStack Dasturchi
 */
export class FullStackDeveloper extends BaseDeveloper {
  public readonly role: DeveloperRole = 'FULLSTACK';
  public readonly primaryStack: readonly string[];

  constructor(config: IDeveloperConfig) {
    super(config, 45, 4);
    this.primaryStack = Object.freeze(
      config.customSkills || ['TypeScript', 'Next.js', 'Node.js', 'PostgreSQL', 'Prisma/TypeORM', 'Docker']
    );
  }

  public writeCode(task: string): string {
    return `🌐 [FullStack] ${this.name} "${task}" uchun UI interfeysdan tortib ma'lumotlar bazasigacha bo'lgan to'liq tsiklni bajardi.`;
  }

  public deploy(): string {
    return `🚀 [FullStack] ${this.name} Docker Compose orqali to'liq stackni (Frontend + Backend + DB) serverga chiqardi.`;
  }
}
