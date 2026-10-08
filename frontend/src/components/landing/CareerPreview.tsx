import { motion } from 'framer-motion';

export default function CareerPreview() {
  return (
    <section className="py-24 px-4 max-w-6xl mx-auto text-center" id="product">
      <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Stop guessing if you're ready.</h2>
      <p className="text-xl text-text-muted max-w-2xl mx-auto mb-16">
        CareerOS compares your current skills with the skills required for your target career.
      </p>
      
      <motion.div 
        whileHover={{ scale: 1.02 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="max-w-3xl mx-auto glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden"
      >
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
      </motion.div>
    </section>
  );
}