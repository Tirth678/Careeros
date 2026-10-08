import { motion } from 'framer-motion';

export default function FeatureSection() {
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
          <motion.div 
            key={i} 
            whileHover={{ scale: 1.05, y: -5 }} 
            className="glass-card p-8 rounded-2xl border border-white/10 relative overflow-hidden group"
          >
            <div className="text-5xl font-bold text-white/5 absolute -top-4 -right-4 group-hover:text-primary-500/10 transition-colors">{feat.num}</div>
            <div className="text-sm font-bold text-primary-400 mb-4">{feat.num}</div>
            <h3 className="text-xl font-bold text-white mb-4">{feat.title}</h3>
            <p className="text-text-muted leading-relaxed">{feat.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}