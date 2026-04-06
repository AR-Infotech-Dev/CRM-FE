import { CirclePlus, Eye, Filter, MoreHorizontal, Plus, Settings2, Upload } from "lucide-react";
import ActionButton from "./ui/ActionButton";

function Toolbar({ onAddNew }) {
  return (
    <div className="toolbar">
      <div className="toolbar-left">
        <ActionButton variant="ghostPrimary">
          <CirclePlus size={16} />
          Update
        </ActionButton>
        <ActionButton>4 Selected</ActionButton>
        <ActionButton>
          <Filter size={15} />
          Filter
          <span className="pill">4</span>
        </ActionButton>
        <ActionButton>
          <Settings2 size={15} />
          Filters
        </ActionButton>
        <span className="results-text">120 Results</span>
      </div>

      <div className="toolbar-right">
        <ActionButton variant="primary" onClick={onAddNew}>
          <Plus size={16} />
          Add New
        </ActionButton>
        <ActionButton>
          <Upload size={15} />
          Import/Export
        </ActionButton>
        <ActionButton>
          <Eye size={15} />
          View
        </ActionButton>
        <ActionButton variant="icon">
          <MoreHorizontal size={18} />
        </ActionButton>
      </div>
    </div>
  );
}

export default Toolbar;
