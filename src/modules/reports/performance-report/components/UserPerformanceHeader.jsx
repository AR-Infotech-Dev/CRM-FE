import { ArrowLeft, Download } from "lucide-react";
export function UserPerformanceToolbar({
  loading,
  canExport,
  onBack,
  loadFrom = false,
  onExportExcel,
  onExportPdf,
  fromDate,
  toDate,
  onDateFilterChange,
}) {
  return (
  <div className="!m-0 !w-full flex h-[40px] items-start justify-end">
    
    <div className="flex items-end gap-3">

      {onBack && (
        <button
          type="button"
          className="performance-button"
          onClick={onBack}
        >
          <ArrowLeft size={14} />
          Back
        </button>
      )}

      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-600">
          From Date
        </label>

        <input
          type="date"
          value={fromDate || ""}
          onChange={(e) =>
            onDateFilterChange("fromDate", e.target.value)
          }
          className="!h-[31px] !w-[130px] !rounded-[7px] !border !border-[#dbe3ef] !bg-white !px-[10px] !text-[12px] !font-bold !text-[#334155] outline-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-semibold text-slate-600">
          To Date
        </label>

        <input
          type="date"
          value={toDate || ""}
          onChange={(e) =>
            onDateFilterChange("toDate", e.target.value)
          }
          className="!h-[31px] !w-[130px] !rounded-[7px] !border !border-[#dbe3ef] !bg-white !px-[10px] !text-[12px] !font-bold !text-[#334155] outline-none"
        />
      </div>

      <button
        type="button"
        className="performance-button"
        disabled={!canExport || loading}
        onClick={onExportExcel}
      >
        <Download size={14} />
        Export Excel
      </button>

    </div>
  </div>
);
}