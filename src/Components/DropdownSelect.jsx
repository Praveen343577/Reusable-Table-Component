import { useState, useRef, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

const DropdownSelect = ({
  options = [],
  value,
  onChange,
  isMulti = true,
  placeholder,
  searchable = true,
  searchPlaceholder,
  showSelectAll = true,
  disabled = false,
  className = "",
  id,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef(null);
  const { t } = useTranslation();

  const finalPlaceholder = placeholder || t("common.select", "Select...");
  const finalSearchPlaceholder = searchPlaceholder || t("buttons.search", "Search...");

  // Normalize options to handle complex objects, custom search strings, and disabled states
  const normalizedOptions = useMemo(() => {
    return options.map((opt) => {
      if (typeof opt === "object" && opt !== null) {
        return {
          label: opt.label === undefined ? opt.value : opt.label,
          value: opt.value,
          searchValue:
            opt.searchValue ||
            (typeof opt.label === "string" ? opt.label : String(opt.value)),
          disabled: !!opt.disabled,
        };
      }
      return {
        label: String(opt),
        value: opt,
        searchValue: String(opt),
        disabled: false,
      };
    });
  }, [options]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const visibleOptions = useMemo(() => {
    if (!searchTerm.trim()) return normalizedOptions;
    const lowerTerm = searchTerm.toLowerCase();
    return normalizedOptions.filter((opt) =>
      opt.searchValue.toLowerCase().includes(lowerTerm),
    );
  }, [normalizedOptions, searchTerm]);

  const selectableVisibleOptions = useMemo(
    () => visibleOptions.filter((opt) => !opt.disabled),
    [visibleOptions],
  );

  const getTriggerLabel = () => {
    if (isMulti) {
      const valArray = Array.isArray(value) ? value : [];
      if (valArray.length === 0) return finalPlaceholder;
      return `${valArray.length} selected`;
    }

    if (value === null || value === undefined || value === "") {
      return finalPlaceholder;
    }

    const selectedOpt = normalizedOptions.find((o) => o.value === value);
    if (!selectedOpt) return value;

    return typeof selectedOpt.label === "string"
      ? selectedOpt.label
      : selectedOpt.searchValue;
  };

  const handleOptionClick = (option) => {
    if (option.disabled) return;

    if (isMulti) {
      const valArray = Array.isArray(value) ? value : [];
      const isSelected = valArray.includes(option.value);
      let newValue;

      if (isSelected) {
        newValue = valArray.filter((v) => v !== option.value);
      } else {
        newValue = [...valArray, option.value];
      }
      onChange(newValue);
    } else {
      onChange(option.value);
      setIsOpen(false);
      setSearchTerm("");
    }
  };

  const isAllVisibleSelected = useMemo(() => {
    if (isMulti && selectableVisibleOptions.length > 0) {
      const valArray = Array.isArray(value) ? value : [];
      return selectableVisibleOptions.every((opt) =>
        valArray.includes(opt.value),
      );
    }
    return false;
  }, [selectableVisibleOptions, value, isMulti]);

  const hasSelection = isMulti ? (value?.length > 0) : !!value;

  return (
    <div
      id={id}
      className={`custom-dropdown-picker ${className} ${disabled ? "is-disabled" : ""}`}
      ref={dropdownRef}
    >
      <button
        type="button"
        className={`custom-dropdown-trigger ${isOpen ? "is-open" : ""} ${hasSelection ? "has-selection" : ""}`}
        onClick={() => { if (!disabled) setIsOpen((prev) => !prev); }}
        disabled={disabled}
      >
        <span className="custom-dropdown-trigger-label">
          {getTriggerLabel()}
        </span>
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{
            flexShrink: 0,
            transition: "transform 0.2s",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            color: "#94a3b8",
          }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {isOpen && (
        <div className="custom-dropdown-panel">
          {isMulti && showSelectAll && (
            <div className="custom-dropdown-panel-header">
              <button
                type="button"
                className="custom-dropdown-panel-action"
                disabled={
                  isAllVisibleSelected || selectableVisibleOptions.length === 0
                }
                onClick={() => {
                  const valArray = Array.isArray(value) ? value : [];
                  const currentIds = new Set(valArray);
                  selectableVisibleOptions.forEach((opt) =>
                    currentIds.add(opt.value),
                  );
                  onChange(Array.from(currentIds));
                }}
              >
                Select all
              </button>
              <span className="custom-dropdown-panel-sep">·</span>
              <button
                type="button"
                className="custom-dropdown-panel-action"
                disabled={!value || value.length === 0}
                onClick={() => onChange([])}
              >
                Clear
              </button>
            </div>
          )}

          {searchable && (
            <div className="custom-dropdown-search-wrap">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="custom-dropdown-search-icon"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                className="custom-dropdown-search-input"
                placeholder={finalSearchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                autoFocus
              />
              {searchTerm && (
                <button
                  type="button"
                  className="custom-dropdown-search-clear"
                  onClick={() => setSearchTerm("")}
                >
                  ×
                </button>
              )}
            </div>
          )}

          <ul className="custom-dropdown-list">
            {visibleOptions.length > 0 ? (
              visibleOptions.map((opt) => {
                const valArray = Array.isArray(value) ? value : [value];
                const isSelected = valArray.includes(opt.value);

                return (
                  <li key={opt.value}>
                    <button
                      type="button"
                      className={`custom-dropdown-item ${isSelected ? "is-checked" : ""} ${opt.disabled ? "is-disabled" : ""}`}
                      onClick={() => handleOptionClick(opt)}
                      disabled={opt.disabled}
                      style={{ width: '100%', border: 'none', background: 'none', padding: '7px 12px', textAlign: 'left', display: 'flex', alignItems: 'center', cursor: opt.disabled ? 'not-allowed' : 'pointer' }}
                    >
                      {isMulti && (
                        <span
                          className={`custom-checkbox-box ${isSelected ? "checked" : ""}`}
                        >
                          {isSelected && (
                            <svg
                              width="9"
                              height="9"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="3.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </span>
                      )}
                      <div
                        className="custom-dropdown-item-label"
                        style={{ flex: 1 }}
                      >
                        {opt.label}
                      </div>
                      {!isMulti && isSelected && (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#0b5297"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          style={{ marginLeft: "auto" }}
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </button>
                  </li>
                );
              })
            ) : (
              <li className="custom-dropdown-item-empty">
                {searchTerm
                  ? `No results for "${searchTerm}"`
                  : "No options available"}
              </li>
            )}
          </ul>
        </div>
      )}

      <style>{`
        .custom-dropdown-picker { position: relative; display: inline-block; width: 100%; font-family: inherit; }
        .custom-dropdown-picker.is-disabled { opacity: 0.6; cursor: not-allowed; pointer-events: none; }
        .custom-dropdown-trigger { display: flex; align-items: center; justify-content: space-between; width: 100%; gap: 8px; background: var(--bg, #fff); border: 1.5px solid var(--border-color, #e2e8f0); border-radius: 8px; padding: 7px 10px; font-size: 0.82rem; color: var(--secondary-text-color, #64748b); cursor: pointer; transition: all 0.2s; box-sizing: border-box; min-height: 34px; }
        .custom-dropdown-trigger:hover, .custom-dropdown-trigger.is-open { border-color: #0b5297; box-shadow: 0 0 0 3px rgba(11, 82, 151, 0.08); color: #1e293b; }
        .custom-dropdown-trigger.has-selection { border-color: #0b5297; color: #0b5297; font-weight: 600; }
        .custom-dropdown-trigger-label { flex: 1; text-align: left; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

        /* Dark Mode: Trigger */
        .dark .custom-dropdown-trigger { background: #1e293b; border-color: #334155; color: #94a3b8; }
        .dark .custom-dropdown-trigger:hover, .dark .custom-dropdown-trigger.is-open { border-color: #3b82f6; color: #f1f5f9; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
        .dark .custom-dropdown-trigger.has-selection { border-color: #3b82f6; color: #3b82f6; }

        .custom-dropdown-panel { position: absolute; top: calc(100% + 4px); left: 0; min-width: 200px; width: 100%; background: #fff; border: 1.5px solid #e2e8f0; border-radius: 10px; box-shadow: 0 8px 24px rgba(0,0,0,0.1); z-index: 9999; overflow: hidden; animation: dropdownFadeIn 0.15s ease; }
        @keyframes dropdownFadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
        
        /* Dark Mode: Panel */
        .dark .custom-dropdown-panel { background: #1e293b; border-color: #334155; box-shadow: 0 10px 30px rgba(0,0,0,0.4); }

        .custom-dropdown-panel-header { display: flex; align-items: center; gap: 4px; padding: 8px 12px; border-bottom: 1px solid #f1f5f9; background: #f8fafc; }
        .dark .custom-dropdown-panel-header { background: #0f172a; border-bottom-color: #334155; }

        .custom-dropdown-panel-action { background: none; border: none; font-size: 0.75rem; font-weight: 600; color: #0b5297; cursor: pointer; padding: 0; }
        .dark .custom-dropdown-panel-action { color: #3b82f6; }
        .custom-dropdown-panel-action:disabled { opacity: 0.4; cursor: default; }
        .custom-dropdown-panel-action:not(:disabled):hover { text-decoration: underline; }
        .custom-dropdown-panel-sep { color: #cbd5e1; margin: 0 4px; }
        .dark .custom-dropdown-panel-sep { color: #475569; }

        .custom-dropdown-search-wrap { display: flex; align-items: center; padding: 8px 12px; border-bottom: 1px solid #f1f5f9; }
        .dark .custom-dropdown-search-wrap { border-bottom-color: #334155; }
        .custom-dropdown-search-icon { color: #94a3b8; margin-right: 8px; flex-shrink: 0;}
        .custom-dropdown-search-input { flex: 1; border: none; outline: none; font-size: 0.85rem; color: #1e293b; min-width: 0; background: transparent; }
        .dark .custom-dropdown-search-input { color: #f1f5f9; }
        .custom-dropdown-search-input::placeholder { color: #94a3b8; }
        .custom-dropdown-search-clear { background: none; border: none; color: #94a3b8; cursor: pointer; font-size: 1.2rem; padding: 0 4px; }

        .custom-dropdown-list { list-style: none; margin: 0; padding: 4px 0; max-height: 250px; overflow-y: auto; }
        .custom-dropdown-list::-webkit-scrollbar { width: 5px; }
        .custom-dropdown-list::-webkit-scrollbar-thumb { background: #e2e8f0; border-radius: 4px; }
        .dark .custom-dropdown-list::-webkit-scrollbar-thumb { background: #334155; }

        .custom-dropdown-item { display: flex; align-items: center; gap: 10px; padding: 7px 12px; font-size: 0.8rem; color: #334155; cursor: pointer; transition: background 0.15s; }
        .dark .custom-dropdown-item { color: #cbd5e1; }
        .custom-dropdown-item:hover:not(.is-disabled) { background: #f0f7ff; }
        .dark .custom-dropdown-item:hover:not(.is-disabled) { background: rgba(59, 130, 246, 0.1); color: #f1f5f9; }
        .custom-dropdown-item.is-checked { background: #eff6ff; }
        .dark .custom-dropdown-item.is-checked { background: rgba(59, 130, 246, 0.15); color: #3b82f6; }
        .custom-dropdown-item.is-disabled { opacity: 0.45; cursor: not-allowed; }
        .custom-dropdown-item-empty { padding: 12px; text-align: center; font-size: 0.8rem; color: #94a3b8; }

        .custom-checkbox-box { width: 14px; height: 14px; border: 1.5px solid #cbd5e1; border-radius: 4px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; background: #fff; transition: all 0.15s; }
        .dark .custom-checkbox-box { background: #0f172a; border-color: #475569; }
        .custom-checkbox-box.checked { background: #0b5297; border-color: #0b5297; color: #fff; }
        .dark .custom-checkbox-box.checked { background: #3b82f6; border-color: #3b82f6; }
      `}</style>
    </div>
  );
};

DropdownSelect.propTypes = {
  options: PropTypes.array.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.array,
    PropTypes.string,
    PropTypes.number,
  ]),
  onChange: PropTypes.func.isRequired,
  isMulti: PropTypes.bool,
  placeholder: PropTypes.string,
  searchable: PropTypes.bool,
  searchPlaceholder: PropTypes.string,
  showSelectAll: PropTypes.bool,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  id: PropTypes.string,
};

export default DropdownSelect;
