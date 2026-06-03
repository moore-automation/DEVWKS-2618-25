import { useCallback, useState } from 'react';
import { Check, Copy } from 'lucide-react';

async function copyText(text) {
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
}

const CopyCodeBlock = ({ intro, content, buttonLabel = 'Copy' }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await copyText(content);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }, [content]);

  return (
    <div className="mt-4">
      {intro ? <p className="mb-3 text-sm text-slate-200">{intro}</p> : null}
      <div className="overflow-hidden rounded-xl border border-slate-700/90 bg-[#020617]">
        <div className="flex items-center justify-end border-b border-slate-700/80 bg-[#0f172a]/80 px-3 py-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-500/50 bg-cyan-950/40 px-2.5 py-1 text-xs font-medium text-cyan-200 transition-colors hover:border-cyan-400 hover:bg-cyan-900/50"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            {copied ? 'Copied' : buttonLabel}
          </button>
        </div>
        <pre className="max-h-80 overflow-auto p-4 text-xs leading-relaxed text-emerald-100/90 md:text-sm">
          <code>{content}</code>
        </pre>
      </div>
    </div>
  );
};

export default CopyCodeBlock;
