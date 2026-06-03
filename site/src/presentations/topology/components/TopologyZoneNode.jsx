import { memo } from 'react';

const zoneStyles = {
  platform: { border: 'rgba(34, 211, 238, 0.35)', bg: 'rgba(34, 211, 238, 0.04)', label: '#22d3ee' },
  production: { border: 'rgba(52, 211, 153, 0.45)', bg: 'rgba(52, 211, 153, 0.06)', label: '#34d399' },
  development: { border: 'rgba(56, 189, 248, 0.45)', bg: 'rgba(56, 189, 248, 0.06)', label: '#38bdf8' },
};

const TopologyZoneNode = ({ data }) => {
  const style = zoneStyles[data.zone] || zoneStyles.platform;

  return (
    <div
      style={{ width: data.width, height: data.height }}
      className="pointer-events-none relative rounded-xl border-2 border-dashed"
      aria-hidden
    >
      <div
        className="absolute inset-0 rounded-xl"
        style={{ borderColor: style.border, backgroundColor: style.bg }}
      />
      <div
        className="absolute -top-3 left-3 rounded-md border border-slate-700 bg-[#070b14] px-2 py-0.5 text-xs font-semibold"
        style={{ color: style.label }}
      >
        {data.label}
      </div>
    </div>
  );
};

export default memo(TopologyZoneNode);
