export interface Career {
  id: string;
  name: string;
  description: string;
  matchScore: number;
  requiredSkills: { skillId: string; requiredLevel: number; importance: 'HIGH' | 'MEDIUM' | 'LOW' }[];
}