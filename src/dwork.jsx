/* global React, window */
const { ADVISOR: ADV, TASKS, ACTIVE_CLIENTS: AC, OM_LIST, ANNOUNCEMENTS: AN, KPI_VALUE, KPI_TRAD, ALLOCATION } = window.DSB_DATA;

// ============== DWORK · DASHBOARD ==============
function ScreenDworkDashboard({ onNavigate }) {
  const [view, setView] = useState("onboard");
  const [editMode, setEditMode] = useState(false);
  const views = [
    { id: "onboard", label: "Onboarding", icon: "person_add", count: 14 },
    { id: "exec", label: "Executive Summary", icon: "dashboard" },
    { id: "market", label: "Market Intelligence", icon: "show_chart" },
    { id: "nac", label: "NAC Dashboard", icon: "campaign", count: 18 },
    { id: "tasks", label: "Daily Tasks", icon: "task_alt", count: TASKS.filter(t => !t.done).length },
    { id: "comm", label: "Communication Triggers", icon: "forum", count: 6 }
  ];
  return (
    <>
      <PageHeader
        eyebrow="dWork · Cockpit hằng ngày"
        title="Hôm nay làm gì với KH nào?"
        sub={`Chào ${ADV.shortName} — bạn có 4 việc P1 và 2 NAC alert cần xử lý trước trưa.`}
        actions={
          <>
            <Button tone="ghost" icon="palette" size="sm" onClick={() => setEditMode(e => !e)}>{editMode ? "Đang chỉnh" : "Tuỳ biến"}</Button>
            <Button tone="outline" icon="file_download" size="sm">Xuất báo cáo</Button>
            <Button tone="primary" icon="add" size="sm">Thêm widget</Button>
          </>
        }
        tabs={views} tabValue={view} onTab={setView}
      />
      <Page>
        {view === "exec" && <ExecutiveView onNavigate={onNavigate} editMode={editMode} />}
        {view === "market" && <MarketView />}
        {view === "nac" && <NacView onNavigate={onNavigate} />}
        {view === "onboard" && <OnboardingView onNavigate={onNavigate} />}
        {view === "tasks" && <TasksView />}
        {view === "comm" && <CommView />}
      </Page>
    </>
  );
}

