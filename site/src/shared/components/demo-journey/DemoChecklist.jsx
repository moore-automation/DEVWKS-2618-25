import TaskFlowItem from './TaskFlowItem';
import TaskDetailPanel from './TaskDetailPanel';

const DemoChecklist = ({ tasks, activeTaskId, completedTaskIds, subtitle }) => {
  const ordered = [...tasks].sort((a, b) => a.order - b.order);
  const completedSet = new Set(completedTaskIds);
  const activeTask = ordered.find((t) => t.id === activeTaskId);
  const total = ordered.length;
  const doneCount = completedTaskIds.length;
  const progress = total > 0 ? doneCount / total : 0;

  if (!activeTask) {
    return null;
  }

  const stepNumber = ordered.findIndex((t) => t.id === activeTaskId) + 1;

  return (
    <div className="flex w-full flex-col gap-0 md:flex-row">
      <div className="flex w-full flex-col border-b border-slate-700/70 md:w-1/2 md:border-b-0 md:border-r md:border-slate-700/70">
        <div className="border-b border-slate-700/70 p-5 md:p-6">
          <h2 className="text-lg font-bold text-white md:text-xl">Demo Journey</h2>
          <p className="mt-1 text-sm text-[#94a3b8]">{subtitle}</p>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-[#0f172a] ring-1 ring-slate-700/50">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-green-400 transition-all duration-500 ease-out shadow-[0_0_12px_rgba(52,211,153,0.35)]"
              style={{ width: `${Math.min(100, progress * 100)}%` }}
            />
          </div>
          <p className="mt-2 text-xs text-slate-500">
            {doneCount} of {total} steps completed
          </p>
        </div>

        <div className="px-5 py-4 md:px-6 md:py-5">
          {ordered.map((task, index) => (
            <TaskFlowItem
              key={task.id}
              task={task}
              isActive={task.id === activeTaskId}
              isCompleted={completedSet.has(task.id)}
              isLast={index === ordered.length - 1}
            />
          ))}
        </div>
      </div>

      <div className="flex w-full flex-1 flex-col p-4 md:w-1/2 md:p-6">
        <TaskDetailPanel task={activeTask} stepNumber={stepNumber} totalTaskSteps={total} />
      </div>
    </div>
  );
};

export default DemoChecklist;
