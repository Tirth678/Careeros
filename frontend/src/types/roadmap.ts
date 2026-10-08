export interface RoadmapPhase {
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
}