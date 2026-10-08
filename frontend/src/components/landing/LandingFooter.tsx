import { Brain } from 'lucide-react';
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
}