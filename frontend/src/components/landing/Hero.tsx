import { ArrowRight, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HoverButton } from '../ui/hover-glow-button';

export default function Hero() {
  const navigate = useNavigate();
  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom, duration: 0.5 }
    })
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4 relative">
      <motion.div 
        custom={0.3}
        initial="hidden"
        animate="visible"
        variants={itemVariants}
        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-900/10 border border-primary-500/30 text-primary-400 text-sm font-medium mb-8"
      >
        <Sparkles className="w-4 h-4" />
        AI-POWERED CAREER INTELLIGENCE
      </motion.div>
      
      <motion.h1 
        custom={0.5}
        initial="hidden"
        animate="visible"
        variants={itemVariants}
        className="text-5xl md:text-7xl font-bold tracking-tight max-w-4xl mb-6 text-white text-glow"
      >
        Your career has a destination.<br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">CareerOS shows you the path.</span>
      </motion.h1>
      
      <motion.p 
        custom={0.7}
        initial="hidden"
        animate="visible"
        variants={itemVariants}
        className="text-xl text-text-muted max-w-2xl mb-10"
      >
        Turn your skills, projects, academics and experience into a clear path toward the career you want.
      </motion.p>
      
      <motion.div 
        custom={0.9}
        initial="hidden"
        animate="visible"
        variants={itemVariants}
        className="flex flex-col sm:flex-row gap-4"
      >
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <HoverButton 
            onClick={() => navigate('/signup')} 
            className="flex items-center justify-center gap-2 font-semibold !text-base"
            glowColor="#A855F7"
            backgroundColor="#ffffff"
            textColor="#000000"
            hoverTextColor="#000000"
          >
            Build My Career Profile <ArrowRight className="w-5 h-5" />
          </HoverButton>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link to="/careers" className="px-8 py-4 bg-background-100 border border-white/10 text-white font-semibold rounded-lg hover:bg-background-200 transition-colors flex items-center justify-center">
            Explore Careers
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}