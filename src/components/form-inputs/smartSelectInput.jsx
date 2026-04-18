// export default SmartSelectInput;
import React, { useState, useEffect, useRef } from 'react';
import { FixedSizeList as List } from 'react-window';
// import { fetchJson } from '@utils/fetchJson';
import { makeRequest } from "../../api/httpClient";

import { API_BASE_URL } from '../../api/config';
import Cookies from 'js-cookie';
import { Check } from 'lucide-react';
// import DropdownPortal from './DropdownPortal';
// import { useCategoryCreateStore } from '@plugin/categories/store/useCategoryCreateStore';
// import { createEntityMap } from '@components/GlobalModals';
import { useFloating, offset, flip, shift, autoUpdate, FloatingPortal } from '@floating-ui/react';
const cacheStore = new Map();
const SmartSelectInput = ({ id, value, onSelect, onObjectSelect = {}, config, addNewFunction }) => {
  const {
    type = 'category',
    source = '',
    label = '',
    check = '',
    list = '',
    placeholder = 'Select...',
    allowAddNew = false,
    showRecent = false,
    preload = false,
    cache = true,
    multi = false,
    getValue,
    getLabel,
    customURL = "",
    statusCheck = false,
    customParameters = {},
  } = config;
  // const { openCategoryCreate } = useCategoryCreateStore();
  const key = `${type}-${source}`;
  const [options, setOptions] = useState([]);
  const [internalValue, setInternalValue] = useState(multi ? [] : null);
  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const [hasMore, setHasMore] = useState(true);
  const [inputWidth, setInputWidth] = useState(0);
  const [page, setPage] = useState("0");
  const listRef = useRef(null);
  const { refs, floatingStyles, update, } = useFloating({
    middleware: [offset(4), flip(), shift()],
    placement: 'bottom-start',
    whileElementsMounted: autoUpdate,
  });

  // Normalize fetched items
  const normalizeOptions = (items = []) => items.map(item => ({
    value: getValue ? getValue(item) : item.id,
    label: getLabel ? getLabel(item) : item.name || 'Unnamed',
    original: item,
  }));

  useEffect(() => {
    if (showDropdown && refs.reference.current) {
      setInputWidth(refs.reference.current.offsetWidth);
    }
  }, [showDropdown, refs.reference]);

  // Fetch once, then always filter locally
  const fetchOptions = async (page) => {
    setLoading(true);
    console.log(page);
    const headers = {
      // token: Cookies.get('_bb_key'),
      // SadminID: Cookies.get('authid'),
    };
    let res = {}, data = [], newOptions = [];
    if (type === 'category') {
      let urlType = customURL || `${API_BASE_URL}/searchSlugList`;
      const posData = customURL ? customParameters : { status: 'active', slug: source };

      res = await makeRequest(urlType, {
        method: 'POST', headers,
        body: posData,
      });
      // res = await fetchJson(urlType, {
      //   method: 'POST', headers,
      //   body: JSON.stringify(posData),
      // });
      data = customURL ? res?.data || [] : res.data[0]?.sublist || [];
    } else {
      // res = await fetchJson(`${API_BASE_URL}/searchList`, {
      res = await makeRequest(`${API_BASE_URL}/searchList`, {
        method: 'POST', headers,
        body: JSON.stringify({
          text: '',
          system: "new",
          tableName: type === 'customer' ? 'customer' : source,
          wherec: type === 'customer' ? 'name' : check,
          status: statusCheck,
          list,
          curpage: page,
          ...customParameters,
        }),
      });
      data = res.data || [];
    }
    const normalized = normalizeOptions(data);
    //setOptions(normalized);
    newOptions = normalizeOptions(data);
    setOptions((prev) => {
      const existingIds = new Set(prev.map(item => item.value));
      const uniqueNew = newOptions.filter(item => !existingIds.has(item.value));
      return [...prev, ...uniqueNew];
    });
    setHasMore(res.loadstate);
    // setPage(res?.paginginfo?.nextPage);
    if (cache) cacheStore.set(key, normalized);
    if (showRecent)
      localStorage.setItem(`recent_${key}`, JSON.stringify(data.slice(0, 5)));
    setLoading(false);
  };

  // Fetch once on mount
  useEffect(() => {
    if (preload || cache) {
      const recent = localStorage.getItem(`recent_${key}`);
      if (recent) setOptions(normalizeOptions(JSON.parse(recent)));
      else fetchOptions();
    }
  }, []);
  const handleScroll = ({ scrollOffset, scrollDirection, scrollUpdateWasRequested }) => {
    const listEl = listRef.current;
    if (!listEl) return;

    const { scrollHeight, clientHeight, scrollTop } = listEl._outerRef;

    // If user scrolled near bottom
    if (scrollHeight - scrollTop - clientHeight < 50 && hasMore && !loading) {
      console.log("Fetch next page", page);
      fetchOptions(page);
    }
  };
  useEffect(() => {
    let alive = true;

    const toIdArray = (v) => {
      if (Array.isArray(v)) return v.map(String).map(s => s.trim()).filter(Boolean);
      if (v === null || v === undefined) return [];
      return String(v)
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
    };

    const ids = toIdArray(value);

    // If value is cleared, clear internal selection and exit
    const isCleared =
      (multi && ids.length === 0) ||
      (!multi && (value === null || value === undefined || String(value).trim() === ''));

    const applyMatch = (pool) => {
      if (!alive) return;
      const matched = pool.filter(opt => ids.includes(String(opt.value)));
      setInternalValue(multi ? matched : (matched[0] ?? null));
    };

    if (isCleared) {
      setInternalValue(multi ? [] : null);
      return () => { alive = false; };
    }

    const cached = cacheStore.get(key);

    if (cached && cached.length) {
      applyMatch(cached);
    } else {
      (async () => {
        try {
          await fetchOptions(); // should populate cacheStore for `key`
        } finally {
          const fresh = cacheStore.get(key) || [];
          applyMatch(fresh);
        }
      })();
    }

    return () => { alive = false; };
  }, [value, key, multi]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !refs.floating.current?.contains(event.target) &&
        !refs.reference.current?.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);
  const handleSelect = (item) => {
    if (multi) {
      let selected = Array.isArray(internalValue) ? [...internalValue] : [];
      const already = selected.find(v => v.value === item.value);
      selected = already ? selected.filter(v => v.value !== item.value) : [...selected, item];
      setInternalValue(selected);
      onSelect(selected.map(i => i.value).join(','));
      onObjectSelect?.(item);
    } else {
      setInternalValue(item);
      setInputValue('');  // reset after select
      setShowDropdown(false);
      onSelect(item.value);
      onObjectSelect?.(item);
    }
  };

  const handleClear = () => {
    setInternalValue(multi ? [] : null);
    setInputValue(null);
    setShowDropdown(false);
    onSelect('');
    onObjectSelect?.({});
  };
  const capitalize = s => s.charAt(0).toUpperCase() + s.slice(1);
  const handleRefresh = () => {
    cacheStore.delete(key);
    localStorage.removeItem(`recent_${key}`);
    setPage(0);
    setOptions([]);
    fetchOptions();
  };
  // const handleNew = (rowData) => {

  //     // check type
  //     setShowDropdown(false);
  //     const entityType = config.type;
  //     const storeHook = createEntityMap[entityType];

  // if (storeHook) {
  //   const openCreate = storeHook.getState().open?.[`${entityType}Create`] || storeHook.getState()[`open${capitalize(entityType)}Create`];
  //   if (typeof openCreate === 'function') {
  //     openCreate({ payload: rowData }, async (result) => {
  //       if(result){
  //         cacheStore.delete(key);
  //         localStorage.removeItem(`recent_${key}`);
  //         await fetchOptions();
  //         const allOptions = cacheStore.get(key) || [];
  //         const lastID = result.last_insert_id ? result.last_insert_id : result.lastID;
  //         const selected = allOptions.find(opt => String(opt.value) === String(lastID));
  //         if (selected) {
  //           setInternalValue(selected);
  //           onSelect(selected.value);
  //           onObjectSelect?.(selected.original);
  //         }
  //       }
  //     });
  //   } else {
  //     console.warn(`No openCreate method found for type: ${entityType}`);
  //   }
  // } else {
  //   console.warn(`No store registered for type: ${entityType}`);
  // }
  // };

  // **Local filtering**
  const filteredOptions = inputValue
    ? options.filter(opt =>
      opt.label && opt.label.toLowerCase().includes(inputValue.toLowerCase())
    )
    : options;

  const Row = ({ index, style }) => {
    const item = filteredOptions[index];
    const isSelected = multi
      ? internalValue.some(v => v.value === item.value)
      : internalValue?.value === item.value;

    return (
      <div
        style={style}
        onClick={() => handleSelect(item)}
        className="cursor-pointer px-4 py-2 hover:bg-gray-100 flex items-start justify-between text-sm"
      >
        <span className="whitespace-normal break-words">{item.label}</span>
        {isSelected && <Check size={16} className="text-green-600 ml-2" />}
      </div>
    );
  };

  return (
    <div ref={containerRef} className="relative w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      )}
      {multi ? (
        <div onClick={() => { setShowDropdown(true); inputRef.current?.focus(); }}
          className={`flex flex-wrap gap-1 rounded w-full transition-all
               ${internalValue.length > 0 ? 'border px-2 py-1' : ''}`}>
          {internalValue.map((v, i) => (
            <span key={i} className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm">
              {v.label}
              <button onClick={(e) => {
                e.stopPropagation();
                const updated = internalValue.filter(item => item.value !== v.value);
                setInternalValue(updated);
                onObjectSelect?.(updated);
                onSelect(updated.map(i => i.value).join(','));
              }} className="ml-1">&times;</button>
            </span>
          ))}
          <input
            ref={el => {
              inputRef.current = el;
              refs.setReference(el);
            }}
            onBlur={() => {
              if (!multi && inputValue === '') {
                setInternalValue(null);
                onSelect('');
                onObjectSelect?.({});
              }
            }}
            className="ws-input form-input w-full flex-grow min-w-[120px] border-none bg-gray-100 focus:outline-none h-10 rounded text-sm px-3 py-2 pr-2 outline-none text-sm"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={internalValue.length ? '' : placeholder}
          />
        </div>
      ) : (
        <div className="relative">
          <input
            id={id}
            name={id}
            type="text"
            autoComplete="off"
            ref={refs.setReference}
            value={inputValue || internalValue?.label || ''}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setShowDropdown(true)}
            placeholder={placeholder}
            className="ws-input form-input w-full text-gray-600 text-md bg-gray-100 rounded focus:outline-none text-sm px-3 py-2 pr-10 rounded"
          />
          {internalValue && (
            <button type="button" onClick={handleClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 hover:text-red-500">
              &times;
            </button>
          )}
        </div>
      )}

      {showDropdown && (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={{
              ...floatingStyles,
              minWidth: inputWidth || 200,              // Match the input's width
              maxWidth: 480,                     // You can adjust this (or use '100vw' for full window)
            }}
            className="z-50 max-h-60 border bg-white shadow-lg rounded-md text-sm"
          >
            <div className="flex pr-2 pt-1 bg-blue-50 p-2 h-10 align-center justify-between">
              {loading ? (
                <div className="p-3 text-sm text-gray-500">Loading...</div>
              ) : (
                <button onClick={handleRefresh} className="hover:underline text-blue-600">Refresh List</button>
              )}
              {/* {allowAddNew && (
                <button
                  onClick={() => {if(config.type==="category"){handleNew({is_parent:'no',short:true,form_label:placeholder,parent_id:filteredOptions[0].original?.parent_id})}else{
                    handleNew({});
                  } }}
                  className="hover:underline text-blue-600"
                >
                  + Add New {label}
                </button>
              )} */}
            </div>


            <List ref={listRef} height={200} itemCount={filteredOptions.length} onScroll={handleScroll} itemSize={44} width="100%">
              {Row}
            </List>

          </div>
        </FloatingPortal>
      )}
    </div>
  );
};
export default SmartSelectInput;