import { motion } from 'framer-motion';

export default function HowItWorks() {
  return (
    <section className="py-24 px-4 max-w-5xl mx-auto text-center border-t border-white/5">
      <h2 className="text-3xl md:text-4xl font-bold mb-16 text-white">From where you are to where you want to be.</h2>
      <div className="flex flex-col md:flex-row justify-between items-center relative">
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-primary-900/10 via-primary-500/30 to-primary-900/10 -translate-y-1/2 z-0"></div>
        {['Build your profile', 'Choose your career', 'Understand your gaps', 'Follow your roadmap'].map((step, i) => (
          <motion.div 
            key={i} 
            whileHover={{ scale: 1.1, y: -5 }}
            className="relative z-10 flex flex-col items-center mb-8 md:mb-0 cursor-default"
          >
            <div className="w-12 h-12 rounded-full bg-background border border-primary-500/30 flex items-center justify-center text-primary-400 font-bold mb-4 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              0{i+1}
            </div>
            <span className="font-medium text-white">{step}</span>
          </motion.div>
        ))}
      </div>
    </section>
  );
}