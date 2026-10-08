import type { Skill } from '../types/skill';
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
];
