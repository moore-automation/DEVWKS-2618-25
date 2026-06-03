import { useCallback, useState } from 'react';
import { Check, ChevronDown, ChevronUp, Copy } from 'lucide-react';
import { labSeats, buildOpenConnectCommand } from '../../../data/labAccessData';

const leftSeats = labSeats.filter((s) => s.seat <= 8);
const rightSeats = labSeats.filter((s) => s.seat >= 9);

const copyText = async (text) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.left = '-9999px';
  document.body.appendChild(ta);
  ta.select();
  document.execCommand('copy');
  document.body.removeChild(ta);
};

const SeatCopyRow = ({ seat }) => {
  const [copied, setCopied] = useState(false);
  const command = buildOpenConnectCommand(seat);

  const handleCopy = useCallback(async () => {
    try {
      await copyText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [command]);

  return (
    <tr className="border-b border-slate-800/80 transition-colors hover:bg-slate-800/30">
      <td className="px-3 py-2 font-semibold text-white">Seat {seat.seat}</td>
      <td className="px-3 py-2 text-right">
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center gap-1 rounded-lg border border-cyan-500/50 bg-cyan-950/40 px-2.5 py-1 text-xs font-medium text-cyan-200 transition-colors hover:border-cyan-400 hover:bg-cyan-900/50"
        >
          {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </td>
    </tr>
  );
};

const SeatTable = ({ seats }) => (
  <table className="w-full text-left text-sm">
    <tbody>
      {seats.map((seat) => (
        <SeatCopyRow key={seat.id} seat={seat} />
      ))}
    </tbody>
  </table>
);

const LabAccessSection = ({ embedded = false }) => {
  const [visible, setVisible] = useState(false);

  return (
    <section
      className={`shrink-0 bg-[#070b14] px-3 py-2.5 md:px-6 md:py-3 ${
        embedded ? '' : 'border-t border-slate-800/80'
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-semibold text-white md:text-base">Cisco Live US 2026 - Access</h2>
          <p className="text-[11px] text-slate-500 md:text-xs">
            {visible
              ? 'Copy the OpenConnect command for your seat — run in a terminal on your Ubuntu host while logged in as devnet'
              : 'Required for sandbox access — expand to copy your seat command (Ubuntu user devnet) or reconnect if VPN drops'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          className="flex items-center gap-1 rounded-lg border border-slate-600/80 bg-[#111827]/90 px-2.5 py-1.5 text-xs text-slate-300 transition-colors hover:border-cyan-500/40 hover:text-white"
        >
          {visible ? (
            <>
              <ChevronUp className="h-3.5 w-3.5" />
              Collapse
            </>
          ) : (
            <>
              <ChevronDown className="h-3.5 w-3.5" />
              Expand
            </>
          )}
        </button>
      </div>

      {visible && (
        <div className="mt-2 overflow-hidden rounded-xl border border-slate-700/80 bg-[#0f172a]/50">
          <div className="grid md:grid-cols-2 md:divide-x md:divide-slate-800/80">
            <SeatTable seats={leftSeats} />
            <SeatTable seats={rightSeats} />
          </div>
        </div>
      )}
    </section>
  );
};

export default LabAccessSection;
