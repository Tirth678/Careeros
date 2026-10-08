const fs = require('fs');
const path = require('path');

const files = {
  // Types
  "src/types/common.ts": `export type Status = 'idle' | 'loading' | 'success' | 'error';`,
  "src/types/profile.ts": `export interface Student {
  id: string;
  name: string;
  email: string;
  university: string;
  degree: string;
  graduationYear: number;
  cgpa: number;
  targetCareerId: string;
  readinessScore: number;
  streak: number;
  roadmapProgress: number;
}`,
  "src/types/skill.ts": `export interface Skill {
  id: string;
  name: string;
  category: 'Programming' | 'Frontend' | 'Backend' | 'AI / ML' | 'Tools';
  proficiency: number;
  status: 'STRONG' | 'DEVELOPING' | 'NEEDS_WORK';
}`,
  "src/types/career.ts": `export interface Career {
  id: string;
  name: string;
  description: string;
  matchScore: number;
  requiredSkills: { skillId: string; requiredLevel: number; importance: 'HIGH' | 'MEDIUM' | 'LOW' }[];
}`,
  "src/types/roadmap.ts": `export interface RoadmapPhase {
  id: string;
  title: string;
  order: number;
  tasks: RoadmapTask[];
}
export interface RoadmapTask {
  id: string;
  title: string;
  skillId: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedMinutes: number;
  status: 'completed' | 'in-progress' | 'pending';
  description: string;
  steps: string[];
}`,

  // Mock Data
  "src/data/skills.ts": `import { Skill } from '../types/skill';
export const MOCK_SKILLS: Skill[] = [
  { id: 's1', name: 'Python', category: 'Programming', proficiency: 91, status: 'STRONG' },
  { id: 's2', name: 'React', category: 'Frontend', proficiency: 92, status: 'STRONG' },
  { id: 's3', name: 'TypeScript', category: 'Frontend', proficiency: 84, status: 'STRONG' },
  { id: 's4', name: 'NumPy', category: 'AI / ML', proficiency: 85, status: 'STRONG' },
  { id: 's5', name: 'Machine Learning', category: 'AI / ML', proficiency: 78, status: 'DEVELOPING' },
  { id: 's6', name: 'SQL', category: 'Backend', proficiency: 76, status: 'DEVELOPING' },
  { id: 's7', name: 'Node.js', category: 'Backend', proficiency: 67, status: 'DEVELOPING' },
  { id: 's8', name: 'Docker', category: 'Tools', proficiency: 42, status: 'NEEDS_WORK' },
  { id: 's9', name: 'PyTorch', category: 'AI / ML', proficiency: 31, status: 'NEEDS_WORK' },
  { id: 's10', name: 'MLOps', category: 'AI / ML', proficiency: 12, status: 'NEEDS_WORK' },
];`,
  "src/data/careers.ts": `import { Career } from '../types/career';
export const MOCK_CAREERS: Career[] = [
  {
    id: 'c1', name: 'Full Stack Developer', description: 'Build end-to-end web applications.', matchScore: 89,
    requiredSkills: []
  },
  {
    id: 'c2', name: 'AI Engineer', description: 'Develop intelligent systems and AI models.', matchScore: 72,
    requiredSkills: []
  },
  {
    id: 'c3', name: 'ML Engineer', description: 'Design and deploy machine learning models.', matchScore: 67,
    requiredSkills: [
      { skillId: 's1', requiredLevel: 90, importance: 'HIGH' },
      { skillId: 's4', requiredLevel: 80, importance: 'HIGH' },
      { skillId: 's5', requiredLevel: 85, importance: 'HIGH' },
      { skillId: 's9', requiredLevel: 80, importance: 'HIGH' }, // PyTorch
      { skillId: 's10', requiredLevel: 60, importance: 'HIGH' }, // MLOps
    ]
  },
  {
    id: 'c4', name: 'Data Scientist', description: 'Analyze complex data to extract insights.', matchScore: 61,
    requiredSkills: []
  },
  {
    id: 'c5', name: 'Cloud Engineer', description: 'Manage and architect cloud infrastructure.', matchScore: 43,
    requiredSkills: []
  },
];`,
  "src/data/student.ts": `import { Student } from '../types/profile';
export const MOCK_STUDENT: Student = {
  id: 'u1',
  name: 'Tirth',
  email: 'tirth@example.com',
  university: 'GSFC University',
  degree: 'B.Tech Computer Science Engineering',
  graduationYear: 2028,
  cgpa: 7.8,
  targetCareerId: 'c2',
  readinessScore: 72,
  streak: 12,
  roadmapProgress: 68
};`,
  "src/data/roadmap.ts": `import { RoadmapPhase } from '../types/roadmap';
export const MOCK_ROADMAP: RoadmapPhase[] = [
  {
    id: 'p1', title: 'FOUNDATIONS', order: 1, tasks: [
      { id: 't1', title: 'Python', skillId: 's1', difficulty: 'Beginner', estimatedMinutes: 120, status: 'completed', description: 'Master Python basics', steps: [] },
      { id: 't2', title: 'NumPy', skillId: 's4', difficulty: 'Intermediate', estimatedMinutes: 60, status: 'completed', description: 'Learn NumPy', steps: [] },
    ]
  },
  {
    id: 'p2', title: 'DEEP LEARNING', order: 2, tasks: [
      { id: 't3', title: 'Neural Network Fundamentals', skillId: 's5', difficulty: 'Intermediate', estimatedMinutes: 90, status: 'completed', description: 'Understand NNs', steps: [] },
      { id: 't4', title: 'PyTorch Training Loops', skillId: 's9', difficulty: 'Intermediate', estimatedMinutes: 45, status: 'in-progress', description: 'PyTorch is an important skill for modern ML engineering.', steps: ['Learn tensors', 'Understand forward/backward pass', 'Build a training loop', 'Train a small classifier'] },
    ]
  }
];`
};

for (const [filepath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf-8');
  console.log('Created:', filepath);
}
