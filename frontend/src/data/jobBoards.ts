export const JOB_BOARDS = [
  { name: 'LinkedIn', label: 'Professional network', initials: 'in', color: 'bg-blue-600', url: (role: string) => `https://www.linkedin.com/jobs/search/?${new URLSearchParams({ keywords: role })}` },
  { name: 'Indeed', label: 'Job search', initials: 'I', color: 'bg-indigo-600', url: (role: string) => `https://www.indeed.com/jobs?${new URLSearchParams({ q: role })}` },
  { name: 'Glassdoor', label: 'Jobs and company research', initials: 'G', color: 'bg-emerald-600', url: (role: string) => `https://www.glassdoor.com/Job/jobs.htm?${new URLSearchParams({ 'sc.keyword': role })}` },
  { name: 'Wellfound', label: 'Browse startup opportunities', initials: 'W', color: 'bg-zinc-700', url: (_role: string) => 'https://wellfound.com/jobs' },
  { name: 'Naukri', label: 'Jobs in India', initials: 'N', color: 'bg-sky-600', url: (role: string) => `https://www.naukri.com/${role.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}-jobs` },
  { name: 'Foundit', label: 'Jobs in India', initials: 'f', color: 'bg-purple-600', url: (role: string) => `https://www.foundit.in/srp/results?${new URLSearchParams({ query: role })}` },
];

// CareerOS role overviews, not employer postings or scraped job descriptions.
export const ROLE_DETAILS: Record<string, { responsibilities: string[]; portfolio: string; titles: string[] }> = {
  'Full Stack Developer': { responsibilities: ['Build responsive interfaces and backend APIs.', 'Design database models and integrate authentication.', 'Test, deploy, and maintain complete web applications.'], portfolio: 'A deployed application with authentication, a database, tests, and a clear README.', titles: ['Full Stack Developer', 'Software Engineer', 'Web Developer'] },
  'AI Engineer': { responsibilities: ['Integrate AI models into usable products.', 'Build retrieval and evaluation workflows.', 'Monitor response quality, latency, and cost.'], portfolio: 'An AI application with an evaluation dataset, documented limitations, and a working demo.', titles: ['AI Engineer', 'Generative AI Engineer', 'Applied AI Engineer'] },
  'ML Engineer': { responsibilities: ['Build reproducible training and data pipelines.', 'Evaluate model performance and deploy inference services.', 'Monitor models and maintain reliable releases.'], portfolio: 'A reproducible machine learning project with a deployed prediction API and evaluation report.', titles: ['Machine Learning Engineer', 'ML Engineer', 'MLOps Engineer'] },
  'Data Scientist': { responsibilities: ['Explore and clean datasets to answer business questions.', 'Develop and evaluate statistical or predictive models.', 'Communicate findings through clear visualizations.'], portfolio: 'An end-to-end analysis with documented assumptions, visualizations, and actionable findings.', titles: ['Data Scientist', 'Junior Data Scientist', 'Data Analyst'] },
  'Cloud Engineer': { responsibilities: ['Provision and maintain cloud infrastructure.', 'Automate deployments and observability.', 'Manage access, reliability, and infrastructure costs.'], portfolio: 'A cloud deployment with infrastructure as code, monitoring, and a documented recovery plan.', titles: ['Cloud Engineer', 'AWS Engineer', 'DevOps Engineer'] },
};
