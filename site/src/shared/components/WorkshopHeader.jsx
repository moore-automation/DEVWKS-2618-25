const base = import.meta.env.BASE_URL;

const WorkshopHeader = () => (
  <header className="shrink-0 border-b border-slate-800/80 bg-[#0b1120] px-4 py-5 text-center md:px-8 md:py-6">
    <div className="mx-auto flex max-w-3xl flex-col items-center gap-3">
      <img src={`${base}assets/logo.jpg`} alt="Cisco" className="h-10 w-auto rounded-lg opacity-90 md:h-12" />
      <div>
        <h1 className="text-xl font-bold tracking-tight text-cyan-300 md:text-3xl">DEVWKS-2618</h1>
        <p className="mx-auto mt-2 max-w-2xl text-sm text-[#94a3b8] md:text-base">
          Keeping Compliant with Open-Source Automation and NSO
        </p>
      </div>
    </div>
  </header>
);

export default WorkshopHeader;
