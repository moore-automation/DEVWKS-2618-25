import { AnimatePresence, motion } from 'framer-motion';
import ExpandableImage from '../ExpandableImage';
import CopyCodeBlock from '../CopyCodeBlock';
import TerminalSimulator from '../TerminalSimulator';

const accentBar = {
  emerald: 'bg-emerald-500',
  blue: 'bg-blue-500',
  indigo: 'bg-indigo-500',
  purple: 'bg-purple-500',
  amber: 'bg-amber-500',
  yellow: 'bg-yellow-500',
  cyan: 'bg-cyan-500',
  orange: 'bg-orange-500',
};

const pillStyles = {
  emerald: 'border-emerald-400/55 bg-emerald-950/60 text-emerald-300 ring-1 ring-emerald-500/20',
  blue: 'border-sky-400/50 bg-sky-950/55 text-sky-300 ring-1 ring-sky-500/15',
  indigo: 'border-indigo-400/50 bg-indigo-950/55 text-indigo-200 ring-1 ring-indigo-500/15',
  purple: 'border-fuchsia-400/50 bg-fuchsia-950/50 text-fuchsia-200 ring-1 ring-fuchsia-500/15',
  amber: 'border-amber-400/50 bg-amber-950/50 text-amber-200 ring-1 ring-amber-500/15',
  yellow: 'border-yellow-400/45 bg-yellow-950/45 text-yellow-200 ring-1 ring-yellow-500/15',
  cyan: 'border-cyan-400/50 bg-cyan-950/55 text-cyan-200 ring-1 ring-cyan-500/15',
  orange: 'border-orange-400/50 bg-orange-950/55 text-orange-200 ring-1 ring-orange-500/15',
};

const linkClass =
  'text-cyan-400 underline decoration-cyan-500/40 underline-offset-2 hover:text-cyan-300';

