/* global React, window */
// New Dashboard — onboarding/setup welcome view.
// Overrides ScreenDworkDashboard from dwork.jsx (loaded after it in index.html).

const { ADVISOR } = window.DSB_DATA;

// ---- Setup data for the 4 La Bàn cards ----
const SETUP_CARDS = [
  {
    id: "ilead",
    icon: "school",
    chipColor: "#8B2E8F",
    chipBg: "bg-purple-50",
    chipText: "text-pti-primary",
    accentBar: "bg-pti-primary",
    title: "iLead",
    subtitle: "Phát triển nghề nghiệp",
    intro: "Thiết lập hồ sơ nghề nghiệp",
    tooltip: {
      bullets: [
        "Định danh vị trí và vai trò",
        "Đánh giá năng lực theo 14 giá trị",
        "Lập kế hoạch phát triển cá nhân"
      ],
      purpose: "Xây dựng định hướng phát triển nghề nghiệp rõ ràng và phù hợp với năng lực cá nhân."
    },
    items: [
      { num: 1, label: "Định danh vị trí",        status: "done",    value: "Backend Developer (IC)", note: "Xác định Career Track và Functional Domain." },
      { num: 2, label: "Đánh giá năng lực",       status: "pending", value: "Chưa hoàn tất",          note: "Tự đánh giá theo 14 giá trị cốt lõi của tổ chức." },
      { num: 3, label: "Lập kế hoạch phát triển", status: "todo",    value: "Chưa thực hiện",         note: "Xác định mục tiêu phát triển cá nhân và chuyên môn." }
    ],
    cta: { label: "Tiếp tục thiết lập", icon: "arrow_forward", route: "ilead/job" }
  },
  {
    id: "dlink",
    icon: "hub",
    chipColor: "#00C97D",
    chipBg: "bg-emerald-50",
    chipText: "text-emerald-700",
    accentBar: "bg-vnd-accent-green",
    title: "dLink",
    subtitle: "Mạng lưới hỗ trợ",
    intro: "Thiết lập mạng lưới đồng hành",
    tooltip: {
      bullets: [
        "Servant Manager (người hướng dẫn)",
        "Buddy (người đồng hành)",
        "Network mapping (phạm vi kết nối)"
      ],
      purpose: "Xây dựng mạng lưới hỗ trợ để tối ưu hóa quá trình hòa nhập và phát triển năng lực chuyên môn."
    },
    items: [
      { icon: "supervisor_account", label: "Servant Manager (SM)", status: "done",    value: "Trần Văn B",       note: "Người hướng dẫn phát triển năng lực cá nhân." },
      { icon: "handshake",          label: "Buddy",                 status: "pending", value: "Chưa được gán",    note: "Người đồng hành hỗ trợ hòa nhập ban đầu." },
      { icon: "groups",             label: "Network Mapping",       status: "todo",    value: "Chưa thực hiện",   note: "Xác định phạm vi kết nối và hợp tác công việc." }
    ],
    cta: { label: "Tiếp tục thiết lập", icon: "arrow_forward", route: "dlink/ipax" }
  },
  {
    id: "dwork",
    icon: "work",
    chipColor: "#0077ED",
    chipBg: "bg-vnd-primary-50",
    chipText: "text-vnd-primary-700",
    accentBar: "bg-vnd-primary-500",
    title: "dWork",
    subtitle: "Trách nhiệm công việc",
    intro: "Thiết lập phạm vi công việc",
    tooltip: {
      bullets: [
        "Formal Chain (chuỗi quản lý)",
        "KPI & OKR (mục tiêu công việc)"
      ],
      purpose: "Xác định rõ ràng phạm vi trách nhiệm và tiêu chí đánh giá hiệu suất công việc."
    },
    items: [
      { icon: "account_tree", label: "Formal Chain (FC)", status: "todo", value: "Chưa xác nhận",  note: "Xác định người quản lý trực tiếp và chuỗi báo cáo." },
      { icon: "flag",         label: "KPI & OKR",         status: "todo", value: "Chưa thiết lập", note: "Định nghĩa mục tiêu và chỉ số đánh giá hiệu suất." }
    ],
    cta: { label: "Bắt đầu thiết lập", icon: "arrow_forward", route: "dwork/clients" }
  },
  {
    id: "daccount",
    icon: "verified",
    chipColor: "#FF8C33",
    chipBg: "bg-amber-50",
    chipText: "text-amber-700",
    accentBar: "bg-vnd-warning",
    title: "dAccount",
    subtitle: "Đánh giá & Phát triển",
    intro: "Thông tin đánh giá hiệu suất",
    tooltip: {
      bullets: [
        "P-rank (cấp bậc hiện tại)",
        "Cấu trúc thù lao",
        "Lịch đánh giá định kỳ (3P Review)"
      ],
      purpose: "Minh bạch hóa tiêu chí đánh giá và cơ chế ghi nhận giá trị đóng góp của cá nhân."
    },
    items: [
      { icon: "emoji_events", label: "P-rank hiện tại",        status: "info",    value: "P1 (Nhân viên mới)",   note: "Cấp bậc được gán tự động khi gia nhập tổ chức." },
      { icon: "payments",     label: "Cấu trúc thù lao",       status: "info",    value: "Xem cấu trúc salary band", note: "Minh bạch về mức thù lao và tiêu chí đánh giá." },
      { icon: "event",        label: "Lịch đánh giá định kỳ", status: "pending", value: "Chưa thiết lập",       note: "Đặt lịch review 3P với SM theo quý." }
    ],
    cta: { label: "Xem thông tin chi tiết", icon: "arrow_forward", route: "daccount" }
  }
];

