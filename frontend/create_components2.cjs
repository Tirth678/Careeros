const fs = require('fs');
const path = require('path');

const files = {
  // Landing Components
  "src/components/landing/ParticleBackground.tsx": `import { useEffect, useRef } from 'react';

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particles: { x: number; y: number; vx: number; vy: number; radius: number }[] = [];
    const particleCount = 70;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const init = () => {
      resize();
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          radius: Math.random() * 1.5 + 0.5,
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(168, 85, 247, 0.4)'; // Primary purple
      
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = \`rgba(168, 85, 247, \${0.15 - dist/1000})\`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      requestAnimationFrame(draw);
    };

    init();
    draw();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none opacity-60 z-0" />;
}`,
  "src/components/landing/Hero.tsx": `import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 relative">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-900/10 border border-primary-500/30 text-primary-400 text-sm font-medium mb-8 animate-fade-in">
        <Sparkles className="w-4 h-4" />
        AI-POWERED CAREER INTELLIGENCE
      </div>
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl mb-6 text-white text-glow animate-slide-up">
        Your career has a destination.<br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">CareerOS shows you the path.</span>
      </h1>
      <p className="text-xl text-text-muted max-w-2xl mb-10 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        Turn your skills, projects, academics and experience into a clear path toward the career you want.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <Link to="/signup" className="px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
          Build My Career Profile <ArrowRight className="w-5 h-5" />
        </Link>
        <Link to="/careers" className="px-8 py-4 bg-background-100 border border-white/10 text-white font-semibold rounded-lg hover:bg-background-200 transition-colors flex items-center justify-center">
          Explore Careers
        </Link>
      </div>
    </div>
  );
}`,
  "src/components/landing/FeatureSection.tsx": `export default function FeatureSection() {
  return (
    <section className="py-24 px-4 max-w-7xl mx-auto" id="how-it-works">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">Everything you need to become career-ready.</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { num: '01', title: 'KNOW YOURSELF', desc: 'Build one complete profile containing your academics, projects, certifications, internships and skills.' },
          { num: '02', title: 'CHOOSE YOUR DIRECTION', desc: 'Explore careers and see which paths match your current capabilities.' },
          { num: '03', title: 'FIND YOUR GAPS', desc: 'Understand exactly which skills you are missing for your target career.' },
          { num: '04', title: 'KNOW WHAT TO DO NEXT', desc: 'Get a personalized roadmap based on your actual skill gaps.' }
        ].map((feat, i) => (
          <div key={i} className="glass-card p-8 rounded-2xl border border-white/10 relative overflow-hidden group">
            <div className="text-5xl font-bold text-white/5 absolute -top-4 -right-4 group-hover:text-primary-500/10 transition-colors">{feat.num}</div>
            <div className="text-sm font-bold text-primary-400 mb-4">{feat.num}</div>
            <h3 className="text-xl font-bold text-white mb-4">{feat.title}</h3>
            <p className="text-text-muted leading-relaxed">{feat.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}`,
  "src/components/landing/HowItWorks.tsx": `export default function HowItWorks() {
  return (
    <section className="py-24 px-4 max-w-5xl mx-auto text-center border-t border-white/5">
      <h2 className="text-3xl md:text-4xl font-bold mb-16 text-white">From where you are to where you want to be.</h2>
      <div className="flex flex-col md:flex-row justify-between items-center relative">
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-primary-900/10 via-primary-500/30 to-primary-900/10 -translate-y-1/2 z-0"></div>
        {['Build your profile', 'Choose your career', 'Understand your gaps', 'Follow your roadmap'].map((step, i) => (
          <div key={i} className="relative z-10 flex flex-col items-center mb-8 md:mb-0">
            <div className="w-12 h-12 rounded-full bg-background border border-primary-500/30 flex items-center justify-center text-primary-400 font-bold mb-4 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              0{i+1}
            </div>
            <span className="font-medium text-white">{step}</span>
          </div>
        ))}
      </div>
    </section>
  );
}`,
  "src/components/landing/CareerPreview.tsx": `export default function CareerPreview() {
  return (
    <section className="py-24 px-4 max-w-6xl mx-auto text-center" id="product">
      <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Stop guessing if you're ready.</h2>
      <p className="text-xl text-text-muted max-w-2xl mx-auto mb-16">
        CareerOS compares your current skills with the skills required for your target career.
      </p>
      
      <div className="max-w-3xl mx-auto glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 blur-3xl rounded-full"></div>
        <h3 className="text-2xl font-bold text-white mb-2">ML Engineer</h3>
        <div className="text-6xl font-bold text-primary-500 text-glow my-6">67 / 100</div>
        <div className="text-primary-300 font-semibold tracking-widest uppercase mb-12">Developing</div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
          <div>
            <h4 className="text-sm font-bold text-text-muted mb-4 uppercase tracking-wider">Strong</h4>
            <div className="space-y-3">
              {['Python', 'NumPy', 'Machine Learning'].map(s => (
                <div key={s} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                  <span className="text-white font-medium">{s}</span>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-text-muted mb-4 uppercase tracking-wider">Missing</h4>
            <div className="space-y-3">
              {['PyTorch', 'MLOps', 'Model Deployment'].map(s => (
                <div key={s} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-background-200 border border-white/20"></div>
                  <span className="text-text-muted">{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}`,
  "src/components/landing/AIAdvisorPreview.tsx": `import { ArrowRight, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AIAdvisorPreview() {
  return (
    <section className="py-24 px-4 max-w-4xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">AI that tells you what to do next.</h2>
      
      <div className="glass-panel p-8 md:p-12 rounded-3xl border border-primary-500/20 bg-primary-900/5 relative">
        <div className="flex items-center gap-3 mb-6">
          <Brain className="w-8 h-8 text-primary-400" />
          <h3 className="text-xl font-bold text-white">AI CAREER ADVISOR</h3>
        </div>
        <p className="text-xl md:text-2xl text-text-muted leading-relaxed mb-6 font-light">
          "You have a strong programming foundation. Your biggest opportunity is developing production-level ML skills."
        </p>
        <p className="text-xl md:text-2xl text-white leading-relaxed mb-10 font-medium">
          "Start with PyTorch, then move into model deployment."
        </p>
        <Link to="/signup" className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-500 transition-colors">
          Generate My Roadmap <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}`,
  "src/components/landing/LandingFooter.tsx": `import { Brain } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingFooter() {
  return (
    <footer className="border-t border-white/10 bg-background pt-24 pb-12 px-8 mt-24">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-16 gap-8">
        <div className="text-center md:text-left">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Your career shouldn't feel like a guessing game.</h2>
          <p className="text-xl text-text-muted mb-8">Build your profile. Find your gaps. Follow your path.</p>
          <Link to="/signup" className="inline-block px-8 py-4 bg-white text-black font-semibold rounded-lg hover:bg-gray-200 transition-colors">
            Start Building Your Career →
          </Link>
        </div>
      </div>
      <div className="max-w-7xl mx-auto pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-text-muted">
        <div className="flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary-500" />
          <span className="font-bold text-white">CareerOS</span>
        </div>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white">Product</a>
          <a href="#" className="hover:text-white">Careers</a>
          <a href="#" className="hover:text-white">How it Works</a>
          <a href="#" className="hover:text-white">Privacy</a>
          <a href="#" className="hover:text-white">Terms</a>
          <a href="#" className="hover:text-white">GitHub</a>
        </div>
      </div>
    </footer>
  );
}`,

  // Dashboard Components
  "src/components/dashboard/ReadinessCard.tsx": `import { TrendingUp } from 'lucide-react';

export default function ReadinessCard() {
  return (
    <div className="glass-card p-6 rounded-2xl border border-white/10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/10 blur-2xl rounded-full"></div>
      <p className="text-sm font-medium text-text-muted mb-1">Career Readiness</p>
      <div className="flex items-baseline gap-2 mb-2">
        <h3 className="text-3xl font-bold text-white text-glow">72</h3>
        <span className="text-sm text-text-muted">/ 100</span>
      </div>
      <p className="text-sm font-medium text-white mb-4">AI Engineer</p>
      <div className="flex items-center gap-1 text-xs text-primary-400 font-medium">
        <TrendingUp className="w-4 h-4" />
        <span>+6% this month</span>
      </div>
    </div>
  );
}`,
  "src/components/dashboard/StreakCard.tsx": `import { Flame } from 'lucide-react';

export default function StreakCard() {
  return (
    <div className="glass-card p-6 rounded-2xl border border-white/10">
      <p className="text-sm font-medium text-text-muted mb-1">Career Streak</p>
      <div className="flex items-center gap-3 mb-4">
        <h3 className="text-3xl font-bold text-white">12</h3>
        <span className="text-sm text-text-muted">days</span>
        <Flame className="w-6 h-6 text-primary-500" />
      </div>
      <p className="text-xs text-text-muted">Best: <span className="text-white font-medium">21 days</span></p>
    </div>
  );
}`,
  "src/components/dashboard/SkillsOverview.tsx": `export default function SkillsOverview() {
  return (
    <div className="glass-card p-6 rounded-2xl border border-white/10">
      <p className="text-sm font-medium text-text-muted mb-1">Skills</p>
      <div className="flex items-baseline gap-2 mb-4">
        <h3 className="text-3xl font-bold text-white">18</h3>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-primary-500"></div>
        <p className="text-xs font-medium text-white">12 strong</p>
      </div>
    </div>
  );
}`,
  "src/components/dashboard/RoadmapOverview.tsx": `export default function RoadmapOverview() {
  return (
    <div className="glass-card p-6 rounded-2xl border border-white/10">
      <p className="text-sm font-medium text-text-muted mb-1">Roadmap</p>
      <div className="flex items-baseline gap-2 mb-2">
        <h3 className="text-3xl font-bold text-white">68%</h3>
      </div>
      <p className="text-sm font-medium text-white mb-4">AI Engineer</p>
      <div className="h-1.5 w-full bg-background-200 rounded-full overflow-hidden">
        <div className="h-full bg-primary-500 rounded-full" style={{ width: '68%' }}></div>
      </div>
    </div>
  );
}`,
  "src/components/dashboard/NextBestAction.tsx": `import { ArrowRight, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NextBestAction() {
  return (
    <div className="glass-card p-8 rounded-2xl border border-primary-500/30 bg-primary-900/5 relative">
      <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-primary-900/30 text-primary-400 text-xs font-bold uppercase tracking-wider mb-4 border border-primary-500/20">
        Your Next Best Action
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">Complete PyTorch Training Loops</h2>
      <div className="flex gap-4 text-sm text-text-muted mb-6">
        <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 45 min</span>
        <span className="text-primary-400 font-medium">Expected impact: +4% readiness</span>
      </div>
      <p className="text-text-dim mb-8">
        Improving PyTorch will strengthen your ML Engineer readiness and unlock the next phase of your roadmap.
      </p>
      <Link to="/roadmap" className="inline-flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
        Continue <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}`,
  "src/components/dashboard/CareerMatches.tsx": `import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function CareerMatches() {
  const matches = [
    { name: 'Full Stack Developer', score: 89 },
    { name: 'AI Engineer', score: 72 },
    { name: 'ML Engineer', score: 67 },
  ];

  return (
    <div className="glass-card p-6 rounded-2xl border border-white/10 h-full flex flex-col">
      <h3 className="text-lg font-bold text-white mb-6">Career Matches</h3>
      <div className="space-y-4 flex-1">
        {matches.map(m => (
          <div key={m.name} className="flex justify-between items-center">
            <span className="font-medium text-white text-sm">{m.name}</span>
            <span className="text-primary-400 font-bold text-sm">{m.score}%</span>
          </div>
        ))}
      </div>
      <Link to="/careers" className="mt-6 flex items-center gap-2 text-sm text-text-muted hover:text-white transition-colors">
        Explore careers <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}`
};

for (const [filepath, content] of Object.entries(files)) {
  const fullPath = path.join(__dirname, filepath);
  fs.mkdirSync(path.dirname(fullPath), { recursive: true });
  fs.writeFileSync(fullPath, content, 'utf-8');
  console.log('Created:', filepath);
}
