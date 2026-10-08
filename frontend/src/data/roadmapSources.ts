// Curated links verified against roadmap.sh. Progress is tracked separately in CareerOS.
export const ROADMAP_SOURCES = [
  { career: 'Full Stack Developer', slug: 'full-stack-developer', title: 'Full Stack Developer', url: 'https://roadmap.sh/full-stack', description: 'Explore the frontend, backend, and database skills behind complete web applications.' },
  { career: 'AI Engineer', slug: 'ai-engineer', title: 'AI Engineer', url: 'https://roadmap.sh/ai-engineer', description: 'Explore the skills for building applications with AI models and tools.' },
  { career: 'ML Engineer', slug: 'ml-engineer', title: 'Machine Learning', url: 'https://roadmap.sh/machine-learning', description: 'Explore the machine learning roadmap and its learning resources.' },
  { career: 'Data Scientist', slug: 'data-scientist', title: 'AI and Data Scientist', url: 'https://roadmap.sh/ai-data-scientist', description: 'Explore programming, statistics, and practical work with data.' },
  { career: 'Cloud Engineer', slug: 'cloud-engineer', title: 'AWS', url: 'https://roadmap.sh/aws', description: 'Explore an AWS-focused learning path for cloud engineering.' },
] as const;

export function roadmapSource(career?: { slug?: string; name?: string }) {
  return ROADMAP_SOURCES.find(source => source.slug === career?.slug || source.career === career?.name);
}
