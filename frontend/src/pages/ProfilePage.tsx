export default function ProfilePage() {
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
}