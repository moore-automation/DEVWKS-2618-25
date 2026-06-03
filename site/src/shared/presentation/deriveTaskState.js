/** Derive checklist state from presentation step index (shared by platform as-code demos). */
export const deriveTaskState = (steps, currentStep) => {
  const taskOrder = steps.filter((s) => s.type === 'task').map((s) => s.taskId);
  const stepData = steps[currentStep];
  if (stepData?.type === 'task') {
    const idx = taskOrder.indexOf(stepData.taskId);
    return {
      activeTaskId: stepData.taskId,
      completedTaskIds: idx > 0 ? taskOrder.slice(0, idx) : [],
    };
  }
  if (stepData?.type === 'outro') {
    return { activeTaskId: null, completedTaskIds: [...taskOrder] };
  }
  return { activeTaskId: null, completedTaskIds: [] };
};
