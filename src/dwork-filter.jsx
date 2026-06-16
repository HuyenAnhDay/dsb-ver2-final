/* global React, window */
// ============================================================
// dWork · "Bộ lọc nâng cao" — lean, guided condition builder
// A centered modal. Each condition is ONE clean row:
//   [ Chỉ số ▾ ]  [ Điều kiện ▾ ]  [ Giá trị ]   ✕
// Conditions are joined by a toggleable VÀ / HOẶC connector,
// evaluated as OR-of-AND groups. Replaces the old inline pills.
// ============================================================
// useState / useEffect / useRef come from ui.jsx (shared global scope)
const FILTER_JOURNEY = window.DSB_DATA.JOURNEY;

// ---- Field catalogue, grouped by category (matches the picker tree) ----
const FILTER_GROUPS = [
  { id: "profile", label: "Hồ sơ cá nhân", icon: "person", fields: [
    { id: "dob",          label: "Ngày tháng sinh",     type: "date" },
    { id: "gender",       label: "Giới tính",           type: "enum", options: ["Nam", "Nữ"] },
    { id: "city",         label: "Thành phố",           type: "enum", options: ["Hà Nội", "TP. Hồ Chí Minh", "Hải Phòng", "Đà Nẵng"] },
    { id: "district",     label: "Quận / Huyện",        type: "text" },
    { id: "completeness", label: "Độ hoàn thiện hồ sơ", type: "number", unit: "%" }
  ]},
  { id: "finance", label: "Tài chính", icon: "payments", fields: [
    { id: "nav",     label: "Giá trị tài sản", type: "number", unit: "tr" },
    { id: "cashPct", label: "Tỷ lệ tiền mặt",  type: "number", unit: "%" },
    { id: "pnlYtd",  label: "Hiệu quả YTD",    type: "number", unit: "%" }
  ]},
  { id: "journey", label: "Hành trình & Chăm sóc", icon: "timeline", fields: [
    { id: "openDate", label: "Ngày mở tài khoản",     type: "date" },
    { id: "segment",  label: "Phân khúc",            type: "enum", options: ["Private Wealth", "Mass Affluent", "Emerging Affluent"] },
    { id: "journey",  label: "Giai đoạn hành trình", type: "enum", options: Object.values(FILTER_JOURNEY).map(j => ({ v: j.key, l: j.label })) },
    { id: "nac",      label: "Cảnh báo NAC",         type: "enum", options: [
        { v: "alert", l: "Đỏ — Khẩn cấp" }, { v: "watch", l: "Vàng — Theo dõi" }, { v: "none", l: "Không cảnh báo" } ] },
    { id: "cadence",  label: "Nhịp chăm sóc",        type: "enum", options: [
        { v: "P1 · Daily", l: "P1 · Hằng ngày" }, { v: "P2 · Weekly", l: "P2 · Hằng tuần" }, { v: "P3 · Bi-weekly", l: "P3 · 2 tuần/lần" } ] },
    { id: "lastDays", label: "Số ngày chưa tương tác", type: "number", unit: "ngày" }
  ]}
];
const FIELD_BY_ID = Object.fromEntries(FILTER_GROUPS.flatMap(g => g.fields.map(f => [f.id, { ...f, group: g.label, groupIcon: g.icon }])));

// ---- Operators per field type ----
const OPS = {
  number: [
    { v: ">",  l: "Lớn hơn" },
    { v: "<",  l: "Nhỏ hơn" },
    { v: ">=", l: "Từ (≥)" },
    { v: "<=", l: "Đến (≤)" },
    { v: "=",  l: "Bằng" },
    { v: "between", l: "Trong khoảng" }
  ],
  date: [
    { v: "between", l: "Trong khoảng" },
    { v: "before",  l: "Trước ngày" },
    { v: "after",   l: "Sau ngày" },
    { v: "on",      l: "Đúng ngày" }
  ],
  enum: [
    { v: "is",    l: "Là" },
    { v: "isnot", l: "Không phải" }
  ],
  text: [
    { v: "contains", l: "Chứa" },
    { v: "eq",       l: "Chính xác là" }
  ]
};
const OP_LABEL = Object.fromEntries(Object.values(OPS).flat().map(o => [o.v, o.l]));
const normOpts = (f) => (f.options || []).map(o => typeof o === "string" ? { v: o, l: o } : o);

// ---- Rule factory + helpers ----
let _rid = 0;
const newRule = () => ({ id: "r" + (++_rid), field: null, op: null, value: "", value2: "" });
function setField(rule, fieldId) {
  const f = FIELD_BY_ID[fieldId];
  return { ...rule, field: fieldId, op: OPS[f.type][0].v, value: "", value2: "" };
}
function isRuleActive(r) {
  if (!r.field) return false;
  const f = FIELD_BY_ID[r.field];
  if ((f.type === "number" || f.type === "date") && r.op === "between") return r.value !== "" || r.value2 !== "";
  return r.value !== "" && r.value != null;
}

