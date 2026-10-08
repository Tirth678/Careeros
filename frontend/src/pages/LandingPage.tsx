import Hero from '../components/landing/Hero';
import FeatureSection from '../components/landing/FeatureSection';
import HowItWorks from '../components/landing/HowItWorks';
import CareerPreview from '../components/landing/CareerPreview';
import AIAdvisorPreview from '../components/landing/AIAdvisorPreview';
import LandingFooter from '../components/landing/LandingFooter';
import AetherFlowHero from '../components/ui/aether-flow-hero';
import { Link } from 'react-router-dom';
import { Brain } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      
      {/* HERO SECTION WITH AETHER FLOW */}
      <div className="relative min-h-screen flex flex-col">
        <AetherFlowHero />
        
        <nav className="relative z-10 flex items-center justify-between px-8 py-6 w-full max-w-7xl mx-auto">
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
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/signup" className="px-4 py-2 bg-white text-black text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors inline-block">Get Started</Link>
            </motion.div>
          </div>
        </nav>
        
        <main className="relative z-10 flex-1 flex flex-col justify-center">
          <Hero />
        </main>
      </div>

      {/* REST OF THE PAGE */}
      <main className="relative z-10 bg-black">
        <FeatureSection />
        <HowItWorks />
        <CareerPreview />
        <AIAdvisorPreview />
      </main>
      <LandingFooter />
    </div>
  );
}