function ExecutiveView({ onNavigate, editMode }) {
  const trend7 = [42, 58, 51, 71, 88, 76, 62];
  const trend30 = [62, 65, 70, 68, 72, 75, 78, 82, 79, 85, 88, 86, 91, 94];
  const [range, setRange] = useState("7d");
  const data = range === "7d" ? trend7 : trend30;
  return (
    <div className="grid grid-cols-12 gap-4">
      {/* KPI row */}
      {[
        { label: "Lead đang chăm sóc", value: "1,284", trend: 12.0, icon: "diversity_3", tone: "blue", sub: "+45 lead tuần này" },
        { label: "Doanh thu dự kiến", value: "4.2 tỷ", trend: 8.4, icon: "payments", tone: "green", sub: "Pipeline weighted" },
        { label: "Onboard đang chạy", value: "12", trend: -4.2, icon: "fact_check", tone: "amber", sub: "3 vướng compliance" },
        { label: "AUM phụ trách", value: "184 tỷ", trend: 6.8, icon: "stacked_line_chart", tone: "purple", sub: "Active clients · 128" }
      ].map((k, i) => (
        <div key={i} className={`col-span-12 md:col-span-6 xl:col-span-3 ${editMode ? "ring-2 ring-dashed ring-vnd-primary-300" : ""}`}>
          <Card>
            <Stat {...k} />
          </Card>
        </div>
      ))}

      {/* Performance chart */}
      <Card className="col-span-12 xl:col-span-8 p-7">
        <SectionTitle sub="Conversion lead → ký hợp đồng theo ngày"
          action={
            <div className="flex items-center gap-2">
              <ChipToggle active={range === "7d"} onClick={() => setRange("7d")}>7 ngày</ChipToggle>
              <ChipToggle active={range === "30d"} onClick={() => setRange("30d")}>30 ngày</ChipToggle>
              <Button tone="ghost" size="sm" icon="open_in_new">Phân tích</Button>
            </div>
          }>Tiến độ Hiệu suất</SectionTitle>
        <div className="relative">
          {/* gridlines */}
          <div className="absolute inset-0 grid grid-rows-4">
            {[0,1,2,3].map(i => <div key={i} className="border-t border-outline-variant/30"></div>)}
          </div>
          <BarChart
            data={data.map((v, i) => ({
              value: v,
              label: range === "7d" ? ["T2","T3","T4","T5","T6","T7","CN"][i] : "",
              highlight: range === "7d" ? i === 4 : i === data.length - 1
            }))}
            height={220}
          />
        </div>
        <div className="grid grid-cols-3 gap-6 mt-5 pt-5 border-t border-outline-variant/30">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">Win rate</p>
            <p className="font-display font-bold text-headline-md text-vnd-primary-900 mt-1">38.4%</p>
            <p className="text-[12px] text-emerald-700 font-medium">+2.1pp vs tuần trước</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">Avg deal size</p>
            <p className="font-display font-bold text-headline-md text-vnd-primary-900 mt-1">412 tr</p>
            <p className="text-[12px] text-emerald-700 font-medium">+18 tr</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">Cycle days</p>
            <p className="font-display font-bold text-headline-md text-vnd-primary-900 mt-1">14.2 d</p>
            <p className="text-[12px] text-red-600 font-medium">+0.8 d</p>
          </div>
        </div>
      </Card>

      {/* Allocation snapshot */}
      <Card className="col-span-12 xl:col-span-4 p-7">
        <SectionTitle sub="Tổng AUM portfolio">P&L Snapshot</SectionTitle>
        <div className="flex items-center justify-center my-1">
          <DonutChart data={ALLOCATION} size={180} thickness={20} centerValue="184 tỷ" centerLabel="AUM" />
        </div>
        <ul className="mt-4 space-y-1.5">
          {ALLOCATION.map((a, i) => (
            <li key={i} className="flex items-center gap-2 text-[12.5px]">
              <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: a.color }}></span>
              <span className="flex-1 text-on-surface">{a.label}</span>
              <span className="font-mono text-on-surface-variant">{a.pct}%</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* Today schedule */}
      <Card className="col-span-12 lg:col-span-7 xl:col-span-5">
        <SectionTitle sub="2 cuộc gặp · 4 task P1"
          action={<Button tone="link" size="sm" iconRight="arrow_forward" onClick={() => onNavigate("dwork/clients")}>Mở Client Zone</Button>}>
          Lịch trình hôm nay
        </SectionTitle>
        <ol className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-outline-variant/40">
          {[
            { time: "09:30", title: "Gặp anh Lê Văn Việt", sub: "Ký hợp đồng — Highlands Lê Lợi", tag: "P1", tone: "blue", live: true },
            { time: "11:00", title: "Call: Trần Ngọc Nhi", sub: "Review proposal V2 + chốt allocation", tag: "P1", tone: "blue" },
            { time: "13:30", title: "Compliance review", sub: "Bảo Logistics — kết quả AML check", tag: "P2", tone: "amber" },
            { time: "15:00", title: "Họp team Squad 04", sub: "Lộ trình Q4 + chia case khó", tag: "Team", tone: "purple" }
          ].map((e, i) => (
            <li key={i} className="relative group">
              <span className={`absolute -left-[18px] top-1 w-3 h-3 rounded-full ring-4 ring-white ${e.live ? "bg-vnd-accent-green animate-pulse-soft" : "bg-vnd-primary-500"}`}></span>
              <div className="flex items-start gap-3 p-3 -mx-3 rounded-xl hover:bg-surface-container-low transition-colors cursor-pointer">
                <span className="font-mono text-[12px] font-semibold text-vnd-primary-900 w-12 mt-0.5">{e.time}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13.5px] font-semibold text-on-surface flex items-center gap-2">
                    {e.title}
                    {e.live && <Badge tone="green" size="xs" icon="circle">Live</Badge>}
                  </p>
                  <p className="text-[12px] text-on-surface-variant mt-0.5">{e.sub}</p>
                </div>
                <Badge tone={e.tone} size="sm">{e.tag}</Badge>
              </div>
            </li>
          ))}
        </ol>
      </Card>

      {/* Pipeline snapshot */}
      <Card className="col-span-12 lg:col-span-5 xl:col-span-3 bg-vnd-primary-900 text-white relative overflow-hidden">
        <div className="absolute -top-12 -right-10 w-56 h-56 rounded-full bg-vnd-primary-500/30 blur-3xl"></div>
        <div className="absolute -bottom-16 -left-8 w-48 h-48 rounded-full bg-vnd-accent-green/20 blur-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <Badge tone="ghost" size="sm" icon="bolt" className="bg-white/10 text-white border-white/20">Pipeline</Badge>
            <button onClick={() => onNavigate("dwork/clients")} className="text-white/80 hover:text-white text-[11px] font-medium">
              Xem chi tiết <Icon name="arrow_forward" size={12} className="inline" />
            </button>
          </div>
          <p className="font-display text-display-sm font-bold mt-3 leading-none">41.1<span className="text-headline-md text-white/70 font-normal"> tỷ</span></p>
          <p className="text-[12px] text-white/70 mt-1">Tổng giá trị weighted · 6 stage</p>
          <div className="grid grid-cols-2 gap-2 mt-5">
            {[
              { l: "Nóng (P1)", v: "8 leads" },
              { l: "Đang BANT", v: "14 leads" },
              { l: "Lên lịch tuần này", v: "6" },
              { l: "Sắp đề xuất", v: "3" }
            ].map((s, i) => (
              <div key={i} className="bg-white/5 ring-1 ring-white/10 rounded-lg p-3">
                <p className="text-[10.5px] uppercase tracking-wider text-white/60">{s.l}</p>
                <p className="font-display font-semibold text-[15px] mt-0.5">{s.v}</p>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Priority clients */}
      <Card className="col-span-12 xl:col-span-4">
        <SectionTitle sub="P1 cadence · 6 KH"
          action={<Button tone="link" size="sm" iconRight="arrow_forward">Tất cả</Button>}>
          Khách hàng Ưu tiên
        </SectionTitle>
        <ul className="space-y-2 -mx-2">
          {AC.slice(0, 4).map(c => (
            <li key={c.id} className="flex items-center gap-3 px-2 py-2 rounded-lg hover:bg-surface-container-low cursor-pointer group">
              <Avatar initials={c.initials} tone={["blue","green","amber","purple"][AC.indexOf(c) % 4]} size={36} />
              <div className="flex-1 min-w-0">
                <p className="text-[13.5px] font-semibold text-on-surface truncate flex items-center gap-1.5">{c.name}
                  {c.flags.missedCall && <Icon name="phone_missed" size={13} className="text-red-500" />}
                  {c.flags.pendingReply && <Icon name="schedule" size={13} className="text-amber-600" />}
                </p>
                <p className="text-[11.5px] text-on-surface-variant truncate">{c.segment} · {c.cadence}</p>
              </div>
              <div className="text-right">
                <p className="font-mono text-[13px] font-semibold text-vnd-primary-900">{c.nav.toLocaleString("vi-VN")} tr</p>
                <p className="text-[10.5px] text-emerald-600 font-medium">+{c.pnlYtd}% YTD</p>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      {/* Communication triggers */}
      <Card className="col-span-12 xl:col-span-8">
        <SectionTitle sub="6 cảnh báo cần xử lý trong 24h"
          action={
            <div className="flex gap-2">
              <ChipToggle active>All (6)</ChipToggle>
              <ChipToggle>Missed call (2)</ChipToggle>
              <ChipToggle>Pending reply (3)</ChipToggle>
              <ChipToggle>Quá hạn cadence (1)</ChipToggle>
            </div>
          }>
          Communication Triggers
        </SectionTitle>
        <table className="w-full text-left text-[13px]">
          <thead className="border-b border-outline-variant/40">
            <tr className="text-[10.5px] uppercase tracking-wider text-on-surface-variant font-semibold">
              <th className="pb-3 pr-3">Khách hàng</th>
              <th className="pb-3 pr-3">Trigger</th>
              <th className="pb-3 pr-3">Cadence</th>
              <th className="pb-3 pr-3">Last touch</th>
              <th className="pb-3 pr-3 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {[
              { c: AC[0], trig: "Missed call lúc 08:42", tIcon: "phone_missed", tTone: "red", action: "Callback" },
              { c: AC[4], trig: "Pending reply · 2 ngày", tIcon: "schedule", tTone: "amber", action: "Nhắn Zalo" },
              { c: AC[1], trig: "Quá hạn cadence P1", tIcon: "warning", tTone: "amber", action: "Liên hệ" },
              { c: AC[2], trig: "Pending reply email · 18h", tIcon: "schedule", tTone: "amber", action: "Trả lời" }
            ].map((row, i) => (
              <tr key={i} className="hover:bg-surface-container-low group">
                <td className="py-2.5 pr-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar initials={row.c.initials} size={28} tone={["blue","green","amber","purple"][i % 4]} />
                    <div>
                      <p className="font-semibold text-on-surface">{row.c.name}</p>
                      <p className="text-[11px] text-on-surface-variant">{row.c.segment}</p>
                    </div>
                  </div>
                </td>
                <td className="py-2.5 pr-3"><Badge tone={row.tTone} size="sm" icon={row.tIcon}>{row.trig}</Badge></td>
                <td className="py-2.5 pr-3 text-on-surface-variant">{row.c.cadence}</td>
                <td className="py-2.5 pr-3 font-mono text-[12px] text-on-surface-variant">3.5h trước</td>
                <td className="py-2.5 pr-3">
                  <div className="flex items-center justify-end gap-1">
                    <Button tone="ghost" size="xs" icon="call">Gọi</Button>
                    <Button tone="soft" size="xs">{row.action}</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Activity feed */}
      <Card className="col-span-12 xl:col-span-4">
        <SectionTitle sub="Updates từ team & hệ thống"
          action={<Button tone="ghost" size="xs" icon="filter_list">Lọc</Button>}>
          Activity Feed
        </SectionTitle>
        <ul className="space-y-3.5">
          {[
            { who: "Trần Quân (CA)", what: "đã hoàn tất handoff", obj: "Bảo Logistics", ago: "12 phút", icon: "handshake", tone: "green" },
            { who: "Hệ thống", what: "AML check thông qua", obj: "Đỗ Trung Kiên", ago: "1h", icon: "verified", tone: "blue" },
            { who: "Lê Khánh", what: "đã comment trong workflow", obj: "OM-879", ago: "2h", icon: "chat_bubble", tone: "purple" },
            { who: "Hệ thống", what: "Cảnh báo cadence P1", obj: "Trần Ngọc Nhi", ago: "3h", icon: "warning", tone: "amber" },
            { who: "Phạm Quỳnh", what: "chia sẻ sản phẩm mới", obj: "VPF Tích sản 5 năm", ago: "Hôm qua", icon: "share", tone: "blue" }
          ].map((a, i) => (
            <li key={i} className="flex gap-3">
              <span className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center
                ${{green:"bg-emerald-50 text-emerald-700", blue:"bg-vnd-primary-50 text-vnd-primary-700",
                   purple:"bg-fuchsia-50 text-fuchsia-700", amber:"bg-amber-50 text-amber-700"}[a.tone]}`}>
                <Icon name={a.icon} size={16} />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[12.5px] text-on-surface">
                  <span className="font-semibold">{a.who}</span> {a.what} <span className="font-semibold text-vnd-primary-700">{a.obj}</span>
                </p>
                <p className="text-[10.5px] text-on-surface-variant mt-0.5 font-mono">{a.ago}</p>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function MarketView() {
  const ticker = [
    { sym: "VN-Index", v: "1,278.42", d: 0.84 },
    { sym: "HNX-Index", v: "238.15", d: -0.22 },
    { sym: "USD/VND", v: "24,732", d: 0.05 },
    { sym: "Gold (oz)", v: "$2,651", d: 0.61 },
    { sym: "WTI Oil", v: "$74.20", d: -1.12 },
    { sym: "Bitcoin", v: "$67,420", d: 2.14 },
    { sym: "TPCP 10Y", v: "3.78%", d: -0.03 }
  ];
  return (
    <div className="space-y-4">
      {/* Ticker */}
      <Card padded={false} className="overflow-hidden">
        <div className="bg-vnd-primary-900 text-white px-5 py-3 flex items-center gap-2">
          <Icon name="show_chart" size={18} /> <span className="font-display font-semibold text-sm">Market Pulse — Live</span>
          <span className="ml-auto text-[11px] font-mono opacity-70">14:32:08 ICT</span>
        </div>
        <div className="overflow-hidden">
          <div className="ticker-track flex gap-10 whitespace-nowrap py-3.5 px-6">
            {[...ticker, ...ticker].map((t, i) => (
              <span key={i} className="inline-flex items-center gap-2 text-[13px]">
                <span className="font-display font-semibold">{t.sym}</span>
                <span className="font-mono">{t.v}</span>
                <span className={`font-mono font-bold ${t.d >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                  {t.d >= 0 ? "+" : ""}{t.d}%
                </span>
              </span>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-12 lg:col-span-8">
          <SectionTitle sub="Macro snapshot · cập nhật 14:30"
            action={<Button tone="ghost" size="sm" icon="open_in_new">Báo cáo phân tích</Button>}>
            Tình hình thị trường Việt Nam
          </SectionTitle>
          <div className="relative h-60 -mx-2">
            {/* simple SVG line chart */}
            <svg viewBox="0 0 600 220" className="w-full h-full">
              <defs>
                <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0077ED" stopOpacity="0.30" />
                  <stop offset="100%" stopColor="#0077ED" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[0,1,2,3,4].map(i => (
                <line key={i} x1="0" x2="600" y1={(i+1)*40} y2={(i+1)*40} stroke="#E1E2EB" strokeDasharray="3 4" />
              ))}
              <path d="M0,150 C60,140 90,120 130,118 C180,116 200,140 250,130 C300,120 320,80 380,72 C430,66 460,98 500,90 C540,84 570,60 600,52 L600,220 L0,220 Z" fill="url(#g1)" />
              <path d="M0,150 C60,140 90,120 130,118 C180,116 200,140 250,130 C300,120 320,80 380,72 C430,66 460,98 500,90 C540,84 570,60 600,52" stroke="#0077ED" strokeWidth="2.4" fill="none" />
              {/* second series (HNX) */}
              <path d="M0,170 C80,168 130,160 180,155 C230,150 260,170 310,168 C360,166 390,140 440,142 C500,144 540,128 600,118" stroke="#00C97D" strokeWidth="1.8" fill="none" strokeDasharray="4 3" />
              {["09:00","10:00","11:00","13:00","14:00","15:00"].map((t, i) => (
                <text key={t} x={i * 110 + 20} y="212" fontSize="10" fill="#727784" fontFamily="JetBrains Mono">{t}</text>
              ))}
            </svg>
          </div>
          <div className="flex items-center gap-4 mt-2 text-[12px]">
            <span className="inline-flex items-center gap-1.5"><span className="w-3 h-0.5 bg-vnd-primary-500"></span>VN-Index</span>
            <span className="inline-flex items-center gap-1.5"><span className="w-3 h-0.5 bg-vnd-accent-green border-dashed"></span>HNX-Index</span>
          </div>
        </Card>

        <Card className="col-span-12 lg:col-span-4">
          <SectionTitle sub="3 cảnh báo mới">Macro Alerts</SectionTitle>
          <ul className="space-y-3">
            {[
              { lvl: "warn", title: "VND yếu đi 0.6% trong tuần", body: "Cân nhắc rebalance USD allocation cho PE clients.", tone: "amber" },
              { lvl: "info", title: "SBV giữ lãi suất điều hành", body: "Trái phiếu doanh nghiệp 24T vẫn hấp dẫn.", tone: "blue" },
              { lvl: "info", title: "FED đảo chiều dovish", body: "Cơ hội cho equity emerging market quý sau.", tone: "blue" }
            ].map((a, i) => (
              <li key={i} className={`p-3 rounded-xl ring-1
                ${a.tone === "amber" ? "bg-amber-50 ring-amber-200" : "bg-vnd-primary-50/60 ring-vnd-primary-100"}`}>
                <p className="text-[13px] font-semibold text-vnd-primary-900">{a.title}</p>
                <p className="text-[12px] text-on-surface-variant mt-0.5">{a.body}</p>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="col-span-12">
          <SectionTitle sub="Top mover hôm nay">Cơ hội ngành</SectionTitle>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: "Ngân hàng", d: 2.4, summary: "Dòng tiền mạnh vào nhóm CP top 5", color: "vnd-primary-500" },
              { name: "Bất động sản KCN", d: 1.8, summary: "FDI Q3 tăng 18% so cùng kỳ", color: "vnd-accent-green" },
              { name: "Công nghệ", d: 3.2, summary: "Hưởng lợi từ chu kỳ AI, semicon", color: "anvie-primary" },
              { name: "Năng lượng", d: -1.1, summary: "Giá dầu điều chỉnh, áp lực ngắn hạn", color: "vnd-warning" }
            ].map((s, i) => (
              <div key={i} className="rounded-xl ring-1 ring-outline-variant/30 p-4 hover:shadow-soft transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <p className="font-display font-semibold text-on-surface">{s.name}</p>
                  <span className={`font-mono text-[13px] font-bold ${s.d >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                    {s.d >= 0 ? "+" : ""}{s.d}%
                  </span>
                </div>
                <p className="text-[12px] text-on-surface-variant mt-1.5 leading-snug">{s.summary}</p>
                <Sparkline data={[3,4,3.5,5,4.6,6,7,6.2,7.8,8.4]} width={180} height={28} stroke={`var(--tw-${s.color})`} />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}

function NacView({ onNavigate }) {
  const buckets = [
    { id: "P1", label: "P1 · Daily", count: 6, tone: "red", desc: "Liên hệ ngay trong 24h" },
    { id: "P2", label: "P2 · Weekly", count: 12, tone: "amber", desc: "Theo dõi trong tuần" },
    { id: "P3", label: "P3 · Bi-weekly", count: 28, tone: "blue", desc: "Update 2 tuần/lần" },
    { id: "P4", label: "P4 · Monthly", count: 82, tone: "neutral", desc: "Maintain tháng" }
  ];
  return (
    <div className="grid grid-cols-12 gap-4">
      {buckets.map(b => (
        <div key={b.id} className="col-span-12 md:col-span-6 xl:col-span-3">
          <Card className={`border-l-4 ${b.tone === "red" ? "border-l-red-500" : b.tone === "amber" ? "border-l-amber-500" : b.tone === "blue" ? "border-l-vnd-primary-500" : "border-l-outline-variant"}`}>
            <div className="flex items-start justify-between">
              <div>
                <Badge tone={b.tone === "neutral" ? "neutral" : b.tone} size="sm">{b.label}</Badge>
                <p className="font-display font-bold text-display-sm text-vnd-primary-900 mt-3">{b.count}</p>
                <p className="text-[12px] text-on-surface-variant mt-1">{b.desc}</p>
              </div>
              <button className="w-9 h-9 rounded-full bg-surface-container-low hover:bg-vnd-primary-50 text-vnd-primary-700 flex items-center justify-center">
                <Icon name="arrow_outward" size={16} />
              </button>
            </div>
          </Card>
        </div>
      ))}
      <Card className="col-span-12">
        <SectionTitle sub="18 KH có NAC alert chưa xử lý">NAC Alerts hôm nay</SectionTitle>
        <ul className="divide-y divide-outline-variant/20">
          {AC.map((c, i) => (
            <li key={c.id} className="flex items-center gap-4 py-3">
              <PriorityPill level={["P1","P1","P2","P3","P1","P1"][i] || "P3"} />
              <Avatar initials={c.initials} tone={["blue","green","amber","purple","rose","slate"][i % 6]} size={36} />
              <div className="flex-1 min-w-0">
                <p className="text-[13.5px] font-semibold text-on-surface">{c.name}</p>
                <p className="text-[12px] text-on-surface-variant">{c.cadence} · NAV {c.nav.toLocaleString("vi-VN")} tr · last touch 3.5h trước</p>
              </div>
              <Button size="sm" tone="outline" icon="call">Gọi</Button>
              <Button size="sm" tone="primary" onClick={() => onNavigate("dwork/clients")}>Mở profile</Button>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function TasksView() {
  const [tasks, setTasks] = useState(TASKS);
  const toggle = (id) => setTasks(t => t.map(x => x.id === id ? { ...x, done: !x.done } : x));
  const buckets = [
    { id: "now", label: "Trong 2h tới", filter: () => true },
    { id: "today", label: "Hôm nay", filter: () => true },
    { id: "later", label: "Sau", filter: () => false }
  ];
  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-12 lg:col-span-8">
        <SectionTitle sub={`${tasks.filter(t => !t.done).length}/${tasks.length} chưa hoàn thành`}
          action={
            <div className="flex gap-2">
              <Button tone="ghost" size="sm" icon="filter_list">Lọc</Button>
              <Button tone="primary" size="sm" icon="add">Thêm task</Button>
            </div>
          }>Việc trong ngày</SectionTitle>
        <ul className="space-y-2">
          {tasks.map(t => (
            <li key={t.id} className={`flex items-center gap-3 p-3 rounded-xl border transition-all
              ${t.done ? "bg-surface-container-low border-outline-variant/20 opacity-70" : "bg-white border-outline-variant/30 hover:shadow-soft"}`}>
              <button onClick={() => toggle(t.id)}
                className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors flex-shrink-0
                  ${t.done ? "bg-emerald-500 text-white" : "ring-1 ring-outline-variant hover:ring-vnd-primary-500"}`}>
                {t.done && <Icon name="check" size={14} weight={600} />}
              </button>
              <PriorityPill level={t.priority} />
              <div className="flex-1 min-w-0">
                <p className={`text-[13.5px] font-medium ${t.done ? "line-through text-on-surface-variant" : "text-on-surface"}`}>{t.title}</p>
                <p className="text-[11.5px] text-on-surface-variant mt-0.5">{t.project}</p>
              </div>
              {t.nac && <Badge tone="red" size="xs" icon="campaign">NAC</Badge>}
              <span className="font-mono text-[12px] text-on-surface-variant">{t.due}</span>
              <button className="w-7 h-7 rounded-md hover:bg-surface-container-high text-on-surface-variant flex items-center justify-center">
                <Icon name="more_horiz" size={16} />
              </button>
            </li>
          ))}
        </ul>
      </Card>

      <div className="col-span-12 lg:col-span-4 space-y-4">
        <Card>
          <SectionTitle sub="Phân bổ theo priority">Today at a glance</SectionTitle>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl ring-1 ring-red-200 bg-red-50 p-3 text-center">
              <p className="font-display font-bold text-headline-md text-red-700">4</p>
              <p className="text-[11px] text-red-700/80">P1</p>
            </div>
            <div className="rounded-xl ring-1 ring-amber-200 bg-amber-50 p-3 text-center">
              <p className="font-display font-bold text-headline-md text-amber-700">2</p>
              <p className="text-[11px] text-amber-700/80">P2</p>
            </div>
            <div className="rounded-xl ring-1 ring-vnd-primary-100 bg-vnd-primary-50 p-3 text-center">
              <p className="font-display font-bold text-headline-md text-vnd-primary-700">1</p>
              <p className="text-[11px] text-vnd-primary-700/80">P3</p>
            </div>
          </div>
        </Card>
        <Card>
          <SectionTitle sub="AI suggestion">Gợi ý cho buổi chiều</SectionTitle>
          <div className="rounded-xl bg-mesh-blue p-4 ring-1 ring-vnd-primary-100">
            <p className="text-[12.5px] text-on-surface leading-relaxed">
              <span className="font-semibold text-vnd-primary-900">Đỗ Trung Kiên</span> đã gọi 2 lần chưa được nghe máy. Cân nhắc gửi Zalo voice + đề xuất khung 15:30 để callback.
            </p>
            <div className="flex gap-2 mt-3">
              <Button size="xs" tone="primary" icon="auto_awesome">Áp dụng</Button>
              <Button size="xs" tone="ghost">Bỏ qua</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function CommView() {
  return (
    <div className="grid grid-cols-12 gap-4">
      {[
        { tag: "Missed call", icon: "phone_missed", tone: "red", count: 2, action: "Callback ngay", desc: "KH gọi không nghe được" },
        { tag: "Pending reply", icon: "schedule", tone: "amber", count: 3, action: "Trả lời", desc: "Chưa phản hồi quá 4h" },
        { tag: "Quá hạn cadence", icon: "warning", tone: "amber", count: 1, action: "Liên hệ", desc: "Vượt rule liên hệ" }
      ].map(b => (
        <Card key={b.tag} className="col-span-12 md:col-span-4">
          <div className="flex items-start gap-3">
            <span className={`w-10 h-10 rounded-xl flex items-center justify-center
              ${b.tone === "red" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"}`}>
              <Icon name={b.icon} size={20} />
            </span>
            <div className="flex-1">
              <p className="font-display font-semibold text-vnd-primary-900">{b.tag}</p>
              <p className="text-[12px] text-on-surface-variant">{b.desc}</p>
            </div>
            <span className="font-display font-bold text-headline-lg text-vnd-primary-900">{b.count}</span>
          </div>
        </Card>
      ))}
      <Card className="col-span-12">
        <SectionTitle sub="Tổng hợp tất cả trigger trong 24h">Backlog liên hệ</SectionTitle>
        <Empty icon="forum" title="Sẽ hiển thị tại đây"
          sub="Sau khi cấu hình rule cadence (P1-P4) + tự động sync inbox kênh giao tiếp."
          action={<Button tone="soft" icon="settings">Mở cấu hình</Button>} />
      </Card>
    </div>
  );
}

Object.assign(window, { ScreenDworkDashboard });

// ============== ONBOARDING VIEW · 4 Tầng Workflow ==============
const FLOW_META = {
  DA:  { label: "DA · Self-serve",       tone: "blue",   color: "#0077ED", desc: "Digital, system-driven" },
  DCA: { label: "DCA · CA-assisted",     tone: "purple", color: "#8B2E8F", desc: "Client Advisor relationship" },
  DSA: { label: "DSA · Advisory",        tone: "amber",  color: "#FF8C33", desc: "Suitability profiled · IPS" }
};

const TIERS = [
  { id: 1, key: "pre",     label: "Pre-Onboarding",  obj: "Awareness → Intent",         color: "#727784", bg: "bg-surface-container-high" },
  { id: 2, key: "setup",   label: "Account Setup",   obj: "Intent → Contract",          color: "#0077ED", bg: "bg-vnd-primary-50" },
  { id: 3, key: "activ",   label: "Activation",      obj: "Contract → First Trade",     color: "#FF8C33", bg: "bg-amber-50" },
  { id: 4, key: "early",   label: "Early Engagement", obj: "First 90 Days Cadence",     color: "#00C97D", bg: "bg-emerald-50" }
];

const ONBOARD_CLIENTS = [
  { id: "OB-901", name: "Lê Thị Hạnh",   company: "Cá nhân",            flow: "DSA", tier: 2, step: "Suitability N-R-E", progress: 38, days: 4, since: "12/05", careBy: ["CSA · Trần Quân", "PC · Lê Hồng"], next: "BMI gate check", risk: "ok",      tag: "Matching" },
  { id: "OB-900", name: "Phạm Đăng Khoa", company: "Khoa Logistics",     flow: "DCA", tier: 3, step: "Workspace walkthrough", progress: 72, days: 2, since: "14/05", careBy: ["CA · Hoàng Anh", "CC · Nguyễn Mai"], next: "First service experience", risk: "ok" },
  { id: "OB-899", name: "Nguyễn Bích Hà", company: "Hà Beauty Co.",      flow: "DCA", tier: 4, step: "Week 6 review", progress: 60, days: 42, since: "04/04", careBy: ["CA · Hoàng Anh", "CC · Nguyễn Mai"], next: "Cross-sell readiness", risk: "ok" },
  { id: "OB-898", name: "Đỗ Quang Vinh",  company: "Founder · Tech",     flow: "DA",  tier: 2, step: "eKYC + AML check", progress: 84, days: 1, since: "15/05", careBy: ["CSE · System bot"], next: "Cấp tài khoản", risk: "ok" },
  { id: "OB-895", name: "Hoàng Phương Anh", company: "Cá nhân",          flow: "DSA", tier: 1, step: "Values-fit assessment", progress: 22, days: 7, since: "09/05", careBy: ["Pre-sales · Lê Khánh"], next: "Entry path guidance", risk: "stuck", tag: "Idle 5d" },
  { id: "OB-893", name: "Trần Hữu Long",  company: "Long Trading",       flow: "DCA", tier: 2, step: "Ký hợp đồng", progress: 92, days: 6, since: "10/05", careBy: ["CA · Trần Quân", "CC · Đỗ Hà"], next: "Cấp tài khoản", risk: "overdue", tag: "SLA quá hạn" },
  { id: "OB-890", name: "Vũ Minh Châu",   company: "Châu Pharma JSC",   flow: "DSA", tier: 4, step: "Quarterly re-validation", progress: 88, days: 76, since: "01/03", careBy: ["CSA · Phạm Quỳnh", "AC · Vũ Tâm", "PC · Lê Hồng"], next: "AE/AME third-eye review", risk: "ok" },
  { id: "OB-888", name: "Lý Thu Trang",   company: "Cá nhân",            flow: "DA",  tier: 3, step: "Platform tour", progress: 50, days: 3, since: "13/05", careBy: ["CSE · System bot"], next: "First trade self-guided", risk: "ok" },
  { id: "OB-885", name: "Nguyễn Anh Tú",  company: "Tú Architecture",    flow: "DCA", tier: 1, step: "Brand awareness drip", progress: 12, days: 11, since: "05/05", careBy: ["Marketing"], next: "Values-fit assessment", risk: "ok" },
  { id: "OB-882", name: "Bùi Thanh Hằng", company: "Hằng Boutique",      flow: "DSA", tier: 3, step: "IPS discussion", progress: 64, days: 5, since: "11/05", careBy: ["CSA · Trần Quân", "CC · Đỗ Hà"], next: "First advisory recommendation", risk: "ok" },
  { id: "OB-881", name: "Cao Đức Thắng",  company: "Cá nhân",            flow: "DA",  tier: 1, step: "Marketing touch", progress: 8,  days: 14, since: "02/05", careBy: ["Marketing"], next: "Self-serve signup", risk: "stuck", tag: "No-touch 7d" },
  { id: "OB-878", name: "Ngô Kim Liên",   company: "Liên Education",     flow: "DCA", tier: 4, step: "Day 30 check-in", progress: 33, days: 30, since: "16/04", careBy: ["CA · Hoàng Anh", "CC · Nguyễn Mai"], next: "Goal mapping session", risk: "ok" },
  { id: "OB-874", name: "Đặng Minh Hùng", company: "Hùng Trading Co.",   flow: "DCA", tier: 2, step: "Matching engine · Pick CA", progress: 50, days: 3, since: "13/05", careBy: ["—"], next: "KH chọn từ Top 5 CA", risk: "ok", tag: "Đang chọn" },
  { id: "OB-870", name: "Phan Thu Hà",    company: "Hà & Cộng sự",       flow: "DSA", tier: 2, step: "Sub-model selection", progress: 44, days: 8, since: "08/05", careBy: ["CSA · Lê Khánh"], next: "Brokerage / Subscription / Mandate", risk: "ok" }
];

function OnboardingView({ onNavigate }) {
  const [flow, setFlow] = useState("all");
  const [tier, setTier] = useState(null);
  const [risk, setRisk] = useState("all");
  const [selected, setSelected] = useState(null);
  const toast = useToast();

  const filtered = ONBOARD_CLIENTS.filter(c =>
    (flow === "all" || c.flow === flow) &&
    (tier == null || c.tier === tier) &&
    (risk === "all" || c.risk === risk)
  );

  const byTier = TIERS.map(t => ({ ...t, count: ONBOARD_CLIENTS.filter(c => c.tier === t.id).length }));
  const byFlow = ["DA","DCA","DSA"].map(f => ({ f, count: ONBOARD_CLIENTS.filter(c => c.flow === f).length }));
  const totalRisk = {
    overdue: ONBOARD_CLIENTS.filter(c => c.risk === "overdue").length,
    stuck:   ONBOARD_CLIENTS.filter(c => c.risk === "stuck").length,
    ok:      ONBOARD_CLIENTS.filter(c => c.risk === "ok").length
  };

  return (
    <div className="space-y-4">
      {/* Header hero: 4-tier funnel */}
      <Card padded={false} className="overflow-hidden">
        <div className="bg-mesh-blue px-7 py-6 border-b border-outline-variant/30">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <Badge tone="blue" size="sm" icon="route">Onboarding Workflow · 4 tầng</Badge>
              <h2 className="font-display text-headline-md text-vnd-primary-900 mt-2">14 KH đang trong vòng onboarding</h2>
              <p className="text-[13px] text-on-surface-variant mt-1">Pre-onboarding → Account Setup → Activation → Early Engagement · DA / DCA / DSA flows</p>
            </div>
            <div className="flex items-center gap-2 text-[12px] flex-wrap">
              {totalRisk.overdue > 0 && <Badge tone="red" size="md" icon="warning">{totalRisk.overdue} quá hạn SLA</Badge>}
              {totalRisk.stuck > 0 && <Badge tone="amber" size="md" icon="schedule">{totalRisk.stuck} idle &gt; 5 ngày</Badge>}
              <Badge tone="green" size="md" icon="check_circle">{totalRisk.ok} on track</Badge>
            </div>
          </div>

          {/* Funnel */}
          <div className="mt-5 grid grid-cols-4 gap-0">
            {byTier.map((t, i) => {
              const isLast = i === byTier.length - 1;
              return (
                <button key={t.id} onClick={() => setTier(tier === t.id ? null : t.id)}
                  className={`relative text-left transition-all ${tier === t.id ? "scale-[1.02] z-10" : ""}`}>
                  <div className={`bg-white ring-1 ${tier === t.id ? "ring-vnd-primary-500 shadow-soft" : "ring-outline-variant/40"} px-5 py-4 ${isLast ? "rounded-r-xl" : ""} ${i === 0 ? "rounded-l-xl" : "ml-[-12px]"}`}
                    style={{ clipPath: isLast ? "none" : "polygon(0 0, calc(100% - 14px) 0, 100% 50%, calc(100% - 14px) 100%, 0 100%, 14px 50%)" }}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="w-6 h-6 rounded-md flex items-center justify-center font-display font-bold text-[11px] text-white" style={{ backgroundColor: t.color }}>{t.id}</span>
                      <span className="font-display font-bold text-headline-sm text-vnd-primary-900">{t.count}</span>
                    </div>
                    <p className="font-display font-semibold text-[13px] text-on-surface">{t.label}</p>
                    <p className="text-[10.5px] text-on-surface-variant mt-0.5">{t.obj}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Flow breakdown row */}
        <div className="px-7 py-4 grid grid-cols-3 gap-4 bg-surface-container-lowest">
          {byFlow.map(f => {
            const meta = FLOW_META[f.f];
            return (
              <div key={f.f} className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-lg flex items-center justify-center text-white" style={{ backgroundColor: meta.color }}>
                  <Icon name={f.f === "DA" ? "smart_toy" : f.f === "DCA" ? "support_agent" : "psychology"} size={18} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[10.5px] uppercase tracking-wider font-bold text-on-surface-variant">{meta.label}</p>
                  <p className="font-display font-semibold text-[13.5px] text-vnd-primary-900">{f.count} KH · <span className="text-on-surface-variant font-normal">{meta.desc}</span></p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Filter row */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <FilterBar>
          <ChipToggle active={flow === "all"} onClick={() => setFlow("all")}>Tất cả flow</ChipToggle>
          <ChipToggle active={flow === "DA"}  onClick={() => setFlow("DA")}  icon="smart_toy">DA</ChipToggle>
          <ChipToggle active={flow === "DCA"} onClick={() => setFlow("DCA")} icon="support_agent">DCA</ChipToggle>
          <ChipToggle active={flow === "DSA"} onClick={() => setFlow("DSA")} icon="psychology">DSA</ChipToggle>
          <div className="w-px h-5 bg-outline-variant mx-1"></div>
          <ChipToggle active={tier == null} onClick={() => setTier(null)}>Mọi tầng</ChipToggle>
          {TIERS.map(t => (
            <ChipToggle key={t.key} active={tier === t.id} onClick={() => setTier(t.id)}>Tầng {t.id} · {t.label}</ChipToggle>
          ))}
        </FilterBar>
        <FilterBar>
          <ChipToggle active={risk === "all"} onClick={() => setRisk("all")}>Tất cả</ChipToggle>
          <ChipToggle active={risk === "overdue"} onClick={() => setRisk("overdue")} icon="warning">SLA quá hạn</ChipToggle>
          <ChipToggle active={risk === "stuck"} onClick={() => setRisk("stuck")} icon="schedule">Idle</ChipToggle>
        </FilterBar>
      </div>

      {/* Client cards grid */}
      {filtered.length === 0 ? (
        <Card><Empty icon="filter_alt_off" title="Không có KH khớp bộ lọc" sub="Thử bỏ bớt filter để xem nhiều hơn." action={<Button tone="soft" onClick={() => { setFlow("all"); setTier(null); setRisk("all"); }}>Reset filter</Button>} /></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(c => (
            <OnboardCard key={c.id} c={c} onOpen={() => setSelected(c)} />
          ))}
        </div>
      )}

      <OnboardDrawer client={selected} onClose={() => setSelected(null)} onAction={(msg) => toast?.(msg, { tone: "success", icon: "check_circle" })} />
    </div>
  );
}

function OnboardCard({ c, onOpen }) {
  const tier = TIERS.find(t => t.id === c.tier);
  const flow = FLOW_META[c.flow];
  const riskBadge = c.risk === "overdue"
    ? { tone: "red", icon: "warning", label: c.tag || "SLA quá hạn" }
    : c.risk === "stuck"
    ? { tone: "amber", icon: "schedule", label: c.tag || "Đang idle" }
    : null;

  return (
    <article onClick={onOpen}
      className="bg-white rounded-2xl ring-1 ring-outline-variant/30 hover:ring-vnd-primary-300 hover:shadow-soft transition-all cursor-pointer overflow-hidden group">
      {/* Tier ribbon */}
      <div className={`px-4 py-2 ${tier.bg} flex items-center justify-between border-b border-outline-variant/20`}>
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 rounded-md flex items-center justify-center text-white font-display font-bold text-[10px]" style={{ backgroundColor: tier.color }}>{tier.id}</span>
          <span className="text-[11px] font-display font-semibold text-on-surface">Tầng {tier.id} · {tier.label}</span>
        </div>
        {c.tag && !riskBadge && <Badge tone="blue" size="xs">{c.tag}</Badge>}
        {riskBadge && <Badge tone={riskBadge.tone} size="xs" icon={riskBadge.icon}>{riskBadge.label}</Badge>}
      </div>

      <div className="p-4">
        {/* Identity */}
        <div className="flex items-start gap-3">
          <Avatar name={c.name} size={42} tone={c.flow === "DA" ? "blue" : c.flow === "DCA" ? "purple" : "amber"} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <p className="font-display font-semibold text-[14px] text-on-surface truncate">{c.name}</p>
              <Badge tone={flow.tone} size="xs" icon={c.flow === "DA" ? "smart_toy" : c.flow === "DCA" ? "support_agent" : "psychology"}>{c.flow}</Badge>
            </div>
            <p className="text-[11px] text-on-surface-variant truncate">{c.company} · {c.id}</p>
          </div>
        </div>

        {/* Current step */}
        <div className="mt-3 rounded-lg bg-surface-container-low p-3">
          <p className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant">Đang thực hiện</p>
          <p className="text-[13px] font-semibold text-on-surface mt-0.5">{c.step}</p>
          <div className="mt-2">
            <div className="flex items-center justify-between text-[10.5px] mb-1 font-mono">
              <span className="text-on-surface-variant">{c.progress}% trong tầng</span>
              <span className="text-on-surface-variant">{c.days}d · từ {c.since}</span>
            </div>
            <div className="h-1.5 bg-white rounded-full overflow-hidden">
              <div className="h-full rounded-full transition-all" style={{ width: c.progress + "%", backgroundColor: tier.color }}></div>
            </div>
          </div>
        </div>

        {/* CareBy chips */}
        <div className="mt-3 flex items-start gap-2">
          <Icon name="diversity_3" size={14} className="text-on-surface-variant mt-0.5 flex-shrink-0" />
          <div className="flex-1 flex flex-wrap gap-1">
            {c.careBy.map((p, i) => (
              <span key={i} className="inline-flex items-center text-[10.5px] font-medium px-1.5 py-0.5 rounded-md bg-surface-container-high text-on-surface-variant">{p}</span>
            ))}
          </div>
        </div>

        {/* Next action */}
        <div className="mt-4 pt-3 border-t border-outline-variant/30 flex items-center justify-between gap-2">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-wider font-bold text-on-surface-variant">Bước kế tiếp</p>
            <p className="text-[12px] font-semibold text-vnd-primary-700 truncate">{c.next}</p>
          </div>
          <Button size="sm" tone="primary" icon="play_arrow">Thực hiện</Button>
        </div>
      </div>
    </article>
  );
}

function OnboardDrawer({ client, onClose, onAction }) {
  if (!client) return null;
  const flow = FLOW_META[client.flow];
  // Build per-tier checklist based on flow
  const tierActivities = {
    1: [
      { label: "Marketing touch · 3 nếp sống messaging", done: client.tier > 1 || client.progress > 30 },
      { label: "Values-fit assessment", done: client.tier > 1 || client.progress > 60 },
      { label: "Entry path guidance (DA vs DCA vs DSA)", done: client.tier > 1 }
    ],
    2: {
      DA:  [{ label: "Self-serve digital signup", done: client.tier > 2 || client.progress > 30 },
            { label: "eKYC + AML auto check", done: client.tier > 2 || client.progress > 70 },
            { label: "CSE background monitoring", done: client.tier > 2 }],
      DCA: [{ label: "CA matching · KH chọn từ Top 5", done: client.tier > 2 || client.progress > 30 },
            { label: "Relationship building", done: client.tier > 2 || client.progress > 60 },
            { label: "Ký hợp đồng + gán CareBy (CC/AC)", done: client.tier > 2 }],
      DSA: [{ label: "Suitability profiling N-R-E", done: client.tier > 2 || client.progress > 25 },
            { label: "Sub-model selection (Brokerage / Sub / Mandate)", done: client.tier > 2 || client.progress > 55 },
            { label: "CSA matching · KH chọn từ Top 5", done: client.tier > 2 || client.progress > 75 },
            { label: "BMI gate check + ký hợp đồng", done: client.tier > 2 }]
    }[client.flow],
    3: {
      DA:  [{ label: "Platform tour tự động", done: client.tier > 3 || client.progress > 30 },
            { label: "First trade self-guided", done: client.tier > 3 || client.progress > 70 },
            { label: "CSE available nếu stuck", done: false }],
      DCA: [{ label: "CA intro call", done: client.tier > 3 || client.progress > 25 },
            { label: "Workspace walkthrough", done: client.tier > 3 || client.progress > 60 },
            { label: "First service experience (idea / trade)", done: client.tier > 3 }],
      DSA: [{ label: "CSA intro session · xác nhận N-R-E", done: client.tier > 3 || client.progress > 30 },
            { label: "IPS discussion", done: client.tier > 3 || client.progress > 60 },
            { label: "First advisory recommendation", done: client.tier > 3 }]
    }[client.flow],
    4: {
      DA:  [{ label: "Automated check-ins (email/push)", done: client.tier === 4 && client.progress > 20 },
            { label: "Educational content drip", done: client.tier === 4 && client.progress > 40 },
            { label: "NAC monitoring · readiness for DCA upgrade", done: client.tier === 4 && client.progress > 70 }],
      DCA: [{ label: "CA weekly rhythm (call/meeting)", done: client.tier === 4 && client.progress > 25 },
            { label: "Relationship deepening — goals & life context", done: client.tier === 4 && client.progress > 50 },
            { label: "Cross-sell readiness (DCA → DSA)", done: client.tier === 4 && client.progress > 80 }],
      DSA: [{ label: "CSA monthly portfolio review", done: client.tier === 4 && client.progress > 30 },
            { label: "Suitability re-validation hàng quý", done: client.tier === 4 && client.progress > 60 },
            { label: "AC coordination · AE/AME third-eyes", done: client.tier === 4 && client.progress > 85 }]
    }[client.flow]
  };

  return (
    <Drawer open={!!client} onClose={onClose} width={880}>
      {/* Header */}
      <div className="bg-mesh-blue px-7 pt-6 pb-5 border-b border-outline-variant/40">
        <div className="flex items-start gap-4">
          <Avatar name={client.name} size={64} tone={client.flow === "DA" ? "blue" : client.flow === "DCA" ? "purple" : "amber"} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-display text-headline-md text-vnd-primary-900">{client.name}</h2>
              <Badge tone={flow.tone} size="sm" icon={client.flow === "DA" ? "smart_toy" : client.flow === "DCA" ? "support_agent" : "psychology"}>{flow.label}</Badge>
              {client.risk === "overdue" && <Badge tone="red" size="sm" icon="warning">SLA quá hạn</Badge>}
              {client.risk === "stuck" && <Badge tone="amber" size="sm" icon="schedule">Idle</Badge>}
            </div>
            <p className="text-[13px] text-on-surface-variant mt-1">{client.company} · {client.id} · Onboarding từ {client.since} ({client.days} ngày)</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/70 hover:bg-white text-on-surface-variant flex items-center justify-center">
            <Icon name="close" size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin px-7 py-6 bg-surface-container-low space-y-4">
        {/* 4-tier stepper */}
        <Card padded={false}>
          <div className="px-6 py-4 border-b border-outline-variant/30">
            <p className="text-[11px] uppercase tracking-wider font-bold text-vnd-primary-500/80">Hành trình Onboarding</p>
            <p className="font-display text-title-md text-vnd-primary-900 mt-0.5">4 tầng · {client.tier - 1} đã hoàn tất · đang ở Tầng {client.tier}</p>
          </div>
          <div className="p-6">
            <ol className="grid grid-cols-4 gap-0 relative">
              {TIERS.map((t, i) => {
                const state = t.id < client.tier ? "done" : t.id === client.tier ? "current" : "pending";
                const styles = {
                  done:    { circle: "bg-emerald-500 text-white", line: "bg-emerald-500", text: "text-emerald-700" },
                  current: { circle: "text-white ring-4 ring-vnd-primary-200 animate-pulse-soft", line: "bg-surface-container-high", text: "text-vnd-primary-900" },
                  pending: { circle: "bg-surface-container-high text-on-surface-variant", line: "bg-surface-container-high", text: "text-on-surface-variant" }
                }[state];
                return (
                  <li key={t.id} className="relative flex flex-col items-center text-center px-2">
                    {i < TIERS.length - 1 && <span className={`absolute top-5 left-1/2 right-[-50%] h-0.5 ${styles.line}`}></span>}
                    <span className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-[13px] ${styles.circle}`}
                      style={state === "current" ? { backgroundColor: t.color } : {}}>
                      {state === "done" ? <Icon name="check" size={18} weight={600} /> : t.id}
                    </span>
                    <p className={`mt-2.5 font-display font-semibold text-[12.5px] ${styles.text}`}>{t.label}</p>
                    <p className="text-[10.5px] text-on-surface-variant mt-0.5">{t.obj}</p>
                  </li>
                );
              })}
            </ol>

            {/* Progress in current tier */}
            <div className="mt-7 rounded-xl bg-vnd-primary-50 ring-1 ring-vnd-primary-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-[11px] uppercase tracking-wider font-bold text-vnd-primary-700">Tiến độ Tầng {client.tier}</p>
                  <p className="font-display font-semibold text-vnd-primary-900 mt-0.5">{client.step}</p>
                </div>
                <span className="font-display font-bold text-headline-md text-vnd-primary-900 font-mono">{client.progress}%</span>
              </div>
              <div className="h-2 bg-white rounded-full overflow-hidden">
                <div className="h-full bg-vnd-primary-500 rounded-full transition-all" style={{ width: client.progress + "%" }}></div>
              </div>
            </div>
          </div>
        </Card>

        {/* Activities for current tier */}
        <Card>
          <SectionTitle sub={`${flow.label} flow · ${TIERS[client.tier - 1].obj}`}>
            Hoạt động Tầng {client.tier} · {TIERS[client.tier - 1].label}
          </SectionTitle>
          <ul className="space-y-2">
            {(tierActivities[client.tier] || []).map((a, i) => (
              <li key={i} className={`flex items-center gap-3 p-3 rounded-xl ring-1
                ${a.done ? "ring-emerald-200 bg-emerald-50/30" : "ring-outline-variant/30 bg-white"}`}>
                <span className={`w-7 h-7 rounded-md flex items-center justify-center
                  ${a.done ? "bg-emerald-500 text-white" : "bg-surface-container-high text-on-surface-variant"}`}>
                  {a.done ? <Icon name="check" size={16} weight={600} /> : <span className="font-display font-bold text-[11px]">{i + 1}</span>}
                </span>
                <span className={`flex-1 text-[13px] ${a.done ? "line-through text-on-surface-variant" : "text-on-surface font-medium"}`}>{a.label}</span>
                {!a.done && <Button size="xs" tone="primary" onClick={() => onAction("Đã thực hiện: " + a.label)}>Thực hiện</Button>}
              </li>
            ))}
          </ul>
        </Card>

        {/* Two-column: CareBy & Activity */}
        <div className="grid grid-cols-12 gap-4">
          <Card className="col-span-12 md:col-span-5">
            <SectionTitle sub="Function assignments theo flow">CareBy Team</SectionTitle>
            <ul className="space-y-2">
              {client.careBy.map((p, i) => {
                const [role, name] = p.includes("·") ? p.split("·").map(s => s.trim()) : [p, "—"];
                return (
                  <li key={i} className="flex items-center gap-3 p-2.5 rounded-xl ring-1 ring-outline-variant/30">
                    <Avatar name={name === "—" ? role : name} size={32} tone={i === 0 ? "blue" : i === 1 ? "purple" : "amber"} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[12.5px] font-semibold text-on-surface">{name === "—" ? role : name}</p>
                      <p className="text-[11px] text-on-surface-variant">{name === "—" ? "Chưa gán" : role}</p>
                    </div>
                    <Badge tone="neutral" size="xs">{role.split(" ")[0]}</Badge>
                  </li>
                );
              })}
            </ul>
            <p className="text-[10.5px] text-on-surface-variant mt-3 font-mono">CC = Client Companion · AC = Advisory Companion · PC = Product Companion · CSE = Self-Service Engine · CSA = Client Suitability Advisor</p>
          </Card>

          <Card className="col-span-12 md:col-span-7">
            <SectionTitle sub="Hành động & sự kiện gần đây">Activity Log</SectionTitle>
            <ol className="relative pl-6 space-y-3 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-outline-variant/40">
              {[
                { l: `Đang ở Tầng ${client.tier} · ${client.step}`, by: "System", ago: "Hôm nay", dot: "current" },
                { l: `Gán CareBy: ${client.careBy.slice(0, 2).join(", ")}`, by: "System", ago: `${client.days - 1}d`, dot: "done" },
                ...(client.tier >= 2 ? [{ l: "Hoàn tất Tầng 1 · Pre-Onboarding", by: "Marketing + Pre-sales", ago: `${client.days + 3}d`, dot: "done" }] : []),
                ...(client.tier >= 3 ? [{ l: "Hoàn tất Tầng 2 · Account Setup", by: client.flow === "DA" ? "CSE" : client.flow === "DCA" ? "CA team" : "CSA team", ago: `${client.days + 6}d`, dot: "done" }] : []),
                { l: `Khởi tạo onboarding · flow ${client.flow}`, by: "Marketing", ago: client.since, dot: "done" }
              ].map((e, i) => (
                <li key={i} className="relative">
                  <span className={`absolute -left-[18px] top-1 w-3 h-3 rounded-full ring-4 ring-surface-container-lowest
                    ${e.dot === "current" ? "bg-vnd-primary-500" : "bg-emerald-500"}`}></span>
                  <p className="text-[13px] text-on-surface">{e.l}</p>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">{e.by} · {e.ago}</p>
                </li>
              ))}
            </ol>
          </Card>
        </div>

        {/* Next best action */}
        <Card className="bg-vnd-primary-900 text-white relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-60 h-60 rounded-full bg-vnd-primary-500/30 blur-3xl"></div>
          <div className="relative flex items-center gap-4">
            <span className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center"><Icon name="auto_awesome" size={22} /></span>
            <div className="flex-1">
              <p className="text-[10.5px] uppercase tracking-wider font-bold text-white/60">Next best action</p>
              <p className="font-display text-title-md mt-1">{client.next}</p>
              <p className="text-[12.5px] text-white/70 mt-1">Theo workflow {client.flow} · Tầng {client.tier} của KH này</p>
            </div>
            <Button tone="primary" icon="play_arrow" onClick={() => onAction("Đang khởi chạy: " + client.next)}>Thực hiện</Button>
            <Button tone="ghost" icon="event" className="text-white">Đặt lịch</Button>
          </div>
        </Card>
      </div>
    </Drawer>
  );
}

Object.assign(window, { OnboardingView });
