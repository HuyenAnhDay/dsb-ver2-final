/* global React, window */
const { COMPASSES, SIDEBAR_NAV, matchSidebarItem, NAV, navGroupForRoute, ADVISOR, ANNOUNCEMENTS } = window.DSB_DATA;

// --- AppShell ---
function AppShell({ route, onNavigate, compact, setCompact, children }) {
  const activeItem = matchSidebarItem(route);
  // Level-1 → which compass's sub-nav to show. Dashboard is a standalone landing page.
  const compassForNav = activeItem === "dwork" ? "dwork" : activeItem;
  const compass = COMPASSES.find(c => c.id === compassForNav);
  const navCfg = (compass && NAV[compass.id]) || null;
  const groups = navCfg ? navCfg.groups : [];
  const activeGroup = compass ? navGroupForRoute(compass.id, route) : null;
  // Hide the sub-nav bar when:
  // - on the Dashboard top-level page
  // - the compass's only module is flagged `full` (whole-compass coming-soon)
  const onlyModule = groups.length === 1 && groups[0].modules.length === 1 ? groups[0].modules[0] : null;
  const isFullPageCompass = onlyModule && onlyModule.full;
  // Hide the module nav bar on a client-detail route (dwork/clients/<id>).
  const isClientDetail = route.startsWith("dwork/clients/") && route.split("/").length > 2;
  const showSubNav = activeItem !== "dashboard" && !isFullPageCompass && compass && groups.length > 0 && !isClientDetail;

  return (
    <div className="flex min-h-screen bg-surface-container-low">
      <Sidebar
        activeItem={activeItem} route={route}
        onNavigate={onNavigate} compact={compact} setCompact={setCompact}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar compact={compact} setCompact={setCompact}
          showSubNav={showSubNav} compass={compass} groups={groups}
          activeGroup={activeGroup} route={route} onNavigate={onNavigate} />
        <main className="flex-1 min-w-0">{children}</main>
      </div>
      <AIBuddyFab />
    </div>
  );
}

// =============== SIDEBAR ===============
function Sidebar({ activeItem, route, onNavigate, compact, setCompact }) {
  const primary = SIDEBAR_NAV.filter(i => i.group === "primary");
  const utility = SIDEBAR_NAV.filter(i => i.group === "utility");

  const renderItem = (item) => {
    const active = item.id === activeItem;
    return (
      <a
        key={item.id}
        href="#" onClick={(e) => { e.preventDefault(); onNavigate(item.route); }}
        title={compact ? item.label : ""}
        className={`flex items-center gap-4 rounded-lg transition-all
          ${compact ? "h-11 justify-center" : "py-2.5 px-4"}
          ${active
            ? "bg-vnd-primary-50 text-vnd-primary-500 font-bold"
            : "text-on-surface-variant hover:bg-surface-container-high"}`}
      >
        <Icon name={item.icon} size={22} filled={active} weight={active ? 500 : 400} />
        {!compact && <span className="text-[15px] font-medium">{item.label}</span>}
      </a>
    );
  };

  return (
    <aside
      className={`hidden md:flex flex-col h-screen sticky top-0 left-0 bg-surface-container border-r border-outline-variant/60 z-30 transition-[width] duration-200
        ${compact ? "w-[76px]" : "w-64"}`}
    >
      {/* Brand */}
      <div className={`flex items-center gap-4 px-4 pt-6 pb-8 ${compact ? "justify-center px-2" : ""}`}>
        <div className="w-10 h-10 bg-vnd-primary-900 rounded-lg flex items-center justify-center text-white font-display font-bold text-[22px] flex-shrink-0 leading-none">D</div>
        {!compact && (
          <div className="min-w-0">
            <p className="font-display font-bold text-headline-md text-vnd-primary-900 leading-none">DSB</p>
            <p className="text-[11px] text-on-surface-variant opacity-70 mt-1 truncate">Dynamic Service Blueprint</p>
          </div>
        )}
      </div>

      {/* Primary nav */}
      <nav className={`flex-1 ${compact ? "px-2" : "px-4"} space-y-1 overflow-y-auto scrollbar-hide`}>
        <div className="space-y-1">
          {primary.map(renderItem)}
        </div>
        <div className={`${compact ? "mx-2" : "mx-1"} my-3 h-px bg-outline-variant/40`}></div>
        <div className="space-y-1">
          {utility.map(renderItem)}
        </div>
      </nav>

      {/* Bottom utilities */}
      <div className={`border-t border-outline-variant/50 ${compact ? "px-2 py-3" : "px-4 py-4"} space-y-1`}>
        <button onClick={() => setCompact(!compact)}
          title={compact ? "Mở rộng" : "Thu gọn"}
          className={`flex items-center gap-4 rounded-lg transition-all text-on-surface-variant hover:bg-surface-container-high
            ${compact ? "w-full h-10 justify-center" : "py-2 px-4 w-full"}`}>
          <Icon name={compact ? "right_panel_open" : "right_panel_close"} size={20} />
          {!compact && <span className="text-[14px]">Thu gọn</span>}
        </button>
        <a href="#" className={`flex items-center gap-4 rounded-lg transition-all text-on-surface-variant hover:bg-surface-container-high
          ${compact ? "w-full h-10 justify-center" : "py-2 px-4"}`}>
          <Icon name="logout" size={20} />
          {!compact && <span className="text-[14px]">Đăng xuất</span>}
        </a>
      </div>
    </aside>
  );
}

