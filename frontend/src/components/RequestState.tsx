export default function RequestState({ loading, error, retry }: { loading: boolean; error: string | null; retry: () => void }) {
  if (loading) return <p role="status" className="text-text-muted py-8">Loading your data…</p>;
  if (error) return <div role="alert" className="text-red-400 py-8">{error} <button className="underline ml-3" onClick={retry}>Retry</button></div>;
  return null;
}
