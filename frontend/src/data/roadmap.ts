import type { RoadmapPhase } from '../types/roadmap';
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
];
