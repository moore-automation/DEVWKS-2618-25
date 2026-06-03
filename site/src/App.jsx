import { lazy, Suspense } from 'react';

const NSOCICDPage = lazy(() => import('./presentations/nso-cicd/NSOCICDPage'));

const pageFallback = (
  <div className="flex min-h-screen items-center justify-center bg-[#0b1120] text-sm text-[#94a3b8]">
    Loading…
  </div>
);

function App() {
  return (
    <Suspense fallback={pageFallback}>
      <NSOCICDPage />
    </Suspense>
  );
}

export default App;
