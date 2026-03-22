import { Construction } from "lucide-react";
import { Link } from "react-router-dom";

const WorkflowDetail = () => {
  return (
    <div className="p-8 max-w-[1060px] mx-auto space-y-8">
      <Link to="/workflows" className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1">
        ← Workflows
      </Link>

      <div className="py-24 text-center space-y-4">
        <Construction className="h-8 w-8 text-muted-foreground/30 mx-auto" />
        <div>
          <p className="text-[14px] text-foreground font-semibold">Workflow Detail — Coming Soon</p>
          <p className="text-[12px] text-muted-foreground mt-1 max-w-md mx-auto leading-relaxed">
            Detailed workflow execution, draft generation, compliance checks, and task management
            will be available once the agent backend is connected.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-sm bg-secondary text-[11px] text-muted-foreground font-medium">
          <div className="h-1.5 w-1.5 rounded-full bg-warning" />
          Requires backend integration
        </div>
      </div>
    </div>
  );
};

export default WorkflowDetail;
