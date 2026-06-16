/* global React, ReactDOM, window */
const {
  AppShell, ToastProvider,
  ScreenDworkDashboard, ScreenDworkClients, ScreenDworkOmni,
  ScreenDworkProduct, ScreenDworkTools, ScreenDworkHelpdesk, ScreenDworkCompliance,
  ScreenILead, ScreenDLink, ScreenDAccount
} = window;

const DEFAULT_ROUTE = "dwork/clients";

// Every destination except Client Zone is parked behind a Coming-soon screen.
const COMING_SOON_ROUTES = {
  "dwork/dashboard": { compass: "dwork",    sub: "Dashboard",                  desc: "Cockpit tổng hợp hằng ngày — KPI, lịch làm việc, pipeline và cảnh báo ưu tiên." },
  "dwork/bi":        { compass: "dwork",    sub: "AI Buddy · BI Automation",    desc: "Trợ lý AI có ngữ cảnh đầy đủ trên DSB — hỏi về KH, pipeline, sản phẩm, hiệu suất." },
  "dwork/omni":      { compass: "dwork",    sub: "Omnichannel",                desc: "Hợp nhất tương tác đa kênh — call, Zalo, email, chat — theo từng khách hàng." },
  "dwork/product":   { compass: "dwork",    sub: "Product Zone",               desc: "Danh mục sản phẩm & dịch vụ đầu tư, công cụ so sánh và đề xuất phù hợp." },
  "dwork/oc":        { compass: "dwork",    sub: "OC · Operational Chain",      desc: "Khu vực vận hành quy trình nội bộ — đội ngũ Ops, SLA, workflow automation." },
  "dwork/tools":     { compass: "dwork",    sub: "Toolbox",                    desc: "Bộ công cụ nghiệp vụ hỗ trợ chuyên viên tư vấn." },
  "toolbox":         { compass: "dwork",    sub: "Toolbox",                    desc: "Bộ công cụ nghiệp vụ hỗ trợ chuyên viên tư vấn." },
  "dwork/helpdesk":  { compass: "dwork",    sub: "Helpdesk & Library",         desc: "Thư viện kiến thức, hướng dẫn nghiệp vụ và hỗ trợ." },
  "library":         { compass: "dwork",    sub: "Helpdesk & Library",         desc: "Thư viện kiến thức, hướng dẫn nghiệp vụ và hỗ trợ." },
  "daccount":        { compass: "daccount", sub: "dAccount · Đánh giá & Phát triển", desc: "Khu vực minh bạch P-rank, salary band, và lịch đánh giá 3P định kỳ với Servant Manager." }
};
function comingSoonFor(route) {
  if (COMING_SOON_ROUTES[route]) return COMING_SOON_ROUTES[route];
  const c = (route || "").split("/")[0];
  if (c === "ilead")    return { compass: "dwork",    sub: "iLead",    desc: "Lộ trình phát triển năng lực & sự nghiệp chuyên viên tư vấn." };
  if (c === "dlink")    return { compass: "dwork",    sub: "dLink",    desc: "Phân tích mạng lưới kết nối nội bộ và liên kết chéo." };
  if (c === "daccount") return COMING_SOON_ROUTES["daccount"];
  return { compass: "dwork", sub: "Đang phát triển", desc: "Khu vực này đang được xây dựng và sẽ mở khoá ở phiên bản kế tiếp." };
}

