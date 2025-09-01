import { useParams, useNavigate } from "react-router-dom";
import WorkOrderDetails from "@/components/WorkOrderDetails";

const WorkOrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/");
  };

  if (!id) {
    navigate("/");
    return null;
  }

  return (
    <WorkOrderDetails 
      workOrderId={id}
      onBack={handleBack}
    />
  );
};

export default WorkOrderDetail;