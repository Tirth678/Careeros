export interface LiveJob {
  id: string; title: string; company: string; location: string; url: string;
  source: string; postedAt: string | null;
}
export interface JobFeed {
  checkedAt: string;
  jobs: LiveJob[];
  sources: { name: string; status: 'available' | 'blocked' | 'unavailable'; count: number; message: string }[];
}
