'use client';

import { useState, useEffect } from 'react';
import { RefreshCw } from 'lucide-react';

interface ProcessingStatusProps {
  generating: boolean;
  processId?: string;
}

export function ProcessingStatus({ generating, processId }: ProcessingStatusProps) {
  const [steps, setSteps] = useState<string[]>([]);

  useEffect(() => {
    if (!generating || !processId) {
      setSteps([]);
      return;
    }

    const eventSource = new EventSource(`/api/status?id=${processId}`);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.steps) {
          setSteps(data.steps);
        }
        // Close connection if process is complete
        if (data.completed) {
          eventSource.close();
        }
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [generating, processId]);

  return (
    <div className="space-y-2 mb-4">
      {generating && !steps.length && (
        <div className="flex items-center space-x-2 text-gray-400">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Processing...</span>
        </div>
      )}
      {steps.map((step, index) => (
        <div key={index} className="flex items-center space-x-2 text-gray-600">
          <RefreshCw className={`w-4 h-4 ${index === steps.length - 1 ? 'animate-spin' : ''}`} />
          <span>{step}</span>
        </div>
      ))}
    </div>
  );
}