// ---- Status meta ----
const STATUS_META = {
  done:    { icon: "check_circle",          color: "#00C97D", bg: "bg-emerald-50",  fg: "text-emerald-700", ring: "ring-emerald-200",  label: "Hoàn tất" },
  pending: { icon: "schedule",              color: "#FFB020", bg: "bg-amber-50",    fg: "text-amber-700",   ring: "ring-amber-200",    label: "Đang chờ" },
  todo:    { icon: "radio_button_unchecked",color: "#727784", bg: "bg-surface-container-high", fg: "text-on-surface-variant", ring: "ring-outline-variant/60", label: "Chưa thực hiện" },
  info:    { icon: "info",                  color: "#0077ED", bg: "bg-vnd-primary-50", fg: "text-vnd-primary-700", ring: "ring-vnd-primary-200", label: "Thông tin" }
};

// ---- The new dashboard screen ----
function ScreenDworkDashboard({ onNavigate }) {
  // Roll up progress across cards
  const totalSteps = SETUP_CARDS.reduce((s, c) => s + c.items.filter(i => i.status !== "info").length, 0);
  const doneSteps  = SETUP_CARDS.reduce((s, c) => s + c.items.filter(i => i.status === "done").length, 0);
  const pct = Math.round((doneSteps / totalSteps) * 100);

  return (
    <>
      {/* HERO: welcome + setup progress — compact */}
      <section className="bg-white border-b border-outline-variant/40">
        <div className="max-w-[1440px] mx-auto px-8 py-4">
          <div className="rounded-2xl bg-mesh-blue ring-1 ring-vnd-primary-900/5 px-5 py-4 relative overflow-hidden">
            <div className="relative flex items-center gap-4 flex-wrap">
              {/* Greeting */}
              <div className="flex items-center gap-3 min-w-0 flex-1">
                <Avatar initials={ADVISOR.initials} size={44} tone="blue" />
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.18em] font-bold text-vnd-primary-500/80">Khởi đầu tại IPAG</p>
                  <p className="font-display text-title-lg text-vnd-primary-900 leading-tight">
                    Chào mừng <span className="text-vnd-primary-500">{ADVISOR.name}</span>
                  </p>
                  <p className="text-[12px] text-on-surface-variant truncate mt-0.5">Hoàn tất thiết lập ban đầu để bắt đầu làm việc tại IPAG.</p>
                </div>
              </div>

              {/* Inline progress */}
              <div className="flex items-center gap-4 bg-white/80 backdrop-blur ring-1 ring-vnd-primary-900/10 rounded-xl px-4 py-2.5">
                <div className="text-right">
                  <p className="text-[9.5px] uppercase tracking-wider font-bold text-on-surface-variant leading-tight">Tiến độ</p>
                  <p className="font-display font-bold text-title-md text-vnd-primary-900 font-mono leading-none mt-0.5">
                    {doneSteps}<span className="text-on-surface-variant/60">/{totalSteps}</span>
                    <span className="text-[11px] text-on-surface-variant font-sans font-medium ml-1.5">bước</span>
                  </p>
                </div>
                <div className="w-32 h-2 rounded-full bg-surface-container-high overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-vnd-primary-500 to-vnd-accent-green transition-[width] duration-500"
                       style={{ width: pct + "%" }}></div>
                </div>
                <span className="text-[11.5px] font-mono font-semibold text-vnd-primary-700 tabular-nums">{pct}%</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4 LA BÀN — SPOTLIGHT */}
      <Page wide>
        <div className="relative">
          {/* Spotlight glow */}
          <div className="absolute -inset-x-4 -inset-y-6 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(0,119,237,0.10)_0%,_rgba(0,119,237,0.04)_35%,_transparent_70%)]"></div>
          </div>

          {/* Section heading */}
          <div className="relative flex items-end justify-between gap-4 mb-4 flex-wrap">
            <div>
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-vnd-primary-50 ring-1 ring-vnd-primary-200 mb-2">
                <span className="relative flex w-1.5 h-1.5">
                  <span className="absolute inset-0 rounded-full bg-vnd-primary-500 animate-pulse-soft"></span>
                  <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-vnd-primary-500"></span>
                </span>
                <span className="text-[10.5px] uppercase tracking-wider font-bold text-vnd-primary-700">Trọng tâm thiết lập</span>
              </div>
              <h2 className="font-display text-headline-md text-vnd-primary-900">4 La Bàn định hướng</h2>
              <p className="text-[13px] text-on-surface-variant mt-1">Mỗi La Bàn là một trục thiết lập độc lập — hoàn tất theo thứ tự bất kỳ.</p>
            </div>
            <div className="hidden md:flex items-center gap-2 text-[11.5px] text-on-surface-variant">
              <Icon name="touch_app" size={14} className="text-vnd-primary-500" />
              <span>Hover vào <Icon name="info" size={11} className="inline" /> trên mỗi La Bàn để xem mục đích</span>
            </div>
          </div>

          <div className="relative grid grid-cols-12 gap-4">
            {SETUP_CARDS.map(card => (
              <SetupCard key={card.id} card={card} onNavigate={onNavigate} />
            ))}
          </div>
        </div>

        {/* HELP BAR */}
        <HelpBar />
      </Page>
    </>
  );
}

