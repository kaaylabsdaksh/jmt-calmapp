import React from 'react';
import WorkOrderBatchDetails from '@/components/WorkOrderBatchDetails';

const WorkOrderBatchDetailsDemo: React.FC = () => {
  const handleBack = () => {
    console.log('Back to batches clicked');
    // In a real app, this would navigate back to the batches list
  };

  return (
    <div className="container mx-auto p-6">
      <WorkOrderBatchDetails 
        batchId="383727" 
        onBack={handleBack}
      />
    </div>
  );
};

export default WorkOrderBatchDetailsDemo;