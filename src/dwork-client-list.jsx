/* global React, window */
// ============================================================
// dWork · Client Zone — Active Clients list (Profile view)
// Rebuilt per DSB spec: T0/T-1 context toggle, Smart Views,
// custom filter builder, profile-completeness micro-input,
// journey signals, and inline hover actions.
// ============================================================
const { ACTIVE_CLIENTS: CLIENTS_SEED, JOURNEY, GAP_PROMPTS } = window.DSB_DATA;

const AVATAR_TONES = ["blue", "green", "amber", "purple", "slate", "rose"];
const JOURNEY_BADGE = { slate: "neutral", blue: "blue", green: "green", purple: "purple" };

// --- Client-list display rows: Tên khách hàng · Customer Id · STK giao dịch ---
// Status dot encodes customer type; each row maps to a rich profile (profileId).
const DOT_TONE = {
  amber:  { dot: "bg-amber-500",  label: "Khách hàng cá nhân" },
  purple: { dot: "bg-purple-500", label: "Tổ chức / nội bộ" }
};
const _LIST_RAW = [
  ["ĐỖ THỊ LAN ANH",   "0002052489", "0001833334", "amber"],
  ["chung chung",      "0002052433", "0001833096", "purple"],
  ["Nghiệp Vụ Test",   "0002052383", "0001832961", "purple"],
  ["linhboi",          "0002052338", "0001832845", "amber"],
  ["BÙI THỊ QUỲNH",    "0002052285", "0001832639", "amber"],
  ["TẠ THỊ CHUNG",     "0002052273", "0001832623", "amber"],
  ["TẠ THỊ CHUNG",     "0002052262", "0001832606", "amber"],
  ["BÙI THỊ QUỲNH",    "0002052257", "0001832594", "amber"],
  ["BÙI THỊ QUỲNH",    "0002052256", "0001832591", "amber"],
  ["BÙI THỊ QUỲNH",    "0002052254", "0001832588", "amber"],
  ["TẠ THỊ CHUNG",     "0002052251", "0001832554", "amber"],
  ["TẠ THỊ CHUNG",     "0002052249", "0001832551", "amber"],
  ["BÙI THỊ QUỲNH",    "0002052237", "0001832539", "amber"],
  ["BÙI THỊ QUỲNH",    "0002052234", "0001832536", "amber"],
  ["TẠ THỊ CHUNG",     "0002052231", "0001832532", "amber"],
  ["BÙI THỊ QUỲNH",    "0002052228", "0001832526", "amber"],
  ["NGUYỄN MINH NGỌC", "0002052224", "0001832518", "amber"]
];
const _PROFILE_IDS = CLIENTS_SEED.map(c => c.id);
const _SEGMENTS = ["Private Wealth", "Mass Affluent", "Emerging Affluent"];
const _CITIES = [["Hà Nội", "Cầu Giấy"], ["TP. Hồ Chí Minh", "Quận 1"], ["Hải Phòng", "Lê Chân"], ["Đà Nẵng", "Hải Châu"], ["Hà Nội", "Đống Đa"]];
const _CADENCE = ["P1 · Daily", "P2 · Weekly", "P3 · Bi-weekly"];
const _JKEYS = Object.values(JOURNEY).map(j => j.key);
const initialsOf = (name) => name.trim().split(/\s+/).slice(-2).map(w => (w[0] || "").toUpperCase()).join("") || "KH";
const LIST_SEED = _LIST_RAW.map(([name, customerId, stk, tone], i) => {
  const digits = customerId.replace(/\D/g, "");
  const n = parseInt(digits.slice(-4), 10) || (i + 1);
  const [city, district] = _CITIES[i % _CITIES.length];
  return {
    id: customerId,                                  // Customer Id — shown + used by lookup
    profileId: _PROFILE_IDS[i % _PROFILE_IDS.length], // opens a rich mock profile
    name, stk, tone,
    nvcs: "Môi giới test",
    custody: "06C" + digits.slice(-6),
    cif: "CIF" + digits,
    cccd: "0" + digits + String(100 + (n % 900)),
    phone: "+84 9" + (n % 9) + " " + digits.slice(0, 3) + " " + digits.slice(3, 7),
    email: "kh" + digits.slice(-4) + "@vnds.vn",
    company: "—",
    segment: _SEGMENTS[i % _SEGMENTS.length],
    cadence: _CADENCE[i % _CADENCE.length],
    journey: _JKEYS[i % _JKEYS.length],
    nac: i % 7 === 0 ? "watch" : "none",
    city, district, gender: "—",
    initials: initialsOf(name),
    joinedAt: "Q" + (1 + (i % 4)) + "/202" + (2 + (i % 4)),
    openDate: "202" + (2 + (i % 4)) + "-0" + (1 + (i % 9)) + "-15",
    dob: "19" + (70 + (i % 25)) + "-05-12",
    nav: 200 + (n * 7) % 9000,
    pnlYtd: ((n % 40) - 10) + 0.5,
    pnlToday: ((n % 7) - 3) / 2,
    roi: (n % 20) + 2,
    benchmark: 9.1,
    cashPct: 5 + (n % 70),
    completeness: 40 + (n % 60),
    lastDays: n % 60,
    missing: [],
    flags: { missedCall: false, pendingReply: false },
    owners: ["Hoàng Anh"]
  };
});

