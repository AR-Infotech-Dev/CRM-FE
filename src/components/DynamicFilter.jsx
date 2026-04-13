import { Delete, FilterX } from "lucide-react";
import React, { useMemo, useRef, useState } from "react";


const TEXT_CONDITIONS = [
    { label: "Is In", value: "is_in" },
    { label: "Start With", value: "start_with" },
    { label: "End With", value: "end_with" },
    { label: "Equal To", value: "equal_to" },
    { label: "Not Equal To", value: "not_equal_to" },
    { label: "Is Empty", value: "is_empty" },
    { label: "Is Not Empty", value: "is_not_empty" },
];

const EMPTY_VALUE_CONDITIONS = ["is_empty", "is_not_empty"];

const defaultConditionByType = {
    text: "is_in",
    number: "equal_to",
    date: "exact_date",
    select: "equal_to",
};

const DynamicFilter = ({
    fields = [],
    savedFilters = [],
    onSearch,
    onApplyFilters,
    onSaveFilter,
    onDeleteFilter,
    onSelectSavedFilter,
    onClearFilters,
}) => {
    const [searchText, setSearchText] = useState("");
    const [fieldSearch, setFieldSearch] = useState("");
    const [savedFilterSearch, setSavedFilterSearch] = useState("");
    const [selectedFilterId, setSelectedFilterId] = useState("");
    const [filterName, setFilterName] = useState("");
    const [visibility, setVisibility] = useState("private");
    const [showFieldMenu, setShowFieldMenu] = useState(false);
    const [showSavedFilterMenu, setShowSavedFilterMenu] = useState(false);
    const [editingFieldKey, setEditingFieldKey] = useState(null);

    const [activeFilters, setActiveFilters] = useState([]);

    const fieldMenuRef = useRef(null);
    const savedMenuRef = useRef(null);

    const filteredFields = useMemo(() => {
        return fields.filter((field) =>
            field.label.toLowerCase().includes(fieldSearch.toLowerCase())
        );
    }, [fields, fieldSearch]);

    const filteredSavedFilters = useMemo(() => {
        return savedFilters.filter((filter) =>
            filter.filter_name.toLowerCase().includes(savedFilterSearch.toLowerCase())
        );
    }, [savedFilters, savedFilterSearch]);

    const addField = (field) => {
        const alreadyExists = activeFilters.some((item) => item.field === field.value);
        if (alreadyExists) return;

        const next = {
            id: `${field.value}-${Date.now()}`,
            field: field.value,
            label: field.label,
            type: field.type || "text",
            condition: defaultConditionByType[field.type || "text"] || "is_in",
            value: "",
        };

        setActiveFilters((prev) => [...prev, next]);
        setEditingFieldKey(next.id);
        setShowFieldMenu(false);
    };

    const updateFilter = (id, key, value) => {
        setActiveFilters((prev) =>
            prev.map((item) =>
                item.id === id
                    ? {
                        ...item,
                        [key]: value,
                        ...(key === "condition" && EMPTY_VALUE_CONDITIONS.includes(value)
                            ? { value: "" }
                            : {}),
                    }
                    : item
            )
        );
    };

    const removeFilter = (id) => {
        setActiveFilters((prev) => prev.filter((item) => item.id !== id));
        if (editingFieldKey === id) setEditingFieldKey(null);
    };

    const applyFilters = () => {
        const payload = activeFilters.map((item) => ({
            field: item.field,
            condition: item.condition,
            value: item.value,
            type: item.type,
        }));

        onApplyFilters?.({
            freeTextSearch: searchText,
            filters: payload,
            selectedFilterId,
        });
    };

    const clearFilters = () => {
        setSearchText("");
        setSelectedFilterId("");
        setFilterName("");
        setVisibility("private");
        setActiveFilters([]);
        setEditingFieldKey(null);
        onClearFilters?.();
    };

    const saveFilter = () => {
        const payload = {
            filter_id: selectedFilterId || null,
            filter_name: filterName,
            visibility,
            conditions: activeFilters.map((item) => ({
                field: item.field,
                label: item.label,
                type: item.type,
                condition: item.condition,
                value: item.value,
            })),
        };

        onSaveFilter?.(payload);
    };

    const handleSelectSavedFilter = (filter) => {
        setSelectedFilterId(filter.filter_id);
        setFilterName(filter.filter_name);
        setVisibility(filter.visibility || "private");
        setShowSavedFilterMenu(false);
        onSelectSavedFilter?.(filter);
    };

    const getConditions = (type) => {
        if (type === "date") {
            return [
                { label: "Today", value: "today" },
                { label: "Tomorrow", value: "tomorrow" },
                { label: "Yesterday", value: "yesterday" },
                { label: "Exact Date", value: "exact_date" },
                { label: "This Month", value: "this_month" },
                { label: "This Week", value: "this_week" },
                { label: "Date Range", value: "date_range" },
                { label: "Is Empty", value: "is_empty" },
                { label: "Is Not Empty", value: "is_not_empty" },
            ];
        }

        return TEXT_CONDITIONS;
    };

    return (
        <div className="flex flex-wrap items-start gap-2 w-full">
            <div className="min-w-50">
                <input
                    type="text"
                    value={searchText}
                    onChange={(e) => {
                        const value = e.target.value;
                        setSearchText(value);
                        onSearch?.(value);
                    }}
                    placeholder="Search..."
                    className="h-7.5 w-full rounded-md border border-slate-200 bg-white px-4 text-sm outline-none ring-0 placeholder:text-slate-400 focus:border-blue-500"
                />
            </div>

            <div className="relative" ref={savedMenuRef}>
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setShowSavedFilterMenu((prev) => !prev)}
                        className="gradient-button inline-flex h-7.5 w-11 items-center justify-center rounded-md border border-slate-200 text-white"
                        title="Filter View"
                    >
                        <FilterX color="#ffffff" />
                        {/* <span className="material-symbols-outlined text-[20px]">filter_alt</span> */}
                    </button>

                    <button
                        type="button"
                        onClick={clearFilters}
                        className="inline-flex gradient-button h-7.5 items-center justify-center rounded-md border  border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    >
                        Clear
                    </button>

                    {selectedFilterId ? (
                        <div className="inline-flex h-11 items-center rounded-md border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700">
                            {filterName || "Selected Filter"}
                        </div>
                    ) : null}
                </div>

                {showSavedFilterMenu ? (
                    <div className="absolute left-0 top-14 z-30 w-90 rounded-xl border border-slate-200 bg-white shadow-xl">
                        <div className="sticky top-0 border-b border-slate-100 bg-white p-3">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={savedFilterSearch}
                                    onChange={(e) => setSavedFilterSearch(e.target.value)}
                                    placeholder="Search filter"
                                    className="h-10 w-full rounded-md border border-slate-200 px-3 pr-10 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500"
                                />
                                {savedFilterSearch ? (
                                    <button
                                        type="button"
                                        onClick={() => setSavedFilterSearch("")}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                                    >
                                        ✕
                                    </button>
                                ) : null}
                            </div>
                        </div>

                        <div className="max-h-80 overflow-y-auto p-2">
                            {filteredSavedFilters.length ? (
                                filteredSavedFilters.map((filter) => (
                                    <div
                                        key={filter.filter_id}
                                        className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-slate-50"
                                    >
                                        <div className="w-5 text-slate-500">
                                            {filter.visibility === "public" ? "🌐" : ""}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={() => handleSelectSavedFilter(filter)}
                                            className="flex-1 text-left text-sm text-slate-700"
                                        >
                                            {filter.filter_name}
                                        </button>

                                        <input
                                            type="radio"
                                            checked={filter.is_default === "yes"}
                                            readOnly
                                        />

                                        <button
                                            type="button"
                                            onClick={() => onDeleteFilter?.(filter)}
                                            className="text-red-500 hover:text-red-600"
                                        >
                                            🗑
                                        </button>
                                    </div>
                                ))
                            ) : (
                                <div className="py-8 text-center text-sm text-slate-500">
                                    No Filters Available
                                </div>
                            )}
                        </div>
                    </div>
                ) : null}
            </div>

            <div className="relative" ref={fieldMenuRef}>
                <button
                    type="button"
                    onClick={() => setShowFieldMenu((prev) => !prev)}
                    className="inline-flex h-7.5 gradient-button w-11 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                    title="Add Filter"
                >
                    add
                </button>

                {showFieldMenu ? (
                    <div className="absolute left-0 top-9.25 z-30 w-55 rounded-xl border border-slate-200 bg-white shadow-xl py-1">
                        <div className="sticky top-0 border-slate-100 bg-white p-1.5">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={fieldSearch}
                                    onChange={(e) => setFieldSearch(e.target.value)}
                                    placeholder="Search field"
                                    className="h-7.5 w-full rounded-md border border-slate-200 px-3 pr-10 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500"
                                />
                                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                                    🔍
                                </span>
                            </div>
                        </div>

                        <div className="px-1 max-h-25 overflow-y-auto py-1 [&>*:last-child]:rounded-b-xl">
                            {filteredFields.length ? (
                                filteredFields.map((field) => (
                                    <button
                                        key={field.value}
                                        type="button"
                                        onClick={() => addField(field)}
                                        className="block border-b-gray-700 w-full px-4 py-2 text-left text-sm text-slate-500 bg-gray-50 hover:bg-gray-100 hover:text-slate-500"
                                    >
                                        {field.label}
                                    </button>
                                ))
                            ) : (
                                <div className="py-8 text-center text-sm text-slate-500">
                                    No fields available
                                </div>
                            )}
                        </div>
                    </div>
                ) : null}
            </div>

            {activeFilters.map((item) => (
                <div key={item.id} className="relative">
                    <div className="inline-flex h-7.5 items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-4 text-sm">
                        <button
                            type="button"
                            onClick={() => setEditingFieldKey(editingFieldKey === item.id ? null : item.id)}
                            className="flex items-center gap-2 text-slate-700"
                        >
                            <span>{item.label}</span>
                            <span className="text-slate-400">∈</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => removeFilter(item.id)}
                            className="text-slate-400 hover:text-slate-600"
                        >
                            ✕
                        </button>
                    </div>

                    {editingFieldKey === item.id ? (
                        <div className="absolute left-0 top-8.25 z-30 w-60 rounded-xl border border-slate-200 bg-white p-4 shadow-xl">
                            <div className="mb-3">
                                <div className="mb-2 text-sm font-semibold text-slate-800">
                                    {item.label}
                                </div>

                                <select
                                    value={item.condition}
                                    onChange={(e) => updateFilter(item.id, "condition", e.target.value)}
                                    className="h-7.5 w-full rounded-md border border-slate-300 bg-white px-3 text-sm outline-none focus:border-blue-500"
                                >
                                    {getConditions(item.type).map((condition) => (
                                        <option key={condition.value} value={condition.value}>
                                            {condition.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {!EMPTY_VALUE_CONDITIONS.includes(item.condition) &&
                                !["today", "tomorrow", "yesterday", "this_month", "this_week"].includes(item.condition) ? (
                                <div className="mb-4">
                                    <input
                                        type={item.type === "number" ? "number" : item.type === "date" ? "date" : "text"}
                                        value={item.value}
                                        onChange={(e) => updateFilter(item.id, "value", e.target.value)}
                                        placeholder={`Enter ${item.label}`}
                                        className="h-7.5 w-full rounded-md border border-slate-200 px-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500"
                                    />
                                </div>
                            ) : null}

                            <div className="flex items-center justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setEditingFieldKey(null)}
                                    className="text-sm text-slate-600 hover:text-slate-800"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditingFieldKey(null);
                                        applyFilters();
                                    }}
                                    className="rounded-md gradient-button hover:bg-purple-500 hover:text-white px-4 py-2 text-sm font-medium text-white"
                                >
                                    Apply
                                </button>
                            </div>
                        </div>
                    ) : null}
                </div>
            ))}

            {/* {activeFilters.length > 0 ? (
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={applyFilters}
                        className="h-7.5 rounded-md border border-slate-200 bg-white px-4 text-sm text-slate-700 hover:bg-slate-50"
                    >
                        Apply Filters
                    </button>

                    <div className="relative">
                        <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-3">
                            <input
                                type="text"
                                value={filterName}
                                onChange={(e) => setFilterName(e.target.value)}
                                placeholder="Filter Name"
                                className="w-[140px] border-none bg-transparent text-sm outline-none placeholder:text-slate-400"
                            />

                            <label className="flex items-center gap-1 text-xs text-slate-600">
                                <input
                                    type="radio"
                                    name="visibility"
                                    checked={visibility === "public"}
                                    onChange={() => setVisibility("public")}
                                />
                                Public
                            </label>

                            <label className="flex items-center gap-1 text-xs text-slate-600">
                                <input
                                    type="radio"
                                    name="visibility"
                                    checked={visibility === "private"}
                                    onChange={() => setVisibility("private")}
                                />
                                Private
                            </label>

                            <button
                                type="button"
                                onClick={saveFilter}
                                className="rounded-md bg-slate-900 px-3 py-2 text-xs font-medium text-white hover:bg-slate-800"
                            >
                                Save Filter
                            </button>
                        </div>
                    </div>
                </div>
            ) : null} */}
        </div>
    );
};

export default DynamicFilter;