import {
  CirclePlus,
  Eye,
  Filter,
  MoreHorizontal,
  Settings2,
  Upload,
} from "lucide-react";
import ActionButton from "../../components/ui/ActionButton";

function ModuleControls({
  onCreate,
  selectedLabel = "4 Selected",
  resultsLabel = "120 Results",
  createLabel = "Add New",
}) {
  return (
    <div className="module-controls">
      <div className="module-toolbar-row">
        <div className="module-toolbar-left">
          <ActionButton variant="ghostPrimary">
            <CirclePlus size={16} />
            Update
          </ActionButton>
          <ActionButton>{selectedLabel}</ActionButton>
          <ActionButton>
            <Filter size={15} />
            Filter
            <span className="pill">4</span>
          </ActionButton>
          <ActionButton>
            <Settings2 size={15} />
            Filters
          </ActionButton>
          <span className="results-text">{resultsLabel}</span>
        </div>

        <div className="module-toolbar-right">
          <ActionButton variant="primary" onClick={onCreate}>
            <CirclePlus size={16} />
            {createLabel}
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
    </div>
  );
}

export default ModuleControls;