// --- (1) TRA CỨU NHANH — full identity lookup, compact wrapping grid ---
// Two "primary" fields stay inline; the rest live in an expandable grid so
// the cluster never spans wider than the viewport.
const LOOKUP_FIELDS = [
  { key: "name",    label: "Tên khách hàng", icon: "person",          ph: "Nguyễn Văn A",   primary: true },
  { key: "id",      label: "Customer Id",    icon: "badge",           ph: "0002052489",    primary: true },
  { key: "custody", label: "Số lưu ký",      icon: "savings",         ph: "06C052489" },
  { key: "stk",     label: "STK giao dịch",  icon: "account_balance", ph: "0001833334" },
  { key: "phone",   label: "Số điện thoại",  icon: "call",            ph: "09xx xxx xxx" },
  { key: "email",   label: "Email",          icon: "mail",            ph: "ten@email.com" },
  { key: "cccd",    label: "Số CCCD/CMND",   icon: "fingerprint",     ph: "0xx xxx xxx xxx" }
];
const LOOKUP_PRIMARY = LOOKUP_FIELDS.filter(f => f.primary);
const LOOKUP_REST = LOOKUP_FIELDS.filter(f => !f.primary);
const LOOKUP_LABELS = {
  ...Object.fromEntries(LOOKUP_FIELDS.map(f => [f.key, f.label])),
  dateFrom: "Từ ngày", dateTo: "Đến ngày"
};
const blankLookup = () => ({ name: "", id: "", custody: "", stk: "", phone: "", email: "", cccd: "", dateFrom: "", dateTo: "" });

// --- (2) FILTER — enum quick-filter pills (multi-select) + advanced numeric conditions ---
const ENUM_FILTERS = [
  { id: "segment", label: "Phân khúc", icon: "diamond", options: [
      { v: "Private Wealth", l: "Private Wealth" },
      { v: "Mass Affluent", l: "Mass Affluent" },
      { v: "Emerging Affluent", l: "Emerging Affluent" } ] },
  { id: "journey", label: "Hành trình", icon: "timeline", options: Object.values(JOURNEY).map(j => ({ v: j.key, l: j.label })) },
  { id: "nac", label: "Cảnh báo", icon: "warning", options: [
      { v: "alert", l: "Đỏ — Khẩn cấp" }, { v: "watch", l: "Vàng — Theo dõi" }, { v: "none", l: "Không cảnh báo" } ] },
  { id: "cadence", label: "Nhịp chăm sóc", icon: "event_repeat", options: [
      { v: "P1 · Daily", l: "P1 · Hằng ngày" }, { v: "P2 · Weekly", l: "P2 · Hằng tuần" }, { v: "P3 · Bi-weekly", l: "P3 · 2 tuần/lần" } ] }
];
const ENUM_BY_ID = Object.fromEntries(ENUM_FILTERS.map(f => [f.id, f]));

const ADV_FIELDS = [
  { id: "nav",          label: "Giá trị tài sản", unit: " tr",  def: "5000" },
  { id: "cashPct",      label: "Tỷ lệ tiền mặt",  unit: "%",    def: "40" },
  { id: "completeness", label: "Độ hoàn thiện hồ sơ", unit: "%", def: "80" },
  { id: "pnlYtd",       label: "P&L YTD",         unit: "%",    def: "0" },
  { id: "lastDays",     label: "Ngày chưa tương tác", unit: " ngày", def: "30" }
];
const ADV_BY_ID = Object.fromEntries(ADV_FIELDS.map(f => [f.id, f]));

function advEval(c, r) {
  const v = c[r.field]; const t = parseFloat(r.value);
  if (isNaN(t)) return true;
  return r.op === ">" ? v > t : r.op === "<" ? v < t : v === t;
}
function advText(r) {
  const f = ADV_BY_ID[r.field] || {};
  return `${f.label} ${r.op} ${r.value}${f.unit || ""}`;
}
const LOOKUP_TEXT_KEYS = ["name", "id", "custody", "stk", "phone", "email", "cccd", "cif"];
function matchSearch(c, q, refine) {
  if (q) {
    const k = q.toLowerCase().trim();
    const hay = [c.name, c.company, c.id, c.phone, c.email, c.cif, c.cccd, c.custody, c.stk].filter(Boolean).join(" ").toLowerCase();
    if (!hay.includes(k)) return false;
  }
  const r = refine || {};
  for (const id of LOOKUP_TEXT_KEYS) {
    const val = (r[id] || "").trim().toLowerCase();
    if (val && !String(c[id] || "").toLowerCase().includes(val)) return false;
  }
  // date range over account open date (openDate = YYYY-MM-DD, lexicographically comparable)
  if (r.dateFrom && c.openDate && c.openDate < r.dateFrom) return false;
  if (r.dateTo && c.openDate && c.openDate > r.dateTo) return false;
  return true;
}
function matchEnums(c, enumSel) {
  for (const id of Object.keys(enumSel)) {
    const set = enumSel[id];
    if (set && set.size && !set.has(c[id])) return false;
  }
  return true;
}
function enumActiveCount(enumSel) {
  return Object.values(enumSel).reduce((n, s) => n + (s && s.size ? 1 : 0), 0);
}

function lastTouchLabel(days) {
  if (days <= 0) return "Hôm nay";
  if (days === 1) return "Hôm qua";
  return `${days} ngày trước`;
}