// ---- Evaluation (OR-of-AND groups split on "or" connectors) ----
function evalRule(c, r) {
  const f = FIELD_BY_ID[r.field]; if (!f) return true;
  const v = c[r.field];
  if (f.type === "number") {
    if (r.op === "between") {
      const a = parseFloat(r.value), b = parseFloat(r.value2);
      if (!isNaN(a) && v < a) return false;
      if (!isNaN(b) && v > b) return false;
      return true;
    }
    const x = parseFloat(r.value); if (isNaN(x)) return true;
    return r.op === ">" ? v > x : r.op === "<" ? v < x : r.op === ">=" ? v >= x : r.op === "<=" ? v <= x : v === x;
  }
  if (f.type === "date") {
    if (!v) return true; const d = new Date(v);
    if (r.op === "between") {
      if (r.value && d < new Date(r.value)) return false;
      if (r.value2 && d > new Date(r.value2)) return false;
      return true;
    }
    if (!r.value) return true; const t = new Date(r.value);
    return r.op === "before" ? d < t : r.op === "after" ? d > t : v === r.value;
  }
  if (f.type === "enum") {
    if (!r.value) return true;
    return r.op === "isnot" ? v !== r.value : v === r.value;
  }
  if (!r.value) return true;
  const hay = String(v || "").toLowerCase(), needle = String(r.value).toLowerCase();
  return r.op === "eq" ? hay === needle : hay.includes(needle);
}
function evalFilter(c, rules, conns) {
  const active = [];
  for (let i = 0; i < rules.length; i++) if (isRuleActive(rules[i])) active.push({ r: rules[i], c: i > 0 ? conns[i - 1] : null });
  if (active.length === 0) return true;
  let groups = [[active[0].r]];
  for (let i = 1; i < active.length; i++) {
    if (active[i].c === "or") groups.push([active[i].r]);
    else groups[groups.length - 1].push(active[i].r);
  }
  return groups.some(g => g.every(r => evalRule(c, r)));
}
function ruleSummary(r) {
  const f = FIELD_BY_ID[r.field]; if (!f) return "";
  const optLabel = (val) => { const o = normOpts(f).find(x => x.v === val); return o ? o.l : val; };
  let val;
  if (f.type === "enum") val = optLabel(r.value);
  else if (r.op === "between") val = `${r.value || "…"} – ${r.value2 || "…"}${f.unit ? " " + f.unit : ""}`;
  else val = `${r.value}${f.unit ? " " + f.unit : ""}`;
  return `${f.label} · ${OP_LABEL[r.op]} ${val}`;
}

