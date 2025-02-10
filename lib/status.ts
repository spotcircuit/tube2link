// In-memory store for process status
const processStatus = new Map<string, {
  steps: string[];
  completed: boolean;
}>();

export function addStatus(id: string, step: string) {
  if (!processStatus.has(id)) {
    processStatus.set(id, { steps: [], completed: false });
  }
  const status = processStatus.get(id)!;
  status.steps.push(step);
}

export function completeStatus(id: string) {
  const status = processStatus.get(id);
  if (status) {
    status.completed = true;
  }
}

export function getStatus(id: string) {
  return processStatus.get(id) || { steps: [], completed: false };
}
