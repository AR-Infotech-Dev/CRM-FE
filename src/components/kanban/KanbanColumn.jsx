import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { GripVertical } from "lucide-react";

import KanbanCard from "./KanbanCard";
import { useKanbanContext } from "./KanbanContext";

function KanbanColumn({ column, items }) {
  const { config } = useKanbanContext();

  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: "column",
      columnId: column.id,
    },
  });

  return (
    <section className="kanban-column">
      <header
        className="kanban-column-head"
        style={{
          backgroundColor: column.color || "var(--primary-100)",
        }}
      >
        <div className="kanban-column-title-wrap">
          <span className="kanban-column-grip" aria-hidden="true">
            <GripVertical size={14} />
          </span>
          <div className="kanban-column-copy">
            <h3 className="kanban-column-title">{column.title}</h3>
            <span className="kanban-column-meta">
              {items.length} of {items.length}
            </span>
          </div>
        </div>
        <span className="kanban-column-count">{items.length}</span>
      </header>

      <div ref={setNodeRef} className={`kanban-column-body ${isOver ? "is-over" : ""}`}>
        <SortableContext items={items.map((item) => item._kanbanId)} strategy={verticalListSortingStrategy}>
          {items.length ? (
            items.map((item) => (
              <KanbanCard
                key={item._kanbanId}
                row={item}
                columnId={column.id}
              />
            ))
          ) : (
            <div className="kanban-column-empty">Drop items here</div>
          )}
        </SortableContext>
      </div>
    </section>
  );
}

export default KanbanColumn;