/** @param {string | { text?: string, link?: { label: string, href: string }, textAfter?: string }} line */
function renderRichLine(line) {
  if (typeof line === 'string') return line;

  return (
    <>
      {line.text ?? ''}
      {line.link ? (
        <a href={line.link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
          {line.link.label}
        </a>
      ) : null}
      {line.textAfter ?? ''}
    </>
  );
}

function lineKey(line, index) {
  if (typeof line === 'string') return line;
  return `${line.text ?? ''}-${line.link?.href ?? index}`;
}

function afterBlockKey(block, index) {
  if (typeof block.text === 'string') return block.text;
  return lineKey(block.text, index);
}

function subItemKey(sub, index) {
  if (typeof sub === 'string') return sub;
  if (sub.image?.src) return sub.image.src;
  return `sub-${index}`;
}

function TaskStepsList({ items, ordered = false }) {
  const ListTag = ordered ? 'ol' : 'ul';
  const base = import.meta.env.BASE_URL;

  return (
    <ListTag className="list-none space-y-3 text-sm text-slate-200">
      {items.map((line, index) => {
        const subItems = typeof line === 'object' ? line.subItems : undefined;
        const images = typeof line === 'object' ? line.images : undefined;

        return (
          <li key={lineKey(line, index)}>
            <div className="flex gap-2">
              {ordered ? (
                <span className="w-5 shrink-0 font-semibold tabular-nums text-sky-400/90">{index + 1}.</span>
              ) : (
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500/80" />
              )}
              <span className="min-w-0 flex-1">{renderRichLine(line)}</span>
            </div>
            {subItems?.length ? (
              <ul className="ml-7 mt-2 space-y-1.5 border-l-2 border-slate-700/80 pl-4 text-slate-300">
                {subItems.map((sub, subIndex) =>
                  typeof sub === 'object' && sub.image ? (
                    <li key={subItemKey(sub, subIndex)} className="list-none py-1">
                      <ExpandableImage
                        src={`${base}${sub.image.src}`}
                        alt={sub.image.alt || ''}
                      />
                    </li>
                  ) : (
                    <li key={subItemKey(sub, subIndex)} className="leading-relaxed">
                      {sub}
                    </li>
                  ),
                )}
              </ul>
            ) : null}
            {images?.length ? (
              <div className="ml-7 mt-3 space-y-3">
                {images.map((img) => (
                  <ExpandableImage
                    key={img.src}
                    src={`${base}${img.src}`}
                    alt={img.alt || ''}
                  />
                ))}
              </div>
            ) : null}
          </li>
        );
      })}
    </ListTag>
  );
}

const TaskDetailPanel = ({ task, stepNumber, totalTaskSteps }) => {
  const color = task.color || 'emerald';
  const bar = accentBar[color] || accentBar.emerald;
  const pill = pillStyles[color] || pillStyles.emerald;
  const hasTerminal = task.terminalLines && task.terminalLines.length > 0;
  const hasExpectedOutputImage = Boolean(task.expectedOutputImage);
  const showExpectedOutput = hasTerminal || hasExpectedOutputImage;
  const tasksLabel = task.tasksLabel ?? 'Your tasks';
  const whyLabel = task.whyLabel ?? 'Why this matters';
  const beforeLabel = task.beforeLabel ?? 'Before you continue';

  return (
    <div className="flex flex-col rounded-2xl border border-slate-700/80 bg-[#0f172a]/75 shadow-[0_0_40px_rgba(0,0,0,0.35)]">
      <AnimatePresence mode="wait">
        <motion.div
          key={task.id}
          initial={{ opacity: 0, x: 28 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="flex flex-col"
        >
          <div className="p-6 md:p-8">
            <div className="mb-4 inline-flex w-fit rounded-full border border-emerald-500/40 bg-emerald-950/50 px-3 py-1 text-xs font-medium text-emerald-300/95">
              Step {stepNumber} of {totalTaskSteps}
            </div>

            <h2 className="text-2xl font-bold text-white md:text-3xl">{task.title}</h2>
            <p className="mt-2 text-sm text-[#94a3b8] md:text-base">{task.description}</p>

            <div className={`mt-5 h-1 w-16 rounded-full ${bar}`} />

            <section className="mt-6">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">{tasksLabel}</h3>
              <TaskStepsList items={task.whatWellDo} ordered={Boolean(task.tasksOrdered)} />
              {task.copyBlock ? (
                <CopyCodeBlock
                  content={task.copyBlock.content}
                  intro={task.copyBlock.intro}
                  buttonLabel={task.copyBlock.buttonLabel}
                />
              ) : null}
              {(() => {
                const afterCopySteps =
                  task.afterCopyBlocks ??
                  (task.afterCopyBlock ? [task.afterCopyBlock] : []);
                const baseStep = task.whatWellDo?.length ?? 0;

                return afterCopySteps.map((block, blockIndex) => (
                  <div key={afterBlockKey(block, blockIndex)} className="mt-4 flex gap-2 text-sm text-slate-200">
                    {task.tasksOrdered ? (
                      <span className="w-5 shrink-0 font-semibold tabular-nums text-sky-400/90">
                        {baseStep + blockIndex + 1}.
                      </span>
                    ) : (
                      <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500/80" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p>
                        {typeof block.text === 'string'
                          ? block.text
                          : renderRichLine(block.text)}
                      </p>
                      {block.copyBlock ? (
                        <CopyCodeBlock
                          content={block.copyBlock.content}
                          intro={block.copyBlock.intro}
                          buttonLabel={block.copyBlock.buttonLabel}
                        />
                      ) : null}
                      {block.subItems?.length ? (
                        <ul className="mt-2 space-y-1.5 border-l-2 border-slate-700/80 pl-4 text-slate-300">
                          {block.subItems.map((sub) => (
                            <li key={sub} className="leading-relaxed">
                              {sub}
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      {block.image ? (
                        <div className="mt-3">
                          <ExpandableImage
                            src={`${import.meta.env.BASE_URL}${block.image.src}`}
                            alt={block.image.alt || block.text}
                          />
                        </div>
                      ) : null}
                    </div>
                  </div>
                ));
              })()}
            </section>

            {task.value?.length > 0 && (
              <section className="mt-6">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">{whyLabel}</h3>
                <div className="flex flex-wrap gap-2">
                  {task.value.map((v) => (
                    <span key={v} className={`rounded-full border px-3 py-1 text-xs font-medium ${pill}`}>
                      {v}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {task.codeExample && !showExpectedOutput && (
              <section className="mt-6">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-500">Example</h3>
                <pre className="overflow-x-auto rounded-xl border border-slate-700/90 bg-[#020617] p-4 text-xs leading-relaxed text-emerald-100/90 md:text-sm">
                  <code>{task.codeExample}</code>
                </pre>
              </section>
            )}

            {task.defaultsInfo && (
              <section className="mt-6 rounded-xl border border-slate-700/80 bg-[#020617]/80 p-4">
                <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Defaults</h3>
                <dl className="space-y-2 text-sm">
                  <div>
                    <dt className="text-slate-500">Source</dt>
                    <dd className="text-slate-200">{task.defaultsInfo.source}</dd>
                  </div>
                  <div>
                    <dt className="text-slate-500">Override</dt>
                    <dd className="font-mono text-xs text-slate-200">{task.defaultsInfo.override}</dd>
                  </div>
                </dl>
              </section>
            )}

            {task.policyDetails && (
              <section className="mt-6 rounded-xl border border-amber-500/20 bg-amber-950/20 p-4">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-amber-500/80">Policy</h3>
                <dl className="space-y-2 text-sm text-slate-200">
                  <div>
                    <dt className="text-xs text-slate-500">File</dt>
                    <dd className="font-mono text-xs">{task.policyDetails.file}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">Language</dt>
                    <dd>{task.policyDetails.language}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-slate-500">Rule</dt>
                    <dd>{task.policyDetails.rule}</dd>
                  </div>
                </dl>
              </section>
            )}

            {task.goldenRules && (
              <section className="mt-6">
                <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-amber-500/80">{beforeLabel}</h3>
                <ul className="space-y-2 text-sm text-slate-200">
                  {task.goldenRules.map((rule, index) => (
                    <li key={lineKey(rule, index)} className="flex gap-2 border-l-2 border-yellow-500/40 pl-3">
                      {renderRichLine(rule)}
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {task.imageUrl && (
              <section className="mt-6">
                <ExpandableImage
                  src={`${import.meta.env.BASE_URL}${task.imageUrl}`}
                  alt={`${task.title} screenshot`}
                />
              </section>
            )}
          </div>

          {showExpectedOutput && (
            <div className="border-t border-slate-700/80 p-3 md:p-4">
              <h3 className="mb-2 px-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Expected output
                {hasTerminal && task.terminalTitle ? (
                  <span className="font-normal normal-case text-slate-600"> · {task.terminalTitle}</span>
                ) : null}
              </h3>
              {hasExpectedOutputImage && (
                <>
                  {task.expectedOutputText ? (
                    <p className="mb-3 px-1 text-sm text-slate-300">{task.expectedOutputText}</p>
                  ) : null}
                  <ExpandableImage
                    src={`${import.meta.env.BASE_URL}${task.expectedOutputImage}`}
                    alt={task.expectedOutputImageAlt || `${task.title} expected result`}
                  />
                </>
              )}
              {hasTerminal && (
                <TerminalSimulator
                  key={task.id}
                  lines={task.terminalLines}
                  title={task.terminalTitle || 'terminal'}
                />
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default TaskDetailPanel;
