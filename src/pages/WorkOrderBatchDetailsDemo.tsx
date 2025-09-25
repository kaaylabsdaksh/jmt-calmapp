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
    <div className="container mx-auto p-6">
      <WorkOrderBatchDetails 
        batchId={batchId || "383727"} 
        onBack={handleBack}
      />
    </div>
  );
};

export default WorkOrderBatchDetailsDemo;