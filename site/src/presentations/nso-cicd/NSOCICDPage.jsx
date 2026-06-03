import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { usePresentationMode } from '../../shared/hooks/usePresentationMode';
import OutroSlide from '../../shared/components/OutroSlide';
import NavigationControls from '../../shared/components/NavigationControls';
import WorkshopHeader from '../../shared/components/WorkshopHeader';
import DemoChecklist from '../../shared/components/demo-journey/DemoChecklist';
import { deriveTaskState } from '../../shared/presentation/deriveTaskState';
import LabAccessSection from '../access/components/LabAccessSection';
import LabTopologySection from '../topology/components/LabTopologySection';
import TopologyNodeDetailPanel from '../topology/components/TopologyNodeDetailPanel';
import { demoTasks, demoSteps } from './data/nsoCicdData';

const NSOCICDPage = () => {
  const [selectedNode, setSelectedNode] = useState(null);

  const { currentStep, totalSteps, currentStepData, goToNext, goToPrevious, reset, canGoNext, canGoPrevious } =
    usePresentationMode(demoSteps);

  const { activeTaskId, completedTaskIds } = useMemo(
    () => deriveTaskState(demoSteps, currentStep),
    [currentStep],
  );

  const isOutro = currentStepData?.type === 'outro';
  const isTask = currentStepData?.type === 'task';

  const navigationProps = {
    canGoPrevious,
    canGoNext,
    onPrevious: goToPrevious,
    onNext: goToNext,
    onReset: reset,
    currentStep,
    totalSteps,
  };

  return (
    <div className="presentation-page min-h-screen">
      <WorkshopHeader />

      <LabTopologySection
        selectedNodeId={selectedNode?.id || null}
        onNodeClick={setSelectedNode}
      />

      <NavigationControls {...navigationProps} sticky showHint />

      <main>
        <AnimatePresence mode="wait">
          {isTask && (
            <motion.div
              key={`task-${currentStepData.taskId}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35 }}
              className="mx-auto max-w-7xl"
            >
              <DemoChecklist
                tasks={demoTasks}
                activeTaskId={activeTaskId}
                completedTaskIds={completedTaskIds}
                subtitle="Hands-on NSO service development with GitLab CI/CD"
              />
            </motion.div>
          )}
          {isOutro && (
            <motion.div
              key="outro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <OutroSlide title={currentStepData.title} subtitle={currentStepData.subtitle} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="shrink-0 border-t border-slate-700/80">
        {(isTask || isOutro) && (
          <NavigationControls {...navigationProps} sticky={false} showHint={false} variant="footer" />
        )}
        <LabAccessSection embedded />
      </footer>

      <AnimatePresence>
        {selectedNode && (
          <TopologyNodeDetailPanel node={selectedNode} onClose={() => setSelectedNode(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

export default NSOCICDPage;
