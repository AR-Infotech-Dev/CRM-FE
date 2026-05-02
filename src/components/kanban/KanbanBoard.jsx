import { useEffect, useMemo, useState } from "react";
import { DndContext, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import { toast } from "react-toastify";

import Spinner from "../ui/Spinner";
import { makeRequest } from "../../api/httpClient";
import KanbanColumn from "./KanbanColumn";
import { KanbanProvider } from "./KanbanContext";
import {
  buildKanbanState,
  findColumnIdForCard,
  normalizeKanbanColumns,
  reorderKanbanState,
} from "./kanbanUtils";

function KanbanBoard({ rows = [], editRow, config, loading = false, onAfterUpdate }) {
  const [columns, setColumns] = useState([]);
  const [boardState, setBoardState] = useState({});
  const [loadingColumns, setLoadingColumns] = useState(false);
  const [updatingCardId, setUpdatingCardId] = useState(null);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));

  useEffect(() => {
    const loadColumns = async () => {
      if (!config?.categoryParentSlug) {
        setColumns([]);
        return;
      }

      try {
        setLoadingColumns(true);
        const res = await makeRequest(config.columnsApi || "/system/searchSlugList", {
          method: "POST",
          body: {
            tableName: config.categoryTableName || "categories",
            selectFields: config.categorySelectFields || "category_id,categoryName,cat_color",
            searchField: config.categorySearchField || "categoryName",
            slug: config.categoryParentSlug,
            status: config.categoryStatus || "active",
          },
        });

        const rawColumns = res?.data?.[0]?.sublist || [];
        setColumns(normalizeKanbanColumns(rawColumns, config));
      } catch (error) {
        toast.error("Unable to load kanban columns");
        setColumns([]);
      } finally {
        setLoadingColumns(false);
      }
    };

    loadColumns();
  }, [config]);

  const normalizedBoardState = useMemo(
    () => buildKanbanState(columns, rows, config || {}),
    [columns, rows, config]
  );

  useEffect(() => {
    setBoardState(normalizedBoardState);
  }, [normalizedBoardState]);

  const columnIds = useMemo(() => columns.map((column) => column.id), [columns]);

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over) {
      return;
    }

    const activeCardId = String(active.id);
    const sourceColumnId = findColumnIdForCard(boardState, activeCardId);

    if (!sourceColumnId) {
      return;
    }

    const overData = over.data.current;
    const targetColumnId =
      overData?.type === "column"
        ? overData.columnId
        : overData?.type === "card"
          ? overData.columnId
          : findColumnIdForCard(boardState, String(over.id));

    if (!targetColumnId) {
      return;
    }

    const targetItems = boardState[targetColumnId] || [];
    const targetIndex =
      overData?.type === "card"
        ? targetItems.findIndex((item) => String(item._kanbanId) === String(over.id))
        : targetItems.length;

    const nextBoardState = reorderKanbanState(
      boardState,
      activeCardId,
      sourceColumnId,
      targetColumnId,
      targetIndex
    );

    if (nextBoardState === boardState) {
      return;
    }

    setBoardState(nextBoardState);

    if (sourceColumnId === targetColumnId) {
      return;
    }

    const movedCard =
      Object.values(boardState)
        .flat()
        .find((item) => String(item._kanbanId) === activeCardId) || null;

    if (!movedCard) {
      return;
    }

    try {
      setUpdatingCardId(activeCardId);

      const updatePath =
        typeof config.updateApi === "function"
          ? config.updateApi(movedCard, targetColumnId)
          : `${config.updateApi}/${movedCard[config.idField]}`;

      const updateBody =
        typeof config.buildUpdateBody === "function"
          ? config.buildUpdateBody(movedCard, targetColumnId)
          : { [config.statusField]: targetColumnId };

      const res = await makeRequest(updatePath, {
        method: config.updateMethod || "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateBody),
      });

      if (!res.success) {
        throw new Error(res?.message || "Unable to update status");
      }

      toast.success(config.successMessage || "Status updated");
      onAfterUpdate?.();
    } catch (error) {
      setBoardState(boardState);
      toast.error(error.message || "Unable to update status");
    } finally {
      setUpdatingCardId(null);
    }
  };

  if (loading || loadingColumns) {
    return (
      <div className="kanban-loading">
        <Spinner />
      </div>
    );
  }

  if (!columns.length) {
    return <div className="kanban-empty">No kanban columns found for this category slug.</div>;
  }

  return (
    <div className="kanban-shell">
      {updatingCardId ? (
        <div className="kanban-updating">
          <Spinner size="sm" /> Updating status...
        </div>
      ) : null}

      <KanbanProvider value={{ config, editRow }}>
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <div className="kanban-board">
            {columnIds.map((columnId) => {
              const column = columns.find((item) => item.id === columnId);
              return (
                <KanbanColumn
                  key={columnId}
                  column={column}
                  items={boardState[columnId] || []}
                />
              );
            })}
          </div>
        </DndContext>
      </KanbanProvider>
    </div>
  );
}

export default KanbanBoard;
