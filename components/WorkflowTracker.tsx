import React from 'react';
import { WorkflowStep as WorkflowStepType, WorkflowStatus } from '../types';
import { CheckCircleIcon, PendingIcon, SpinnerIcon, XCircleIcon } from '../constants';

const getStatusIcon = (status: WorkflowStatus) => {
  switch (status) {
    case WorkflowStatus.COMPLETED:
      return <CheckCircleIcon />;
    case WorkflowStatus.RUNNING:
      return <SpinnerIcon />;
    case WorkflowStatus.FAILED:
      return <XCircleIcon />;
    case WorkflowStatus.PENDING:
    default:
      return <PendingIcon />;
  }
};

interface WorkflowStepProps {
  step: WorkflowStepType;
}

const WorkflowStep: React.FC<WorkflowStepProps> = ({ step }) => {
  const isRunning = step.status === WorkflowStatus.RUNNING;

  return (
    <div className={`flex items-start space-x-4 p-4 rounded-lg transition-all duration-300 ${isRunning ? 'bg-violet-500/10' : ''}`}>
      <div className="flex-shrink-0 mt-1">{getStatusIcon(step.status)}</div>
      <div>
        <h4 className={`font-semibold ${isRunning ? 'text-violet-400' : 'text-slate-200'}`}>{step.title}</h4>
        <p className="text-sm text-slate-400">{step.description}</p>
      </div>
    </div>
  );
};


interface WorkflowTrackerProps {
  steps: WorkflowStepType[];
  currentLog: string;
}

const WorkflowTracker: React.FC<WorkflowTrackerProps> = ({ steps, currentLog }) => {
  return (
    <div className="bg-slate-900 p-6 rounded-lg border border-slate-800 h-full flex flex-col">
      <h3 className="text-xl font-bold text-slate-100 mb-6 border-b border-slate-800 pb-4">Generation Progress</h3>
      <div className="space-y-2 flex-grow overflow-y-auto pr-2">
        {steps.map(step => (
          <WorkflowStep key={step.id} step={step} />
        ))}
      </div>
      {currentLog && (
        <div className="mt-4 p-3 bg-slate-950 rounded-md text-sm text-slate-400 font-mono h-16 flex items-center border border-slate-800">
            <span className="animate-pulse-fast">> {currentLog}</span>
        </div>
      )}
    </div>
  );
};

export default WorkflowTracker;