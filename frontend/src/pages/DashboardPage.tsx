import ReadinessCard from '../components/dashboard/ReadinessCard';
import StreakCard from '../components/dashboard/StreakCard';
import SkillsOverview from '../components/dashboard/SkillsOverview';
import RoadmapOverview from '../components/dashboard/RoadmapOverview';
import NextBestAction from '../components/dashboard/NextBestAction';
import CareerMatches from '../components/dashboard/CareerMatches';
import ParticleBackground from '../components/landing/ParticleBackground';

export default function DashboardPage() {
  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      <div className="relative z-10 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-white">Good morning, Tirth.</h1>
          <p className="text-text-muted mt-1">Here's your career progress at a glance.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ReadinessCard />
          <StreakCard />
          <SkillsOverview />
          <RoadmapOverview />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <NextBestAction />
          </div>
          <div>
            <CareerMatches />
          </div>
        </div>
      </div>
    </div>
  );
}