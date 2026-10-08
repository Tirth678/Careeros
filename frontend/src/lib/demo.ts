import { MOCK_STUDENT } from '../data/student';
import { MOCK_SKILLS } from '../data/skills';
import { MOCK_CAREERS } from '../data/careers';
import { MOCK_ROADMAP } from '../data/roadmap';
import type { StudentDTO, StudentSkillDTO, CareerDTO, CareerAnalysisDTO, RoadmapDTO, DashboardDTO, ProfileDTO, TaskStatus } from './models';

// Only the explicit demo build and opted-in local development use public fixtures.
export const DEMO_MODE = import.meta.env.MODE === 'demo' || (import.meta.env.DEV && import.meta.env.VITE_DEMO_MODE === 'true');
let student: StudentDTO = {
  id: MOCK_STUDENT.id, name: MOCK_STUDENT.name, email: MOCK_STUDENT.email,
  university: MOCK_STUDENT.university ?? null, degree: MOCK_STUDENT.degree ?? null,
  graduationYear: MOCK_STUDENT.graduationYear ?? null, cgpa: MOCK_STUDENT.cgpa ?? null,
};
let skills: StudentSkillDTO[] = MOCK_SKILLS.map(skill => ({
  id: skill.id, name: skill.name, category: skill.category, proficiency: skill.proficiency,
  confidence: null, source: 'demo',
}));
const careerSkills: Record<string, string[]> = {
  c1: ['s2', 's3', 's6', 's7'], c2: ['s1', 's4', 's5', 's9', 's10'],
  c3: ['s1', 's4', 's5', 's9', 's10'], c4: ['s1', 's4', 's5', 's6'], c5: ['s1', 's7', 's8'],
};
const careers: CareerDTO[] = MOCK_CAREERS.map(career => ({
  id: career.id, name: career.name, description: career.description,
  slug: career.name.toLowerCase().replaceAll(' ', '-'),
  requirements: (careerSkills[career.id] ?? []).map(id => {
    const skill = MOCK_SKILLS.find(item => item.id === id)!;
    const requirement = career.requiredSkills.find(item => item.skillId === id);
    return { skillId: id, skillName: skill.name, category: skill.category,
      requiredLevel: requirement?.requiredLevel ?? 85, weight: 1, priority: 'high' as const };
  }),
}));
let roadmap: RoadmapDTO = {
  id: 'demo-roadmap', studentId: student.id, careerId: 'c2',
  title: 'Your path to AI Engineer', description: 'Build strong foundations, then train and deploy your first neural network.',
  progress: 75, isActive: true, createdAt: new Date().toISOString(),
  tasks: MOCK_ROADMAP.flatMap(phase => phase.tasks.map(task => ({
    id: task.id, roadmapId: 'demo-roadmap', title: task.title,
    description: [task.description, ...task.steps].join(' · '), skillId: task.skillId ?? null,
    week: phase.order, estimatedMinutes: task.estimatedMinutes,
    status: (task.status === 'completed' ? 'done' : task.status === 'in-progress' ? 'in_progress' : 'todo') as TaskStatus,
  }))),
};

export function demoUser() { return { id: student.id, name: student.name, email: student.email }; }

function analyze(career: CareerDTO): CareerAnalysisDTO {
  const results = (career.requirements ?? []).map(requirement => {
    const current = skills.find(skill => skill.id === requirement.skillId)?.proficiency ?? 0;
    return { skillId: requirement.skillId, skillName: requirement.skillName,
      current, required: requirement.requiredLevel, weight: requirement.weight,
      priority: requirement.priority, ratio: Math.min(current / requirement.requiredLevel, 1) };
  });
  return { career: { id: career.id, slug: career.slug, name: career.name },
    readinessScore: Math.round(results.reduce((sum, item) => sum + item.ratio, 0) / Math.max(results.length, 1) * 100),
    strongSkills: results.filter(item => item.current >= item.required),
    gaps: results.filter(item => item.current < item.required),
  };
}

