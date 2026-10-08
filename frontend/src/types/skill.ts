export interface Skill {
  id: string;
  name: string;
  category: 'Programming' | 'Frontend' | 'Backend' | 'AI / ML' | 'Tools';
  proficiency: number;
  status: 'STRONG' | 'DEVELOPING' | 'NEEDS_WORK';
}