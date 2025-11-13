import React, { useState, useRef, useEffect } from "react";
import "./CustomSelect.css";

export default function CustomSelect({ options = [], value, onChange, placeholder = "Pilih" }) {
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState(-1);
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => setHighlight(options.findIndex(o => o.value === value)), [value, options]);

  function toggle() { setOpen(v => !v); }
  function select(opt) { onChange?.(opt.value); setOpen(false); }
  function onKeyDown(e) {
    if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setHighlight(h => Math.min(h + 1, options.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setHighlight(h => Math.max(h - 1, 0)); }
    if (e.key === "Enter" && open && highlight >= 0) select(options[highlight]);
    if (e.key === "Escape") setOpen(false);
  }

  const selected = options.find(o => o.value === value)?.label || placeholder;

  return (
    <div className="custom-select" ref={ref}>
      <button
        type="button"
        className="custom-select-button modern-dropdown"
        onClick={toggle}
        onKeyDown={onKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        {selected}
      </button>

      {open && (
        <ul role="listbox" className="custom-select-list">
          {options.map((o, i) => (
            <li
              key={o.value}
              role="option"
              aria-selected={o.value === value}
              className={`custom-select-option ${i === highlight ? "highlight" : ""}`}
              onMouseEnter={() => setHighlight(i)}
              onClick={() => select(o)}
            >
              {o.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}