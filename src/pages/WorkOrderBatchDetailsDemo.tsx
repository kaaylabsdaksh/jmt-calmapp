import React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import WorkOrderBatchDetails from '@/components/WorkOrderBatchDetails';

const WorkOrderBatchDetailsDemo: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const batchId = searchParams.get('batchId');

  const handleBack = () => {
    navigate('/');
  };

  return (
    <div className="w-full px-2 sm:px-4 lg:px-6 pb-3 sm:pb-6">
      <WorkOrderBatchDetails 
        batchId={batchId || "383727"} 
        onBack={handleBack}
      />
    </div>
  );
};

export default WorkOrderBatchDetailsDemo;