// =============== TOP BAR (with inline Level-2 dropdown + Level-3 tabs) ===============
function TopBar({ compact, setCompact, showSubNav, compass, groups = [], activeGroup, route, onNavigate }) {
  const [notifOpen, setNotifOpen] = useState(false);
  const hasGroups = groups.length > 1 || (groups.length === 1 && !!groups[0].label);
  const pickGroup = (g) => {
    const first = g.modules.find(m => !m.comingSoon) || g.modules[0];
    if (first) onNavigate(first.id);
  };
  useEffect(() => {
    const h = (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        document.getElementById("global-search")?.focus();
      }
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, []);

  return (
    <header className="bg-surface-container-lowest shadow-sm z-20 sticky top-0">
      <div className="flex justify-between items-center gap-4 w-full px-gutter max-w-[1440px] mx-auto h-14">
        <div className="flex items-center gap-3 min-w-0 flex-1 h-14">
          <button className="md:hidden w-9 h-9 rounded-lg hover:bg-surface-container-low text-on-surface-variant flex items-center justify-center shrink-0" onClick={() => setCompact(!compact)}>
            <Icon name="menu" size={20} />
          </button>
          <span className="md:hidden font-display font-bold text-headline-md text-vnd-primary-900 shrink-0">DSB</span>

          {/* Global search (⌘K) — primary, consistent header element on every screen */}
          <label className="flex items-center gap-2 h-9 flex-1 max-w-[640px] rounded-full bg-surface-container-low ring-1 ring-outline-variant/50 focus-within:ring-2 focus-within:ring-vnd-primary-500 focus-within:bg-white px-3.5 transition-all">
            <Icon name="search" size={18} className="text-on-surface-variant shrink-0" />
            <input id="global-search" type="text" placeholder="Tìm kiếm khách hàng, lead, sản phẩm…"
              className="no-focus-box flex-1 min-w-0 bg-transparent text-[13.5px] text-on-surface border-0 outline-none placeholder:text-on-surface-variant/60" />
            <kbd className="hidden sm:inline-flex items-center justify-center h-5 px-1.5 rounded-md bg-white ring-1 ring-outline-variant/50 text-[10.5px] font-mono font-medium text-on-surface-variant shrink-0">⌘K</kbd>
          </label>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <div className="w-px h-6 bg-outline-variant/60"></div>
          <div className="relative">
            <button onClick={() => setNotifOpen(o => !o)}
              className="relative text-on-surface-variant hover:text-vnd-primary-500 transition-colors w-8 h-8 flex items-center justify-center">
              <Icon name="notifications" size={22} filled={notifOpen} />
              <span className="absolute top-0 right-0 w-2 h-2 bg-vnd-danger rounded-full border-2 border-white"></span>
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-10 w-[360px] bg-white rounded-2xl shadow-lift ring-1 ring-outline-variant/40 overflow-hidden animate-fade-in z-30">
                <div className="px-4 py-3 border-b border-outline-variant/40 flex items-center justify-between">
                  <p className="font-display font-semibold text-vnd-primary-900">Thông báo</p>
                  <button className="text-[11px] font-medium text-vnd-primary-700 hover:underline">Đánh dấu đã đọc</button>
                </div>
                <ul className="max-h-[420px] overflow-y-auto scrollbar-thin divide-y divide-outline-variant/20">
                  {ANNOUNCEMENTS.map(a => (
                    <li key={a.id} className="px-4 py-3 hover:bg-surface-container-low flex gap-3 cursor-pointer">
                      <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                        ${a.level === "warn" ? "bg-amber-50 text-amber-700" : "bg-vnd-primary-50 text-vnd-primary-700"}`}>
                        <Icon name={a.level === "warn" ? "warning" : "campaign"} size={16} />
                      </span>
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-on-surface">{a.title}</p>
                        <p className="text-[12px] text-on-surface-variant mt-0.5">{a.body}</p>
                        <p className="text-[10.5px] text-on-surface-variant/70 mt-1 font-mono">{a.at}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <button className="w-8 h-8 rounded-full border border-outline-variant overflow-hidden flex items-center justify-center" title={ADVISOR.name}>
            <Avatar initials={ADVISOR.initials} size={32} tone="blue" />
          </button>
        </div>
      </div>

      {/* ===== LAYER-2 SITEMAP — underline tabs, directly under the search bar ===== */}
      {showSubNav && activeGroup && (
        <div className="border-t border-outline-variant/30 bg-surface-container-lowest">
          <div className="w-full px-gutter max-w-[1440px] mx-auto">
            <nav className="flex items-center gap-1 h-12 overflow-x-auto scrollbar-hide">
              {groups.map((g, gi) =>
                g.modules.map(m => {
                  const isActive = m.id === route;
                  const isComing = m.comingSoon;
                  return (
                    <a key={m.id} href="#"
                      onClick={(e) => { e.preventDefault(); if (!isComing) onNavigate(m.id); }}
                      aria-disabled={isComing}
                      aria-current={isActive ? "page" : undefined}
                      title={m.sub || undefined}
                      className={`relative font-display inline-flex items-center h-12 px-3.5 text-[14px] gap-1.5 whitespace-nowrap transition-colors border-b-2
                        ${isComing
                          ? "text-on-surface-variant/45 cursor-not-allowed border-transparent"
                          : isActive
                            ? "text-vnd-primary-600 font-semibold border-vnd-primary-500"
                            : "text-on-surface-variant font-medium border-transparent hover:text-vnd-primary-600"}`}>
                      <Icon name={m.icon} size={18} filled={isActive} />
                      <span>{m.label}</span>
                      {isComing && (
                        <span className="inline-flex items-center px-1.5 h-4 rounded-full bg-amber-100/80 text-amber-800 text-[9.5px] font-bold uppercase tracking-wider">Soon</span>
                      )}
                    </a>
                  );
                })
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
}

// =============== AI BUDDY — FLOATING BUTTON ===============
function AIBuddyFab() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const h = (e) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === "j" || e.key === "J")) { e.preventDefault(); setOpen(o => !o); }
    };
    document.addEventListener("keydown", h);
    return () => document.removeEventListener("keydown", h);
  }, []);
  return (
    <>
      {!open && (
        <button onClick={() => setOpen(true)} title="AI Buddy — hỏi mọi thông tin trong hệ thống (⌘J)"
          className="group fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 h-11 pl-2 pr-4 rounded-full bg-vnd-primary-500 text-white shadow-lift hover:bg-vnd-primary-700 hover:shadow-brand transition-all active:scale-[.97]">
          <span className="relative w-7 h-7 rounded-full bg-white/15 flex items-center justify-center">
            <Icon name="auto_awesome" size={16} className="text-white" filled />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-vnd-accent-green ring-2 ring-vnd-primary-500 animate-pulse-soft"></span>
          </span>
          <span className="text-[13px] font-display font-semibold">Buddy</span>
        </button>
      )}
      <AIBuddyPopover open={open} onClose={() => setOpen(false)} />
    </>
  );
}

// =============== AI BUDDY POPOVER ===============
const AI_SUGGESTIONS = [
  { icon: "trending_up",  text: "Tóm tắt hiệu suất Q2 của tôi so với region" },
  { icon: "campaign",     text: "KH nào có NAC alert chưa xử lý hôm nay?" },
  { icon: "inventory_2",  text: "Sản phẩm bond yield > 9% kỳ hạn ≤ 24T?" },
  { icon: "people",       text: "Lead nào trong pipeline có cơ hội close > 50% tuần này?" },
  { icon: "school",       text: "Tôi nên ưu tiên skill gap nào để lên BMI-4?" },
  { icon: "warning",      text: "Tôi có vướng compliance nào không?" }
];

// Performance snapshot used in the expanded fullscreen mode.
const PERF_SNAPSHOT = {
  rank: { pos: 7, of: 84, pct: 8.3, region: "South" },
  quarter: "Q2/2026",
  kpis: [
    { l: "Doanh số Q2",  v: "18.4 tỷ",  delta: "+14.2%", tone: "green", icon: "payments",      vs: "vs Q1" },
    { l: "AUM",           v: "184 tỷ",   delta: "+8.6%",  tone: "green", icon: "savings",       vs: "vs Q1" },
    { l: "Active KH",     v: "62",        delta: "+5",      tone: "green", icon: "diversity_3",   vs: "vs Q1" },
    { l: "Conversion",    v: "32.4%",     delta: "+3.1pp",  tone: "green", icon: "trending_up",   vs: "vs target 28%" },
    { l: "Cycle days",    v: "11.6",      delta: "+0.6",    tone: "red",   icon: "schedule",      vs: "vs Q1 — chậm hơn" },
    { l: "NPS KH",        v: "72",        delta: "+4",      tone: "green", icon: "sentiment_very_satisfied", vs: "vs Q1" }
  ],
  drivers: [
    { label: "Lead có chất lượng từ Network", weight: 32, tone: "green" },
    { label: "Tỉ lệ đóng từ stage 'Đề xuất' tăng", weight: 24, tone: "green" },
    { label: "Cross-sell bond sang nhóm KH ưu tú", weight: 18, tone: "green" },
    { label: "Cycle dài ở nhóm KH > 5 tỷ AUM", weight: -14, tone: "red" }
  ],
  goals: [
    { l: "Top 5 Region",       progress: 70, target: "Cần thêm 0.9 tỷ doanh số" },
    { l: "BMI-4 cuối Q2/2027", progress: 58, target: "Cần 36h Estate + 24h Tax" },
    { l: "Cert KAM Advanced",  progress: 80, target: "Còn 1 case study + thi" }
  ]
};

const PERF_QUESTIONS = [
  { icon: "compare_arrows", text: "So sánh tôi với Top 3 advisor cùng region" },
  { icon: "query_stats",    text: "Drivers nào kéo doanh số Q2 tăng mạnh nhất?" },
  { icon: "schedule",       text: "Vì sao cycle days bị chậm 0.6 ngày?" },
  { icon: "trending_down",  text: "Có chỉ số nào đang xấu đi tôi cần để ý?" },
  { icon: "track_changes",  text: "Tôi còn cách Top 5 region bao xa?" },
  { icon: "auto_graph",     text: "Dự báo doanh số Q3 nếu giữ momentum hiện tại?" },
  { icon: "groups",         text: "Nhóm KH nào đang đóng góp lớn nhất?" },
  { icon: "checklist",      text: "3 hành động ưu tiên tuần này để giữ rank?" }
];

function AIBuddyPopover({ open, onClose, embedded = false }) {
  const [thread, setThread] = useState([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (!open) { setExpanded(false); return; }
    const onKey = (e) => {
      if (e.key === "Escape") {
        if (expanded) setExpanded(false);
        else onClose?.();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, expanded]);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [thread, busy]);

  // ⌘J / Ctrl+J hot-key
  useEffect(() => {
    if (embedded) return;
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "j") {
        e.preventDefault();
        // toggle via parent (we expect onClose to be a no-op when closed; we just dispatch event)
        document.dispatchEvent(new CustomEvent("__ai-buddy-toggle"));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [embedded]);

  const send = (text) => {
    const q = (text ?? input).trim();
    if (!q) return;
    setThread(t => [...t, { role: "user", text: q }]);
    setInput("");
    setBusy(true);
    setTimeout(() => {
      const reply = mockReply(q);
      setThread(t => [...t, reply]);
      setBusy(false);
    }, 900);
  };

  if (!open && !embedded) return null;

  const body = (
    <div className={`flex flex-col ${embedded ? "h-full" : "h-[640px]"} ${embedded ? "" : "bg-white"}`}>
      {/* Head */}
      {!embedded && (
        <div className="px-5 py-4 border-b border-outline-variant/40 flex items-center justify-between bg-gradient-to-r from-vnd-primary-900 via-vnd-primary-700 to-vnd-primary-500 text-white relative overflow-hidden">
          <div className="absolute -top-8 -right-10 w-44 h-44 rounded-full bg-vnd-accent-green/30 blur-3xl"></div>
          <div className="relative flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-full bg-white/15 flex items-center justify-center">
              <Icon name="auto_awesome" size={16} filled />
            </span>
            <div>
              <p className="font-display font-semibold text-[14px]">AI Buddy</p>
              <p className="text-[10.5px] text-white/70">Trợ lý dữ liệu hệ thống DSB · Beta</p>
            </div>
          </div>
          <div className="relative flex items-center gap-1">
            <button onClick={() => setExpanded(true)} title="Mở rộng toàn màn hình — hỏi đáp về Performance"
              className="h-8 px-2.5 rounded-full hover:bg-white/10 flex items-center gap-1.5 text-[11.5px] font-medium">
              <Icon name="open_in_full" size={14} />
              <span className="hidden sm:inline">Mở rộng</span>
            </button>
            <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-white/10 flex items-center justify-center"><Icon name="close" size={18} /></button>
          </div>
        </div>
      )}

      {/* Conversation */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin px-5 py-5 space-y-4 bg-surface-container-low/40">
        {thread.length === 0 && (
          <div className="text-center py-2">
            <div className="inline-flex w-14 h-14 rounded-2xl bg-gradient-to-br from-vnd-primary-700 to-vnd-accent-green text-white items-center justify-center mb-3 shadow-brand">
              <Icon name="auto_awesome" size={28} filled />
            </div>
            <p className="font-display text-title-md text-vnd-primary-900">Xin chào, tôi là AI Buddy</p>
            <p className="text-[12.5px] text-on-surface-variant mt-1 max-w-md mx-auto">Hỏi tôi bất kỳ điều gì về KH, pipeline, sản phẩm, BMI/ICM, NAC… Tôi truy cập trực tiếp dữ liệu DSB.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-5 text-left">
              {AI_SUGGESTIONS.map((s, i) => (
                <button key={i} onClick={() => send(s.text)}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-white ring-1 ring-outline-variant/30 hover:ring-vnd-primary-300 hover:bg-vnd-primary-50/50 transition-all text-left group">
                  <span className="w-8 h-8 rounded-lg bg-vnd-primary-50 text-vnd-primary-700 flex items-center justify-center flex-shrink-0">
                    <Icon name={s.icon} size={16} />
                  </span>
                  <span className="text-[12.5px] text-on-surface font-medium leading-snug">{s.text}</span>
                  <Icon name="arrow_forward" size={14} className="text-on-surface-variant/0 group-hover:text-vnd-primary-500 ml-auto" />
                </button>
              ))}
            </div>
          </div>
        )}

        {thread.map((m, i) => (
          m.role === "user" ? (
            <div key={i} className="flex justify-end">
              <div className="max-w-[80%] bg-vnd-primary-500 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-[13.5px] leading-relaxed shadow-xs">
                {m.text}
              </div>
            </div>
          ) : (
            <div key={i} className="flex gap-2.5">
              <span className="w-8 h-8 rounded-full bg-gradient-to-br from-vnd-primary-700 to-vnd-accent-green text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                <Icon name="auto_awesome" size={14} filled />
              </span>
              <div className="max-w-[85%]">
                <div className="bg-white ring-1 ring-outline-variant/30 rounded-2xl rounded-tl-sm px-4 py-3 text-[13.5px] leading-relaxed text-on-surface space-y-2.5">
                  {m.intro && <p>{m.intro}</p>}
                  {m.kpis && (
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      {m.kpis.map((k, j) => (
                        <div key={j} className="rounded-lg bg-surface-container-low p-2.5 text-center">
                          <p className="text-[9.5px] uppercase tracking-wider text-on-surface-variant font-bold">{k.l}</p>
                          <p className={`font-display font-bold text-headline-sm mt-0.5 font-mono ${k.tone === "green" ? "text-emerald-700" : k.tone === "red" ? "text-red-700" : "text-vnd-primary-900"}`}>{k.v}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  {m.list && (
                    <ul className="space-y-1.5 text-[12.5px]">
                      {m.list.map((it, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <span className="w-4 h-4 rounded-full bg-vnd-primary-50 text-vnd-primary-700 flex items-center justify-center flex-shrink-0 text-[9px] font-bold mt-0.5">{j + 1}</span>
                          <span><span className="font-semibold">{it.title}</span>{it.note && <span className="text-on-surface-variant"> — {it.note}</span>}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {m.text && <p>{m.text}</p>}
                  {m.followups && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {m.followups.map((f, j) => (
                        <button key={j} onClick={() => send(f)}
                          className="text-[11px] px-2.5 py-1 rounded-full bg-vnd-primary-50 text-vnd-primary-700 hover:bg-vnd-primary-100 font-medium">{f}</button>
                      ))}
                    </div>
                  )}
                </div>
                <p className="text-[10px] text-on-surface-variant/70 font-mono mt-1.5">AI Buddy · vừa xong</p>
              </div>
            </div>
          )
        ))}

        {busy && (
          <div className="flex gap-2.5">
            <span className="w-8 h-8 rounded-full bg-gradient-to-br from-vnd-primary-700 to-vnd-accent-green text-white flex items-center justify-center flex-shrink-0">
              <Icon name="auto_awesome" size={14} filled />
            </span>
            <div className="bg-white ring-1 ring-outline-variant/30 rounded-2xl rounded-tl-sm px-4 py-3">
              <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-vnd-primary-500 animate-pulse-soft"></span>
                <span className="w-2 h-2 rounded-full bg-vnd-primary-500 animate-pulse-soft" style={{ animationDelay: "0.2s" }}></span>
                <span className="w-2 h-2 rounded-full bg-vnd-primary-500 animate-pulse-soft" style={{ animationDelay: "0.4s" }}></span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Composer */}
      <div className="px-4 py-3 border-t border-outline-variant/40 bg-white">
        <div className="flex items-end gap-2 bg-surface-container-low rounded-2xl ring-1 ring-outline-variant/30 focus-within:ring-2 focus-within:ring-vnd-primary-500 px-3 py-2 transition-all">
          <textarea
            rows="1" value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder="Hỏi AI Buddy về dữ liệu hệ thống…"
            className="flex-1 bg-transparent outline-none text-[13.5px] resize-none py-1.5 max-h-32 placeholder:text-on-surface-variant/70" />
          <div className="flex items-center gap-1">
            <Button size="icon" tone="ghost" icon="mic" />
            <Button size="icon" tone="primary" icon="send" onClick={() => send()} />
          </div>
        </div>
        <div className="flex items-center gap-2 mt-2 text-[10.5px] text-on-surface-variant flex-wrap">
          <span className="inline-flex items-center gap-1"><Icon name="info" size={11} /> AI Buddy có thể sai. Luôn kiểm tra dữ liệu nhạy cảm trước khi hành động.</span>
          <span className="ml-auto flex items-center gap-2">
            <ChipToggle icon="dataset">Dữ liệu KH</ChipToggle>
            <ChipToggle icon="show_chart">Pipeline</ChipToggle>
            <ChipToggle icon="psychology">Insight</ChipToggle>
          </span>
        </div>
      </div>
    </div>
  );

  if (embedded) return body;

  // FULL-SCREEN EXPANDED MODE — Performance Q&A
  if (expanded) {
    return (
      <AIBuddyFullscreen
        thread={thread} input={input} setInput={setInput}
        busy={busy} send={send} scrollRef={scrollRef}
        onCollapse={() => setExpanded(false)}
        onClose={() => { setExpanded(false); onClose(); }}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-[55] animate-fade-in">
      <div className="absolute inset-0 bg-vnd-primary-950/30 backdrop-blur-sm" onClick={onClose}></div>
      <div className="absolute top-20 right-6 w-[440px] max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-lift overflow-hidden animate-slide-in">
        {body}
      </div>
    </div>
  );
}

// =============== AI BUDDY — FULLSCREEN PERFORMANCE Q&A ===============
function AIBuddyFullscreen({ thread, input, setInput, busy, send, scrollRef, onCollapse, onClose }) {
  const perf = PERF_SNAPSHOT;
  return (
    <div className="fixed inset-0 z-[60] bg-surface-container-low animate-fade-in flex flex-col">
      {/* Top bar */}
      <header className="h-14 bg-gradient-to-r from-vnd-primary-900 via-vnd-primary-700 to-vnd-primary-500 text-white px-6 flex items-center justify-between relative overflow-hidden flex-shrink-0">
        <div className="absolute -top-10 right-1/3 w-72 h-72 rounded-full bg-vnd-accent-green/20 blur-3xl"></div>
        <div className="relative flex items-center gap-3">
          <span className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center">
            <Icon name="auto_awesome" size={18} filled />
          </span>
          <div>
            <p className="font-display font-semibold text-[15px] leading-tight">AI Buddy — Performance Q&A</p>
            <p className="text-[11px] text-white/70 leading-tight">Hỏi đáp dữ liệu thực hiệu suất của bạn · Cập nhật {new Date().toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" })}</p>
          </div>
        </div>
        <div className="relative flex items-center gap-1">
          <span className="hidden md:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[11.5px] font-mono">
            <Icon name="bolt" size={12} className="text-vnd-accent-green" filled />
            <span>Có ngữ cảnh đầy đủ: KPI, pipeline, BMI/ICM, NAC</span>
          </span>
          <button onClick={onCollapse} title="Thu gọn về popover"
            className="h-9 px-3 ml-1 rounded-full hover:bg-white/10 flex items-center gap-1.5 text-[12px]">
            <Icon name="close_fullscreen" size={14} />
            <span>Thu gọn</span>
          </button>
          <button onClick={onClose} className="w-9 h-9 rounded-full hover:bg-white/10 flex items-center justify-center"><Icon name="close" size={18} /></button>
        </div>
      </header>

      {/* Body — 2 columns */}
      <div className="flex-1 min-h-0 grid grid-cols-12 gap-0">
        {/* LEFT — performance snapshot */}
        <aside className="col-span-12 lg:col-span-4 xl:col-span-4 bg-white border-r border-outline-variant/40 overflow-y-auto scrollbar-thin">
          <div className="p-5 space-y-5">
            {/* Rank card */}
            <div className="rounded-2xl bg-gradient-to-br from-vnd-primary-700 via-vnd-primary-500 to-vnd-accent-green text-white p-4 shadow-brand relative overflow-hidden">
              <div className="absolute -top-6 -right-6 w-32 h-32 rounded-full bg-white/15 blur-2xl"></div>
              <div className="relative">
                <p className="text-[10px] uppercase tracking-wider font-bold text-white/80">Region {perf.rank.region} · {perf.quarter}</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="font-display font-bold text-[44px] leading-none font-mono">#{perf.rank.pos}</p>
                  <p className="text-white/70 text-[14px] font-mono">/{perf.rank.of}</p>
                </div>
                <p className="text-[12.5px] mt-1.5 font-medium">Top {perf.rank.pct}% advisor cùng region</p>
                <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/15 ring-1 ring-white/20 text-[11px] font-semibold">
                  <Icon name="arrow_upward" size={12} />
                  Tăng 3 bậc so với Q1
                </div>
              </div>
            </div>

            {/* KPI grid */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10.5px] uppercase tracking-wider font-bold text-on-surface-variant">Chỉ số cốt lõi</p>
                <span className="text-[10.5px] text-on-surface-variant font-mono">{perf.quarter}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {perf.kpis.map((k, i) => (
                  <div key={i} className="rounded-xl bg-surface-container-low ring-1 ring-outline-variant/30 p-3">
                    <div className="flex items-center gap-1.5 text-on-surface-variant">
                      <Icon name={k.icon} size={13} />
                      <p className="text-[10px] uppercase tracking-wider font-bold">{k.l}</p>
                    </div>
                    <p className="font-display font-bold text-title-md text-vnd-primary-900 mt-1 font-mono leading-none">{k.v}</p>
                    <div className="flex items-center gap-1 mt-1.5">
                      <span className={`inline-flex items-center gap-0.5 text-[10.5px] font-mono font-bold
                        ${k.tone === "green" ? "text-emerald-700" : k.tone === "red" ? "text-red-700" : "text-vnd-primary-700"}`}>
                        <Icon name={k.tone === "red" ? "arrow_downward" : "arrow_upward"} size={10} />
                        {k.delta}
                      </span>
                      <span className="text-[10px] text-on-surface-variant/80">{k.vs}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Drivers */}
            <div>
              <p className="text-[10.5px] uppercase tracking-wider font-bold text-on-surface-variant mb-2">Drivers · Q2/2026</p>
              <div className="space-y-1.5">
                {perf.drivers.map((d, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-[12px] text-on-surface truncate">{d.label}</p>
                      <div className="h-1.5 mt-1 bg-surface-container-high rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${d.tone === "green" ? "bg-emerald-500" : "bg-red-500"}`}
                             style={{ width: Math.abs(d.weight) * 2.5 + "%" }}></div>
                      </div>
                    </div>
                    <span className={`text-[11px] font-mono font-bold w-12 text-right
                      ${d.tone === "green" ? "text-emerald-700" : "text-red-700"}`}>
                      {d.weight > 0 ? "+" : ""}{d.weight}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Goals */}
            <div>
              <p className="text-[10.5px] uppercase tracking-wider font-bold text-on-surface-variant mb-2">Mục tiêu cá nhân</p>
              <div className="space-y-2.5">
                {perf.goals.map((g, i) => (
                  <div key={i} className="rounded-xl ring-1 ring-outline-variant/30 bg-white p-3">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[12.5px] font-semibold text-vnd-primary-900">{g.l}</p>
                      <span className="text-[11px] font-mono font-bold text-vnd-primary-700">{g.progress}%</span>
                    </div>
                    <div className="h-1.5 mt-1.5 bg-surface-container-high rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-vnd-primary-500 to-vnd-accent-green" style={{ width: g.progress + "%" }}></div>
                    </div>
                    <p className="text-[10.5px] text-on-surface-variant mt-1.5">{g.target}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT — Q&A */}
        <section className="col-span-12 lg:col-span-8 xl:col-span-8 flex flex-col min-h-0 bg-surface-container-low/30">
          {/* Conversation */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin px-8 py-6">
            {thread.length === 0 ? (
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-6">
                  <div className="inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br from-vnd-primary-700 to-vnd-accent-green text-white items-center justify-center mb-3 shadow-brand">
                    <Icon name="auto_awesome" size={32} filled />
                  </div>
                  <p className="font-display text-headline-md text-vnd-primary-900">Hỏi đáp về Performance của bạn</p>
                  <p className="text-[13.5px] text-on-surface-variant mt-2 max-w-xl mx-auto">
                    AI Buddy đã đọc xong các chỉ số quý của bạn ở bên trái. Hỏi bất cứ điều gì — so sánh, dự báo, lý do, hành động ưu tiên.
                  </p>
                </div>

                <p className="text-[10.5px] uppercase tracking-wider font-bold text-on-surface-variant mb-2.5 ml-1">Câu hỏi gợi ý</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {PERF_QUESTIONS.map((s, i) => (
                    <button key={i} onClick={() => send(s.text)}
                      className="flex items-center gap-3 p-3.5 rounded-xl bg-white ring-1 ring-outline-variant/30 hover:ring-vnd-primary-300 hover:bg-vnd-primary-50/40 hover:-translate-y-0.5 transition-all text-left group shadow-xs">
                      <span className="w-9 h-9 rounded-lg bg-vnd-primary-50 text-vnd-primary-700 flex items-center justify-center flex-shrink-0">
                        <Icon name={s.icon} size={17} />
                      </span>
                      <span className="text-[13px] text-on-surface font-medium leading-snug flex-1">{s.text}</span>
                      <Icon name="arrow_forward" size={15} className="text-on-surface-variant/0 group-hover:text-vnd-primary-500" />
                    </button>
                  ))}
                </div>

                <div className="mt-6 flex items-start gap-2.5 rounded-xl bg-vnd-primary-50/60 ring-1 ring-vnd-primary-200/60 px-4 py-3">
                  <Icon name="lightbulb" size={16} className="text-vnd-primary-700 mt-0.5 flex-shrink-0" filled />
                  <p className="text-[12px] text-vnd-primary-900 leading-relaxed">
                    <span className="font-semibold">Mẹo:</span> Bạn có thể hỏi xuyên context — kết hợp KPI + KH + sản phẩm. Ví dụ "Top 3 KH đóng góp doanh số nhiều nhất Q2 và bài học để nhân lên Q3?"
                  </p>
                </div>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto space-y-4">
                {thread.map((m, i) => (
                  m.role === "user" ? (
                    <div key={i} className="flex justify-end">
                      <div className="max-w-[80%] bg-vnd-primary-500 text-white rounded-2xl rounded-tr-sm px-4 py-2.5 text-[13.5px] leading-relaxed shadow-xs">{m.text}</div>
                    </div>
                  ) : (
                    <div key={i} className="flex gap-2.5">
                      <span className="w-8 h-8 rounded-full bg-gradient-to-br from-vnd-primary-700 to-vnd-accent-green text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                        <Icon name="auto_awesome" size={14} filled />
                      </span>
                      <div className="max-w-[85%]">
                        <div className="bg-white ring-1 ring-outline-variant/30 rounded-2xl rounded-tl-sm px-4 py-3 text-[13.5px] leading-relaxed text-on-surface space-y-2.5">
                          {m.intro && <p>{m.intro}</p>}
                          {m.kpis && (
                            <div className="grid grid-cols-3 gap-2 mt-1">
                              {m.kpis.map((k, j) => (
                                <div key={j} className="rounded-lg bg-surface-container-low p-2.5 text-center">
                                  <p className="text-[9.5px] uppercase tracking-wider text-on-surface-variant font-bold">{k.l}</p>
                                  <p className={`font-display font-bold text-headline-sm mt-0.5 font-mono ${k.tone === "green" ? "text-emerald-700" : k.tone === "red" ? "text-red-700" : "text-vnd-primary-900"}`}>{k.v}</p>
                                </div>
                              ))}
                            </div>
                          )}
                          {m.list && (
                            <ul className="space-y-1.5 text-[12.5px]">
                              {m.list.map((it, j) => (
                                <li key={j} className="flex items-start gap-2">
                                  <span className="w-4 h-4 rounded-full bg-vnd-primary-50 text-vnd-primary-700 flex items-center justify-center flex-shrink-0 text-[9px] font-bold mt-0.5">{j + 1}</span>
                                  <span><span className="font-semibold">{it.title}</span>{it.note && <span className="text-on-surface-variant"> — {it.note}</span>}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                          {m.text && <p>{m.text}</p>}
                          {m.followups && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {m.followups.map((f, j) => (
                                <button key={j} onClick={() => send(f)}
                                  className="text-[11px] px-2.5 py-1 rounded-full bg-vnd-primary-50 text-vnd-primary-700 hover:bg-vnd-primary-100 font-medium">{f}</button>
                              ))}
                            </div>
                          )}
                        </div>
                        <p className="text-[10px] text-on-surface-variant/70 font-mono mt-1.5">AI Buddy · vừa xong</p>
                      </div>
                    </div>
                  )
                ))}
                {busy && (
                  <div className="flex gap-2.5">
                    <span className="w-8 h-8 rounded-full bg-gradient-to-br from-vnd-primary-700 to-vnd-accent-green text-white flex items-center justify-center flex-shrink-0">
                      <Icon name="auto_awesome" size={14} filled />
                    </span>
                    <div className="bg-white ring-1 ring-outline-variant/30 rounded-2xl rounded-tl-sm px-4 py-3">
                      <div className="flex gap-1">
                        <span className="w-2 h-2 rounded-full bg-vnd-primary-500 animate-pulse-soft"></span>
                        <span className="w-2 h-2 rounded-full bg-vnd-primary-500 animate-pulse-soft" style={{ animationDelay: "0.2s" }}></span>
                        <span className="w-2 h-2 rounded-full bg-vnd-primary-500 animate-pulse-soft" style={{ animationDelay: "0.4s" }}></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Composer */}
          <div className="px-8 py-4 border-t border-outline-variant/40 bg-white">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-end gap-2 bg-surface-container-low rounded-2xl ring-1 ring-outline-variant/30 focus-within:ring-2 focus-within:ring-vnd-primary-500 px-3 py-2 transition-all">
                <textarea
                  rows="1" value={input} onChange={e => setInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
                  placeholder="Hỏi về performance của bạn — so sánh, dự báo, lý do, hành động…"
                  className="flex-1 bg-transparent outline-none text-[13.5px] resize-none py-1.5 max-h-32 placeholder:text-on-surface-variant/70" />
                <div className="flex items-center gap-1">
                  <Button size="icon" tone="ghost" icon="mic" />
                  <Button size="icon" tone="primary" icon="send" onClick={() => send()} />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2 text-[10.5px] text-on-surface-variant flex-wrap">
                <span className="inline-flex items-center gap-1"><Icon name="info" size={11} /> AI Buddy có thể sai. Luôn kiểm tra dữ liệu nhạy cảm trước khi hành động.</span>
                <span className="ml-auto flex items-center gap-2">
                  <ChipToggle icon="leaderboard" active>Performance</ChipToggle>
                  <ChipToggle icon="dataset">KH</ChipToggle>
                  <ChipToggle icon="show_chart">Pipeline</ChipToggle>
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function mockReply(q) {
  const lower = q.toLowerCase();
  if (lower.includes("top 3") || lower.includes("so sánh tôi với top")) {
    return {
      role: "ai",
      intro: "So sánh bạn với Top 3 advisor region South — Q2/2026:",
      kpis: [
        { l: "Bạn (#7)", v: "18.4 tỷ", tone: "blue" },
        { l: "Top 3 trung bình", v: "24.6 tỷ", tone: "green" },
        { l: "Gap", v: "−6.2 tỷ", tone: "red" }
      ],
      list: [
        { title: "Nguyễn T.H (#1)", note: "27.8 tỷ · 92 KH active · cycle 9.4 ngày" },
        { title: "Phạm V.A (#2)", note: "24.1 tỷ · 78 KH active · cycle 10.1 ngày" },
        { title: "Lê M.C (#3)", note: "22.0 tỷ · 71 KH active · cycle 10.8 ngày" }
      ],
      text: "Khoảng cách lớn nhất nằm ở cycle days (bạn 11.6 vs top 10.1). Nếu rút cycle xuống 10.5, ước tính bạn có thể đạt ~21 tỷ doanh số tương đương Top 3.",
      followups: ["Lý do cycle bị chậm?", "Plan rút cycle xuống 10.5", "Top 3 khác bạn ở quy trình nào?"]
    };
  }
  if (lower.includes("drivers") || lower.includes("doanh số") && lower.includes("tăng")) {
    return {
      role: "ai",
      intro: "Drivers chính kéo doanh số Q2 của bạn tăng so với Q1:",
      list: [
        { title: "Lead chất lượng từ Network (+32%)", note: "iLead network giới thiệu 14 KH high-intent" },
        { title: "Tỉ lệ đóng stage 'Đề xuất' (+24%)", note: "32.4% → 40.1% nhờ proposal mẫu mới" },
        { title: "Cross-sell bond ưu tú (+18%)", note: "12 KH > 5 tỷ AUM mua thêm bond" }
      ],
      text: "Trong 3 drivers, cross-sell bond ưu tú có ROI cao nhất (avg ticket 850M). Khuyến nghị nhân rộng playbook này sang nhóm KH 2-5 tỷ AUM ở Q3.",
      followups: ["Playbook cross-sell bond", "Source lead chất lượng", "Proposal mẫu mới"]
    };
  }
  if (lower.includes("cycle") || lower.includes("chậm")) {
    return {
      role: "ai",
      intro: "Cycle days +0.6 ngày so với Q1 — phân tích:",
      list: [
        { title: "Nhóm KH > 5 tỷ AUM", note: "Cycle 16.2 ngày (Q1: 14.8) — chiếm 78% delay" },
        { title: "Lý do chính", note: "Compliance review kéo dài + KH chờ family decision" },
        { title: "Nhóm KH < 1 tỷ AUM", note: "Cycle 8.1 ngày — vẫn ổn định" }
      ],
      text: "Cycle dài chỉ tập trung ở 1 segment. Đề xuất: (1) Pre-clear compliance trước proposal; (2) Mời chuyên gia Legacy vào meeting KH lớn để rút quyết định gia đình.",
      followups: ["KH nào bị stuck > 14 ngày?", "Mời chuyên gia Legacy", "Pre-clear compliance"]
    };
  }
  if (lower.includes("xấu đi") || lower.includes("trending_down") || lower.includes("để ý")) {
    return {
      role: "ai",
      intro: "3 chỉ số cần để ý trong 30 ngày tới:",
      list: [
        { title: "Cycle days (+0.6)", note: "Đang lệch khỏi target. Theo dõi tuần 1-2 tháng 6." },
        { title: "Pipeline cuối tháng (−18%)", note: "Số lead mới giảm — cần refill từ network." },
        { title: "BMI Estate gap (−34)", note: "Block lộ trình BMI-4 nếu không học trong Q3." }
      ],
      text: "Nguy cơ lớn nhất là pipeline thinning. Nếu không refill 15-20 lead chất lượng trong 2 tuần, doanh số Q3 sẽ giảm ~12%.",
      followups: ["Mở Pipeline view", "Plan refill 20 lead", "Đăng ký khoá Estate"]
    };
  }
  if (lower.includes("top 5") || lower.includes("rank")) {
    return {
      role: "ai",
      intro: "Bạn cách Top 5 region 2 bậc — chi tiết:",
      kpis: [
        { l: "Vị trí Top 5", v: "20.8 tỷ", tone: "blue" },
        { l: "Bạn", v: "18.4 tỷ", tone: "green" },
        { l: "Cần thêm", v: "2.4 tỷ", tone: "red" }
      ],
      text: "Với 2.4 tỷ doanh số bổ sung trong Q2 còn lại (5 tuần), bạn cần avg 480M/tuần. Pipeline đang có 6 lead weighted ~3.1 tỷ — đủ dư khả thi nếu close 75%.",
      followups: ["6 lead khả năng cao", "Plan 5 tuần", "Theo dõi rank live"]
    };
  }
  if (lower.includes("dự báo") || lower.includes("q3") || lower.includes("momentum")) {
    return {
      role: "ai",
      intro: "Dự báo Q3/2026 nếu giữ momentum hiện tại:",
      kpis: [
        { l: "Doanh số", v: "20.8 tỷ", tone: "green" },
        { l: "AUM", v: "204 tỷ", tone: "green" },
        { l: "Rank dự kiến", v: "#5", tone: "green" }
      ],
      text: "Model dự báo dựa trên: tăng trưởng 14% (Q2 vs Q1), conversion 32%, pipeline 32 lead hiện tại. Confidence 78%. Rủi ro: pipeline cần refill thêm 18-20 lead.",
      followups: ["Yếu tố rủi ro", "Best case / Worst case", "Action để chắc Top 5"]
    };
  }
  if (lower.includes("nhóm kh") || lower.includes("đóng góp")) {
    return {
      role: "ai",
      intro: "Top 3 nhóm KH đóng góp Q2:",
      list: [
        { title: "Doanh nhân SME (38%)", note: "7.0 tỷ · 12 KH · avg ticket 580M" },
        { title: "Chuyên gia thu nhập cao (28%)", note: "5.2 tỷ · 22 KH · avg ticket 235M" },
        { title: "Gia đình kế thừa (18%)", note: "3.3 tỷ · 6 KH · avg ticket 550M" }
      ],
      text: "Doanh nhân SME tăng trưởng nhanh nhất (+42% so với Q1). Nhóm này phản hồi rất tốt với combo cash flow + bond ngắn hạn. Đề xuất nhân rộng.",
      followups: ["Mở segment Doanh nhân SME", "Lookalike audience", "Playbook combo cash + bond"]
    };
  }
  if (lower.includes("hành động") || lower.includes("ưu tiên") && lower.includes("tuần")) {
    return {
      role: "ai",
      intro: "3 hành động ưu tiên tuần này để giữ rank #7+:",
      list: [
        { title: "Đẩy 2 lead weighted cao", note: "L-2840 (1.25 tỷ, 85%) + L-2841 (500M, 78%) — gọi trong 48h" },
        { title: "Refill pipeline 8 lead", note: "Liên hệ network mentor + tham gia 1 referral event" },
        { title: "Pre-clear compliance 3 KH lớn", note: "Rút cycle 2-3 ngày, tăng momentum Q2 final" }
      ],
      text: "Nếu xong cả 3 hành động này trong tuần, model dự báo bạn giữ vững #7 và mở đường lên #5 cuối Q2.",
      followups: ["Mở 2 lead high-prob", "Mời mentor referral", "List 3 KH compliance"]
    };
  }
  if (lower.includes("q2") || lower.includes("hiệu suất")) {
    return {
      role: "ai",
      intro: "Tóm tắt hiệu suất Quý 2/2026 của bạn so với region South:",
      kpis: [
        { l: "Doanh số", v: "18.4 tỷ", tone: "green" },
        { l: "AUM", v: "184 tỷ", tone: "green" },
        { l: "ICM", v: "+24", tone: "green" }
      ],
      text: "Bạn đang xếp #7/84 advisors region South (Top 8.3%). Vượt 12% so với target được giao, +14.2% so với Q1. Điểm yếu duy nhất: cycle days +0.6 ngày.",
      followups: ["So sánh chi tiết với Top 3", "KH nào kéo cycle dài?", "Plan cải thiện Q3"]
    };
  }
  if (lower.includes("nac") || lower.includes("alert")) {
    return {
      role: "ai",
      intro: "Hôm nay bạn có 18 KH có NAC alert chưa xử lý:",
      list: [
        { title: "P1 (6 KH)", note: "Cần liên hệ trong 24h" },
        { title: "P2 (12 KH)", note: "Theo dõi trong tuần" }
      ],
      text: "Ưu tiên cao: Lê Văn Việt (missed call 08:42), Đỗ Trung Kiên (pending reply 2 ngày), Trần Ngọc Nhi (quá hạn cadence P1).",
      followups: ["Mở danh sách P1", "Soạn outreach hàng loạt", "Lý do KH idle"]
    };
  }
  if (lower.includes("bond") || lower.includes("sản phẩm")) {
    return {
      role: "ai",
      intro: "3 sản phẩm bond yield > 9% kỳ hạn ≤ 24T phù hợp:",
      list: [
        { title: "VIB Trái phiếu DN 24T", note: "8.2% p.a — vẫn dưới 9%" },
        { title: "VPF Tích sản 5 năm", note: "9.4% YTD (mix) — kỳ hạn dài hơn" }
      ],
      text: "Lưu ý: trong AFA hiện tại không có bond pure < 24T với yield > 9%. Đề xuất combo VIB 24T + VPF tích sản.",
      followups: ["KH nào phù hợp combo này?", "Compare risk", "Tạo proposal mẫu"]
    };
  }
  if (lower.includes("pipeline") || lower.includes("lead") || lower.includes("close")) {
    return {
      role: "ai",
      intro: "4 lead trong pipeline có cơ hội close > 50% tuần này:",
      list: [
        { title: "Lê Văn Việt (L-2841)", note: "Stage: Gặp tư vấn · 500M · prob 78%" },
        { title: "Trần Ngọc Nhi (L-2840)", note: "Stage: Đề xuất mở TK · 1.25 tỷ · prob 85%" },
        { title: "Hoàng Thị Mai (L-2835)", note: "Stage: Đặt lịch hẹn · 880M · prob 62%" },
        { title: "Nguyễn Thanh Hà (L-2827)", note: "Stage: Tiếp cận · 660M · prob 55%" }
      ],
      followups: ["Mở Pipeline view", "Next action từng lead", "Tổng weighted value"]
    };
  }
  if (lower.includes("skill") || lower.includes("bmi") || lower.includes("học")) {
    return {
      role: "ai",
      intro: "Để lên BMI-4 vào Q2/2027, tôi đề xuất ưu tiên 3 skill gap:",
      list: [
        { title: "Estate & Legacy", note: "Gap −34 điểm · cần 36h, 2 khoá" },
        { title: "Tax Optimization VN", note: "Gap −26 điểm · cần 24h, 2 khoá" },
        { title: "Behavioral Coaching", note: "Gap −23 điểm · 18h, 1 khoá" }
      ],
      text: "Estate là gap lớn nhất. Đề xuất lộ trình 12 tuần kết hợp khoá học + case study + mentor session với Trần Hồng Vân.",
      followups: ["Tạo plan 12 tuần", "Đăng ký khoá Estate", "Đặt lịch mentor"]
    };
  }
  if (lower.includes("compliance") || lower.includes("aml") || lower.includes("kyc")) {
    return {
      role: "ai",
      text: "Hiện tại bạn có 1 cảnh báo Compliance: Chứng chỉ LIC hết hạn Q4/2025, cần đăng ký renewal trước 30/11. Tất cả KH trong portfolio đều có KYC valid và AML clear.",
      followups: ["Đăng ký renewal LIC", "Audit trail 7 ngày"]
    };
  }
  return {
    role: "ai",
    text: "Mình đã hiểu câu hỏi của bạn. Trong phiên prototype này, mình demo phản hồi cho một số chủ đề: hiệu suất Q2, NAC alert, sản phẩm bond, pipeline lead, skill gap, compliance. Bạn thử các gợi ý phía trên nhé.",
    followups: AI_SUGGESTIONS.slice(0, 3).map(s => s.text)
  };
}

// =============== SUB-NAV (Level 2 dropdown + Level 3 tabs) ===============
// Level 2 = group -> dropdown (shown when a compass has >1 group, or one named group).
// Level 3 = module -> tabs rendered below the header bar.
const GROUP_TONE = {
  primary: { badge: "bg-vnd-primary-700 text-white",            btn: "bg-vnd-primary-50 text-vnd-primary-700 ring-vnd-primary-200 hover:bg-vnd-primary-100" },
  neutral: { badge: "bg-on-surface text-white",                 btn: "bg-surface-container-high text-on-surface ring-outline-variant/50 hover:bg-surface-container-highest" },
  green:   { badge: "bg-vnd-accent-green text-vnd-primary-950", btn: "bg-emerald-50 text-emerald-700 ring-emerald-200 hover:bg-emerald-100" },
  purple:  { badge: "bg-fuchsia-600 text-white",                btn: "bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200 hover:bg-fuchsia-100" },
  amber:   { badge: "bg-amber-500 text-white",                  btn: "bg-amber-50 text-amber-700 ring-amber-200 hover:bg-amber-100" }
};

function GroupDropdown({ groups, activeGroup, route, onPick, onNavigate }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return;
    const h = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [open]);
  const tone = GROUP_TONE[activeGroup.tone] || GROUP_TONE.primary;
  const activeModule = activeGroup.modules.find(m => m.id === route);
  return (
    <div className="relative shrink-0" ref={ref}>
      <button onClick={() => setOpen(o => !o)}
        className={`inline-flex items-center gap-2 h-9 pl-1.5 pr-2.5 rounded-lg ring-1 transition-colors ${tone.btn}`}>
        <span className={`inline-flex items-center h-6 px-2 rounded-md text-[10px] font-bold uppercase tracking-[0.12em] ${tone.badge}`}>{activeGroup.id}</span>
        <span className="text-[13px] font-display font-semibold">{activeGroup.label}</span>
        {activeModule && (
          <>
            <span className="text-on-surface-variant/40">·</span>
            <span className="text-[13px] font-display font-medium text-on-surface-variant">{activeModule.label}</span>
          </>
        )}
        <Icon name="expand_more" size={18} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute z-40 mt-2 left-0 w-[320px] rounded-2xl bg-white shadow-lift ring-1 ring-outline-variant/40 p-1.5 origin-top-left max-h-[72vh] overflow-y-auto scrollbar-thin">
          {groups.map((g, gi) => {
            const t = GROUP_TONE[g.tone] || GROUP_TONE.primary;
            return (
              <div key={g.id} className={gi > 0 ? "mt-1 pt-1 border-t border-outline-variant/30" : ""}>
                <div className="flex items-center gap-2 px-2.5 pt-2 pb-1.5">
                  <span className={`inline-flex items-center h-5 px-1.5 rounded-md text-[9.5px] font-bold uppercase tracking-[0.12em] ${t.badge}`}>{g.id}</span>
                  <span className="text-[12px] font-display font-semibold text-on-surface">{g.label}</span>
                </div>
                <ul className="space-y-0.5">
                  {g.modules.map(m => {
                    const sel = m.id === route;
                    const coming = m.comingSoon;
                    return (
                      <li key={m.id}>
                        <button disabled={coming}
                          onClick={() => { if (!coming) { onNavigate(m.id); setOpen(false); } }}
                          className={`w-full flex items-center gap-2.5 pl-2.5 pr-2 py-2 rounded-xl text-left transition-colors
                            ${coming ? "opacity-50 cursor-not-allowed" : sel ? "bg-vnd-primary-50" : "hover:bg-surface-container-low"}`}>
                          <Icon name={m.icon} size={18} className={sel ? "text-vnd-primary-700" : "text-on-surface-variant"} filled={sel} />
                          <span className="flex-1 min-w-0">
                            <span className="flex items-center gap-1.5">
                              <span className={`text-[13px] font-medium truncate ${sel ? "text-vnd-primary-700" : "text-on-surface"}`}>{m.label}</span>
                              {coming && <span className="inline-flex items-center px-1.5 h-4 rounded-full bg-amber-100/80 text-amber-800 text-[9.5px] font-bold uppercase tracking-wider">Soon</span>}
                            </span>
                            {m.sub && <span className="block text-[11px] text-on-surface-variant truncate">{m.sub}</span>}
                          </span>
                          {sel && <Icon name="check" size={16} className="text-vnd-primary-700 shrink-0" />}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// =============== PageHeader & Page (sub-nav now lives in the header bar) ===============
function PageHeader({ eyebrow, title, sub, actions, tabs, tabValue, onTab, sticky = false }) {
  return (
    <div className={`bg-white border-b border-outline-variant/40 ${sticky ? "sticky top-14 z-10" : ""}`}>
      <div className="px-8 pt-4 pb-3 flex items-start justify-between gap-6 flex-wrap max-w-[1440px] mx-auto">
        <div>
          {eyebrow && <p className="text-[11px] uppercase tracking-[0.14em] font-bold text-vnd-primary-500/80">{eyebrow}</p>}
          <h1 className="font-display text-headline-lg text-vnd-primary-900 mt-1">{title}</h1>
          {sub && <p className="text-body-md text-on-surface-variant mt-1 max-w-3xl">{sub}</p>}
        </div>
        {actions && <div className="flex items-center gap-2 flex-wrap">{actions}</div>}
      </div>
      {tabs && tabs.length > 0 && (
        <div className="px-8 max-w-[1440px] mx-auto">
          <Tabs value={tabValue} onChange={onTab} tabs={tabs} />
        </div>
      )}
    </div>
  );
}

function Page({ children, className = "", wide = false }) {
  return (
    <div className={`px-8 py-4 ${wide ? "" : "max-w-[1440px]"} mx-auto ${className}`}>{children}</div>
  );
}

Object.assign(window, { AppShell, Sidebar, TopBar, AIBuddyFab, GroupDropdown, PageHeader, Page, AIBuddyPopover, mockReply, AI_SUGGESTIONS });
