/* global React, window */
// ============================================================
// CLIENT PROFILE — detail screen per the DSB sitemap.
// Pinned header (luôn hiển thị) · 4 tabs (DGO · Daccount · Dinvest · Dlink).
// Shell + shared helpers live here; each tab is its own file (cp-*.jsx)
// and is read off `window` at render time.
// ============================================================
const { ACTIVE_CLIENTS, INTERACTIONS, SEGMENT_TO_TIER, TIER_LADDER, CJ_STAGES, NAC_BY_STATE, CP_DATA } = window.DSB_DATA;

// ---------- shared formatting ----------
function trToTy(v) {
  // v in million VND ("tr") → friendly tỷ / tr string
  if (v >= 1000) return (v / 1000).toFixed(2).replace(/\.?0+$/, "") + " tỷ";
  return v.toLocaleString("vi-VN") + " tr";
}
function ageFromDob(dob) {
  if (!dob) return null;
  const d = new Date(dob);
  return Math.floor((Date.now() - d.getTime()) / (365.25 * 24 * 3600 * 1000));
}
function buildProfile(client) {
  const tier = SEGMENT_TO_TIER[client.segment] || "Mass";
  return {
    tier,
    tierIndex: TIER_LADDER.indexOf(tier),
    age: ageFromDob(client.dob),
    cjIndex: CJ_STAGES.findIndex(s => s.key === client.journey),
    nac: client.nac && client.nac !== "none" ? { state: client.nac, ...NAC_BY_STATE[client.nac] } : null
  };
}

