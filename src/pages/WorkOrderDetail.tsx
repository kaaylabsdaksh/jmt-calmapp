import { useParams, useNavigate } from "react-router-dom";
import WorkOrderDetails from "@/components/WorkOrderDetails";

const WorkOrderDetail = () => {
  console.log("WorkOrderDetail component rendering");
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  if (!id) {
    navigate("/");
    return null;
  }

  return (
    <WorkOrderDetails 
      workOrderId={id}
    />
  );
};

export default WorkOrderDetail;