// ============== T0 / T-1 CONTEXT TOGGLE ==============
function ContextToggle({ mode, onChange }) {
  const opts = [
    { id: "t1", label: "T-1", icon: "event_available" },
    { id: "t0", label: "T0", icon: "bolt" }
  ];
  return (
    <div className="inline-flex items-center rounded-xl bg-surface-container-high p-1 ring-1 ring-outline-variant/40">
      {opts.map(o => {
        const active = mode === o.id;
        const isT0 = o.id === "t0";
        return (
          <button key={o.id} onClick={() => onChange(o.id)}
            className={`relative inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-[13px] font-mono font-bold transition-all
              ${active
                ? isT0 ? "bg-vnd-primary-900 text-white shadow-sm" : "bg-white text-vnd-primary-700 shadow-sm ring-1 ring-vnd-primary-100"
                : "text-on-surface-variant hover:text-on-surface"}`}>
            {isT0 && active
              ? <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-vnd-accent-green opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-vnd-accent-green"></span></span>
              : <Icon name={o.icon} size={16} />}
            <span>{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}

// ============== (1) TRA CỨU NHANH — single compact row + dropdown ==============
// 4 most-used identity fields stay on one line with Tìm kiếm; a dropdown
// reveals the full set (all fields + account-open date range) in a popover,
// so the cluster stays one row tall by default.
const LOOKUP_INLINE_KEYS = ["name", "id", "phone", "stk"];

function LookupField({ f, value, onChange, onKey, compact }) {
  return (
    <label className="flex flex-col gap-1 min-w-0">
      <span className="text-[10.5px] font-semibold text-on-surface-variant truncate">{f.label}</span>
      <span className={`flex items-center gap-2 ${compact ? "h-9" : "h-9"} rounded-lg bg-white ring-1 ring-outline-variant/50 focus-within:ring-2 focus-within:ring-vnd-primary-500 px-2.5 transition-all`}>
        <Icon name={f.icon} size={15} className="text-on-surface-variant shrink-0" />
        <input value={value} onChange={e => onChange(f.key, e.target.value)} onKeyDown={onKey} placeholder={f.ph}
          className="no-focus-box flex-1 min-w-0 bg-transparent text-[13px] border-0 appearance-none outline-none placeholder:text-on-surface-variant/50" />
        {value && (
          <button onClick={() => onChange(f.key, "")} title="Xoá" className="w-5 h-5 rounded hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center shrink-0"><Icon name="close" size={13} /></button>
        )}
      </span>
    </label>
  );
}

function QuickSearchBar({ refine, onApply }) {
  const fromRefine = () => ({ ...blankLookup(), ...Object.fromEntries(Object.keys(blankLookup()).map(k => [k, refine[k] || ""])) });
  const [d, setD] = useState(fromRefine);
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => { setD(fromRefine()); }, [refine.name, refine.id, refine.custody, refine.stk, refine.phone, refine.email, refine.cccd, refine.dateFrom, refine.dateTo]);
  useEffect(() => {
    if (!open) return;
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);

  const set = (k, v) => setD(s => ({ ...s, [k]: v }));
  const trimmed = () => { const o = {}; Object.keys(d).forEach(k => { const v = (d[k] || "").trim(); if (v) o[k] = v; }); return o; };
  const submit = () => { onApply({ q: "", refine: trimmed() }); setOpen(false); };
  const onKey = (e) => { if (e.key === "Enter") submit(); };
  const anyVal = Object.values(d).some(v => (v || "").trim());
  // count criteria living only in the dropdown (not shown inline) → badge
  const hiddenCount = Object.keys(d).filter(k => !LOOKUP_INLINE_KEYS.includes(k) && (d[k] || "").trim()).length;

  const inlineFields = LOOKUP_INLINE_KEYS.map(k => LOOKUP_FIELDS.find(f => f.key === k));

  return (
    <div className="mb-3 relative" ref={ref}>
      <div className="flex items-end gap-2 flex-wrap">
        {inlineFields.map(f => (
          <div key={f.key} className={f.key === "name" ? "flex-[1.6] min-w-[160px]" : "flex-1 min-w-[140px]"}>
            <LookupField f={f} value={d[f.key]} onChange={set} onKey={onKey} />
          </div>
        ))}
        <Button tone="primary" size="md" icon="search" onClick={submit} className="shrink-0 h-9">Tìm kiếm</Button>
        {anyVal && (
          <button onClick={() => { setD(blankLookup()); onApply({ q: "", refine: {} }); }}
            className="inline-flex items-center gap-1 h-9 px-2.5 rounded-lg text-[12px] font-medium text-on-surface-variant hover:text-red-600 hover:bg-red-50 transition-colors shrink-0">
            <Icon name="close" size={15} /> Xoá
          </button>
        )}
      </div>

      {/* dropdown — full set of lookup fields */}
      {open && (
        <div className="absolute z-30 mt-2 left-0 w-full max-w-[760px] rounded-2xl bg-white shadow-lift ring-1 ring-outline-variant/40 p-4 animate-fade-in">
          <p className="text-[11px] uppercase tracking-wider font-bold text-on-surface-variant mb-2.5">Tiêu chí tra cứu khác</p>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-3 gap-y-2.5">
            {LOOKUP_FIELDS.filter(f => !LOOKUP_INLINE_KEYS.includes(f.key)).map(f => (
              <LookupField key={f.key} f={f} value={d[f.key]} onChange={set} onKey={onKey} />
            ))}
            <div className="col-span-2 flex flex-col gap-1 min-w-0">
              <span className="text-[10.5px] font-semibold text-on-surface-variant">Ngày mở TK — từ / đến</span>
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 h-9 flex-1 min-w-0 rounded-lg bg-white ring-1 ring-outline-variant/50 focus-within:ring-2 focus-within:ring-vnd-primary-500 px-2.5">
                  <Icon name="calendar_today" size={14} className="text-on-surface-variant shrink-0" />
                  <input type="date" value={d.dateFrom} onChange={e => set("dateFrom", e.target.value)}
                    className="no-focus-box flex-1 min-w-0 bg-transparent text-[12.5px] border-0 outline-none text-on-surface" />
                </span>
                <span className="text-on-surface-variant text-[13px]">–</span>
                <span className="flex items-center gap-1.5 h-9 flex-1 min-w-0 rounded-lg bg-white ring-1 ring-outline-variant/50 focus-within:ring-2 focus-within:ring-vnd-primary-500 px-2.5">
                  <Icon name="calendar_today" size={14} className="text-on-surface-variant shrink-0" />
                  <input type="date" value={d.dateTo} onChange={e => set("dateTo", e.target.value)}
                    className="no-focus-box flex-1 min-w-0 bg-transparent text-[12.5px] border-0 outline-none text-on-surface" />
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2 mt-4 pt-3 border-t border-outline-variant/30">
            <button onClick={() => setD(blankLookup())} className="inline-flex items-center gap-1 h-9 px-3 rounded-lg text-[12.5px] font-medium text-on-surface-variant hover:bg-surface-container-low transition-colors">
              <Icon name="delete_sweep" size={16} /> Xoá hết
            </button>
            <Button tone="primary" size="sm" icon="search" onClick={submit}>Tìm kiếm</Button>
          </div>
        </div>
      )}
    </div>
  );
}

// Applied search criteria → quiet, removable chips for the "Bộ lọc đang dùng" row.
function SearchCriteriaChips({ refine, onClearRefine }) {
  const items = Object.keys(refine || {})
    .filter(k => (refine[k] || "").trim())
    .map(k => ({ k, label: LOOKUP_LABELS[k] || k, value: refine[k] }));
  return items.map(it => (
    <span key={it.k} className="inline-flex items-center gap-1.5 h-8 pl-2.5 pr-1 rounded-lg bg-white ring-1 ring-outline-variant/60 text-[12px] shrink-0">
      <span className="text-[10px] uppercase tracking-wide font-bold text-on-surface-variant">{it.label}</span>
      <span className="font-mono text-on-surface truncate max-w-[160px]">{it.value}</span>
      <button onClick={() => onClearRefine(it.k)} title={`Bỏ ${it.label}`} className="w-5 h-5 rounded hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center shrink-0"><Icon name="close" size={12} /></button>
    </span>
  ));
}

// ============== (2a) ENUM QUICK-FILTER PILL (multi-select) ==============
function EnumFilterPill({ field, selected, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);
  const set = selected || new Set();
  const count = set.size;
  const active = count > 0;
  const toggle = (v) => {
    const next = new Set(set);
    next.has(v) ? next.delete(v) : next.add(v);
    onChange(next);
  };
  const firstLabel = active ? (field.options.find(o => set.has(o.v)) || {}).l : null;
  return (
    <div className="relative shrink-0" ref={ref}>
      <button onClick={() => setOpen(o => !o)}
        className={`inline-flex items-center gap-1.5 h-9 pl-2.5 pr-2 rounded-lg text-[13px] font-medium transition-colors ring-1
          ${active
            ? "bg-vnd-primary-50 text-vnd-primary-700 ring-vnd-primary-200"
            : "bg-surface-container-high text-on-surface ring-transparent hover:bg-surface-container-highest"}`}>
        <Icon name={field.icon} size={15} className={active ? "text-vnd-primary-600" : "text-on-surface-variant"} />
        <span className="whitespace-nowrap">{field.label}</span>
        {active && (
          <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-vnd-primary-500 text-white text-[10px] font-bold font-mono">{count}</span>
        )}
        <Icon name="expand_more" size={16} className={`transition-transform ${active ? "text-vnd-primary-600" : "text-on-surface-variant"} ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute z-40 mt-2 left-0 w-[240px] rounded-2xl bg-white shadow-lift ring-1 ring-outline-variant/40 p-1.5">
          <div className="flex items-center justify-between px-2.5 pt-1.5 pb-1">
            <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">{field.label}</p>
            {active && <button onClick={() => onChange(new Set())} className="text-[11px] font-semibold text-vnd-primary-700 hover:underline">Xoá</button>}
          </div>
          <ul className="space-y-0.5">
            {field.options.map(o => {
              const on = set.has(o.v);
              return (
                <li key={o.v}>
                  <button onClick={() => toggle(o.v)}
                    className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left transition-colors ${on ? "bg-vnd-primary-50" : "hover:bg-surface-container-low"}`}>
                    <span className={`w-4 h-4 rounded flex items-center justify-center ring-1 ${on ? "bg-vnd-primary-500 ring-vnd-primary-500" : "ring-outline-variant"}`}>
                      {on && <Icon name="check" size={12} className="text-white" />}
                    </span>
                    <span className="text-[13px] text-on-surface">{o.l}</span>
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

// ============== (2b) ADVANCED-FILTER MENU ("+ Bộ lọc nâng cao") ==============
function AdvFilterMenu({ usedFields, onAdd }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);
  const avail = ADV_FIELDS.filter(f => !usedFields.includes(f.id));
  return (
    <div className="relative shrink-0" ref={ref}>
      <button onClick={() => setOpen(o => !o)}
        className="inline-flex items-center gap-1.5 h-9 px-2.5 rounded-lg text-[13px] font-medium ring-1 border border-dashed border-outline-variant bg-surface-container-low/60 text-on-surface-variant ring-transparent hover:border-vnd-primary-300 hover:text-vnd-primary-700 hover:bg-vnd-primary-50/40 transition-colors">
        <Icon name="filter_alt" size={15} />
        <span className="whitespace-nowrap">Bộ lọc nâng cao</span>
        <Icon name="add" size={15} />
      </button>
      {open && (
        <div className="absolute z-40 mt-2 left-0 w-[260px] rounded-2xl bg-white shadow-lift ring-1 ring-outline-variant/40 p-1.5">
          <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold px-2.5 pt-1.5 pb-1">Thêm điều kiện theo trường số</p>
          {avail.length === 0 && <p className="px-2.5 py-3 text-[12px] text-on-surface-variant">Đã thêm tất cả điều kiện.</p>}
          <ul className="space-y-0.5">
            {avail.map(f => (
              <li key={f.id}>
                <button onClick={() => { onAdd({ field: f.id, op: ">", value: f.def }); setOpen(false); }}
                  className="w-full flex items-center justify-between gap-2 px-2.5 py-2 rounded-lg text-left hover:bg-surface-container-low transition-colors">
                  <span className="text-[13px] text-on-surface">{f.label}</span>
                  <span className="text-[11px] font-mono text-on-surface-variant">{f.unit.trim()}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

// ============== (2c) ADVANCED-RULE PILL (field · operator · value) ==============
function AdvRulePill({ rule, onChange, onRemove }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);
  const f = ADV_BY_ID[rule.field];
  return (
    <div className="relative shrink-0" ref={ref}>
      <span className="inline-flex items-center h-9 rounded-lg bg-vnd-primary-50 text-vnd-primary-700 ring-1 ring-vnd-primary-200">
        <button onClick={() => setOpen(o => !o)} className="inline-flex items-center gap-1.5 h-9 pl-2.5 pr-2 rounded-l-lg hover:bg-vnd-primary-100 transition-colors">
          <span className="text-[13px] font-semibold whitespace-nowrap">{f.label}</span>
          <span className="text-[13px] font-mono font-bold">{rule.op}</span>
          <span className="text-[13px] font-mono">{rule.value}{f.unit}</span>
          <Icon name="expand_more" size={15} className={`transition-transform ${open ? "rotate-180" : ""}`} />
        </button>
        <button onClick={onRemove} title="Xoá điều kiện" className="w-7 h-9 rounded-r-lg hover:bg-vnd-primary-100 flex items-center justify-center"><Icon name="close" size={14} /></button>
      </span>
      {open && (
        <div className="absolute z-40 mt-2 left-0 w-[240px] rounded-2xl bg-white shadow-lift ring-1 ring-outline-variant/40 p-3">
          <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold mb-2">{f.label}</p>
          <div className="flex items-center gap-2">
            <select value={rule.op} onChange={e => onChange({ ...rule, op: e.target.value })}
              className="h-9 rounded-lg bg-surface-container-low ring-1 ring-outline-variant/40 px-2 text-[14px] font-mono focus:ring-2 focus:ring-vnd-primary-500 focus:outline-none">
              <option value=">">&gt;</option>
              <option value="<">&lt;</option>
              <option value="=">=</option>
            </select>
            <input type="number" value={rule.value} autoFocus onChange={e => onChange({ ...rule, value: e.target.value })}
              className="h-9 flex-1 w-0 rounded-lg bg-white ring-1 ring-outline-variant/40 px-2.5 text-[13px] font-mono focus:ring-2 focus:ring-vnd-primary-500 focus:outline-none" />
            <span className="text-[12px] text-on-surface-variant shrink-0">{f.unit.trim()}</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ============== (3a) SAVE-CONFIG BUTTON ("Lưu cài đặt bộ lọc") ==============
function SaveConfigButton({ disabled, onSave }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const h = e => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setName(""); } };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);
  const submit = () => { if (name.trim()) { onSave(name.trim()); setOpen(false); setName(""); } };
  return (
    <div className="relative shrink-0" ref={ref}>
      <button disabled={disabled} onClick={() => setOpen(o => !o)}
        className={`inline-flex items-center gap-1.5 h-9 px-2.5 rounded-lg text-[13px] font-semibold transition-colors
          ${disabled ? "text-on-surface-variant/40 cursor-not-allowed" : "text-vnd-primary-700 hover:bg-vnd-primary-50"}`}>
        <Icon name="bookmark_add" size={16} /> Lưu cài đặt bộ lọc
      </button>
      {open && (
        <div className="absolute z-40 mt-2 right-0 w-[300px] rounded-2xl bg-white shadow-lift ring-1 ring-outline-variant/40 p-3.5">
          <p className="text-[13px] font-display font-semibold text-vnd-primary-900 mb-1">Lưu cấu hình tìm kiếm & lọc</p>
          <p className="text-[11.5px] text-on-surface-variant mb-3">Dùng lại nhanh trong các lần làm việc sau.</p>
          <input value={name} autoFocus onChange={e => setName(e.target.value)} onKeyDown={e => { if (e.key === "Enter") submit(); }}
            placeholder="VD: KH VIP Hà Nội cần chăm sóc"
            className="h-9 w-full rounded-lg bg-white ring-1 ring-vnd-primary-200 px-3 text-[13px] focus:ring-2 focus:ring-vnd-primary-500 focus:outline-none mb-3" />
          <div className="flex items-center justify-end gap-2">
            <Button tone="ghost" size="sm" onClick={() => { setOpen(false); setName(""); }}>Huỷ</Button>
            <Button tone="primary" size="sm" icon="check" disabled={!name.trim()} onClick={submit}>Lưu cấu hình</Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ============== (3b) SAVED-CONFIGS MENU ("Cấu hình đã lưu") ==============
function SavedConfigsMenu({ configs, activeId, onApply, onRename, onDelete }) {
  const [open, setOpen] = useState(false);
  const [renaming, setRenaming] = useState(null);
  const [draft, setDraft] = useState("");
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const h = e => { if (ref.current && !ref.current.contains(e.target)) { setOpen(false); setRenaming(null); } };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);
  const active = configs.find(c => c.id === activeId);
  return (
    <div className="relative shrink-0" ref={ref}>
      <button onClick={() => setOpen(o => !o)}
        className={`inline-flex items-center gap-1.5 h-9 pl-2.5 pr-2 rounded-lg text-[13px] font-semibold ring-1 transition-colors
          ${active ? "bg-amber-50 text-amber-800 ring-amber-200" : "bg-white text-on-surface ring-outline-variant/50 hover:bg-surface-container-low"}`}>
        <Icon name="bookmarks" size={16} className={active ? "text-amber-600" : "text-on-surface-variant"} filled={!!active} />
        <span className="whitespace-nowrap max-w-[160px] truncate">{active ? active.name : "Cấu hình đã lưu"}</span>
        <Icon name="expand_more" size={16} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute z-40 mt-2 right-0 w-[320px] rounded-2xl bg-white shadow-lift ring-1 ring-outline-variant/40 p-1.5">
          <div className="px-2.5 pt-1.5 pb-1">
            <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Cấu hình đã lưu</p>
          </div>
          {configs.length === 0 && <p className="px-2.5 py-4 text-[12.5px] text-on-surface-variant text-center">Chưa có cấu hình nào.<br/>Lập bộ lọc rồi chọn “Lưu cài đặt bộ lọc”.</p>}
          <ul className="space-y-0.5 max-h-[320px] overflow-y-auto scrollbar-thin">
            {configs.map(cf => {
              const sel = cf.id === activeId;
              if (renaming === cf.id) {
                return (
                  <li key={cf.id} className="px-1.5 py-1">
                    <div className="flex items-center gap-1.5">
                      <input value={draft} autoFocus onChange={e => setDraft(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter" && draft.trim()) { onRename(cf.id, draft.trim()); setRenaming(null); } if (e.key === "Escape") setRenaming(null); }}
                        className="h-8 flex-1 rounded-lg bg-white ring-1 ring-vnd-primary-300 px-2.5 text-[13px] focus:ring-2 focus:ring-vnd-primary-500 focus:outline-none" />
                      <button onClick={() => { if (draft.trim()) { onRename(cf.id, draft.trim()); setRenaming(null); } }} className="w-8 h-8 rounded-lg bg-vnd-primary-500 text-white flex items-center justify-center"><Icon name="check" size={15} /></button>
                    </div>
                  </li>
                );
              }
              return (
                <li key={cf.id} className="group/cfg">
                  <div className={`flex items-center gap-2 px-2.5 py-2 rounded-lg transition-colors ${sel ? "bg-amber-50 ring-1 ring-amber-200" : "hover:bg-surface-container-low"}`}>
                    <button onClick={() => { onApply(cf.id); setOpen(false); }} className="flex items-center gap-2.5 flex-1 min-w-0 text-left">
                      <span className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${sel ? "bg-amber-400/30 text-amber-700" : "bg-surface-container-high text-on-surface-variant"}`}><Icon name="bookmark" size={15} filled={sel} /></span>
                      <span className="flex-1 min-w-0">
                        <span className="block text-[13px] font-semibold text-on-surface truncate">{cf.name}</span>
                        <span className="block text-[11px] text-on-surface-variant truncate">{cf.summary}</span>
                      </span>
                    </button>
                    <div className="flex items-center gap-0.5 opacity-0 group-hover/cfg:opacity-100 transition-opacity shrink-0">
                      <button onClick={() => { setRenaming(cf.id); setDraft(cf.name); }} title="Đổi tên" className="w-7 h-7 rounded-md hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center"><Icon name="edit" size={14} /></button>
                      <button onClick={() => onDelete(cf.id)} title="Xoá" className="w-7 h-7 rounded-md hover:bg-red-50 text-on-surface-variant hover:text-red-600 flex items-center justify-center"><Icon name="delete" size={14} /></button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

// ============== PROFILE-COMPLETENESS CELL (display only) ==============
function CompletenessCell({ client }) {
  const pct = client.completeness;
  const tone = pct >= 80 ? "emerald" : pct >= 60 ? "amber" : "red";
  const barColor = { emerald: "bg-emerald-500", amber: "bg-amber-500", red: "bg-red-500" }[tone];
  return (
    <div className="flex items-center gap-2">
      <span className={`text-[11.5px] font-mono font-bold w-8 text-right ${tone === "emerald" ? "text-emerald-700" : tone === "amber" ? "text-amber-700" : "text-red-700"}`}>{pct}%</span>
      <div className="w-14 h-1.5 bg-surface-container-high rounded-full overflow-hidden shrink-0">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: pct + "%" }}></div>
      </div>
      {pct === 100 && <Icon name="verified" size={14} className="text-emerald-600 shrink-0" />}
    </div>
  );
}

// ============== MAIN: ACTIVE CLIENTS LIST ==============
function ActiveClients({ onOpen }) {
  const [clients, setClients] = useState(() => LIST_SEED.map(c => ({ ...c, missing: [...c.missing] })));
  const [mode, setMode] = useState("t1");          // t1 = chốt ngày, t0 = real-time
  // (1) Search
  const [q, setQ] = useState("");
  const [refine, setRefine] = useState({});        // exact identity criteria { cccd, cif, phone, email }
  // (2) Filter — advanced condition builder ({ rules, conns })
  const [filter, setFilter] = useState({ rules: [], conns: [] });
  const [advOpen, setAdvOpen] = useState(false);   // advanced-filter modal (controlled, shared with chips)
  // (2b) Quick filters — one-click presets (multi-select)
  const [quickActive, setQuickActive] = useState(new Set());
  // (3) Saved configs
  const [configs, setConfigs] = useState([]);
  const [activeConfig, setActiveConfig] = useState(null);
  const [sortKey, setSortKey] = useState(null);
  const [sortAsc, setSortAsc] = useState(false);
  const [liveClock, setLiveClock] = useState("14:02:46");
  const toast = useToast();

  // simulated live clock in T0
  useEffect(() => {
    if (mode !== "t0") return;
    const tick = () => {
      const d = new Date();
      setLiveClock(d.toLocaleTimeString("vi-VN", { hour12: false }));
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [mode]);

  // "/" focuses the search box (hint shown in the field).
  useEffect(() => {
    const h = (e) => {
      if (e.key === "/" && !/input|textarea|select/i.test((e.target.tagName || ""))) {
        const el = document.getElementById("client-search");
        if (el) { e.preventDefault(); el.focus(); }
      }
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, []);

  const rows = useMemo(() => {
    let list = clients.filter(c =>
      matchSearch(c, q, refine) &&
      evalQuick(c, quickActive) &&
      evalFilter(c, filter.rules, filter.conns)
    );
    if (sortKey) {
      list = list.slice().sort((a, b) => {
        let cmp;
        if (sortKey === "name") {
          cmp = String(a.name).localeCompare(String(b.name), "vi");
        } else if (sortKey === "id" || sortKey === "stk" || sortKey === "nvcs") {
          cmp = String(a[sortKey]).localeCompare(String(b[sortKey]));
        } else {
          const A = sortKey === "pnl" ? (mode === "t0" ? a.pnlToday : a.pnlYtd) : sortKey === "aum" ? a.nav : a[sortKey];
          const B = sortKey === "pnl" ? (mode === "t0" ? b.pnlToday : b.pnlYtd) : sortKey === "aum" ? b.nav : b[sortKey];
          cmp = A - B;
        }
        return sortAsc ? cmp : -cmp;
      });
    }
    return list;
  }, [clients, q, refine, filter, quickActive, sortKey, sortAsc, mode]);

  const refineCount = Object.values(refine).filter(v => (v || "").trim()).length;
  const filterCount = filter.rules.filter(isRuleActive).length + quickActive.size;
  const hasAnyCriteria = !!q || refineCount > 0 || filterCount > 0;

  // --- (1) Search handlers ---
  const applySearch = ({ q: nq, refine: nr }) => { setQ(nq || ""); setRefine(nr || {}); setActiveConfig(null); };
  // --- (2) Filter handlers ---
  const applyFilter = (next) => { setFilter(next); setActiveConfig(null); };
  const toggleQuick = (id) => {
    setQuickActive(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });
    setActiveConfig(null);
  };
  const clearAll = () => { setQ(""); setRefine({}); setFilter({ rules: [], conns: [] }); setQuickActive(new Set()); setActiveConfig(null); };

  // --- (3) Saved-config handlers ---
  const snapshot = () => ({
    q, refine: { ...refine },
    quick: [...quickActive],
    filter: { rules: filter.rules.map(r => ({ ...r })), conns: [...filter.conns] }
  });
  const summarize = () => {
    const parts = [];
    if (q) parts.push(`“${q}”`);
    [...quickActive].forEach(id => { const f = QUICK_BY_ID[id]; if (f) parts.push(f.label); });
    filter.rules.filter(isRuleActive).forEach(r => parts.push(ruleSummary(r)));
    return parts.join(" · ") || "Không điều kiện";
  };
  const saveConfig = (name) => {
    const id = "cfg-" + Date.now();
    setConfigs(cs => [...cs, { id, name, summary: summarize(), snap: snapshot() }]);
    setActiveConfig(id);
    toast?.(`Đã lưu cấu hình “${name}”`, { tone: "success", icon: "bookmark_added" });
  };
  const applyConfig = (id) => {
    const cf = configs.find(c => c.id === id);
    if (!cf) return;
    const s = cf.snap;
    setQ(s.q || "");
    setRefine({ ...s.refine });
    setQuickActive(new Set(s.quick || []));
    setFilter(s.filter ? { rules: s.filter.rules.map(r => ({ ...r })), conns: [...s.filter.conns] } : { rules: [], conns: [] });
    setActiveConfig(id);
  };
  const renameConfig = (id, name) => { setConfigs(cs => cs.map(c => c.id === id ? { ...c, name } : c)); };
  const deleteConfig = (id) => { setConfigs(cs => cs.filter(c => c.id !== id)); if (activeConfig === id) setActiveConfig(null); };

  const Th = ({ k, children, right, w }) => (
    <th className={`px-3 py-2 text-[10.5px] uppercase tracking-wider font-bold text-on-surface-variant ${right ? "text-right" : "text-left"}`} style={w ? { width: w } : undefined}>
      {k ? (
        <button className={`inline-flex items-center gap-1 hover:text-vnd-primary-700 ${right ? "flex-row-reverse" : ""}`}
          onClick={() => { setSortKey(k); setSortAsc(s => sortKey === k ? !s : false); }}>
          {children}
          <Icon name={sortKey === k ? (sortAsc ? "arrow_upward" : "arrow_downward") : "unfold_more"} size={12} className={sortKey === k ? "text-vnd-primary-700" : "opacity-40"} />
        </button>
      ) : children}
    </th>
  );

  return (
    <div className="px-6 py-4">
      {/* ===== TOP BAR ===== */}
      <div className="flex items-end justify-between gap-4 mb-3 flex-wrap">
        <div>
          <h2 className="font-display text-headline-md text-vnd-primary-900 leading-tight">Danh sách khách hàng</h2>
        </div>
      </div>

      {/* ===== (1) TRA CỨU NHANH — full identity lookup ===== */}
      <QuickSearchBar refine={refine} onApply={applySearch} />

      {/* ===== (3) BỘ LỌC ĐANG DÙNG — applied criteria as chips ===== */}
      {hasAnyCriteria && (
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-[11px] uppercase tracking-wider font-bold text-on-surface-variant shrink-0">Bộ lọc đang dùng</span>
          <SearchCriteriaChips refine={refine}
            onClearRefine={(k) => { setRefine(r => { const n = { ...r }; delete n[k]; return n; }); setActiveConfig(null); }} />
          <AdvancedFilterChips value={filter} onChange={applyFilter} onEdit={() => setAdvOpen(true)} />
          <button onClick={clearAll} className="inline-flex items-center gap-1 h-8 px-2.5 rounded-lg text-[12px] font-medium text-on-surface-variant hover:text-red-600 hover:bg-red-50 transition-colors shrink-0">
            <Icon name="restart_alt" size={15} /> Đặt lại
          </button>
        </div>
      )}

      {/* result meta */}
      <div className="flex items-center gap-2 mb-3 text-[12.5px] text-on-surface-variant">
        <span><span className="font-semibold text-on-surface">{rows.length}</span> / {clients.length} khách hàng</span>
        {filterCount > 0 && <span className="inline-flex items-center gap-1 text-vnd-primary-700"><Icon name="filter_alt" size={14} />{filterCount} điều kiện lọc</span>}
        {sortKey && (
          <button onClick={() => setSortKey(null)} className="inline-flex items-center gap-1 text-on-surface-variant hover:text-vnd-primary-700">
            <Icon name="sort" size={14} /> Bỏ sắp xếp
          </button>
        )}
      </div>

      {/* ===== DATA GRID ===== */}
      <Card padded={false} className="overflow-hidden">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full border-collapse" style={{ minWidth: 560 }}>
            <thead className="bg-surface-container-low border-b border-outline-variant/40">
              <tr>
                <Th k="name" w="38%">Tên khách hàng</Th>
                <Th k="id" w="22%">Customer Id</Th>
                <Th k="stk" w="22%">STK giao dịch</Th>
                <Th k="nvcs" w="18%">NVCS</Th>
              </tr>
            </thead>
            <tbody>
              {rows.map((c, i) => {
                const tone = DOT_TONE[c.tone] || DOT_TONE.amber;
                return (
                  <tr key={c.id}
                    className={`group border-b border-outline-variant/15 transition-colors hover:bg-vnd-primary-50 cursor-pointer ${i % 2 ? "bg-surface-container-low/40" : "bg-white"}`}
                    onClick={() => onOpen(c.profileId)}>
                    {/* Customer name + status dot */}
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className={`h-2 w-2 rounded-full shrink-0 ${tone.dot}`} title={tone.label}></span>
                        <span className="text-[13px] text-on-surface truncate group-hover:text-vnd-primary-700 group-hover:underline decoration-vnd-primary-300 underline-offset-2">{c.name}</span>
                      </div>
                    </td>
                    {/* Customer Id */}
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <span className="font-mono text-[13px] text-on-surface-variant">{c.id}</span>
                    </td>
                    {/* STK giao dịch */}
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <span className="font-mono text-[13px] text-vnd-primary-700">{c.stk}</span>
                    </td>
                    {/* NVCS — nhân viên chăm sóc */}
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      <span className="text-[13px] text-on-surface-variant">{c.nvcs}</span>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={4}>
                    <Empty icon="search_off" title="Không có khách hàng phù hợp" sub="Thử đổi bộ lọc hoặc nới điều kiện tìm kiếm." />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

Object.assign(window, { ActiveClients });
