export default function LoadingScreen({ label = 'Loading...' }) {
  return (
    <main className="loading-screen" role="status" aria-live="polite">
      <span className="spinner" />
      <span>{label}</span>
    </main>
  );
}