/** Presentation data and edits stay in this browser tab; reload restores the fixtures. */
export async function demoFetch<T>(path: string, init: RequestInit): Promise<T> {
  init.signal?.throwIfAborted();
  const method = init.method?.toUpperCase() ?? 'GET';
  const body = typeof init.body === 'string' ? JSON.parse(init.body) : {};
  const parts = path.split('?')[0].split('/').filter(Boolean).map(decodeURIComponent);
  let result: unknown;
  if (path === '/api/dashboard' && method === 'GET') {
    const career = careers.find(item => item.id === roadmap.careerId)!;
    result = { student, skills: skills.map(skill => ({ name: skill.name, level: skill.proficiency })),
      streak: { currentStreak: MOCK_STUDENT.streak, longestStreak: 18, lastActivityAt: new Date().toISOString() },
      readiness: { career: { id: career.id, slug: career.slug, name: career.name }, score: analyze(career).readinessScore },
      roadmap: { id: roadmap.id, title: roadmap.title, progress: roadmap.progress,
        nextTask: roadmap.tasks.find(task => task.status !== 'done') ?? null },
    } satisfies DashboardDTO;
  } else if (parts[1] === 'profiles' && parts[2] === student.id) {
    if (parts[3] === 'skills') {
      if (method === 'PUT') {
        const name = String(body.name).trim();
        const existing = skills.find(skill => skill.name.toLowerCase() === name.toLowerCase());
        if (existing) existing.proficiency = Number(body.proficiency);
        else skills.push({ id: crypto.randomUUID(), name, category: 'Other', proficiency: Number(body.proficiency), confidence: null, source: 'demo' });
      } else if (method === 'DELETE') skills = skills.filter(skill => skill.name !== parts[4]);
      result = skills;
    } else {
      if (method === 'PATCH') {
        student = { ...student, name: body.name, degree: body.degree, university: body.university,
          graduationYear: body.graduationYear, cgpa: body.cgpa };
      }
      result = { student, skills, projects: [], internships: [], certifications: [] } satisfies ProfileDTO;
    }
  } else if (parts[1] === 'careers') {
    const career = careers.find(item => item.id === parts[2]);
    if (!parts[2]) result = careers;
    else if (!career) throw new Error('Career not found');
    else result = parts[3] === 'analyze' ? analyze(career) : career;
  } else if (parts[1] === 'students' && parts[3] === 'roadmaps') {
    result = roadmap;
  } else if (path === '/api/roadmaps/generate' && method === 'POST') {
    const career = careers.find(item => item.id === body.careerId);
    if (!career) throw new Error('Career not found');
    roadmap = { ...roadmap, careerId: career.id, title: `Your path to ${career.name}`,
      description: 'A sample learning plan based on your current skills.', progress: 0,
      tasks: analyze(career).gaps.map((gap, index) => ({
        id: `demo-task-${index}`, roadmapId: roadmap.id, title: `Practice ${gap.skillName}`,
        description: `Build a small project using ${gap.skillName} to work toward ${gap.required}% proficiency.`,
        skillId: gap.skillId, week: index + 1, status: 'todo', estimatedMinutes: 90,
      })),
    };
    result = roadmap;
  } else if (parts[1] === 'roadmaps' && parts[3] === 'tasks' && method === 'PATCH') {
    const task = roadmap.tasks.find(item => item.id === parts[4]);
    if (!task || !['todo', 'in_progress', 'done'].includes(body.status)) throw new Error('Invalid task update');
    task.status = body.status;
    roadmap.progress = Math.round(roadmap.tasks.filter(item => item.status === 'done').length / Math.max(roadmap.tasks.length, 1) * 100);
    result = task;
  } else throw new Error('This action is not available in the MVP demo.');
  return structuredClone(result) as T;
}
