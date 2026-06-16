/* global React, window */
const { PIPELINE_STAGES, LEADS, ACTIVE_CLIENTS, INTERACTIONS, ALLOCATION, ONBOARD_STEPS } = window.DSB_DATA;

// ============== CLIENT ZONE WRAPPER ==============
function ScreenDworkClients({ route, onNavigate }) {
  // Profile id lives in the route (dwork/clients/<id>) so the shell can hide
  // the module nav bar on the detail screen.
  const profileId = (route || "").split("/")[2] || null;

  if (profileId) {
    const ClientProfileScreen = window.ClientProfileScreen;
    return <ClientProfileScreen id={profileId} onBack={() => onNavigate("dwork/clients")} />;
  }
  return <ActiveClients onOpen={(id) => onNavigate("dwork/clients/" + id)} />;
}

// ============== LEAD KANBAN ==============
function LeadKanban() {
  const [board, setBoard] = useState(() => {
    const map = {};
    PIPELINE_STAGES.forEach(s => map[s.id] = LEADS.filter(l => l.stage === s.id));
    return map;
  });
  const [dragId, setDragId] = useState(null);
  const [filter, setFilter] = useState({ priority: "all", hot: false, owner: "me" });
  const [detail, setDetail] = useState(null);
  const toast = useToast();

  const onDragStart = (lead) => (e) => {
    setDragId(lead.id);
    e.dataTransfer.effectAllowed = "move";
  };
  const onDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = "move"; };
  const onDrop = (stageId) => (e) => {
    e.preventDefault();
    setBoard(prev => {
      const next = { ...prev };
      let moved = null;
      for (const k of Object.keys(next)) {
        const idx = next[k].findIndex(l => l.id === dragId);
        if (idx >= 0) { moved = { ...next[k][idx], stage: stageId }; next[k] = next[k].filter(l => l.id !== dragId); }
      }
      if (moved) next[stageId] = [moved, ...next[stageId]];
      return next;
    });
    setDragId(null);
    toast?.("Đã chuyển stage", { tone: "success", icon: "swap_horiz" });
  };

  const totalValue = Object.values(board).flat().reduce((s, l) => s + l.value, 0);

  return (
    <div className="px-8 py-6">
      <div className="flex items-center justify-between gap-4 mb-4 flex-wrap">
        <FilterBar>
          <ChipToggle active={filter.priority === "all"} onClick={() => setFilter(f => ({ ...f, priority: "all" }))}>Tất cả</ChipToggle>
          <ChipToggle active={filter.priority === "P1"} onClick={() => setFilter(f => ({ ...f, priority: "P1" }))} icon="circle">P1</ChipToggle>
          <ChipToggle active={filter.priority === "P2"} onClick={() => setFilter(f => ({ ...f, priority: "P2" }))} icon="circle">P2</ChipToggle>
          <ChipToggle active={filter.hot} onClick={() => setFilter(f => ({ ...f, hot: !f.hot }))} icon="local_fire_department">Hot only</ChipToggle>
          <div className="w-px h-5 bg-outline-variant mx-1"></div>
          <ChipToggle active={filter.owner === "me"} onClick={() => setFilter(f => ({ ...f, owner: "me" }))} icon="person">Của tôi</ChipToggle>
          <ChipToggle active={filter.owner === "team"} onClick={() => setFilter(f => ({ ...f, owner: "team" }))} icon="groups">Cả team</ChipToggle>
        </FilterBar>
        <div className="flex items-center gap-3 text-[12.5px]">
          <span className="text-on-surface-variant">Pipeline value:</span>
          <span className="font-display font-bold text-vnd-primary-900 text-headline-sm font-mono">{(totalValue / 1000).toFixed(2)} tỷ</span>
          <span className="w-px h-4 bg-outline-variant"></span>
          <Button tone="ghost" size="sm" icon="dashboard">Kanban</Button>
          <Button tone="ghost" size="sm" icon="view_list">List</Button>
        </div>
      </div>

      <div className="grid grid-cols-6 gap-3 min-w-0 overflow-x-auto pb-4 scrollbar-thin">
        {PIPELINE_STAGES.map((s, idx) => {
          const cards = (board[s.id] || []).filter(l =>
            (filter.priority === "all" || l.priority === filter.priority) &&
            (!filter.hot || l.tag === "Hot")
          );
          return (
            <div key={s.id} className="min-w-[260px] flex flex-col"
              onDragOver={onDragOver} onDrop={onDrop(s.id)}>
              <div className={`px-3 py-2.5 rounded-t-xl border ${s.accent} ${s.tint}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-white/70 text-[11px] font-bold text-vnd-primary-900 flex items-center justify-center font-mono">{idx + 1}</span>
                    <p className="font-display font-semibold text-[13px] text-vnd-primary-900">{s.label}</p>
                  </div>
                  <span className="text-[11px] font-mono text-on-surface-variant bg-white/70 rounded-md px-1.5 py-0.5">{cards.length}</span>
                </div>
                <p className="text-[11px] text-on-surface-variant mt-1 font-mono">{s.value}</p>
              </div>
              <div className={`flex-1 min-h-[400px] p-2 space-y-2 bg-surface-container-low/60 rounded-b-xl border border-t-0 ${s.accent}`}>
                {cards.map(l => (
                  <article
                    key={l.id} draggable
                    onClick={() => setDetail(l)}
                    onDragStart={onDragStart(l)}
                    className={`kanban-card bg-white rounded-lg p-3 ring-1 ring-outline-variant/30 hover:shadow-lift hover:ring-vnd-primary-300 cursor-grab transition-all ${dragId === l.id ? "opacity-50" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Avatar initials={l.avatarSeed} size={28} tone={["blue","green","amber","purple","slate","rose"][LEADS.indexOf(l) % 6]} />
                        <div className="min-w-0">
                          <p className="text-[12.5px] font-semibold text-on-surface truncate">{l.name}</p>
                          <p className="text-[10.5px] text-on-surface-variant truncate">{l.company}</p>
                        </div>
                      </div>
                      <PriorityPill level={l.priority} />
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="font-mono text-[12.5px] font-bold text-vnd-primary-900">
                        {l.value >= 1000 ? `${(l.value/1000).toFixed(2)}T` : `${l.value}M`}
                      </span>
                      {l.tag === "Hot" && <Badge tone="red" size="xs" icon="local_fire_department">Hot</Badge>}
                      {l.tag === "VIP" && <Badge tone="purple" size="xs" icon="diamond">VIP</Badge>}
                    </div>
                    <div className="flex items-center justify-between mt-2.5 pt-2.5 border-t border-outline-variant/30">
                      <span className="text-[10.5px] text-on-surface-variant truncate">{l.source}</span>
                      <span className="text-[10.5px] text-on-surface-variant font-mono">{l.lastTouch}</span>
                    </div>
                  </article>
                ))}
                <button className="w-full py-2 rounded-lg border border-dashed border-outline-variant/60 text-[11.5px] text-on-surface-variant hover:bg-white hover:border-vnd-primary-500 hover:text-vnd-primary-700 transition-colors">
                  + Thêm lead
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <LeadDetailModal lead={detail} onClose={() => setDetail(null)} />
    </div>
  );
}

function LeadDetailModal({ lead, onClose }) {
  if (!lead) return null;
  return (
    <Modal open={!!lead} onClose={onClose} title={lead.name} sub={`${lead.company} · ${lead.id}`}
      size="lg"
      footer={
        <>
          <Button tone="ghost" onClick={onClose}>Đóng</Button>
          <Button tone="outline" icon="event">Đặt lịch</Button>
          <Button tone="primary" icon="arrow_forward">Chuyển stage tiếp</Button>
        </>
      }>
      <div className="grid grid-cols-12 gap-5">
        <div className="col-span-12 md:col-span-7 space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <PriorityPill level={lead.priority} />
            <Badge tone="blue" size="sm" icon="source">{lead.source}</Badge>
            {lead.tag === "Hot" && <Badge tone="red" size="sm" icon="local_fire_department">Hot lead</Badge>}
            {lead.nac && <Badge tone="amber" size="sm" icon="campaign">NAC Alert</Badge>}
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">Ghi chú gần nhất</p>
            <p className="text-[14px] text-on-surface mt-1.5">{lead.note}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <KV label="SĐT" value={lead.phone} icon="call" />
            <KV label="Last touch" value={lead.lastTouch} icon="schedule" />
            <KV label="Giá trị dự kiến" value={`${lead.value >= 1000 ? (lead.value/1000).toFixed(2)+" tỷ" : lead.value+" tr"}`} icon="payments" />
            <KV label="Nguồn" value={lead.source} icon="route" />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold mb-2">Action ngắn</p>
            <div className="flex gap-2 flex-wrap">
              <Button size="sm" tone="outline" icon="call">Gọi</Button>
              <Button size="sm" tone="outline" icon="chat">Zalo</Button>
              <Button size="sm" tone="outline" icon="mail">Email</Button>
              <Button size="sm" tone="outline" icon="event">Đặt lịch hẹn</Button>
              <Button size="sm" tone="soft" icon="auto_awesome">AI: soạn outreach</Button>
            </div>
          </div>
        </div>
        <div className="col-span-12 md:col-span-5">
          <div className="rounded-xl bg-surface-container-low p-4">
            <p className="text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold mb-3">Stage hiện tại</p>
            <ol className="space-y-2">
              {PIPELINE_STAGES.map((s, i) => {
                const idx = PIPELINE_STAGES.findIndex(x => x.id === lead.stage);
                const done = i < idx, current = i === idx;
                return (
                  <li key={s.id} className={`flex items-center gap-2.5 text-[12.5px]
                    ${current ? "text-vnd-primary-900 font-semibold" : done ? "text-emerald-700" : "text-on-surface-variant"}`}>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold
                      ${current ? "bg-vnd-primary-500 text-white" : done ? "bg-emerald-500 text-white" : "bg-surface-container-high text-on-surface-variant"}`}>
                      {done ? <Icon name="check" size={12} /> : i + 1}
                    </span>
                    <span className="flex-1">{s.label}</span>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </Modal>
  );
}

function KV({ label, value, icon }) {
  return (
    <div className="rounded-lg bg-surface-container-low/80 p-3">
      <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold flex items-center gap-1.5">
        {icon && <Icon name={icon} size={12} />}{label}
      </p>
      <p className="text-[13.5px] font-semibold text-on-surface mt-1">{value}</p>
    </div>
  );
}

// ============== ONBOARDING STEPPER ==============
function OnboardingStepper() {
  const [activeCase, setActiveCase] = useState(0);
  const cases = [
    { client: "Trần Ngọc Nhi", id: "ON-441", progress: 57, current: "Risk Profiling", since: "2 ngày" },
    { client: "Phạm Quốc Bảo", id: "ON-440", progress: 28, current: "AML/PEP Check", since: "5 ngày" },
    { client: "Hoàng Thị Mai", id: "ON-438", progress: 86, current: "Cấp tài khoản", since: "Hôm nay" }
  ];
  return (
    <div className="px-8 py-6 grid grid-cols-12 gap-5">
      <Card className="col-span-12 lg:col-span-3 p-3">
        <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold px-3 mb-2">Onboard đang chạy · 3</p>
        <ul className="space-y-1">
          {cases.map((c, i) => (
            <li key={c.id}>
              <button onClick={() => setActiveCase(i)}
                className={`w-full text-left p-3 rounded-xl transition-all
                  ${activeCase === i ? "bg-vnd-primary-50 ring-1 ring-vnd-primary-200" : "hover:bg-surface-container-low"}`}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[13px] font-semibold text-on-surface">{c.client}</span>
                  <Badge tone={activeCase === i ? "blue" : "neutral"} size="xs">{c.id}</Badge>
                </div>
                <p className="text-[11px] text-on-surface-variant mb-2">Đang: {c.current} · {c.since}</p>
                <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-vnd-primary-500 rounded-full transition-all" style={{ width: c.progress + "%" }}></div>
                </div>
                <p className="text-[10.5px] font-mono text-on-surface-variant mt-1">{c.progress}% · 4/7 bước</p>
              </button>
            </li>
          ))}
          <li>
            <button className="w-full p-3 rounded-xl border border-dashed border-outline-variant text-[12px] text-on-surface-variant hover:border-vnd-primary-500 hover:text-vnd-primary-700">
              <Icon name="add" size={14} className="inline mr-1" />Khởi tạo onboard mới
            </button>
          </li>
        </ul>
      </Card>

      <Card className="col-span-12 lg:col-span-9 p-7">
        <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-vnd-primary-500/80 font-bold">Onboarding · ON-441</p>
            <h2 className="font-display text-headline-md text-vnd-primary-900 mt-1">Trần Ngọc Nhi · Boutique 21</h2>
            <p className="text-[13px] text-on-surface-variant mt-1">Bắt đầu 14/05/2026 · SLA còn 3 ngày · 4/7 bước hoàn tất</p>
          </div>
          <div className="flex gap-2">
            <Button tone="outline" size="sm" icon="description">Hồ sơ KH</Button>
            <Button tone="primary" size="sm" icon="check_circle">Đánh dấu hoàn tất bước</Button>
          </div>
        </div>

        {/* Stepper visual */}
        <ol className="grid grid-cols-7 mb-8">
          {ONBOARD_STEPS.map((s, i) => {
            const state = s.state;
            const styles = {
              done: { circle: "bg-emerald-500 text-white", bar: "bg-emerald-500", text: "text-emerald-700" },
              current: { circle: "bg-vnd-primary-500 text-white ring-4 ring-vnd-primary-200 animate-pulse-soft", bar: "bg-surface-container-high", text: "text-vnd-primary-900" },
              pending: { circle: "bg-surface-container-high text-on-surface-variant", bar: "bg-surface-container-high", text: "text-on-surface-variant" }
            }[state];
            return (
              <li key={s.id} className="relative flex flex-col items-center text-center pb-1">
                {i < ONBOARD_STEPS.length - 1 && (
                  <span className={`absolute top-4 left-1/2 right-[-50%] h-0.5 ${i < ONBOARD_STEPS.findIndex(x => x.state === "current") ? "bg-emerald-500" : "bg-surface-container-high"}`}></span>
                )}
                <span className={`relative z-10 w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-[12px] ${styles.circle}`}>
                  {state === "done" ? <Icon name="check" size={16} weight={600} /> : s.id}
                </span>
                <span className={`mt-2 text-[11px] font-semibold leading-tight max-w-[100px] ${styles.text}`}>{s.label}</span>
                {s.gate && <Badge tone="amber" size="xs" className="mt-1.5" icon="security">Gate</Badge>}
              </li>
            );
          })}
        </ol>

        {/* Step detail */}
        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-12 lg:col-span-7 rounded-2xl ring-1 ring-vnd-primary-200 bg-vnd-primary-50/60 p-5">
            <div className="flex items-center gap-3 mb-3">
              <Badge tone="blue" size="sm" icon="bolt">Đang xử lý</Badge>
              <h4 className="font-display text-title-md text-vnd-primary-900">Bước 4 · Risk Profiling</h4>
            </div>
            <p className="text-[13px] text-on-surface mb-4">KH đang hoàn thành bộ câu hỏi xác định khẩu vị rủi ro (20 câu).</p>
            <div className="rounded-xl bg-white p-4 ring-1 ring-outline-variant/30">
              <div className="flex items-center justify-between mb-3">
                <p className="text-[12.5px] font-semibold">Tiến độ KH thực hiện</p>
                <span className="font-mono text-[12px] font-bold text-vnd-primary-700">12/20 câu</span>
              </div>
              <div className="h-2 bg-surface-container-high rounded-full overflow-hidden">
                <div className="h-full bg-vnd-primary-500 rounded-full" style={{ width: "60%" }}></div>
              </div>
              <div className="grid grid-cols-3 gap-2 mt-4">
                {["Risk Tolerance","Time Horizon","Liquidity Need"].map((c, i) => (
                  <div key={c} className="text-center rounded-lg bg-surface-container-low p-2">
                    <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-semibold">{c}</p>
                    <p className="font-display font-bold text-[14px] text-vnd-primary-900 mt-1">{["Trung bình","8 năm","Thấp"][i]}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <Button size="sm" tone="primary" icon="send">Nhắc KH hoàn thành</Button>
              <Button size="sm" tone="ghost" icon="open_in_new">Mở form KH</Button>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-5 space-y-3">
            <div className="rounded-2xl ring-1 ring-outline-variant/30 p-5">
              <p className="text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold mb-3">Compliance Gates</p>
              <ul className="space-y-2.5">
                {[
                  { label: "eKYC", state: "done", note: "Liveness pass" },
                  { label: "AML / PEP", state: "done", note: "Watchlist clear" },
                  { label: "Risk Profile", state: "current", note: "60% hoàn tất" },
                  { label: "Source of funds", state: "pending", note: "Pending" }
                ].map((g, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full
                      ${g.state === "done" ? "bg-emerald-500" : g.state === "current" ? "bg-vnd-primary-500 animate-pulse-soft" : "bg-outline-variant"}`}></span>
                    <span className="flex-1 text-[12.5px] font-medium">{g.label}</span>
                    <span className="text-[11px] text-on-surface-variant">{g.note}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-vnd-primary-900 text-white p-5">
              <p className="text-[11px] uppercase tracking-wider text-white/60 font-semibold">Handoff dự kiến</p>
              <p className="font-display text-title-md mt-1">Trần Quân (CA)</p>
              <p className="text-[11.5px] text-white/70 mt-1">17/05/2026 · sau khi hoàn tất bước 7</p>
              <Button size="xs" tone="ghost" className="bg-white/10 text-white mt-3" icon="forward">Chuyển sớm</Button>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-7">
          <p className="text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold mb-3">Lịch sử các bước</p>
          <ol className="relative pl-6 space-y-3 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-outline-variant/40">
            {ONBOARD_STEPS.map(s => (
              <li key={s.id} className="relative">
                <span className={`absolute -left-[18px] top-1 w-3 h-3 rounded-full ring-4 ring-white
                  ${s.state === "done" ? "bg-emerald-500" : s.state === "current" ? "bg-vnd-primary-500" : "bg-outline-variant"}`}></span>
                <div className="flex items-center justify-between text-[13px]">
                  <p>
                    <span className="font-semibold text-on-surface">{s.label}</span>
                    <span className="text-on-surface-variant ml-2 text-[12px]">— {s.note}</span>
                  </p>
                  <span className="font-mono text-[11.5px] text-on-surface-variant">{s.at}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Card>
    </div>
  );
}

// ============== ACTIVE CLIENTS LIST ==============
// Moved to src/dwork-client-list.jsx (rebuilt per DSB spec:
// T0/T-1 toggle, Smart Views, filter builder, micro-input, inline actions).
// `ActiveClients` is provided globally by that file.

// NOTE: ClientProfileScreen + its 4 tabs moved to src/client-profile.jsx and
// src/cp-*.jsx (rebuilt per DSB sitemap). Resolved off window at render time.

Object.assign(window, { ScreenDworkClients });
