/**
 * Developer Factory Pattern - Entry Point & Executable Demo
 */

import { DeveloperFactory } from './developer-factory.js';
import { ITeamRequirement } from './developer.interface.js';

export * from './developer.interface.js';
export * from './developers.js';
export * from './developer-factory.js';

function runFactoryDemo() {
  console.log('═══════════════════════════════════════════════════════════');
  console.log('       2. FACTORY PATTERN: DEVELOPER FACTORY DEMO          ');
  console.log('═══════════════════════════════════════════════════════════\n');

  console.log('--- 1. 5 XIL MUTAXASSISLIKDAGI DASTURCHILARNI YARATISH ---');

  // 1. Frontend
  const frontend = DeveloperFactory.createFrontend('Shohnazar', 'SENIOR', [
    'Next.js 14',
    'React 19',
    'TypeScript',
    'TailwindCSS',
  ]);

  // 2. Backend
  const backend = DeveloperFactory.createBackend('Jasur', 'LEAD', [
    'Node.js',
    'NestJS',
    'PostgreSQL',
    'Redis',
    'Kafka',
  ]);

  // 3. Mobile
  const mobile = DeveloperFactory.createMobile('Malika', 'MID', [
    'Flutter',
    'Dart',
    'Bloc Pattern',
    'REST API',
  ]);

  // 4. DevOps
  const devops = DeveloperFactory.createDevOps('Azizbek', 'SENIOR', [
    'Kubernetes',
    'Terraform',
    'AWS EKS',
    'CI/CD Pipelines',
  ]);

  // 5. FullStack
  const fullstack = DeveloperFactory.createFullStack('Sardor', 'MID', [
    'React',
    'Express.js',
    'PostgreSQL',
    'Docker',
  ]);

  console.log(frontend.getProfile());
  console.log(backend.getProfile());

  console.log('\n--- 2. DASTURCHILARNING REAL ISH JARAYONLARI SIMULYATSIYASI ---');
  console.log(frontend.writeCode('Foydalanuvchi Profil Sahifasi va Dark Mode'));
  console.log(backend.writeCode('OAuth2 va JWT asosidagi autentifikatsiya mikroxizmati'));
  console.log(mobile.writeCode('Push-bildirishnomalar va oflayn keshlash tizimi'));
  console.log(devops.writeCode('Production klasteri uchun Helm Chart va Ingress Controller'));
  console.log(fullstack.writeCode('To\'lov tizimlari (Stripe & Click) integratsiyasi'));

  console.log('\n--- 3. SPRINT TASK ESTIMATION & CODE REVIEW ---');
  const taskEstimate = backend.estimateTask(8);
  console.log(`Backend baholashi: Story Points: ${taskEstimate.storyPoints}, Vaqt: ${taskEstimate.estimatedDays} kun, Ishonch darajasi: ${taskEstimate.confidence}`);
  console.log(devops.reviewPullRequest(142, frontend.name));

  console.log('\n--- 4. LOYIHANI DEPLOY QILISH ---');
  console.log(frontend.deploy());
  console.log(backend.deploy());
  console.log(devops.deploy());

  console.log('\n--- 5. BUTUN BIR JAMOA (TEAM) YARATISH VA BYUDJET HISOBI ---');
  const projectRequirements: ITeamRequirement[] = [
    { role: 'FRONTEND', name: 'Alisher', level: 'MID' },
    { role: 'BACKEND', name: 'Bobur', level: 'SENIOR' },
    { role: 'MOBILE', name: 'Zilola', level: 'MID' },
    { role: 'DEVOPS', name: 'Rustam', level: 'SENIOR' },
    { role: 'FULLSTACK', name: 'Davron', level: 'LEAD' },
  ];

  const startupTeam = DeveloperFactory.createTeam(projectRequirements);
  const budget = DeveloperFactory.calculateTeamBudget(startupTeam);

  console.log('\n📊 Jamoa byudjeti hisob-kitobi:');
  console.log(`• Jami dasturchilar soni : ${budget.totalDevelopers} kishi`);
  console.log(`• Jami soatlik xarajat   : $${budget.totalHourlyCost}/soat`);
  console.log(`• Oylik taxminiy byudjet : $${budget.estimatedMonthlyCost.toLocaleString()} (160 soat/oy)`);
  console.log('• Rollar taqsimoti       :', budget.roleBreakdown);
}

if (process.argv[1]?.includes('Developer') || process.argv[1]?.includes('index')) {
  runFactoryDemo();
}
