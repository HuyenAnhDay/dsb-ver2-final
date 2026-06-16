/* global React, window */
const { KPI_VALUE, KPI_TRAD, ADVISOR: ADV2 } = window.DSB_DATA;

function ScreenDAccount({ screen }) {
  if (screen === "daccount/depth")      return <DepthScreen />;
  if (screen === "daccount/kpi")        return <KpiDashboard />;
  if (screen === "daccount/benchmarks") return <Benchmarks />;
  return <DepthScreen />;
}

// =============== 4.1 Depth ===============
function DepthScreen() {
  return (
    <>
      <PageHeader
        eyebrow="dAccount · Depth"
        title="Đang ở đâu, tạo ra gì?"
        sub="Chiều sâu năng lực qua BMI Level và ICM Score · tháp tài sản nghề nghiệp."
        actions={
          <>
            <Button tone="ghost" size="sm" icon="history">Lịch sử score</Button>
            <Button tone="primary" size="sm" icon="open_in_new">Career roadmap</Button>
          </>
        }
      />
      <Page>
        <div className="grid grid-cols-12 gap-4 mb-5">
          {/* BMI Hero */}
          <Card className="col-span-12 lg:col-span-7 bg-vnd-primary-900 text-white relative overflow-hidden p-7">
            <div className="absolute -top-10 -right-10 w-80 h-80 rounded-full bg-vnd-primary-500/30 blur-3xl"></div>
            <div className="absolute -bottom-20 -left-10 w-60 h-60 rounded-full bg-vnd-accent-green/15 blur-3xl"></div>
            <div className="relative">
              <Badge tone="ghost" size="sm" className="bg-white/10 text-white border-white/20" icon="stacked_bar_chart">Business Maturity Index</Badge>
              <div className="flex items-end gap-6 mt-5">
                <div>
                  <p className="text-[11px] uppercase tracking-wider text-white/60 font-bold">BMI Level hiện tại</p>
                  <p className="font-display font-bold text-white" style={{ fontSize: 64, lineHeight: 1, letterSpacing: "-0.025em" }}>BMI-3</p>
                  <p className="text-[14px] text-white/80 mt-1">Trusted Advisor</p>
                </div>
                <div className="flex-1 pb-2">
                  <div className="flex items-center justify-between text-[11.5px] text-white/70 mb-1.5">
                    <span>Tiến độ lên BMI-4 (Senior Specialist)</span><span className="font-mono">68%</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-vnd-primary-500 to-vnd-accent-green rounded-full" style={{ width: "68%" }}></div>
                  </div>
                  <p className="text-[11px] text-white/60 mt-2 font-mono">Estimated promotion: Q2/2027</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mt-7">
                {[
                  { l: "Năng lực", v: 76, sub: "Skill + Cert" },
                  { l: "Hành vi", v: 82, sub: "Cadence + Quality" },
                  { l: "Kết quả", v: 64, sub: "KPI vs target" }
                ].map((d, i) => (
                  <div key={i} className="bg-white/10 ring-1 ring-white/10 rounded-xl p-4">
                    <p className="text-[10.5px] uppercase tracking-wider text-white/60 font-bold">{d.l}</p>
                    <p className="font-display font-bold text-display-sm mt-1">{d.v}</p>
                    <div className="h-1 bg-white/15 rounded-full overflow-hidden mt-2">
                      <div className={`h-full rounded-full ${d.v >= 80 ? "bg-vnd-accent-green" : d.v >= 70 ? "bg-vnd-primary-500" : "bg-amber-400"}`} style={{ width: d.v + "%" }}></div>
                    </div>
                    <p className="text-[10.5px] text-white/60 mt-2">{d.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* ICM Score */}
          <Card className="col-span-12 lg:col-span-5">
            <SectionTitle sub="Điểm đóng góp cá nhân cho tổ chức">ICM Score</SectionTitle>
            <div className="flex items-center justify-center my-3">
              <div className="relative">
                <svg width="220" height="220" viewBox="0 0 220 220" className="-rotate-90">
                  <circle cx="110" cy="110" r="92" fill="none" stroke="#eef2ff" strokeWidth="16" />
                  <circle cx="110" cy="110" r="92" fill="none" stroke="url(#icmGrad)" strokeWidth="16"
                    strokeDasharray={`${(782/1000) * 2 * Math.PI * 92} ${2 * Math.PI * 92}`}
                    strokeLinecap="round" />
                  <defs>
                    <linearGradient id="icmGrad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#0077ED" />
                      <stop offset="100%" stopColor="#00C97D" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">ICM Score</p>
                  <p className="font-display font-bold text-vnd-primary-900" style={{ fontSize: 56, lineHeight: 1 }}>782</p>
                  <p className="text-[11.5px] text-on-surface-variant mt-1">/ 1000 · Top 18%</p>
                </div>
              </div>
            </div>
            <ul className="mt-3 space-y-2 text-[12.5px]">
              <li className="flex items-center justify-between"><span className="text-on-surface-variant">Quarterly trend</span><span className="font-mono font-bold text-emerald-600">+24 điểm</span></li>
              <li className="flex items-center justify-between"><span className="text-on-surface-variant">Rank trong region</span><span className="font-mono font-bold">#7 / 84</span></li>
              <li className="flex items-center justify-between"><span className="text-on-surface-variant">Next tier (Gold)</span><span className="font-mono font-bold text-amber-700">Cần +18 điểm</span></li>
            </ul>
          </Card>
        </div>

        {/* Capability dimensions breakdown */}
        <Card className="mb-5">
          <SectionTitle sub="Cấu thành BMI · 6 dimension"
            action={<Button tone="ghost" size="sm" icon="info">Cách tính</Button>}>
            Capability Breakdown
          </SectionTitle>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
            {[
              { l: "Investment", v: 78, target: 90, c: "blue" },
              { l: "Behavioral", v: 62, target: 80, c: "purple" },
              { l: "Tax & Legal", v: 54, target: 75, c: "amber" },
              { l: "Estate", v: 41, target: 70, c: "rose" },
              { l: "Insurance", v: 71, target: 80, c: "green" },
              { l: "Compliance", v: 92, target: 90, c: "blue" }
            ].map((d, i) => (
              <div key={i} className="rounded-xl ring-1 ring-outline-variant/30 p-4 text-center">
                <ProgressRing value={d.v} size={84} thickness={9} label={d.v} sub={d.l} />
                <p className="text-[10.5px] font-mono text-on-surface-variant mt-2">Target {d.target} · {d.v >= d.target ? "✓ Đạt" : `gap ${d.target - d.v}`}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* History */}
        <Card>
          <SectionTitle sub="ICM Score 12 quý gần nhất">Score History</SectionTitle>
          <div className="flex items-end gap-2 h-48">
            {[420, 462, 488, 520, 548, 582, 614, 642, 678, 712, 742, 782].map((v, i) => {
              const max = 800;
              const h = (v / max) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-mono text-on-surface-variant opacity-0 group-hover:opacity-100">{v}</span>
                  <div className={`w-full rounded-t-md ${i === 11 ? "bg-gradient-to-t from-vnd-primary-500 to-vnd-accent-green" : "bg-vnd-primary-100"}`} style={{ height: h + "%" }}></div>
                  <span className="text-[10px] text-on-surface-variant font-mono">Q{(i % 4) + 1}'{Math.floor(i / 4) + 23}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-outline-variant/30 text-[12.5px] text-on-surface-variant">
            <span>Tăng trưởng 36 tháng: <span className="font-mono font-bold text-emerald-700">+362 điểm</span></span>
            <span>Average growth/quarter: <span className="font-mono font-bold">+30 điểm</span></span>
            <span>Next milestone: <span className="font-mono font-bold text-amber-700">800 · Gold tier</span></span>
          </div>
        </Card>
      </Page>
    </>
  );
}

// =============== 4.2 KPI Dashboard ===============
function KpiDashboard() {
  const [tab, setTab] = useState("overview");
  return (
    <>
      <PageHeader
        eyebrow="dAccount · KPI Dashboard"
        title="Hiệu suất theo thời gian thực"
        sub="Value-based KPIs + Traditional KPIs · Goals & Targets được giao và tự đặt."
        actions={
          <>
            <Button tone="ghost" size="sm" icon="calendar_month">Q2/2026</Button>
            <Button tone="outline" size="sm" icon="download">Xuất KPI</Button>
            <Button tone="primary" size="sm" icon="flag">Set target mới</Button>
          </>
        }
        tabs={[
          { id: "overview", label: "Overview", icon: "monitoring" },
          { id: "value", label: "Value-based", icon: "favorite", count: KPI_VALUE.length },
          { id: "trad", label: "Traditional", icon: "trending_up", count: KPI_TRAD.length },
          { id: "goals", label: "Goals & Targets", icon: "flag" }
        ]}
        tabValue={tab} onTab={setTab}
      />
      <Page>
        {tab === "overview" && <KpiOverview />}
        {tab === "value" && <KpiList kpis={KPI_VALUE} kind="value" />}
        {tab === "trad" && <KpiList kpis={KPI_TRAD} kind="trad" />}
        {tab === "goals" && <Goals />}
      </Page>
    </>
  );
}

function KpiOverview() {
  return (
    <>
      <div className="grid grid-cols-12 gap-4 mb-5">
        <Card className="col-span-12 lg:col-span-8 p-7">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[11px] uppercase tracking-wider font-bold text-vnd-primary-500/80">Performance pulse</p>
              <h3 className="font-display text-headline-md text-vnd-primary-900 mt-1">Hiệu suất Q2 vs Q1</h3>
            </div>
            <Badge tone="green" size="md" icon="trending_up">+14.2% overall</Badge>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {[
              { l: "Doanh số", v: "+18%", c: "green" },
              { l: "AUM", v: "+9%", c: "green" },
              { l: "Retention", v: "+1.2pp", c: "green" },
              { l: "NPS", v: "+8 đ", c: "green" },
              { l: "Cycle days", v: "+0.6d", c: "red" },
              { l: "Win rate", v: "+2.1pp", c: "green" },
              { l: "Cross-sell", v: "+0.3", c: "green" },
              { l: "ICM", v: "+24 đ", c: "green" }
            ].map((d, i) => (
              <div key={i} className="rounded-xl ring-1 ring-outline-variant/30 p-3 text-center">
                <p className="text-[10.5px] uppercase tracking-wider text-on-surface-variant font-semibold">{d.l}</p>
                <p className={`font-display font-bold text-headline-sm mt-1 ${d.c === "green" ? "text-emerald-700" : "text-red-700"}`}>{d.v}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card className="col-span-12 lg:col-span-4 bg-mesh-blue ring-1 ring-vnd-primary-100">
          <Badge tone="blue" size="sm" icon="emoji_events">Achievement</Badge>
          <h3 className="font-display text-headline-md text-vnd-primary-900 mt-2">Bạn đang xếp Top 18%</h3>
          <p className="text-[12.5px] text-on-surface-variant mt-2">Trong region South · 84 advisors. Vượt mục tiêu doanh số 12% so với target được giao.</p>
          <div className="flex gap-2 mt-4">
            <Button tone="primary" size="sm" icon="leaderboard">Xem leaderboard</Button>
            <Button tone="ghost" size="sm" icon="share">Chia sẻ</Button>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-12 lg:col-span-6">
          <SectionTitle sub="4 chỉ số cốt lõi">Value-based</SectionTitle>
          <ul className="space-y-3">
            {KPI_VALUE.map(k => <KpiRow key={k.name} k={k} />)}
          </ul>
        </Card>
        <Card className="col-span-12 lg:col-span-6">
          <SectionTitle sub="4 chỉ số sản lượng">Traditional</SectionTitle>
          <ul className="space-y-3">
            {KPI_TRAD.map(k => <KpiRow key={k.name} k={k} />)}
          </ul>
        </Card>
      </div>
    </>
  );
}

function KpiRow({ k }) {
  const reached = k.value >= k.target;
  const pct = Math.min(120, (k.value / k.target) * 100);
  return (
    <li className="rounded-xl ring-1 ring-outline-variant/30 p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[13px] font-semibold text-on-surface">{k.name}</p>
        <Badge tone={reached ? "green" : "amber"} size="xs" icon={reached ? "check" : "schedule"}>
          {reached ? "Đạt target" : `${(k.target - k.value).toFixed(1)}${k.unit} to go`}
        </Badge>
      </div>
      <div className="flex items-baseline gap-3">
        <p className="font-display font-bold text-headline-md text-vnd-primary-900 font-mono">{k.value}{k.unit}</p>
        <span className="text-[11.5px] text-on-surface-variant font-mono">target {k.target}{k.unit}</span>
        <span className={`ml-auto text-[12px] font-mono font-bold ${k.trend >= 0 ? "text-emerald-700" : "text-red-700"}`}>{k.trend >= 0 ? "+" : ""}{k.trend}{k.kind === "value" ? "" : "%"}</span>
      </div>
      <div className="relative h-2 bg-surface-container-low rounded-full overflow-hidden mt-2">
        <div className={`absolute inset-y-0 left-0 rounded-full ${reached ? "bg-emerald-500" : "bg-vnd-primary-500"}`} style={{ width: Math.min(100, pct) + "%" }}></div>
        <div className="absolute inset-y-0 w-0.5 bg-vnd-primary-900" style={{ left: "100%" }}></div>
      </div>
    </li>
  );
}

function KpiList({ kpis, kind }) {
  return (
    <div className="grid grid-cols-12 gap-4">
      {kpis.map((k, i) => (
        <Card key={k.name} className="col-span-12 md:col-span-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-vnd-primary-500/80 font-bold">{kind === "value" ? "Value-based" : "Traditional"} KPI</p>
              <h4 className="font-display font-semibold text-vnd-primary-900 mt-1">{k.name}</h4>
            </div>
            <Badge tone={k.value >= k.target ? "green" : "amber"} size="sm" icon={k.value >= k.target ? "check" : "schedule"}>
              {k.value >= k.target ? "Đạt target" : "Chưa đạt"}
            </Badge>
          </div>
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div><p className="text-[10.5px] uppercase tracking-wider text-on-surface-variant font-semibold">Hiện tại</p><p className="font-display font-bold text-headline-md text-vnd-primary-900 font-mono mt-0.5">{k.value}{k.unit}</p></div>
            <div><p className="text-[10.5px] uppercase tracking-wider text-on-surface-variant font-semibold">Target</p><p className="font-display font-bold text-headline-md text-on-surface font-mono mt-0.5">{k.target}{k.unit}</p></div>
            <div><p className="text-[10.5px] uppercase tracking-wider text-on-surface-variant font-semibold">Trend</p><p className={`font-display font-bold text-headline-md font-mono mt-0.5 ${k.trend >= 0 ? "text-emerald-700" : "text-red-700"}`}>{k.trend >= 0 ? "+" : ""}{k.trend}{kind === "value" ? "" : "%"}</p></div>
          </div>
          <div className="h-32 bg-surface-container-low rounded-lg p-2">
            <Sparkline data={[k.value * 0.7, k.value * 0.75, k.value * 0.82, k.value * 0.88, k.value * 0.93, k.value]} width={400} height={110} />
          </div>
        </Card>
      ))}
    </div>
  );
}

function Goals() {
  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-12 lg:col-span-8">
        <SectionTitle sub="Q2/2026 · 6 mục tiêu (3 được giao, 3 tự đặt)"
          action={<Button tone="primary" size="sm" icon="add">Thêm goal</Button>}>
          Goals & Targets
        </SectionTitle>
        <ul className="space-y-3">
          {[
            { g: "Đạt doanh số 22 tỷ Q2", from: "Region target", p: 84, dl: "30/06" },
            { g: "Onboard 10 KH Private Wealth", from: "Region target", p: 60, dl: "30/06" },
            { g: "Maintain NPS ≥ 60", from: "Region target", p: 100, dl: "Liên tục" },
            { g: "Pass CFP Module 4 trước thi T7", from: "Self", p: 64, dl: "31/07" },
            { g: "Behavioral coaching cert", from: "Self", p: 32, dl: "30/09" },
            { g: "Lead 5 case Estate planning", from: "Self", p: 40, dl: "Q3" }
          ].map((g, i) => (
            <li key={i} className="rounded-xl ring-1 ring-outline-variant/30 p-4">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <p className="font-display font-semibold text-on-surface">{g.g}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge tone={g.from === "Self" ? "blue" : "purple"} size="xs">{g.from === "Self" ? "Tự đặt" : "Được giao"}</Badge>
                    <span className="text-[11px] font-mono text-on-surface-variant">Deadline {g.dl}</span>
                  </div>
                </div>
                <ProgressRing value={g.p} size={52} thickness={6} label={g.p + "%"} sub="" />
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="col-span-12 lg:col-span-4">
        <SectionTitle sub="So với region South">Achievement rate</SectionTitle>
        <div className="text-center">
          <p className="font-display font-bold text-vnd-primary-900" style={{ fontSize: 72, lineHeight: 1 }}>4/6</p>
          <p className="text-[12.5px] text-on-surface-variant mt-1">goals đang on-track</p>
          <Badge tone="green" size="md" className="mt-3" icon="trending_up">Vượt avg region 12%</Badge>
        </div>
        <div className="mt-5 rounded-xl bg-mesh-blue p-4 ring-1 ring-vnd-primary-100">
          <p className="text-[10.5px] uppercase tracking-wider font-bold text-vnd-primary-700">Tip</p>
          <p className="text-[12.5px] text-on-surface mt-1">2 self-goals đang behind. Cân nhắc redirect 2h/tuần từ Goal #6 sang Goal #5 để cân bằng tiến độ.</p>
        </div>
      </Card>
    </div>
  );
}

// =============== 4.3 Benchmarks ===============
function Benchmarks() {
  const [scope, setScope] = useState("team");
  return (
    <>
      <PageHeader
        eyebrow="dAccount · Benchmarks"
        title="Bạn đang ở đâu trong tập thể?"
        sub="So sánh hiệu suất với team, region, toàn tổ chức · học từ Top Performers."
        actions={
          <FilterBar>
            <ChipToggle active={scope === "team"} onClick={() => setScope("team")}>Team</ChipToggle>
            <ChipToggle active={scope === "region"} onClick={() => setScope("region")}>Region</ChipToggle>
            <ChipToggle active={scope === "org"} onClick={() => setScope("org")}>Tổ chức</ChipToggle>
          </FilterBar>
        }
      />
      <Page>
        <div className="grid grid-cols-12 gap-4 mb-5">
          {/* Hero: my position */}
          <Card className="col-span-12 lg:col-span-7 p-7 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-72 h-72 rounded-full bg-vnd-primary-50/60 blur-3xl"></div>
            <div className="relative">
              <Badge tone="blue" size="sm" icon="leaderboard">My Position · Region South</Badge>
              <p className="mt-4 text-[12.5px] text-on-surface-variant">Bạn đang ở vị trí</p>
              <p className="font-display font-bold text-vnd-primary-900" style={{ fontSize: 80, lineHeight: 1, letterSpacing: "-0.03em" }}>#7</p>
              <p className="text-[13px] text-on-surface mt-1">/ 84 advisors · Top 8.3%</p>

              <div className="mt-5 relative">
                {/* Distribution */}
                <svg viewBox="0 0 600 80" className="w-full h-20">
                  <defs>
                    <linearGradient id="distGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#E1E2EB" />
                      <stop offset="50%" stopColor="#0077ED" />
                      <stop offset="100%" stopColor="#00C97D" />
                    </linearGradient>
                  </defs>
                  <path d="M0,60 C100,55 150,30 250,18 C320,12 360,12 420,22 C480,32 540,50 600,58 L600,80 L0,80 Z" fill="url(#distGrad)" opacity="0.6" />
                  <path d="M0,60 C100,55 150,30 250,18 C320,12 360,12 420,22 C480,32 540,50 600,58" stroke="#0077ED" strokeWidth="2" fill="none" />
                  {/* You marker */}
                  <line x1="495" y1="0" x2="495" y2="80" stroke="#00205B" strokeWidth="2" strokeDasharray="3 3" />
                  <circle cx="495" cy="30" r="6" fill="#00205B" />
                  <text x="495" y="14" textAnchor="middle" fontSize="11" fontWeight="700" fill="#00205B" fontFamily="Lexend">You</text>
                  {/* Median marker */}
                  <line x1="300" y1="0" x2="300" y2="80" stroke="#727784" strokeWidth="1" strokeDasharray="2 3" />
                  <text x="300" y="14" textAnchor="middle" fontSize="10" fill="#727784" fontFamily="JetBrains Mono">Median</text>
                </svg>
                <div className="flex items-center justify-between text-[11px] text-on-surface-variant font-mono mt-1">
                  <span>P0</span><span>P25</span><span>P50</span><span>P75</span><span>P90</span><span>P100</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick comparisons */}
          <div className="col-span-12 lg:col-span-5 grid grid-cols-2 gap-3">
            {[
              { l: "vs Team avg", v: "+24%", icon: "trending_up", tone: "green" },
              { l: "vs Region avg", v: "+14%", icon: "trending_up", tone: "green" },
              { l: "vs Org avg", v: "+8%", icon: "trending_up", tone: "green" },
              { l: "vs Top 10", v: "−6%", icon: "trending_down", tone: "amber" }
            ].map((c, i) => (
              <Card key={i}><Stat label={c.l} value={c.v} icon={c.icon} tone={c.tone} /></Card>
            ))}
          </div>
        </div>

        {/* Top Performers */}
        <Card className="mb-5">
          <SectionTitle sub="Region South · Q2/2026"
            action={
              <FilterBar>
                <ChipToggle active>Doanh số</ChipToggle>
                <ChipToggle>AUM</ChipToggle>
                <ChipToggle>NPS</ChipToggle>
                <ChipToggle>ICM</ChipToggle>
              </FilterBar>
            }>
            Top Performers · Học từ ai?
          </SectionTitle>
          <table className="w-full text-[13px]">
            <thead className="border-b border-outline-variant/30 text-[10.5px] uppercase tracking-wider font-semibold text-on-surface-variant">
              <tr className="text-left">
                <th className="pb-3 w-12">Rank</th>
                <th className="pb-3">Advisor</th>
                <th className="pb-3">Squad</th>
                <th className="pb-3 text-right">Doanh số</th>
                <th className="pb-3 text-right">AUM</th>
                <th className="pb-3 text-right">ICM</th>
                <th className="pb-3 text-right">Win rate</th>
                <th className="pb-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {[
                { rk: 1, n: "Trần Hồng Vân", s: "Squad 02", ds: "32.4 tỷ", aum: "284 tỷ", icm: 924, wr: "48%", me: false, tier: "Master" },
                { rk: 2, n: "Lê Khánh", s: "Squad 04", ds: "29.8 tỷ", aum: "264 tỷ", icm: 902, wr: "44%", me: false, tier: "Senior" },
                { rk: 3, n: "Cathy Lin", s: "Squad 01", ds: "27.6 tỷ", aum: "248 tỷ", icm: 881, wr: "46%", me: false, tier: "Master" },
                { rk: 4, n: "Phạm Văn Sơn", s: "Squad 03", ds: "26.2 tỷ", aum: "238 tỷ", icm: 854, wr: "42%", me: false, tier: "Senior" },
                { rk: 5, n: "Đinh Thuý Anh", s: "Squad 02", ds: "24.8 tỷ", aum: "218 tỷ", icm: 832, wr: "41%", me: false, tier: "Senior" },
                { rk: 6, n: "Nguyễn Đăng Trường", s: "Squad 05", ds: "21.4 tỷ", aum: "198 tỷ", icm: 808, wr: "40%", me: false, tier: "Senior" },
                { rk: 7, n: ADV2.shortName + " (Bạn)", s: "Squad 04", ds: "18.4 tỷ", aum: "184 tỷ", icm: 782, wr: "38%", me: true, tier: "Trusted" },
                { rk: 8, n: "Vũ Đức Tâm", s: "Squad 03", ds: "16.8 tỷ", aum: "168 tỷ", icm: 762, wr: "36%", me: false, tier: "Trusted" }
              ].map(r => (
                <tr key={r.rk} className={`${r.me ? "bg-vnd-primary-50 ring-1 ring-vnd-primary-200" : "hover:bg-surface-container-low"}`}>
                  <td className="py-3"><span className={`font-display font-bold ${r.rk <= 3 ? "text-amber-600 text-lg" : r.me ? "text-vnd-primary-700 text-lg" : "text-on-surface-variant"}`}>{r.rk <= 3 ? `🏆 ${r.rk}` : `#${r.rk}`}</span></td>
                  <td className="py-3"><div className="flex items-center gap-2.5"><Avatar name={r.n} size={32} tone={r.me ? "blue" : r.tier === "Master" ? "purple" : "slate"} /><div><p className="font-semibold">{r.n}</p><p className="text-[11px] text-on-surface-variant">{r.tier}</p></div></div></td>
                  <td className="py-3 text-on-surface-variant">{r.s}</td>
                  <td className="py-3 text-right font-mono font-semibold">{r.ds}</td>
                  <td className="py-3 text-right font-mono text-on-surface-variant">{r.aum}</td>
                  <td className="py-3 text-right font-mono font-semibold text-vnd-primary-900">{r.icm}</td>
                  <td className="py-3 text-right font-mono">{r.wr}</td>
                  <td className="py-3 text-right"><Button size="xs" tone={r.me ? "ghost" : "outline"} icon={r.me ? "person" : "visibility"}>{r.me ? "Hồ sơ" : "Học hỏi"}</Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        {/* Insights */}
        <div className="grid grid-cols-12 gap-4">
          <Card className="col-span-12 lg:col-span-7 bg-vnd-primary-900 text-white relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-60 h-60 rounded-full bg-vnd-primary-500/30 blur-3xl"></div>
            <div className="relative">
              <Badge tone="ghost" className="bg-white/10 text-white border-white/20" size="sm" icon="auto_awesome">AI Insight</Badge>
              <h3 className="font-display text-headline-md mt-3">Bạn cách Top 3 chỉ 142 ICM điểm</h3>
              <p className="text-[13px] text-white/80 mt-2 leading-relaxed">Top 3 advisors có 2 đặc điểm chung: <span className="text-white font-semibold">behavioral coaching score &gt; 85</span> và <span className="text-white font-semibold">cross-sell ratio &gt; 3.0</span>. Hai dimension này hiện là điểm yếu của bạn.</p>
              <div className="grid grid-cols-2 gap-3 mt-4">
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-[10.5px] uppercase tracking-wider text-white/60 font-bold">Bạn cần</p>
                  <p className="font-display font-semibold mt-1">Tăng behavioral 62 → 80 (+18đ)</p>
                </div>
                <div className="bg-white/10 rounded-lg p-3">
                  <p className="text-[10.5px] uppercase tracking-wider text-white/60 font-bold">Bạn cần</p>
                  <p className="font-display font-semibold mt-1">Cross-sell 2.4 → 3.0 (+25%)</p>
                </div>
              </div>
              <Button tone="primary" icon="rocket_launch" className="mt-4">Tạo plan đuổi Top 3</Button>
            </div>
          </Card>

          <Card className="col-span-12 lg:col-span-5">
            <SectionTitle sub="Behavioral patterns của Top 10">Behavior of Top 10</SectionTitle>
            <ul className="space-y-2.5">
              {[
                { l: "Daily NAC check trước 9AM", v: "94%", b: "vs 62% avg" },
                { l: "≥ 3 1-on-1 KH/tuần", v: "100%", b: "vs 71% avg" },
                { l: "Cập nhật cadence đúng giờ", v: "98%", b: "vs 78% avg" },
                { l: "Tham dự ≥ 2 live session/quý", v: "90%", b: "vs 54% avg" },
                { l: "Mentor session đều đặn", v: "86%", b: "vs 41% avg" }
              ].map((b, i) => (
                <li key={i} className="flex items-center gap-3 p-3 rounded-xl ring-1 ring-outline-variant/30">
                  <span className="w-7 h-7 rounded-md bg-emerald-50 text-emerald-700 flex items-center justify-center"><Icon name="check_circle" size={14} /></span>
                  <span className="flex-1 text-[12.5px] font-medium">{b.l}</span>
                  <div className="text-right">
                    <p className="font-mono font-bold text-vnd-primary-900 text-[13px]">{b.v}</p>
                    <p className="text-[10px] font-mono text-on-surface-variant">{b.b}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </Page>
    </>
  );
}

Object.assign(window, { ScreenDAccount });