// ============== Grouped field picker (the "Chọn chỉ số" tree) ==============
function FieldPicker({ value, onPick, autoOpen }) {
  const [open, setOpen] = useState(!!autoOpen);
  const [q, setQ] = useState("");
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const h = e => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setQ(""); } };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);
  const f = value ? FIELD_BY_ID[value] : null;
  const kw = q.trim().toLowerCase();
  return (
    <div className="relative flex-1 min-w-[220px]" ref={ref}>
      <button onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center gap-2 h-10 px-2.5 rounded-lg bg-white text-left ring-1 transition-all
          ${open ? "ring-2 ring-vnd-primary-500" : f ? "ring-outline-variant/60 hover:ring-outline" : "ring-outline-variant/60 hover:ring-outline"}`}>
        {f
          ? <span className="w-7 h-7 rounded-md bg-vnd-primary-50 text-vnd-primary-600 flex items-center justify-center shrink-0"><Icon name={f.groupIcon} size={15} /></span>
          : <span className="w-7 h-7 rounded-md bg-surface-container-high text-on-surface-variant flex items-center justify-center shrink-0"><Icon name="search" size={15} /></span>}
        <span className="flex-1 min-w-0">
          {f
            ? <><span className="block text-[9.5px] uppercase tracking-wide text-on-surface-variant font-semibold leading-none mb-0.5">{f.group}</span>
                <span className="block text-[13px] font-semibold text-on-surface truncate leading-tight">{f.label}</span></>
            : <span className="text-[13px] text-on-surface-variant/80">Chọn chỉ số để lọc…</span>}
        </span>
        <Icon name="expand_more" size={17} className={`text-on-surface-variant transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute z-50 mt-2 left-0 w-[340px] max-w-[92vw] rounded-2xl bg-white shadow-lift ring-1 ring-outline-variant/40 overflow-hidden">
          <div className="p-2.5 border-b border-outline-variant/30">
            <span className="flex items-center gap-2 h-9 px-2.5 rounded-lg bg-surface-container-low ring-1 ring-outline-variant/30 focus-within:ring-2 focus-within:ring-vnd-primary-500">
              <Icon name="search" size={16} className="text-on-surface-variant" />
              <input value={q} autoFocus onChange={e => setQ(e.target.value)} placeholder="Tìm chỉ số…"
                className="no-focus-box flex-1 min-w-0 bg-transparent text-[13px] outline-none border-0 placeholder:text-on-surface-variant/60" />
            </span>
          </div>
          <div className="max-h-[300px] overflow-y-auto scrollbar-thin p-1.5">
            {FILTER_GROUPS.map(g => {
              const items = g.fields.filter(fi => !kw || fi.label.toLowerCase().includes(kw));
              if (items.length === 0) return null;
              return (
                <div key={g.id} className="mb-1.5 last:mb-0">
                  <div className="flex items-center gap-1.5 px-2.5 pt-2 pb-1 text-[10.5px] uppercase tracking-wider font-bold text-on-surface-variant">
                    <Icon name={g.icon} size={13} /> {g.label}
                  </div>
                  <ul>
                    {items.map(fi => {
                      const sel = fi.id === value;
                      return (
                        <li key={fi.id}>
                          <button onClick={() => { onPick(fi.id); setOpen(false); setQ(""); }}
                            className={`w-full flex items-center justify-between gap-2 pl-7 pr-2.5 py-2 rounded-lg text-left transition-colors ${sel ? "bg-vnd-primary-50 text-vnd-primary-700" : "hover:bg-surface-container-low text-on-surface"}`}>
                            <span className="text-[13.5px]">{fi.label}</span>
                            {sel && <Icon name="check" size={16} className="text-vnd-primary-600" />}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}
            {FILTER_GROUPS.every(g => g.fields.every(fi => kw && !fi.label.toLowerCase().includes(kw))) && (
              <p className="px-3 py-6 text-center text-[12.5px] text-on-surface-variant">Không tìm thấy chỉ số phù hợp.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ============== Styled native <select> ==============
function Select({ value, onChange, children, className = "", placeholder }) {
  return (
    <span className={`relative inline-flex items-center ${className}`}>
      <select value={value || ""} onChange={e => onChange(e.target.value)}
        className="appearance-none w-full h-10 pl-2.5 pr-8 rounded-lg bg-white ring-1 ring-outline-variant/60 text-[13px] text-on-surface hover:ring-outline focus:ring-2 focus:ring-vnd-primary-500 focus:outline-none transition-all">
        {placeholder && <option value="" disabled>{placeholder}</option>}
        {children}
      </select>
      <Icon name="expand_more" size={16} className="absolute right-2.5 text-on-surface-variant pointer-events-none" />
    </span>
  );
}

// ============== Value control (varies by field type + operator) ==============
function ValueControl({ rule, onChange }) {
  const f = FIELD_BY_ID[rule.field];
  const set = (patch) => onChange({ ...rule, ...patch });
  const inputCls = "h-10 w-full rounded-lg bg-white ring-1 ring-outline-variant/60 px-2.5 text-[13px] hover:ring-outline focus:ring-2 focus:ring-vnd-primary-500 focus:outline-none transition-all placeholder:text-on-surface-variant/60";

  if (f.type === "enum") {
    return (
      <Select value={rule.value} onChange={v => set({ value: v })} placeholder="Chọn giá trị" className="flex-1 min-w-[180px]">
        {normOpts(f).map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
      </Select>
    );
  }
  if (f.type === "text") {
    return <input value={rule.value} onChange={e => set({ value: e.target.value })} placeholder="Nhập giá trị…" className={`flex-1 min-w-[180px] ${inputCls}`} />;
  }
  if (f.type === "date") {
    if (rule.op === "between") {
      return (
        <span className="flex-1 min-w-[260px] flex items-center gap-1.5">
          <input type="date" value={rule.value} onChange={e => set({ value: e.target.value })} className={inputCls} />
          <Icon name="arrow_forward" size={16} className="text-on-surface-variant shrink-0" />
          <input type="date" value={rule.value2} onChange={e => set({ value2: e.target.value })} className={inputCls} />
        </span>
      );
    }
    return <input type="date" value={rule.value} onChange={e => set({ value: e.target.value })} className={`flex-1 min-w-[180px] ${inputCls}`} />;
  }
  // number
  const unit = f.unit ? <span className="text-[13px] text-on-surface-variant font-medium shrink-0 w-10">{f.unit}</span> : null;
  if (rule.op === "between") {
    return (
      <span className="flex-1 min-w-[240px] flex items-center gap-1.5">
        <input type="number" inputMode="decimal" value={rule.value} onChange={e => set({ value: e.target.value })} placeholder="Từ" className={inputCls} />
        <Icon name="arrow_forward" size={16} className="text-on-surface-variant shrink-0" />
        <input type="number" inputMode="decimal" value={rule.value2} onChange={e => set({ value2: e.target.value })} placeholder="Đến" className={inputCls} />
        {unit}
      </span>
    );
  }
  return (
    <span className="flex-1 min-w-[180px] flex items-center gap-2">
      <input type="number" inputMode="decimal" value={rule.value} onChange={e => set({ value: e.target.value })} placeholder="Nhập giá trị" className={inputCls} />
      {unit}
    </span>
  );
}

// ============== Per-condition kebab menu (⋮) ==============
function RuleMenu({ onDuplicate, onRemove }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);
  return (
    <div className="relative shrink-0" ref={ref}>
      <button onClick={() => setOpen(o => !o)} title="Tuỳ chọn"
        className="w-7 h-7 rounded-lg text-on-surface-variant hover:bg-surface-container-high flex items-center justify-center">
        <Icon name="more_vert" size={17} />
      </button>
      {open && (
        <div className="absolute z-50 mt-1 right-0 w-[190px] rounded-xl bg-white shadow-lift ring-1 ring-outline-variant/40 p-1.5">
          <button onClick={() => { onDuplicate(); setOpen(false); }}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-surface-container-low text-left text-[13px] text-on-surface transition-colors">
            <Icon name="content_copy" size={16} className="text-on-surface-variant" /> Nhân đôi điều kiện
          </button>
          <button onClick={() => { onRemove(); setOpen(false); }}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-red-50 hover:text-red-600 text-left text-[13px] text-on-surface transition-colors">
            <Icon name="delete" size={16} className="text-on-surface-variant" /> Xoá điều kiện
          </button>
        </div>
      )}
    </div>
  );
}

// ============== One condition card ("N. Tên chỉ số") ==============
function RuleRow({ index, rule, onChange, onRemove, onDuplicate, autoOpen }) {
  const f = rule.field ? FIELD_BY_ID[rule.field] : null;
  return (
    <div className="rounded-xl ring-1 ring-outline-variant/40 bg-surface-container-low/40 p-3">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[13px] font-semibold text-on-surface">{index + 1}. Tên chỉ số</p>
        <RuleMenu onDuplicate={onDuplicate} onRemove={onRemove} />
      </div>
      <FieldPicker value={rule.field} autoOpen={autoOpen} onPick={fid => onChange(setField(rule, fid))} />
      {f && (
        <div className="grid grid-cols-[150px_1fr] gap-2.5 mt-2.5">
          <div>
            <label className="block text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-1">Điều kiện</label>
            <Select value={rule.op} onChange={op => onChange({ ...rule, op, value: "", value2: "" })} className="w-full">
              {OPS[f.type].map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
            </Select>
          </div>
          <div className="min-w-0">
            <label className="block text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-1">Giá trị</label>
            <div className="flex items-center w-full">
              <ValueControl rule={rule} onChange={onChange} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============== Connector (Và / Hoặc) — centered, clickable ==============
function Connector({ value, onChange }) {
  const isOr = value === "or";
  return (
    <div className="flex items-center gap-3 py-1.5">
      <span className="h-px flex-1 bg-outline-variant/40"></span>
      <button onClick={() => onChange(isOr ? "and" : "or")} title="Đổi cách kết hợp"
        className="inline-flex items-center gap-1.5 h-6 px-2.5 rounded-full text-[11.5px] font-bold tracking-wide text-vnd-primary-700 ring-1 ring-vnd-primary-200 bg-vnd-primary-50 hover:bg-vnd-primary-100 transition-colors">
        {isOr ? "Hoặc" : "Và"}
        <Icon name="swap_horiz" size={13} className="opacity-60" />
      </button>
      <span className="h-px flex-1 bg-outline-variant/40"></span>
    </div>
  );
}

// ============== MAIN: trigger button + modal (chips rendered separately) ==============
function AdvancedFilter({ value, onChange, open: openProp, onOpenChange, hideTrigger }) {
  const committed = value || { rules: [], conns: [] };
  const isControlled = openProp !== undefined;
  const [openState, setOpenState] = useState(false);
  const open = isControlled ? openProp : openState;
  const setOpen = (v) => {
    const next = typeof v === "function" ? v(open) : v;
    if (isControlled) onOpenChange?.(next); else setOpenState(next);
  };
  const [rules, setRules] = useState(committed.rules);
  const [conns, setConns] = useState(committed.conns);
  const [autoOpenId, setAutoOpenId] = useState(null);

  // Seed the draft from the committed value whenever the modal opens.
  useEffect(() => {
    if (!open) return;
    setRules(committed.rules.length ? committed.rules.map(r => ({ ...r })) : [newRule()]);
    setConns([...committed.conns]);
    setAutoOpenId(committed.rules.length ? null : "first");
  }, [open]);

  const openModal = () => setOpen(true);
  const addRule = () => { const r = newRule(); setRules(rs => [...rs, r]); setConns(cs => [...cs, "and"]); setAutoOpenId(r.id); };
  const updRule = (i, r) => setRules(rs => rs.map((x, j) => j === i ? r : x));
  const delRule = (i) => {
    setRules(rs => rs.filter((_, j) => j !== i));
    setConns(cs => { const k = i === 0 ? 0 : i - 1; return cs.filter((_, j) => j !== k); });
  };
  const setConn = (i, v) => setConns(cs => cs.map((x, j) => j === i ? v : x));
  const dupRule = (i) => {
    const copy = { ...rules[i], id: newRule().id };
    setRules(rs => { const out = rs.slice(); out.splice(i + 1, 0, copy); return out; });
    setConns(cs => { const out = cs.slice(); out.splice(i, 0, "and"); return out; });
  };
  const clearDraft = () => { setRules([newRule()]); setConns([]); setAutoOpenId("first"); };
  const turnOff = () => { onChange({ rules: [], conns: [] }); setOpen(false); };

  const apply = () => {
    const keep = [];
    const keepConns = [];
    rules.forEach((r, i) => {
      if (isRuleActive(r)) { if (keep.length) keepConns.push(conns[i - 1] || "and"); keep.push(r); }
    });
    onChange({ rules: keep, conns: keepConns });
    setOpen(false);
  };
  const activeCount = useMemoCount(committed.rules);

  // toolbar chip remove
  const removeChip = (i) => {
    const keep = committed.rules.filter((_, j) => j !== i);
    const k = i === 0 ? 0 : i - 1;
    const keepConns = committed.conns.filter((_, j) => j !== k);
    onChange({ rules: keep, conns: keepConns });
  };

  const draftActive = rules.filter(isRuleActive).length;

  return (
    <>
      {!hideTrigger && (
        <button onClick={openModal} title="Bộ lọc"
          className={`inline-flex items-center gap-1.5 h-9 px-2.5 rounded-lg text-[12.5px] font-medium ring-1 transition-colors shrink-0
            ${activeCount ? "bg-vnd-primary-50 text-vnd-primary-700 ring-vnd-primary-200" : "bg-white text-on-surface ring-outline-variant/50 hover:bg-surface-container-low"}`}>
          <Icon name="filter_list" size={16} className={activeCount ? "text-vnd-primary-600" : "text-on-surface-variant"} />
          <span className="whitespace-nowrap">Bộ lọc</span>
          {activeCount > 0 && <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-vnd-primary-500 text-white text-[10px] font-bold font-mono">{activeCount}</span>}
        </button>
      )}

      <Modal open={open} onClose={() => setOpen(false)} size="lg"
        title="Bộ lọc nâng cao"
        sub="Kết hợp nhiều điều kiện để thu hẹp danh sách khách hàng."
        footer={
          <div className="w-full flex items-center justify-end gap-2">
            <Button tone="outline" size="sm" icon="filter_alt_off" onClick={turnOff}>Tắt bộ lọc</Button>
            <Button tone="outline" size="sm" icon="delete_sweep" onClick={clearDraft}>Xóa tất cả</Button>
            <Button tone="primary" size="sm" icon="check" onClick={apply}>
              Áp dụng{draftActive ? ` · ${draftActive}` : ""}
            </Button>
          </div>
        }>
        <div className="space-y-0">
          {rules.length === 0 && (
            <div className="flex flex-col items-center text-center py-10">
              <span className="w-14 h-14 rounded-2xl bg-surface-container-high text-on-surface-variant flex items-center justify-center mb-3"><Icon name="filter_alt" size={26} /></span>
              <p className="font-display text-title-md text-vnd-primary-900">Chưa có điều kiện nào</p>
              <p className="text-[13px] text-on-surface-variant mt-1 mb-4 max-w-xs">Thêm điều kiện đầu tiên để bắt đầu lọc theo chỉ số.</p>
              <Button tone="primary" size="md" icon="add" onClick={addRule}>Thêm điều kiện</Button>
            </div>
          )}
          {rules.map((r, i) => (
            <div key={r.id}>
              {i > 0 && <Connector value={conns[i - 1] || "and"} onChange={v => setConn(i - 1, v)} />}
              <RuleRow index={i} rule={r} autoOpen={autoOpenId === r.id || (autoOpenId === "first" && i === 0)}
                onChange={(nr) => updRule(i, nr)} onRemove={() => delRule(i)} onDuplicate={() => dupRule(i)} />
            </div>
          ))}
          {rules.length > 0 && (
            <button onClick={addRule}
              className="mt-2.5 w-full h-10 rounded-xl border border-dashed border-outline-variant text-on-surface-variant hover:border-vnd-primary-400 hover:text-vnd-primary-700 hover:bg-vnd-primary-50/40 flex items-center justify-center gap-2 text-[13px] font-medium transition-colors">
              <Icon name="add" size={17} /> Thêm điều kiện
            </button>
          )}
        </div>
      </Modal>
    </>
  );
}

// tiny helper so we don't import useMemo into this file's destructure
function useMemoCount(rules) { return rules.filter(isRuleActive).length; }

// Advanced-filter condition chips — rendered separately so they can sit
// beside the search box and grow rightward, independent of the trigger button.
function AdvancedFilterChips({ value, onChange, onEdit }) {
  const committed = value || { rules: [], conns: [] };
  const removeChip = (i) => {
    const keep = committed.rules.filter((_, j) => j !== i);
    const k = i === 0 ? 0 : i - 1;
    const keepConns = committed.conns.filter((_, j) => j !== k);
    onChange({ rules: keep, conns: keepConns });
  };
  return (
    <>
      {committed.rules.map((r, i) => (
        <span key={r.id || i} className="inline-flex items-center gap-1 h-9 pl-2 pr-1 rounded-lg bg-white ring-1 ring-vnd-primary-200 text-vnd-primary-700 text-[12px] shrink-0">
          {i > 0 && <span className="text-[10px] font-bold text-on-surface-variant mr-0.5">{committed.conns[i - 1] === "or" ? "HOẶC" : "VÀ"}</span>}
          <Icon name="filter_alt" size={13} className="text-vnd-primary-600" filled />
          <button onClick={onEdit} className="font-medium whitespace-nowrap max-w-[200px] truncate">{ruleSummary(r)}</button>
          <button onClick={() => removeChip(i)} title="Xoá" className="w-5 h-5 rounded hover:bg-vnd-primary-100 flex items-center justify-center shrink-0"><Icon name="close" size={12} /></button>
        </span>
      ))}
    </>
  );
}

// ============================================================
// QUICK FILTERS — one-click presets, user-customisable (US7)
// System-allowed catalogue · max N pinned · saved per user.
// ============================================================
const QUICK_FILTERS = [
  { id: "vip",        label: "Khách VIP",          icon: "diamond",         test: c => c.segment === "Private Wealth" },
  { id: "alert",      label: "Cảnh báo đỏ",        icon: "error",           test: c => c.nac === "alert" },
  { id: "watch",      label: "Cần theo dõi",       icon: "visibility",      test: c => c.nac === "watch" },
  { id: "incomplete", label: "Hồ sơ chưa đủ",      icon: "assignment_late", test: c => c.completeness < 80 },
  { id: "stale",      label: "Lâu chưa chăm sóc",  icon: "history",         test: c => c.lastDays > 30 },
  { id: "highCash",   label: "Nhiều tiền mặt",     icon: "savings",         test: c => c.cashPct > 40 },
  { id: "negPnl",     label: "P&L âm",             icon: "trending_down",   test: c => c.pnlYtd < 0 },
  { id: "daily",      label: "Nhịp hằng ngày",     icon: "event_repeat",    test: c => (c.cadence || "").startsWith("P1") },
  { id: "newClient",  label: "Khách hàng mới",     icon: "fiber_new",       test: c => c.journey === "start" }
];
const QUICK_BY_ID = Object.fromEntries(QUICK_FILTERS.map(f => [f.id, f]));
const QUICK_MAX = 5;
const QUICK_DEFAULT = ["vip", "alert", "incomplete", "stale"];
function evalQuick(c, activeIds) {
  for (const id of activeIds) { const f = QUICK_BY_ID[id]; if (f && !f.test(c)) return false; }
  return true;
}

// ── CONCEPT: "Lọc nhanh" reads as a sibling of the search box ──────────────
// One compact dropdown trigger (same height / radius / ring as the search
// field) replaces the old row of bright pills. Applied presets surface as
// quiet removable chips on the same toolbar line — no second row, no pinning,
// minimal chrome so attention stays on the search field.
function QuickFilterControl({ active, onToggle, onClear }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);
  const count = active.size;
  const isActive = count > 0;
  return (
    <div className="relative shrink-0" ref={ref}>
      <button onClick={() => setOpen(o => !o)} title="Bộ lọc nhanh"
        className={`inline-flex items-center gap-1 h-9 pl-2 pr-1.5 rounded-lg text-[12.5px] font-medium ring-1 transition-colors
          ${isActive || open
            ? "bg-vnd-primary-50 text-vnd-primary-700 ring-vnd-primary-200"
            : "bg-white text-on-surface ring-outline-variant/50 hover:bg-surface-container-low"}`}>
        <Icon name="bolt" size={15} className={isActive ? "text-vnd-primary-600" : "text-on-surface-variant"} filled={isActive} />
        <span className="whitespace-nowrap">Lọc nhanh</span>
        {isActive && <span className="inline-flex items-center justify-center min-w-[16px] h-[16px] px-1 rounded-full bg-vnd-primary-500 text-white text-[10px] font-bold font-mono">{count}</span>}
        <Icon name="expand_more" size={15} className={`transition-transform ${open ? "rotate-180" : ""} ${isActive ? "text-vnd-primary-600" : "text-on-surface-variant"}`} />
      </button>
      {open && (
        <div className="absolute z-40 mt-2 left-0 w-[256px] rounded-2xl bg-white shadow-lift ring-1 ring-outline-variant/40 p-1.5 animate-fade-in">
          <div className="flex items-center justify-between px-2.5 pt-1.5 pb-1">
            <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Bộ lọc nhanh</p>
            {isActive && <button onClick={onClear} className="text-[11px] font-semibold text-vnd-primary-700 hover:underline">Xoá ({count})</button>}
          </div>
          <ul className="space-y-0.5 max-h-[320px] overflow-y-auto scrollbar-thin">
            {QUICK_FILTERS.map(f => {
              const on = active.has(f.id);
              return (
                <li key={f.id}>
                  <button onClick={() => onToggle(f.id)}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors ${on ? "bg-vnd-primary-50" : "hover:bg-surface-container-low"}`}>
                    <span className={`w-4 h-4 rounded flex items-center justify-center ring-1 shrink-0 ${on ? "bg-vnd-primary-500 ring-vnd-primary-500" : "ring-outline-variant"}`}>
                      {on && <Icon name="check" size={12} className="text-white" />}
                    </span>
                    <Icon name={f.icon} size={16} className={`shrink-0 ${on ? "text-vnd-primary-600" : "text-on-surface-variant"}`} filled={on} />
                    <span className="text-[13px] text-on-surface flex-1">{f.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

// Applied quick-filter presets as quiet, removable chips (toolbar-inline).
function QuickFilterChips({ active, onToggle }) {
  if (!active || !active.size) return null;
  return (
    <>
      {[...active].map(id => {
        const f = QUICK_BY_ID[id];
        if (!f) return null;
        return (
          <span key={id} className="inline-flex items-center gap-1 h-9 pl-2 pr-1 rounded-lg bg-vnd-primary-50 text-vnd-primary-700 ring-1 ring-vnd-primary-200 text-[12px] font-medium shrink-0">
            <Icon name={f.icon} size={13} className="text-vnd-primary-600" filled />
            <span className="whitespace-nowrap">{f.label}</span>
            <button onClick={() => onToggle(id)} title={`Bỏ ${f.label}`} className="w-5 h-5 rounded hover:bg-vnd-primary-100 flex items-center justify-center"><Icon name="close" size={12} /></button>
          </span>
        );
      })}
    </>
  );
}

// ============================================================
// NOTION-STYLE FILTER — single "+ Bộ lọc" entry point.
// Click → popover "Lọc theo…" (searchable, grouped field list).
// Pick a field → inline condition editor (Điều kiện + Giá trị + Áp dụng).
// Footer "Thêm bộ lọc nâng cao" → opens the full multi-condition modal.
// Applied conditions become removable chips on the toolbar.
// ============================================================
const FIELD_TYPE_ICON = { number: "tag", date: "calendar_today", enum: "list", text: "text_fields" };

// Compact VÀ / HOẶC connector toggle (used between conditions in the overview).
function ConnMini({ value, onChange }) {
  return (
    <div className="flex items-center gap-2 py-1 pl-2.5">
      <span className="w-px h-3 bg-outline-variant/60"></span>
      <div className="inline-flex items-center rounded-md bg-surface-container-high p-0.5 ring-1 ring-outline-variant/40">
        {[{ v: "and", l: "VÀ" }, { v: "or", l: "HOẶC" }].map(o => (
          <button key={o.v} onClick={() => onChange(o.v)}
            className={`h-5 px-2 rounded text-[10.5px] font-bold tracking-wide transition-all ${value === o.v ? "bg-white text-vnd-primary-700 shadow-sm" : "text-on-surface-variant hover:text-on-surface"}`}>
            {o.l}
          </button>
        ))}
      </div>
      <span className="text-[10.5px] text-on-surface-variant">{value === "or" ? "khớp một trong hai" : "thoả cả hai"}</span>
    </div>
  );
}

function NotionFilter({ value, onChange, onOpenAdvanced }) {
  const committed = value || { rules: [], conns: [] };
  const [open, setOpen] = useState(false);
  const [view, setView] = useState("overview");  // overview | fields | editor
  const [q, setQ] = useState("");
  const [draft, setDraft] = useState(null);       // a single rule being built/edited
  const [draftIdx, setDraftIdx] = useState(-1);   // -1 = new, else index of edited rule
  const ref = useRef(null);

  const reset = () => { setView("overview"); setQ(""); setDraft(null); setDraftIdx(-1); };
  useEffect(() => {
    if (!open) return;
    const h = e => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); reset(); } };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  const activeCount = committed.rules.filter(isRuleActive).length;
  const isActive = activeCount > 0;
  const kw = q.trim().toLowerCase();

  const togglePopover = () => setOpen(o => {
    const next = !o;
    if (next) { setQ(""); setDraft(null); setDraftIdx(-1); setView(committed.rules.length ? "overview" : "fields"); }
    return next;
  });

  const startAdd = () => { setView("fields"); setQ(""); setDraft(null); setDraftIdx(-1); };
  const pickField = (fid) => {
    setDraft(d => (draftIdx >= 0 && d) ? setField(d, fid) : setField(newRule(), fid));
    setView("editor");
  };
  const startEdit = (i) => { setDraft({ ...committed.rules[i] }); setDraftIdx(i); setView("editor"); };
  const applyDraft = () => {
    if (!draft || !isRuleActive(draft)) return;
    let rules, conns;
    if (draftIdx >= 0) {
      rules = committed.rules.map((r, j) => j === draftIdx ? draft : r);
      conns = [...committed.conns];
    } else {
      rules = [...committed.rules, draft];
      conns = committed.rules.length ? [...committed.conns, "and"] : [];
    }
    onChange({ rules, conns });
    setDraft(null); setDraftIdx(-1); setQ(""); setView("overview");
  };
  const removeRule = (i) => {
    const rules = committed.rules.filter((_, j) => j !== i);
    const k = i === 0 ? 0 : i - 1;
    const conns = committed.conns.filter((_, j) => j !== k);
    onChange({ rules, conns });
    if (rules.length === 0) setView("fields");
  };
  const setConn = (i, v) => onChange({ rules: committed.rules, conns: committed.conns.map((c, j) => j === i ? v : c) });
  const openAdvanced = () => { setOpen(false); reset(); onOpenAdvanced && onOpenAdvanced(); };

  const f = draft ? FIELD_BY_ID[draft.field] : null;
  const hasRules = committed.rules.length > 0;

  return (
    <div className="relative shrink-0" ref={ref}>
      <button onClick={togglePopover} title="Bộ lọc"
        className={`inline-flex items-center gap-1.5 h-9 px-2.5 rounded-lg text-[12.5px] font-medium ring-1 transition-colors
          ${isActive || open
            ? "bg-vnd-primary-50 text-vnd-primary-700 ring-vnd-primary-200"
            : "bg-white text-on-surface ring-outline-variant/50 hover:bg-surface-container-low"}`}>
        <Icon name="filter_list" size={16} className={isActive ? "text-vnd-primary-600" : "text-on-surface-variant"} />
        <span className="whitespace-nowrap">Bộ lọc</span>
        {isActive && <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-vnd-primary-500 text-white text-[10px] font-bold font-mono">{activeCount}</span>}
      </button>

      {open && (
        <div className="absolute z-40 mt-2 left-0 w-[330px] max-w-[92vw] rounded-2xl bg-white shadow-lift ring-1 ring-outline-variant/40 overflow-hidden animate-fade-in">

          {/* ---------- OVERVIEW: applied conditions with AND/OR connectors ---------- */}
          {view === "overview" && (
            <>
              <div className="p-2.5 max-h-[320px] overflow-y-auto scrollbar-thin">
                <p className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant px-1 pb-1.5">Điều kiện lọc</p>
                {committed.rules.map((r, i) => (
                  <div key={r.id || i}>
                    {i > 0 && <ConnMini value={committed.conns[i - 1] || "and"} onChange={v => setConn(i - 1, v)} />}
                    <div className="flex items-center gap-1 rounded-lg ring-1 ring-outline-variant/40 bg-surface-container-low/50 hover:ring-vnd-primary-200 transition-colors">
                      <button onClick={() => startEdit(i)} className="flex items-center gap-2 flex-1 min-w-0 px-2.5 py-2 text-left">
                        <Icon name="filter_alt" size={14} className="text-vnd-primary-600 shrink-0" filled />
                        <span className="text-[12.5px] text-on-surface truncate">{ruleSummary(r) || "Điều kiện chưa hoàn tất"}</span>
                      </button>
                      <button onClick={() => removeRule(i)} title="Xoá điều kiện" className="w-8 h-8 mr-0.5 rounded-md text-on-surface-variant hover:bg-red-50 hover:text-red-600 flex items-center justify-center shrink-0"><Icon name="close" size={15} /></button>
                    </div>
                  </div>
                ))}
                <button onClick={startAdd}
                  className="mt-2 w-full flex items-center justify-center gap-1.5 h-9 rounded-lg border border-dashed border-outline-variant text-on-surface-variant hover:border-vnd-primary-400 hover:text-vnd-primary-700 hover:bg-vnd-primary-50/40 text-[12.5px] font-medium transition-colors">
                  <Icon name="add" size={16} /> Thêm điều kiện
                </button>
              </div>
              <div className="border-t border-outline-variant/30 p-1.5">
                <button onClick={openAdvanced}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-surface-container-low text-left transition-colors text-on-surface">
                  <Icon name="tune" size={16} className="text-on-surface-variant shrink-0" />
                  <span className="text-[13px]">Mở bộ lọc nâng cao</span>
                </button>
              </div>
            </>
          )}

          {/* ---------- FIELDS: searchable grouped field picker ---------- */}
          {view === "fields" && (
            <>
              <div className="p-2.5 border-b border-outline-variant/30 flex items-center gap-2">
                {hasRules && (
                  <button onClick={() => setView("overview")} title="Quay lại" className="w-8 h-9 rounded-lg hover:bg-surface-container-low text-on-surface-variant flex items-center justify-center shrink-0"><Icon name="arrow_back" size={17} /></button>
                )}
                <span className="flex items-center gap-2 flex-1 h-9 px-2.5 rounded-lg bg-surface-container-low ring-1 ring-outline-variant/40 focus-within:ring-2 focus-within:ring-vnd-primary-500">
                  <Icon name="search" size={16} className="text-on-surface-variant" />
                  <input value={q} autoFocus onChange={e => setQ(e.target.value)} placeholder="Lọc theo…"
                    className="no-focus-box flex-1 min-w-0 bg-transparent text-[13px] outline-none border-0 placeholder:text-on-surface-variant/60" />
                </span>
              </div>
              <div className="max-h-[300px] overflow-y-auto scrollbar-thin p-1.5">
                {FILTER_GROUPS.map(g => {
                  const items = g.fields.filter(fi => !kw || fi.label.toLowerCase().includes(kw));
                  if (items.length === 0) return null;
                  return (
                    <div key={g.id} className="mb-1 last:mb-0">
                      <div className="flex items-center gap-1.5 px-2.5 pt-2 pb-1 text-[10px] uppercase tracking-wider font-bold text-on-surface-variant">
                        <Icon name={g.icon} size={13} /> {g.label}
                      </div>
                      <ul>
                        {items.map(fi => (
                          <li key={fi.id}>
                            <button onClick={() => pickField(fi.id)}
                              className="w-full flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-surface-container-low text-left transition-colors">
                              <Icon name={FIELD_TYPE_ICON[fi.type] || "tag"} size={15} className="text-on-surface-variant shrink-0" />
                              <span className="text-[13px] text-on-surface">{fi.label}</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
                {FILTER_GROUPS.every(g => g.fields.every(fi => kw && !fi.label.toLowerCase().includes(kw))) && (
                  <p className="px-3 py-6 text-center text-[12.5px] text-on-surface-variant">Không tìm thấy trường phù hợp.</p>
                )}
              </div>
              <div className="border-t border-outline-variant/30 p-1.5">
                <button onClick={openAdvanced}
                  className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-surface-container-low text-left transition-colors text-on-surface">
                  <Icon name="tune" size={16} className="text-on-surface-variant shrink-0" />
                  <span className="text-[13px]">Mở bộ lọc nâng cao</span>
                </button>
              </div>
            </>
          )}

          {/* ---------- EDITOR: operator + value for the picked field ---------- */}
          {view === "editor" && f && (
            <div className="p-3">
              <button onClick={() => setView("fields")} className="flex items-center gap-1.5 mb-3 text-[12px] text-on-surface-variant hover:text-on-surface">
                <Icon name="arrow_back" size={15} /> Đổi trường
              </button>
              <div className="flex items-center gap-2.5 mb-3.5">
                <span className="w-8 h-8 rounded-lg bg-vnd-primary-50 text-vnd-primary-600 flex items-center justify-center shrink-0"><Icon name={f.groupIcon} size={17} /></span>
                <span className="min-w-0">
                  <span className="block text-[10px] uppercase tracking-wide text-on-surface-variant font-semibold leading-none mb-0.5">{f.group}</span>
                  <span className="block text-[14px] font-semibold text-on-surface truncate leading-tight">{f.label}</span>
                </span>
              </div>
              <label className="block text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-1.5">Điều kiện</label>
              <Select value={draft.op} onChange={op => setDraft({ ...draft, op, value: "", value2: "" })} className="w-full mb-3.5">
                {OPS[f.type].map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
              </Select>
              <label className="block text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-1.5">Giá trị</label>
              <div className="flex items-center gap-2 mb-4">
                <ValueControl rule={draft} onChange={setDraft} />
              </div>
              <Button tone="primary" size="md" icon="check" onClick={applyDraft} disabled={!isRuleActive(draft)} className="w-full justify-center">
                {draftIdx >= 0 ? "Cập nhật điều kiện" : hasRules ? "Thêm điều kiện" : "Áp dụng"}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

Object.assign(window, {
  AdvancedFilter, AdvancedFilterChips, evalFilter, ruleSummary, isRuleActive, FILTER_GROUPS, FIELD_BY_ID,
  QuickFilterControl, QuickFilterChips, QUICK_FILTERS, QUICK_BY_ID, QUICK_MAX, QUICK_DEFAULT, evalQuick,
  NotionFilter
});
