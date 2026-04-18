import React from 'react'
import { X ,ChevronUp, ChevronDown, ChevronsUpDown, Plus } from "lucide-react";

function ColumnArranger({ setIsColumnMenuOpen,isColumnMenuOpen, hiddenColumns, removableColumns, onShowColumn, onHideColumn, onMoveColumn }) {

    if (!isColumnMenuOpen) return null;
    return (
        <>
            <div className="table-column-picker-menu">
                <div className="table-column-picker-section min-h-[90%] overflow-y-auto">
                    <div className="table-column-picker-title sticky top-0 bg-white">Add Columns</div>
                    {hiddenColumns.length ? (
                        hiddenColumns.map((item) => (
                            <label key={item.key} className="table-column-picker-item">
                                <input
                                    type="checkbox"
                                    checked={false}
                                    onChange={(event) => {
                                        if (event.target.checked) {
                                            onShowColumn?.(item.key);
                                        }
                                    }}
                                />
                                <span>{item.label}</span>
                            </label>
                        ))
                    ) : (
                        <div className="table-column-picker-empty">No columns to add</div>
                    )}
                </div>
                <div className="table-column-picker-section min-h-[90%] overflow-y-auto">
                    <div className="table-column-picker-title sticky top-0 bg-white">Remove Columns</div>
                    {removableColumns.length ? (
                        removableColumns.map((item) => (
                            <div key={item.key} className="table-column-picker-row">
                                <label className="table-column-picker-item">
                                    <input
                                        type="checkbox"
                                        checked
                                        onChange={(event) => {
                                            if (!event.target.checked) {
                                                onHideColumn?.(item.key);
                                            }
                                        }}
                                    />
                                    <span>{item.label}</span>
                                </label>
                                <div className="table-column-picker-actions">
                                    <button
                                        type="button"
                                        className="table-column-order-button"
                                        onClick={() => onMoveColumn?.(item.key, "up")}
                                        disabled={item.isFirst}
                                        title="Move up"
                                    >
                                        <ChevronUp size={12} />
                                    </button>
                                    <button
                                        type="button"
                                        className="table-column-order-button"
                                        onClick={() => onMoveColumn?.(item.key, "down")}
                                        disabled={item.isLast}
                                        title="Move down"
                                    >
                                        <ChevronDown size={12} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="table-column-picker-empty">No columns to remove</div>
                    )}
                </div>
                <div className="table-column-picker-section min-h-[90%] overflow-y-auto">
                    <div className="table-column-picker-title sticky top-0 bg-white">Arrange Columns</div>
                    {removableColumns.length ? (
                        removableColumns.map((item) => (
                            <div key={`${item.key}-arrange`} className="table-column-picker-row">
                                <div className="table-column-picker-arrange-label">
                                    <ChevronsUpDown size={12} />
                                    <span>{item.label}</span>
                                </div>
                                <div className="table-column-picker-actions">
                                    <button
                                        type="button"
                                        className="table-column-order-button"
                                        onClick={() => onMoveColumn?.(item.key, "up")}
                                        disabled={item.isFirst}
                                        title="Move up"
                                    >
                                        <ChevronUp size={12} />
                                    </button>
                                    <button
                                        type="button"
                                        className="table-column-order-button"
                                        onClick={() => onMoveColumn?.(item.key, "down")}
                                        disabled={item.isLast}
                                        title="Move down"
                                    >
                                        <ChevronDown size={12} />
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="table-column-picker-empty">No columns to arrange</div>
                    )}
                </div>
                <div className='relative'>
                    <button className="column-menu-close" onClick={()=>{
                        setIsColumnMenuOpen(false);
                    }} aria-label="Close panel">
                        <X size={14} />
                    </button>
                </div>
            </div>

        </>
    )
}

export default ColumnArranger