function App() {
  const [route, setRoute] = useState(() => {
    const h = window.location.hash.replace(/^#\/?/, "");
    return h || DEFAULT_ROUTE;
  });
  const [compact, setCompact] = useState(false);
  const [tweaksOpen, setTweaksOpen] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);

  // hot-key toggle
  useEffect(() => {
    const onToggle = () => setAiOpen(o => !o);
    document.addEventListener("__ai-buddy-toggle", onToggle);
    return () => document.removeEventListener("__ai-buddy-toggle", onToggle);
  }, []);

  // hash sync
  useEffect(() => {
    const onHash = () => {
      const h = window.location.hash.replace(/^#\/?/, "");
      if (h) setRoute(h);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const navigate = (r) => {
    setRoute(r);
    window.location.hash = "#/" + r;
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Tweaks bridge
  useEffect(() => {
    const onMsg = (e) => {
      const t = e.data?.type;
      if (t === "__activate_edit_mode") setTweaksOpen(true);
      else if (t === "__deactivate_edit_mode") setTweaksOpen(false);
    };
    window.addEventListener("message", onMsg);
    window.parent.postMessage({ type: "__edit_mode_available" }, "*");
    return () => window.removeEventListener("message", onMsg);
  }, []);

  // route → screen — only Client Zone is live; everything else is Coming soon
  let screen = null;
  const [compass, sub] = route.split("/");
  if (compass === "dwork" && sub === "clients") {
    screen = <ScreenDworkClients route={route} onNavigate={navigate} />;
  } else {
    const cs = comingSoonFor(route);
    screen = <ComingSoonScreen compass={cs.compass} sub={cs.sub} desc={cs.desc} />;
  }

  return (
    <ToastProvider>
      <AppShell route={route} onNavigate={navigate} compact={compact} setCompact={setCompact}>
        {screen}
      </AppShell>
      {tweaksOpen && <TweaksPanel
        onClose={() => { setTweaksOpen(false); window.parent.postMessage({ type: "__edit_mode_dismissed" }, "*"); }}
        compact={compact} setCompact={setCompact}
        route={route} setRoute={navigate}
      />}
      <AIBuddyPopover open={aiOpen} onClose={() => setAiOpen(false)} />
    </ToastProvider>
  );
}

// =============== COMING SOON SCREEN ===============
const COMING_SOON_META = {
  dwork: { icon: "rocket_launch", title: "dWork", color: "#0077ED", bg: "from-vnd-primary-700 via-vnd-primary-500 to-vnd-accent-green" },
  daccount: { icon: "trending_up", title: "dAccount", color: "#FF8C33", bg: "from-orange-500 via-amber-500 to-pink-500" }
};

function ComingSoonScreen({ compass = "dwork", sub, desc }) {
  const meta = COMING_SOON_META[compass] || COMING_SOON_META.dwork;
  return (
    <Page wide>
      <div className="min-h-[calc(100vh-220px)] flex items-center justify-center px-6 py-12">
        <div className="max-w-xl w-full text-center">
          <div className={`relative inline-flex w-20 h-20 rounded-2xl bg-gradient-to-br ${meta.bg} text-white items-center justify-center mb-6 shadow-lift`}>
            <Icon name={meta.icon} size={40} filled />
            <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-white ring-2 ring-vnd-warning flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-vnd-warning animate-pulse-soft"></span>
            </span>
          </div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 ring-1 ring-amber-200 text-amber-800 text-[11px] uppercase tracking-wider font-bold mb-3">
            <Icon name="schedule" size={12} />
            Coming soon
          </div>
          <h1 className="font-display text-headline-lg text-vnd-primary-900">{sub}</h1>
          <p className="text-body-md text-on-surface-variant mt-3 leading-relaxed">{desc}</p>

          <div className="mt-7 grid grid-cols-3 gap-3 max-w-md mx-auto">
            {["Đang thiết kế", "Đang xây dựng", "Sắp ra mắt"].map((t, i) => (
              <div key={i} className={`rounded-xl px-3 py-3 ring-1
                ${i === 0 ? "bg-emerald-50 ring-emerald-200 text-emerald-800" :
                  i === 1 ? "bg-vnd-primary-50 ring-vnd-primary-200 text-vnd-primary-700" :
                  "bg-surface-container-low ring-outline-variant/40 text-on-surface-variant"}`}>
                <div className="flex items-center justify-center gap-1.5">
                  <Icon name={i === 0 ? "check_circle" : i === 1 ? "settings" : "circle"} size={14} filled={i < 2} />
                  <span className="text-[11.5px] font-semibold">{t}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-7 flex items-center justify-center gap-2">
            <Button tone="primary" size="sm" icon="notifications_active">Đăng ký thông báo khi ra mắt</Button>
            <Button tone="outline" size="sm" icon="forum">Góp ý sớm</Button>
          </div>
          <p className="text-[11px] text-on-surface-variant/70 mt-5 font-mono">Module này dự kiến mở khoá ở phiên bản kế tiếp.</p>
        </div>
      </div>
    </Page>
  );
}

// =============== BI AUTOMATION SCREEN (embedded AI Buddy) ===============
function ScreenAIBuddy() {
  return (
    <>
      <PageHeader
        eyebrow="dWork · BI Automation"
        title="AI Buddy"
        sub="Hỏi mọi điều về KH, pipeline, sản phẩm, BMI/ICM, NAC, performance — AI Buddy có ngữ cảnh đầy đủ trên DSB."
        actions={
          <>
            <Button tone="ghost" size="sm" icon="history">Lịch sử hỏi</Button>
            <Button tone="outline" size="sm" icon="dataset">Nguồn dữ liệu</Button>
            <Button tone="primary" size="sm" icon="add">Cuộc trò chuyện mới</Button>
          </>
        }
      />
      <Page wide>
        <div className="grid grid-cols-12 gap-5 h-[calc(100vh-220px)] min-h-[560px]">
          {/* Left rail: history & topics */}
          <aside className="col-span-12 lg:col-span-3 bg-white rounded-2xl ring-1 ring-outline-variant/30 overflow-hidden flex flex-col">
            <div className="px-4 py-3 border-b border-outline-variant/30">
              <TextField icon="search" placeholder="Tìm cuộc hỏi…" />
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-thin">
              <div className="px-4 py-3">
                <p className="text-[10.5px] uppercase tracking-wider font-bold text-on-surface-variant mb-2">Hôm nay</p>
                <ul className="space-y-1">
                  {[
                    "Tóm tắt hiệu suất Q2",
                    "KH P1 cần liên hệ",
                    "Lead close prob > 50%"
                  ].map((t, i) => (
                    <li key={i}>
                      <button className={`w-full text-left text-[12.5px] px-2.5 py-2 rounded-lg flex items-center gap-2 ${i === 0 ? "bg-vnd-primary-50 text-vnd-primary-700 font-semibold" : "hover:bg-surface-container-low text-on-surface-variant"}`}>
                        <Icon name="chat" size={14} /><span className="truncate">{t}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="px-4 py-3 border-t border-outline-variant/20">
                <p className="text-[10.5px] uppercase tracking-wider font-bold text-on-surface-variant mb-2">Tuần trước</p>
                <ul className="space-y-1">
                  {[
                    "Skill gap để lên BMI-4",
                    "Sản phẩm bond > 9% yield",
                    "AML alert handling"
                  ].map((t, i) => (
                    <li key={i}>
                      <button className="w-full text-left text-[12.5px] px-2.5 py-2 rounded-lg hover:bg-surface-container-low text-on-surface-variant flex items-center gap-2">
                        <Icon name="chat" size={14} /><span className="truncate">{t}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="px-4 py-4 border-t border-outline-variant/20">
                <p className="text-[10.5px] uppercase tracking-wider font-bold text-on-surface-variant mb-2">Topics gợi ý</p>
                <div className="flex flex-wrap gap-1.5">
                  {["Pipeline", "Performance", "Compliance", "Products", "Network", "Training"].map(t => (
                    <span key={t} className="text-[11px] px-2 py-1 rounded-full bg-surface-container-low text-on-surface-variant ring-1 ring-outline-variant/40">{t}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="px-4 py-3 border-t border-outline-variant/30 bg-surface-container-low/50">
              <div className="flex items-center gap-2 text-[11px] text-on-surface-variant">
                <Icon name="info" size={13} />
                <span>14 cuộc hỏi tuần này · 3.2 phút/cuộc</span>
              </div>
            </div>
          </aside>

          {/* Main chat embedded */}
          <section className="col-span-12 lg:col-span-9 bg-white rounded-2xl ring-1 ring-outline-variant/30 overflow-hidden">
            <AIBuddyPopover open={true} embedded={true} />
          </section>
        </div>
      </Page>
    </>
  );
}

// =============== TWEAKS PANEL ===============
function TweaksPanel({ onClose, compact, setCompact, route, setRoute }) {
  return (
    <div className="fixed bottom-6 right-6 z-[55] w-[300px] bg-white rounded-2xl shadow-lift ring-1 ring-vnd-primary-900/10 overflow-hidden animate-slide-in">
      <div className="bg-vnd-primary-900 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon name="palette" size={18} className="text-vnd-accent-green" />
          <p className="font-display font-semibold text-[13px]">Tweaks</p>
        </div>
        <button onClick={onClose} className="text-white/80 hover:text-white"><Icon name="close" size={18} /></button>
      </div>
      <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto scrollbar-thin">
        <div>
          <p className="text-[10.5px] uppercase tracking-wider font-bold text-on-surface-variant mb-2">Sidebar</p>
          <Toggle on={compact} onChange={setCompact} label="Compact (icon only)" hint="Thu gọn sidebar còn icon" />
        </div>
        <div>
          <p className="text-[10.5px] uppercase tracking-wider font-bold text-on-surface-variant mb-2">Đi nhanh đến…</p>
          <div className="space-y-1">
            {[
              { id: "dwork/dashboard", l: "Dashboard" },
              { id: "dwork/clients", l: "dWork · FC — Client Zone" },
              { id: "dwork/omni", l: "dWork · FC — Omnichannel" },
              { id: "dwork/product", l: "dWork · FC — Product Zone" },
              { id: "dwork/oc", l: "dWork · OC (Coming soon)" },
              { id: "toolbox", l: "Toolbox" },
              { id: "library", l: "Library" },
              { id: "ilead/job",   l: "iLead — Job Track" },
              { id: "ilead/depth", l: "iLead — DEPTH Track" },
              { id: "ilead/idp",   l: "iLead — IDP Track" },
              { id: "dlink/ipax",  l: "dLink — IPAX" },
              { id: "dlink/ilead", l: "dLink · XLink — iLead network" },
              { id: "dlink/dwork", l: "dLink · XLink — dWork network" },
              { id: "daccount",    l: "dAccount (Coming soon)" }
            ].map(r => (
              <button key={r.id} onClick={() => setRoute(r.id)}
                className={`w-full text-left text-[12.5px] px-2.5 py-1.5 rounded-md transition-colors
                  ${route === r.id ? "bg-vnd-primary-50 text-vnd-primary-700 font-semibold" : "hover:bg-surface-container-low text-on-surface-variant"}`}>
                {r.l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