// ---- SetupCard ----
function SetupCard({ card, onNavigate }) {
  const [tipOpen, setTipOpen] = useState(false);
  const stepItems = card.items.filter(i => i.status !== "info");
  const done = stepItems.filter(i => i.status === "done").length;
  const total = stepItems.length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div className="col-span-12 md:col-span-6 bg-white rounded-2xl shadow-soft ring-1 ring-vnd-primary-900/5 overflow-hidden flex flex-col group hover:shadow-lift hover:-translate-y-0.5 transition-all duration-200">
      {/* Accent bar */}
      <div className={`h-1 ${card.accentBar}`}></div>

      {/* Header */}
      <div className="px-6 pt-5 pb-4 flex items-start gap-3 border-b border-outline-variant/40">
        <div className={`w-12 h-12 rounded-xl ${card.chipBg} ${card.chipText} flex items-center justify-center flex-shrink-0 ring-1 ring-inset ring-current/10`}>
          <Icon name={card.icon} size={26} filled />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="font-display font-bold text-title-lg text-vnd-primary-900">{card.title}</h2>
            <div className="relative">
              <button
                onMouseEnter={() => setTipOpen(true)}
                onMouseLeave={() => setTipOpen(false)}
                onFocus={() => setTipOpen(true)}
                onBlur={() => setTipOpen(false)}
                className="w-6 h-6 rounded-full text-on-surface-variant hover:text-vnd-primary-500 hover:bg-vnd-primary-50 flex items-center justify-center transition-colors"
                aria-label={`Tìm hiểu thêm về ${card.title}`}>
                <Icon name="info" size={15} />
              </button>
              {tipOpen && <CompassTooltip card={card} />}
            </div>
          </div>
          <p className="text-[13px] text-on-surface-variant mt-0.5">{card.subtitle}</p>
        </div>

        <div className="text-right flex-shrink-0">
          <p className="text-[10.5px] uppercase tracking-wider font-bold text-on-surface-variant">Tiến độ</p>
          <p className="font-display font-bold text-title-md text-vnd-primary-900 font-mono mt-0.5">
            {done}<span className="text-on-surface-variant/60">/{total || card.items.length}</span>
          </p>
        </div>
      </div>

      {/* Intro */}
      <div className="px-6 pt-4">
        <p className="text-[13px] font-semibold text-on-surface">{card.intro}:</p>
      </div>

      {/* Setup items */}
      <ul className="px-6 py-3 space-y-2 flex-1">
        {card.items.map((it, i) => <SetupItem key={i} item={it} num={it.num ?? null} fallbackIcon={it.icon} />)}
      </ul>

      {/* Footer: progress bar + CTA */}
      <div className="px-6 pb-5 pt-2">
        {total > 0 && (
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-1.5 rounded-full bg-surface-container-high overflow-hidden">
              <div className={`h-full ${card.accentBar} transition-[width] duration-500`} style={{ width: pct + "%" }}></div>
            </div>
            <span className="text-[11px] font-mono text-on-surface-variant">{pct}%</span>
          </div>
        )}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <Button tone="primary" size="sm" iconRight={card.cta.icon}
                  onClick={() => onNavigate?.(card.cta.route)}>
            {card.cta.label}
          </Button>
          <button className="inline-flex items-center gap-1 text-[12px] text-on-surface-variant hover:text-vnd-primary-500 font-medium">
            <Icon name="info" size={13} /> Tìm hiểu thêm
          </button>
        </div>
      </div>
    </div>
  );
}

