export default function SettingsPage() {
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
}