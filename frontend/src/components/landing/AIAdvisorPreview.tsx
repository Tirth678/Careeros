import { ArrowRight, Brain } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function AIAdvisorPreview() {
  return (
    <section className="py-24 px-4 max-w-4xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">AI that tells you what to do next.</h2>
      
      <motion.div 
        whileHover={{ scale: 1.02 }}
        className="glass-panel p-8 md:p-12 rounded-3xl border border-primary-500/20 bg-primary-900/5 relative"
      >
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
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="inline-block">
          <Link to="/signup" className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-500 transition-colors">
            Generate My Roadmap <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}