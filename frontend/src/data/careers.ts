import type { Career } from '../types/career';
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
];