// ---------- shared presentational helpers ----------
function CPCard({ title, sub, icon, action, children, className = "" }) {
  return (
    <section className={`bg-white rounded-2xl shadow-soft ring-1 ring-vnd-primary-900/5 p-5 ${className}`}>
      {(title || action) && (
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-2.5 min-w-0">
            {icon && (
              <span className="w-8 h-8 shrink-0 rounded-lg bg-vnd-primary-50 text-vnd-primary-700 flex items-center justify-center">
                <Icon name={icon} size={18} />
              </span>
            )}
            <div className="min-w-0">
              <h3 className="font-display text-title-md text-vnd-primary-900 leading-tight">{title}</h3>
              {sub && <p className="text-[12px] text-on-surface-variant mt-0.5">{sub}</p>}
            </div>
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}

function CPLabel({ children, className = "" }) {
  return <p className={`text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold ${className}`}>{children}</p>;
}

// inline key/value row (label left · value right)
function KVRow({ label, value, icon, tone }) {
  const toneCls = tone === "pos" ? "text-emerald-700" : tone === "neg" ? "text-red-700" : "text-on-surface";
  return (
    <div className="flex items-center justify-between gap-3 py-2 border-b border-outline-variant/20 last:border-0">
      <span className="text-[12.5px] text-on-surface-variant inline-flex items-center gap-1.5 min-w-0">
        {icon && <Icon name={icon} size={14} className="shrink-0" />}<span className="truncate">{label}</span>
      </span>
      <span className={`text-[13px] font-medium text-right shrink-0 ${toneCls}`}>{value}</span>
    </div>
  );
}

// boxed metric tile
function KVTile({ label, value, sub, tone = "neutral", mono = true }) {
  const ring = {
    neutral: "ring-outline-variant/30",
    blue: "ring-vnd-primary-200 bg-vnd-primary-50/40",
    green: "ring-emerald-200 bg-emerald-50/40",
    amber: "ring-amber-200 bg-amber-50/40",
    purple: "ring-fuchsia-200 bg-fuchsia-50/40",
    red: "ring-red-200 bg-red-50/40"
  }[tone];
  const valColor = tone === "green" ? "text-emerald-700" : tone === "red" ? "text-red-700" : "text-vnd-primary-900";
  return (
    <div className={`rounded-xl ring-1 p-4 ${ring}`}>
      <CPLabel className="text-[10px]">{label}</CPLabel>
      <p className={`font-display font-bold text-headline-sm mt-1 ${valColor} ${mono ? "font-mono" : ""}`}>{value}</p>
      {sub && <p className="text-[11.5px] text-on-surface-variant mt-1">{sub}</p>}
    </div>
  );
}

// ============================================================
// CONTEXT NAVIGATION (per BRD — max 2 fixed layers)
//  Layer 1: breadcrumb switcher  [Module / Page ▼]  + sibling modules
//  Layer 2: right-sticky "Trong trang này" section index
//  Deeper levels → drawer / detail (handled inside panels).
// ============================================================
const CP_MODULES = [
  { id: "nangluc",  label: "La bàn Hiểu biết",  full: "La Bàn Hiểu Biết",                 icon: "explore" },
  { id: "hanhdong", label: "La bàn Hành động",  full: "La Bàn Hành Động · Giao dịch & sao kê", icon: "bolt" },
  { id: "ketnoi",   label: "La bàn Kết nối",    full: "La Bàn Kết Nối · Quan hệ",     icon: "hub" },
  { id: "taisan",   label: "La bàn Giá trị",    full: "La Bàn Giá Trị · Tài sản & nợ",      icon: "account_balance" }
];

// "Tìm trong hồ sơ" — within-customer command menu (jumps to any section of the module)
function ProfileSearch({ groups, module, onPick, onClose }) {
  const [q, setQ] = useState("");
  const ref = useRef(null);
  useEffect(() => {
    const h = e => { if (ref.current && !ref.current.contains(e.target)) onClose(); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);
  const kw = q.trim().toLowerCase();
  const results = [];
  groups.forEach(g => g.items.forEach(it => {
    if (!kw || it.label.toLowerCase().includes(kw) || g.label.toLowerCase().includes(kw)) results.push({ ...it, page: g.label });
  }));
  return (
    <div ref={ref} className="absolute z-40 mt-2 right-0 w-[360px] max-w-[92vw] rounded-2xl bg-white shadow-lift ring-1 ring-outline-variant/40 overflow-hidden animate-fade-in">
      <div className="p-2.5 border-b border-outline-variant/30">
        <span className="flex items-center gap-2 h-9 px-2.5 rounded-lg bg-surface-container-low ring-1 ring-outline-variant/40 focus-within:ring-2 focus-within:ring-vnd-primary-500">
          <Icon name="search" size={16} className="text-on-surface-variant" />
          <input autoFocus value={q} onChange={e => setQ(e.target.value)} placeholder={`Tìm trong ${module.label}…`}
            className="no-focus-box flex-1 min-w-0 bg-transparent text-[13px] outline-none border-0 placeholder:text-on-surface-variant/60" />
        </span>
      </div>
      <ul className="max-h-[320px] overflow-y-auto scrollbar-thin p-1.5">
        {results.map(r => (
          <li key={r.id}>
            <button onClick={() => onPick(r.id)} className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-surface-container-low text-left transition-colors">
              <Icon name={r.icon} size={16} className="text-on-surface-variant shrink-0" />
              <span className="flex-1 min-w-0">
                <span className="block text-[13px] text-on-surface truncate">{r.label}</span>
                <span className="block text-[11px] text-on-surface-variant truncate">{r.page}</span>
              </span>
              <Icon name="arrow_forward" size={15} className="text-on-surface-variant/50 shrink-0" />
            </button>
          </li>
        ))}
        {results.length === 0 && <p className="px-3 py-6 text-center text-[12.5px] text-on-surface-variant">Không tìm thấy mục phù hợp.</p>}
      </ul>
    </div>
  );
}

// Layer-1 breadcrumb switcher: active [Module / Page ▼] + sibling modules + search
function ProfilePageNav({ module, onModuleChange, groups, value, onChange }) {
  const activeMod = CP_MODULES.find(m => m.id === module) || CP_MODULES[0];
  const activeGroup = groups.find(g => g.items.some(it => it.id === value)) || groups[0];
  const [searchOpen, setSearchOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState(null);
  const navRef = useRef(null);
  useEffect(() => {
    if (!openGroup) return;
    const h = e => { if (navRef.current && !navRef.current.contains(e.target)) setOpenGroup(null); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [openGroup]);

  return (
    <div className="sticky top-[124px] z-10 -mx-6 px-6 bg-surface/90 backdrop-blur-md border-b border-outline-variant/30">
      <div className="flex items-center gap-3">
        {/* page groups within the active module — each a dropdown of its items */}
        <div ref={navRef} className="flex items-center gap-0.5 -mb-px">
          {groups.map(g => {
            const a = g.id === activeGroup.id;
            const multi = g.items.length > 1;
            const open = openGroup === g.id;
            return (
              <div key={g.id} className="relative">
                <button
                  onClick={() => { if (multi) setOpenGroup(open ? null : g.id); else { onChange(g.items[0].id); setOpenGroup(null); } }}
                  className={`group relative inline-flex items-center gap-1.5 h-10 px-3 whitespace-nowrap text-[12.5px] font-display font-semibold transition-colors
                    ${a ? "text-vnd-primary-700" : "text-on-surface-variant hover:text-on-surface"}`}>
                  <span>{g.label}</span>
                  {multi && <Icon name="expand_more" size={15} className={`transition-transform ${open ? "rotate-180" : ""} ${a ? "text-vnd-primary-500" : "text-on-surface-variant/60"}`} />}
                  <span className={`absolute left-2.5 right-2.5 -bottom-px h-[2px] rounded-full transition-colors ${a ? "bg-vnd-primary-500" : "bg-transparent group-hover:bg-outline-variant/50"}`}></span>
                </button>
                {multi && open && (
                  <div className="absolute z-40 mt-1.5 left-0 w-[300px] rounded-2xl bg-white shadow-lift ring-1 ring-outline-variant/40 p-1.5 animate-fade-in max-h-[70vh] overflow-y-auto scrollbar-thin">
                    <ul className="space-y-0.5">
                      {g.items.map((it, idx) => {
                        const sel = value === it.id;
                        const prevSection = idx > 0 ? g.items[idx - 1].section : null;
                        const showHeader = it.section && it.section !== prevSection;
                        return (
                          <React.Fragment key={it.id}>
                            {showHeader && (
                              <li className={`px-2.5 ${idx > 0 ? "pt-2.5" : "pt-1"} pb-1`}>
                                <span className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant/70">{it.section}</span>
                              </li>
                            )}
                            <li>
                              <button onClick={() => { onChange(it.id); setOpenGroup(null); }}
                                className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-left text-[12.5px] transition-colors ${sel ? "bg-vnd-primary-50 text-vnd-primary-700 font-semibold" : "text-on-surface hover:bg-surface-container-low"}`}>
                                <Icon name={it.icon} size={16} className={sel ? "text-vnd-primary-600" : "text-on-surface-variant"} filled={sel} />
                                <span className="flex-1 truncate">{it.label}</span>
                                {typeof it.count === "number" && (
                                  <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.5 ${sel ? "bg-vnd-primary-100 text-vnd-primary-700" : "bg-surface-container-high text-on-surface-variant"}`}>{it.count}</span>
                                )}
                                {sel && <Icon name="check" size={15} className="text-vnd-primary-700 shrink-0" />}
                              </button>
                            </li>
                          </React.Fragment>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* search within customer */}
        <div className="relative ml-auto py-1.5">
          <button onClick={() => setSearchOpen(o => !o)} title="Tìm trong hồ sơ khách hàng"
            className={`inline-flex items-center gap-1.5 h-8 px-2.5 rounded-lg text-[12px] font-medium ring-1 transition-colors
              ${searchOpen ? "bg-vnd-primary-50 text-vnd-primary-700 ring-vnd-primary-200" : "bg-white text-on-surface-variant ring-outline-variant/50 hover:bg-surface-container-low"}`}>
            <Icon name="search" size={15} />
            <span className="hidden md:inline">Tìm trong hồ sơ</span>
          </button>
          {searchOpen && <ProfileSearch groups={groups} module={activeMod} onPick={(id) => { onChange(id); setSearchOpen(false); }} onClose={() => setSearchOpen(false)} />}
        </div>
      </div>
    </div>
  );
}

// Page shell: full-width content (left) + right-sticky section index ("Trong trang này")
function ProfileLayout({ module, onModuleChange, groups, value, onChange, children }) {
  const activeMod = CP_MODULES.find(m => m.id === module) || CP_MODULES[0];
  const activeGroup = groups.find(g => g.items.some(it => it.id === value)) || groups[0];
  const activeItem = activeGroup.items.find(it => it.id === value) || activeGroup.items[0];
  return (
    <div>
      <ProfilePageNav module={module} onModuleChange={onModuleChange} groups={groups} value={value} onChange={onChange} />
      <div className="mt-4">
        {/* page heading */}
        <div className="flex items-center gap-2.5 mb-4">
          <span className="w-9 h-9 rounded-xl bg-vnd-primary-50 text-vnd-primary-700 flex items-center justify-center shrink-0"><Icon name={(activeItem && activeItem.icon) || activeGroup.icon} size={20} /></span>
          <div className="min-w-0">
            <h2 className="font-display text-headline-sm text-vnd-primary-900 leading-tight truncate">{(activeItem && activeItem.label) || activeGroup.label}</h2>
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

// ============== PINNED HEADER ==============
// icon-only action with hover tooltip
function IconAction({ icon, label, tone = "default", onClick }) {
  const tones = {
    primary: "bg-vnd-primary-500 text-white hover:bg-vnd-primary-700 shadow-xs",
    default: "bg-white text-on-surface ring-1 ring-outline-variant hover:bg-surface-container-low",
    danger: "bg-red-50 text-red-700 hover:bg-red-100"
  };
  return (
    <div className="relative group/act">
      <button onClick={onClick} aria-label={label}
        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all active:scale-95 ${tones[tone]}`}>
        <Icon name={icon} size={18} weight={500} />
      </button>
      <span className="pointer-events-none absolute top-full right-0 mt-1.5 z-40 whitespace-nowrap rounded-md bg-vnd-primary-900 text-white text-[11px] font-medium px-2 py-1 opacity-0 translate-y-1 group-hover/act:opacity-100 group-hover/act:translate-y-0 transition-all shadow-lift">
        {label}
      </span>
    </div>
  );
}

function ProfileHeader({ client, p, onAction }) {
  const tierTone = { Mass: "neutral", MP: "blue", "KHL Standard": "blue", "KHL Pro": "purple", Institutional: "dark" }[p.tier];
  const cj = CJ_STAGES[p.cjIndex] || CJ_STAGES[0];
  const allCare = CP_DATA.careBy;
  const careBy = allCare.filter(o => o.active);
  const [careOpen, setCareOpen] = useState(false);
  const careRef = useRef(null);
  useEffect(() => {
    if (!careOpen) return;
    const h = (e) => { if (careRef.current && !careRef.current.contains(e.target)) setCareOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [careOpen]);
  return (
    <div className="sticky top-0 z-20 bg-surface/90 backdrop-blur-md border-b border-outline-variant/40">
      <div className="px-6 pt-3 pb-2">
        <div className="flex items-start gap-4">
          <Avatar initials={client.initials} size={52} tone="blue" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-display text-headline-sm text-vnd-primary-900 leading-none">{client.name}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============== SCREEN ==============
function ClientProfileScreen({ id, onBack }) {
  const client = ACTIVE_CLIENTS.find(c => c.id === id);
  const [tab, setTab] = useState("taisan");
  const [logOpen, setLogOpen] = useState(null);
  const toast = useToast();
  useEffect(() => {
    const m = document.querySelector("main");
    if (m) m.scrollTop = 0;
  }, [id]);
  if (!client) return null;
  const p = buildProfile(client);

  const handleAction = (kind) => {
    if (kind === "call" || kind === "log" || kind === "advise") { setLogOpen(kind === "advise" ? "advise" : kind); return; }
    if (kind === "escalate") { toast?.("Đã escalate lên Region Director", { tone: "warn", icon: "trending_up" }); return; }
    if (kind === "careplan") { toast?.("Đã tạo care plan từ NAC", { tone: "success", icon: "medical_services" }); return; }
  };

  const TabDgo = window.TabDgo, TabDaccount = window.TabDaccount, TabDinvest = window.TabDinvest, TabDlink = window.TabDlink;

  return (
    <div className="animate-fade-in pb-12">
      {/* breadcrumb */}
      <div className="px-6 pt-4">
        <button onClick={onBack}
          className="inline-flex items-center gap-1.5 h-8 pl-1.5 pr-3 -ml-1.5 rounded-lg text-[13px] font-medium text-on-surface-variant hover:text-vnd-primary-700 hover:bg-surface-container-high transition-colors">
          <Icon name="arrow_back" size={18} /> Danh sách khách hàng
        </button>
      </div>

      {/* Pinned header */}
      <ProfileHeader client={client} p={p} onAction={handleAction} />

      {/* Tier-1 section tabs — underline strip (light, single row, no wrap) */}
      <div className="sticky top-[76px] z-10 bg-surface/90 backdrop-blur-md px-6 border-b border-outline-variant/40">
        <div className="flex items-center gap-0.5 overflow-x-auto scrollbar-hide">
          {[
            { id: "nangluc",  label: "La bàn Hiểu biết",  desc: "Năng lực & hồ sơ", icon: "explore", soon: true },
            { id: "hanhdong", label: "La bàn Hành động",  desc: "Giao dịch & sao kê", icon: "bolt" },
            { id: "ketnoi",   label: "La bàn Kết nối",    desc: "Quan hệ", icon: "hub" },
            { id: "taisan",   label: "La bàn Giá trị",    desc: "Tài sản & nợ", icon: "account_balance" }
          ].map(t => {
            const a = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`group relative inline-flex items-center gap-2 h-12 px-3.5 whitespace-nowrap text-[14px] font-display font-semibold transition-colors
                  ${a ? "text-vnd-primary-700" : "text-on-surface-variant hover:text-on-surface"}`}>
                <span>{t.label}</span>
                <span className={`absolute left-2.5 right-2.5 -bottom-px h-[2.5px] rounded-full transition-colors ${a ? "bg-vnd-primary-500" : "bg-transparent group-hover:bg-outline-variant/60"}`}></span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab content */}
      <div className="px-6 pb-5">
        {tab === "nangluc" && window.TabNangLuc && <window.TabNangLuc client={client} p={p} />}
        {tab === "hanhdong" && window.TabHanhDong && <window.TabHanhDong client={client} p={p} />}
        {tab === "ketnoi" && window.TabKetNoi && <window.TabKetNoi client={client} p={p} />}
        {tab === "taisan" && window.TabTaiSan && <window.TabTaiSan client={client} p={p} />}
      </div>

      {/* Log modal */}
      <Modal open={!!logOpen} onClose={() => setLogOpen(null)}
        title={`Log touchpoint — ${client.name}`}
        sub="Template tự sinh theo context NAC · điền thêm ghi chú để hoàn tất"
        footer={
          <>
            <Button tone="ghost" onClick={() => setLogOpen(null)}>Huỷ</Button>
            <Button tone="primary" icon="check" onClick={() => { setLogOpen(null); toast?.("Đã log tương tác vào Interaction History", { tone: "success", icon: "check_circle" }); }}>Lưu & log</Button>
          </>
        }>
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            {[["call", "Gọi", "call"], ["zalo", "Zalo", "chat"], ["email", "Email", "mail"], ["advise", "Tư vấn", "forum"]].map(([k, l, ic]) => (
              <ChipToggle key={k} active={logOpen === k} onClick={() => setLogOpen(k)} icon={ic}>{l}</ChipToggle>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <TextField label="Outcome" defaultValue="Completed" icon="check" />
            <TextField label="Thời lượng" defaultValue="12 min" icon="schedule" />
          </div>
          <TextField as="textarea" label="Ghi chú" rows="4" defaultValue="Đã trao đổi về phân bổ Q4. KH quan tâm tăng tỉ trọng bond. Hẹn callback thứ Sáu 14:30." inputClassName="min-h-[88px] py-2" />
          <label className="flex items-center gap-2 text-[12.5px]">
            <input type="checkbox" defaultChecked className="rounded border-outline-variant" />
            <span>Tự gắn với cadence {client.cadence} · khai báo COI per-call</span>
          </label>
        </div>
      </Modal>
    </div>
  );
}

Object.assign(window, {
  ClientProfileScreen, CPCard, CPLabel, KVRow, KVTile, buildProfile, trToTy,
  ProfilePageNav, ProfileLayout
});
