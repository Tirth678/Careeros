import MorphOrb from '../components/ui/ai-thiking-orb-and-input';

export default function AIAssistantPage() {
  return (
    <section className="space-y-5">
      <header>
        <h1 className="text-3xl font-bold text-white">AI Assistant</h1>
        <p className="mt-2 text-text-muted">Your next chapter starts with a question.</p>
      </header>
      <MorphOrb minThinkMs={1600} onSubmit={() => 'AI responses are not connected yet. Your question stays in this browser and has not been sent to an AI service.'} />
      <p className="text-center text-xs text-text-muted">Interactive UI preview · AI connection coming soon</p>
    </section>
  );
}
