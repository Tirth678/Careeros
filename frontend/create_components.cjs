const fs = require('fs');
const path = require('path');

const files = {
  // App Routes
  "src/routes/AppRoutes.tsx": `import { Routes, Route } from 'react-router-dom';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import SignupPage from '../pages/SignupPage';
import DashboardPage from '../pages/DashboardPage';
import ProfilePage from '../pages/ProfilePage';
import SkillsPage from '../pages/SkillsPage';
import CareersPage from '../pages/CareersPage';
import CareerAnalysisPage from '../pages/CareerAnalysisPage';
import RoadmapPage from '../pages/RoadmapPage';
import SettingsPage from '../pages/SettingsPage';
import NotFoundPage from '../pages/NotFoundPage';
import AppLayout from '../components/layout/AppLayout';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/careers/:careerId" element={<CareerAnalysisPage />} />
        <Route path="/roadmap" element={<RoadmapPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}`,
  
  // App
  "src/App.tsx": `import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;`,
  
  // Pages stubs
  "src/pages/LandingPage.tsx": `import Hero from '../components/landing/Hero';
import FeatureSection from '../components/landing/FeatureSection';
import HowItWorks from '../components/landing/HowItWorks';
import CareerPreview from '../components/landing/CareerPreview';
import AIAdvisorPreview from '../components/landing/AIAdvisorPreview';
import LandingFooter from '../components/landing/LandingFooter';
import ParticleBackground from '../components/landing/ParticleBackground';
import { Link } from 'react-router-dom';
import { Brain } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      <ParticleBackground />
      <nav className="relative z-10 flex items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2">
          <Brain className="w-8 h-8 text-primary-500" />
          <span className="text-xl font-bold tracking-tight">CareerOS</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm font-medium text-text-muted">
          <a href="#product" className="hover:text-white transition-colors">Product</a>
          <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="#careers" className="hover:text-white transition-colors">Careers</a>
          <a href="#about" className="hover:text-white transition-colors">About</a>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium hover:text-white transition-colors">Log in</Link>
          <Link to="/signup" className="px-4 py-2 bg-white text-black text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors">Get Started</Link>
        </div>
      </nav>
      <main className="relative z-10">
        <Hero />
        <FeatureSection />
        <HowItWorks />
        <CareerPreview />
        <AIAdvisorPreview />
      </main>
      <LandingFooter />
    </div>
  );
}`,
  "src/pages/LoginPage.tsx": `import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-card p-8 rounded-2xl border border-white/10">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <Brain className="w-10 h-10 text-primary-500" />
            <span className="text-2xl font-bold tracking-tight text-white">CareerOS</span>
          </div>
        </div>
        <h1 className="text-2xl font-semibold text-white mb-6 text-center">Welcome back.</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <input type="email" placeholder="Email" required className="w-full bg-background-100 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors" />
          </div>
          <div>
            <input type="password" placeholder="Password" required className="w-full bg-background-100 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors" />
          </div>
          <button disabled={loading} type="submit" className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-gray-200 transition-colors flex justify-center items-center">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Log in"}
          </button>
        </form>
        <button className="w-full mt-4 bg-background-100 text-white font-medium py-3 rounded-lg border border-white/10 hover:bg-background-200 transition-colors">
          Continue with Google
        </button>
        <p className="mt-8 text-center text-sm text-text-muted">
          Don't have an account? <Link to="/signup" className="text-primary-400 hover:text-primary-300">Create one.</Link>
        </p>
      </div>
    </div>
  );
}`,
  "src/pages/SignupPage.tsx": `import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, Loader2 } from 'lucide-react';

export default function SignupPage() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/dashboard');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md glass-card p-8 rounded-2xl border border-white/10">
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <Brain className="w-10 h-10 text-primary-500" />
            <span className="text-2xl font-bold tracking-tight text-white">CareerOS</span>
          </div>
        </div>
        <h1 className="text-2xl font-semibold text-white mb-6 text-center">Build your career profile.</h1>
        <form onSubmit={handleSignup} className="space-y-4">
          <input type="text" placeholder="Full Name" required className="w-full bg-background-100 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors" />
          <input type="email" placeholder="Email" required className="w-full bg-background-100 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors" />
          <input type="password" placeholder="Password" required className="w-full bg-background-100 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors" />
          <input type="text" placeholder="University" required className="w-full bg-background-100 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors" />
          <input type="text" placeholder="Degree" required className="w-full bg-background-100 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors" />
          <input type="number" placeholder="Graduation Year" required className="w-full bg-background-100 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500 transition-colors" />
          <button disabled={loading} type="submit" className="w-full bg-white text-black font-semibold py-3 rounded-lg hover:bg-gray-200 transition-colors flex justify-center items-center">
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Create My Profile"}
          </button>
        </form>
        <p className="mt-8 text-center text-sm text-text-muted">
          Already have an account? <Link to="/login" className="text-primary-400 hover:text-primary-300">Log in.</Link>
        </p>
      </div>
    </div>
  );
}`,
  "src/pages/DashboardPage.tsx": `import ReadinessCard from '../components/dashboard/ReadinessCard';
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
}`,
  "src/pages/ProfilePage.tsx": `export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">My Profile</h1>
        <p className="text-text-muted mt-1">Your complete career identity.</p>
      </div>
      <div className="glass-card p-6 rounded-2xl border border-white/10">
        <h2 className="text-xl font-semibold text-white">Tirth</h2>
        <p className="text-text-muted mt-2">B.Tech Computer Science Engineering</p>
        <p className="text-text-muted">GSFC University</p>
        <p className="text-text-muted">Graduation: 2028 | CGPA: 7.8</p>
        <p className="text-primary-400 mt-2 font-medium">Target Career: AI Engineer</p>
        <button className="mt-4 px-4 py-2 bg-background-100 border border-white/10 rounded-lg text-white hover:bg-background-200 transition-colors">Edit Profile</button>
      </div>
    </div>
  );
}`,
  "src/pages/SkillsPage.tsx": `import { MOCK_SKILLS } from '../data/skills';
import { useState } from 'react';
import SkillDetailDrawer from '../components/skills/SkillDetailDrawer';

export default function SkillsPage() {
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">My Skills</h1>
        <p className="text-text-muted mt-1">Understand your strengths and identify what to improve.</p>
      </div>
      <div className="flex gap-4 text-sm">
        <div className="px-4 py-2 glass-card rounded-lg border border-white/10"><span className="text-white font-bold">18</span> Skills</div>
        <div className="px-4 py-2 glass-card rounded-lg border border-white/10"><span className="text-primary-400 font-bold">12</span> Strong</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_SKILLS.map(skill => (
          <div key={skill.id} onClick={() => setSelectedSkill(skill.id)} className="glass-card p-5 rounded-xl border border-white/10 cursor-pointer hover:border-primary-500/50 transition-colors">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-white">{skill.name}</h3>
              <span className="text-xs px-2 py-1 bg-background-200 rounded-md text-text-muted">{skill.status}</span>
            </div>
            <div className="h-2 w-full bg-background-200 rounded-full overflow-hidden">
              <div className="h-full bg-primary-500 rounded-full" style={{ width: \`\${skill.proficiency}%\` }} />
            </div>
            <p className="text-right text-xs mt-2 text-text-muted">{skill.proficiency}%</p>
          </div>
        ))}
      </div>
      <SkillDetailDrawer skillId={selectedSkill} onClose={() => setSelectedSkill(null)} />
    </div>
  );
}`,
  "src/pages/CareersPage.tsx": `import { MOCK_CAREERS } from '../data/careers';
import { useNavigate } from 'react-router-dom';

export default function CareersPage() {
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Career Explorer</h1>
        <p className="text-text-muted mt-1">Discover careers that match your current skills.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_CAREERS.map(career => (
          <div key={career.id} className="glass-card p-6 rounded-2xl border border-white/10">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-white">{career.name}</h2>
                <p className="text-sm text-text-muted mt-1">{career.description}</p>
              </div>
              <div className="text-2xl font-bold text-primary-400">{career.matchScore}%</div>
            </div>
            <button onClick={() => navigate(\`/careers/\${career.id}\`)} className="mt-4 w-full py-2 bg-background-100 border border-white/10 text-white rounded-lg hover:bg-white hover:text-black transition-colors">
              View Analysis
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}`,
  "src/pages/CareerAnalysisPage.tsx": `import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_CAREERS } from '../data/careers';
import ParticleBackground from '../components/landing/ParticleBackground';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function CareerAnalysisPage() {
  const { careerId } = useParams();
  const navigate = useNavigate();
  const career = MOCK_CAREERS.find(c => c.id === careerId) || MOCK_CAREERS[2];
  const [loading, setLoading] = useState(false);

  const generateRoadmap = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/roadmap');
    }, 2000);
  };

  return (
    <div className="relative min-h-screen">
      <ParticleBackground />
      <div className="relative z-10 space-y-8">
        <div className="text-center py-12">
          <h1 className="text-5xl font-bold text-white mb-4">{career.name}</h1>
          <p className="text-xl text-text-muted">How ready are you?</p>
          <div className="mt-8 text-7xl font-bold text-primary-500 text-glow">{career.matchScore} / 100</div>
          <div className="mt-4 text-primary-300 font-semibold tracking-widest uppercase">Developing</div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="glass-card p-6 rounded-2xl border border-white/10">
            <h2 className="text-xl font-bold text-white mb-6">Skill Gaps</h2>
            <div className="space-y-6">
              {[
                { name: 'PyTorch', current: 31, req: 80, gap: 49 },
                { name: 'MLOps', current: 12, req: 60, gap: 48 }
              ].map(skill => (
                <div key={skill.name}>
                  <div className="flex justify-between mb-2">
                    <span className="font-semibold text-white">{skill.name}</span>
                    <span className="text-sm text-primary-400">Gap: {skill.gap}%</span>
                  </div>
                  <div className="h-2 w-full bg-background-200 rounded-full overflow-hidden flex">
                    <div className="h-full bg-primary-600" style={{ width: \`\${skill.current}%\` }} />
                    <div className="h-full bg-primary-400/30" style={{ width: \`\${skill.gap}%\` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card p-8 rounded-2xl border border-primary-500/30 bg-primary-900/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/20 blur-3xl rounded-full"></div>
            <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">✨ AI Career Advisor</h2>
            <p className="text-text-muted mb-4">"You have a strong programming foundation, but your biggest gaps are PyTorch and MLOps."</p>
            <p className="text-text-muted mb-8">"Your highest-impact next step is to complete a PyTorch training project."</p>
            <button onClick={generateRoadmap} disabled={loading} className="w-full bg-primary-600 text-white font-semibold py-3 rounded-lg hover:bg-primary-500 transition-colors flex justify-center items-center">
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Generate My Roadmap →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}`,
  "src/pages/RoadmapPage.tsx": `import { MOCK_ROADMAP } from '../data/roadmap';
import ParticleBackground from '../components/landing/ParticleBackground';
import { useState } from 'react';
import TaskDetailDrawer from '../components/roadmap/TaskDetailDrawer';

export default function RoadmapPage() {
  const [selectedTask, setSelectedTask] = useState<any>(null);

  return (
    <div className="relative min-h-screen pb-20">
      <ParticleBackground />
      <div className="relative z-10 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-white">My Career Roadmap</h1>
          <p className="text-text-muted mt-1">Your personalized path to becoming an AI Engineer.</p>
        </div>
        
        <div className="glass-card p-6 rounded-2xl border border-white/10 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">AI Engineer</h2>
            <p className="text-primary-400 mt-1 font-medium">Readiness: 72%</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-white">68%</div>
            <p className="text-sm text-text-muted">Progress</p>
          </div>
        </div>

        <div className="space-y-8 pl-4 border-l-2 border-background-200">
          {MOCK_ROADMAP.map(phase => (
            <div key={phase.id} className="relative">
              <div className="absolute -left-[21px] top-1 w-10 h-10 bg-background border border-white/10 rounded-full flex items-center justify-center font-bold text-sm text-primary-400">
                P{phase.order}
              </div>
              <div className="pl-10">
                <h3 className="text-lg font-bold text-white tracking-widest">{phase.title}</h3>
                <div className="mt-4 space-y-3">
                  {phase.tasks.map(task => (
                    <div 
                      key={task.id} 
                      onClick={() => setSelectedTask(task)}
                      className={\`p-4 rounded-xl border transition-colors cursor-pointer flex items-center gap-3 \${task.status === 'completed' ? 'glass-card border-white/10 opacity-70' : task.status === 'in-progress' ? 'bg-primary-900/10 border-primary-500/50' : 'glass-card border-white/10'}\`}
                    >
                      <div className={\`w-5 h-5 rounded-full border-2 flex items-center justify-center \${task.status === 'completed' ? 'border-primary-500 bg-primary-500 text-black' : task.status === 'in-progress' ? 'border-primary-400' : 'border-background-200'}\`}>
                        {task.status === 'completed' && <span className="text-[10px]">✓</span>}
                      </div>
                      <span className={\`font-medium \${task.status === 'completed' ? 'text-text-muted line-through' : 'text-white'}\`}>{task.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selectedTask && <TaskDetailDrawer task={selectedTask} onClose={() => setSelectedTask(null)} />}
    </div>
  );
}`,
  "src/pages/SettingsPage.tsx": `export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
      </div>
      <div className="space-y-8">
        <section>
          <h2 className="text-lg font-semibold text-white mb-4">Account</h2>
          <div className="space-y-4">
            <input type="text" defaultValue="Tirth" className="w-full bg-background-100 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500" />
            <input type="email" defaultValue="tirth@example.com" className="w-full bg-background-100 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500" />
          </div>
        </section>
        <section>
          <h2 className="text-lg font-semibold text-white mb-4">Career Preferences</h2>
          <select className="w-full bg-background-100 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary-500">
            <option>AI Engineer</option>
            <option>ML Engineer</option>
            <option>Full Stack Developer</option>
          </select>
        </section>
        <button className="bg-white text-black font-semibold py-2 px-6 rounded-lg hover:bg-gray-200">Save Changes</button>
      </div>
    </div>
  );
}`,
  "src/pages/NotFoundPage.tsx": `export default function NotFoundPage() {
  return <div className="p-8 text-white">404 - Not Found</div>;
}`,
  
  // Layout components
  "src/components/layout/AppLayout.tsx": `import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function AppLayout() {
  return (
    <div className="flex min-h-screen bg-black">
      <Sidebar />
      <main className="flex-1 ml-0 md:ml-64 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}`,
  "src/components/layout/Sidebar.tsx": `import { Link, useLocation } from 'react-router-dom';
import { Brain, LayoutDashboard, User, Code2, Briefcase, Map, Settings, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/profile', label: 'Profile', icon: User },
  { path: '/skills', label: 'Skills', icon: Code2 },
  { path: '/careers', label: 'Careers', icon: Briefcase },
  { path: '/roadmap', label: 'Roadmap', icon: Map },
];

export default function Sidebar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <button className="md:hidden fixed top-4 right-4 z-50 p-2 glass-card rounded-lg" onClick={() => setIsOpen(!isOpen)}>
        <Menu className="w-6 h-6 text-white" />
      </button>

      {/* Sidebar */}
      <aside className={\`fixed inset-y-0 left-0 z-40 w-64 glass-panel border-r border-white/10 transform transition-transform duration-300 md:translate-x-0 \${isOpen ? 'translate-x-0' : '-translate-x-full'}\`}>
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center gap-2 px-2 py-4 mb-8">
            <Brain className="w-8 h-8 text-primary-500" />
            <span className="text-xl font-bold tracking-tight text-white">CareerOS</span>
          </div>

          <nav className="flex-1 space-y-1">
            {navItems.map(item => {
              const active = location.pathname.startsWith(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={\`flex items-center gap-3 px-3 py-3 rounded-lg transition-colors \${active ? 'bg-background-200 text-white font-medium' : 'text-text-muted hover:text-white hover:bg-white/5'}\`}
                >
                  <Icon className={\`w-5 h-5 \${active ? 'text-primary-400' : ''}\`} />
                  {item.label}
                </Link>
              );
            })}
            
            <div className="pt-8 mt-8 border-t border-white/10 space-y-1">
              <Link to="/settings" className="flex items-center gap-3 px-3 py-3 rounded-lg text-text-muted hover:text-white hover:bg-white/5 transition-colors">
                <Settings className="w-5 h-5" />
                Settings
              </Link>
            </div>
          </nav>

          <div className="pt-4 border-t border-white/10 flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full bg-primary-900/20 border border-primary-500/30 flex items-center justify-center text-primary-400 font-bold">
              T
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium text-white truncate">Tirth</p>
              <p className="text-xs text-text-muted truncate">B.Tech CSE</p>
            </div>
            <Link to="/" className="p-2 text-text-muted hover:text-white transition-colors">
              <LogOut className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </aside>
      
      {/* Overlay */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsOpen(false)} />
      )}
    </>
  );
}`
};

for (const [filepath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf-8');
  console.log('Created:', filepath);
}
