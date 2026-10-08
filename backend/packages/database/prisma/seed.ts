/**
 * Idempotent reference-data seed: the skill catalog and the career paths that
 * drive analysis, ranking and roadmap generation.
 *
 * Run with `bun run db:seed`. Safe to re-run — everything upserts on a natural
 * key, so it never duplicates rows or orphans `career_skills`.
 */
import { prisma } from "../src/index";

const SKILLS: { name: string; category: string }[] = [
  { name: "HTML", category: "Frontend" },
  { name: "CSS", category: "Frontend" },
  { name: "JavaScript", category: "Frontend" },
  { name: "TypeScript", category: "Frontend" },
  { name: "React", category: "Frontend" },
  { name: "Next.js", category: "Frontend" },
  { name: "Tailwind CSS", category: "Frontend" },
  { name: "Node.js", category: "Backend" },
  { name: "Express", category: "Backend" },
  { name: "Python", category: "Backend" },
  { name: "Django", category: "Backend" },
  { name: "PostgreSQL", category: "Database" },
  { name: "MongoDB", category: "Database" },
  { name: "SQL", category: "Database" },
  { name: "Git", category: "Tooling" },
  { name: "Docker", category: "Tooling" },
  { name: "Linux", category: "Tooling" },
  { name: "REST APIs", category: "Tooling" },
  { name: "Testing", category: "Quality" },
  { name: "Data Structures", category: "Fundamentals" },
  { name: "System Design", category: "Fundamentals" },
];

type CareerSeed = {
  slug: string;
  name: string;
  description: string;
  skills: { skill: string; requiredLevel: number; weight?: number; priority?: "low" | "medium" | "high" }[];
};

const CAREERS: CareerSeed[] = [
  {
    slug: "frontend-engineer",
    name: "Frontend Engineer",
    description: "Builds the interfaces users touch — layout, interaction and performance in the browser.",
    skills: [
      { skill: "HTML", requiredLevel: 80, weight: 1, priority: "high" },
      { skill: "CSS", requiredLevel: 75, weight: 1, priority: "high" },
      { skill: "JavaScript", requiredLevel: 80, weight: 1.2, priority: "high" },
      { skill: "TypeScript", requiredLevel: 70, weight: 1, priority: "medium" },
      { skill: "React", requiredLevel: 80, weight: 1.4, priority: "high" },
      { skill: "Git", requiredLevel: 60, weight: 0.6, priority: "low" },
      { skill: "Testing", requiredLevel: 55, weight: 0.7, priority: "medium" },
    ],
  },
  {
    slug: "backend-engineer",
    name: "Backend Engineer",
    description: "Designs the services, data models and APIs that power an application.",
    skills: [
      { skill: "Node.js", requiredLevel: 75, weight: 1.2, priority: "high" },
      { skill: "REST APIs", requiredLevel: 80, weight: 1.2, priority: "high" },
      { skill: "SQL", requiredLevel: 75, weight: 1.1, priority: "high" },
      { skill: "PostgreSQL", requiredLevel: 70, weight: 1, priority: "medium" },
      { skill: "Docker", requiredLevel: 55, weight: 0.7, priority: "low" },
      { skill: "System Design", requiredLevel: 65, weight: 1, priority: "medium" },
      { skill: "Testing", requiredLevel: 60, weight: 0.8, priority: "medium" },
    ],
  },
  {
    slug: "fullstack-engineer",
    name: "Full-Stack Engineer",
    description: "Works across the whole stack, from database schema to rendered UI.",
    skills: [
      { skill: "TypeScript", requiredLevel: 75, weight: 1.2, priority: "high" },
      { skill: "React", requiredLevel: 75, weight: 1.1, priority: "high" },
      { skill: "Node.js", requiredLevel: 75, weight: 1.1, priority: "high" },
      { skill: "REST APIs", requiredLevel: 70, weight: 1, priority: "medium" },
      { skill: "SQL", requiredLevel: 65, weight: 1, priority: "medium" },
      { skill: "Git", requiredLevel: 65, weight: 0.7, priority: "low" },
      { skill: "Testing", requiredLevel: 55, weight: 0.7, priority: "medium" },
    ],
  },
  {
    slug: "data-analyst",
    name: "Data Analyst",
    description: "Turns raw datasets into answers — querying, cleaning and visualising evidence.",
    skills: [
      { skill: "SQL", requiredLevel: 85, weight: 1.4, priority: "high" },
      { skill: "Python", requiredLevel: 75, weight: 1.2, priority: "high" },
      { skill: "Data Structures", requiredLevel: 55, weight: 0.8, priority: "medium" },
      { skill: "Testing", requiredLevel: 45, weight: 0.5, priority: "low" },
      { skill: "Git", requiredLevel: 45, weight: 0.5, priority: "low" },
    ],
  },
  {
    slug: "devops-engineer",
    name: "DevOps Engineer",
    description: "Owns delivery pipelines, infrastructure and the reliability of deploys.",
    skills: [
      { skill: "Docker", requiredLevel: 85, weight: 1.4, priority: "high" },
      { skill: "Git", requiredLevel: 80, weight: 1, priority: "high" },
      { skill: "Linux", requiredLevel: 75, weight: 1.1, priority: "high" },
      { skill: "System Design", requiredLevel: 65, weight: 1, priority: "medium" },
      { skill: "REST APIs", requiredLevel: 55, weight: 0.6, priority: "low" },
    ],
  },
];

async function main() {
  const skillIds = new Map<string, string>();

  for (const skill of SKILLS) {
    const row = await prisma.skill.upsert({
      where: { name: skill.name },
      update: { category: skill.category },
      create: skill,
    });
    skillIds.set(skill.name, row.id);
  }

  let careerCount = 0;
  for (const career of CAREERS) {
    const row = await prisma.career.upsert({
      where: { slug: career.slug },
      update: { name: career.name, description: career.description },
      create: { slug: career.slug, name: career.name, description: career.description },
    });
    careerCount += 1;

    for (const entry of career.skills) {
      const skillId = skillIds.get(entry.skill);
      if (!skillId) throw new Error(`Career "${career.slug}" references unknown skill "${entry.skill}"`);

      await prisma.careerSkill.upsert({
        where: { careerId_skillId: { careerId: row.id, skillId } },
        update: { requiredLevel: entry.requiredLevel, weight: entry.weight ?? 1, priority: entry.priority ?? "medium" },
        create: {
          careerId: row.id,
          skillId,
          requiredLevel: entry.requiredLevel,
          weight: entry.weight ?? 1,
          priority: entry.priority ?? "medium",
        },
      });
    }
  }

  console.log(`seeded ${skillIds.size} skills and ${careerCount} careers`);
}

main()
  .catch((error) => {
    console.error("seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