// ---- Individual setup row ----
function SetupItem({ item, num, fallbackIcon }) {
  const meta = STATUS_META[item.status];
  return (
    <li className="flex items-start gap-3 p-3 rounded-xl hover:bg-surface-container-low transition-colors -mx-1">
      {/* Step number or item icon */}
      {num != null ? (
        <span className="w-7 h-7 rounded-lg bg-surface-container-low text-on-surface-variant font-mono font-bold text-[12px] flex items-center justify-center flex-shrink-0 ring-1 ring-outline-variant/40">
          {num}
        </span>
      ) : (
        <span className="w-7 h-7 rounded-lg bg-surface-container-low text-on-surface-variant flex items-center justify-center flex-shrink-0 ring-1 ring-outline-variant/40">
          <Icon name={fallbackIcon || "circle"} size={14} />
        </span>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-[13px] font-semibold text-on-surface">{item.label}</p>
          <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10.5px] font-semibold ring-1 ring-inset ${meta.bg} ${meta.fg} ${meta.ring}`}>
            <Icon name={meta.icon} size={11} filled={item.status === "done"} />
            {item.value}
          </span>
        </div>
        <p className="text-[11.5px] text-on-surface-variant mt-1 leading-relaxed">{item.note}</p>
      </div>
    </li>
  );
}

// ---- Tooltip on info hover ----
function CompassTooltip({ card }) {
  return (
    <div className="absolute top-7 left-1/2 -translate-x-1/2 z-30 w-[300px] bg-white rounded-xl shadow-lift ring-1 ring-outline-variant/60 p-4 animate-fade-in">
      <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 ring-1 ring-outline-variant/60"></div>
      <div className="relative">
        <div className="flex items-center gap-2 mb-2">
          <span className={`w-7 h-7 rounded-lg ${card.chipBg} ${card.chipText} flex items-center justify-center`}>
            <Icon name={card.icon} size={15} filled />
          </span>
          <p className="font-display font-semibold text-[13px] text-vnd-primary-900">{card.title} — {card.subtitle}</p>
        </div>
        <p className="text-[11.5px] text-on-surface-variant mb-2 font-semibold">Hỗ trợ thiết lập:</p>
        <ul className="space-y-1 mb-3">
          {card.tooltip.bullets.map((b, i) => (
            <li key={i} className="text-[12px] text-on-surface flex items-start gap-1.5 leading-snug">
              <span className="w-1 h-1 rounded-full bg-on-surface-variant mt-1.5 flex-shrink-0"></span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
        <div className="bg-vnd-primary-50 rounded-lg px-3 py-2">
          <p className="text-[10.5px] font-bold uppercase tracking-wider text-vnd-primary-700 mb-1 inline-flex items-center gap-1">
            <Icon name="push_pin" size={11} filled /> Mục đích
          </p>
          <p className="text-[11.5px] text-on-surface leading-relaxed">{card.tooltip.purpose}</p>
        </div>
      </div>
    </div>
  );
}

// ---- Help bar ----
function HelpBar() {
  return (
    <div className="mt-5 rounded-2xl bg-white ring-1 ring-vnd-primary-900/5 shadow-soft overflow-hidden">
      <div className="grid grid-cols-12">
        <div className="col-span-12 lg:col-span-8 px-6 py-5">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="info" size={16} className="text-vnd-primary-500" filled />
            <p className="font-display font-semibold text-title-md text-vnd-primary-900">Hỗ trợ</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button tone="outline" size="sm" icon="menu_book">Tài liệu hướng dẫn</Button>
            <Button tone="outline" size="sm" icon="chat">Liên hệ HR</Button>
            <Button tone="outline" size="sm" icon="mail">Liên hệ Servant Manager</Button>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-4 bg-gradient-to-br from-vnd-primary-900 via-vnd-primary-700 to-vnd-primary-500 text-white px-6 py-5 flex items-center gap-4 relative overflow-hidden">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 rounded-full bg-vnd-accent-green/30 blur-3xl"></div>
          <button className="relative w-14 h-14 rounded-full bg-white/15 hover:bg-white/25 transition-colors flex items-center justify-center flex-shrink-0 ring-2 ring-white/40">
            <Icon name="play_arrow" size={28} filled className="text-white translate-x-0.5" />
          </button>
          <div className="relative min-w-0">
            <p className="text-[10.5px] uppercase tracking-wider font-bold text-white/70">Video hướng dẫn</p>
            <p className="font-display font-semibold text-[14px] truncate">"Khởi đầu tại IPAG"</p>
            <p className="text-[11px] text-white/70 mt-0.5">Tổng quan 4 La Bàn · 4 phút</p>
          </div>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ScreenDworkDashboard });
