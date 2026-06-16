/* global React, window */
const { SKILL_GAPS, CERTS, BADGES } = window.DSB_DATA;

// =============== iLEAD WRAPPER ===============
function ScreenILead({ screen }) {
  if (screen === "ilead/job")   return <OnboardingMG />;
  if (screen === "ilead/depth") return <BmiTrack />;
  if (screen === "ilead/idp")   return <CertIdp />;
  // legacy fallbacks
  if (screen === "ilead/onboarding") return <OnboardingMG />;
  if (screen === "ilead/bmi")  return <BmiTrack />;
  if (screen === "ilead/icm")  return <IcmTrack />;
  if (screen === "ilead/cert") return <CertIdp />;
  return <OnboardingMG />;
}

// =============== Shared mini-components ===============
function SubTabs({ value, onChange, tabs }) {
  return (
    <div className="inline-flex items-center bg-surface-container-low rounded-xl p-1 ring-1 ring-outline-variant/40">
      {tabs.map(t => {
        const active = t.id === value;
        return (
          <button key={t.id} onClick={() => onChange(t.id)}
            className={`px-3.5 py-1.5 rounded-lg text-[12.5px] font-display font-medium transition-all inline-flex items-center gap-1.5
              ${active ? "bg-white text-vnd-primary-700 shadow-xs" : "text-on-surface-variant hover:text-on-surface"}`}>
            {t.icon && <Icon name={t.icon} size={14} />}
            {t.label}
            {typeof t.count === "number" && (
              <span className={`text-[10px] font-bold rounded-full px-1.5 ${active ? "bg-vnd-primary-100 text-vnd-primary-700" : "bg-surface-container-high text-on-surface-variant"}`}>{t.count}</span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function ScoreCard({ label, value, max = 100, sub, tone = "blue", icon }) {
  const tones = {
    blue:   { fg: "#0077ED", bg: "bg-vnd-primary-50",   chip: "text-vnd-primary-700" },
    green:  { fg: "#00C97D", bg: "bg-emerald-50",       chip: "text-emerald-700" },
    amber:  { fg: "#FF8C33", bg: "bg-amber-50",         chip: "text-amber-700" },
    purple: { fg: "#8B2E8F", bg: "bg-fuchsia-50",       chip: "text-fuchsia-700" }
  }[tone];
  return (
    <div className={`rounded-xl ring-1 ring-outline-variant/30 p-4 ${tones.bg}`}>
      <div className="flex items-center justify-between">
        {icon && <span className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: tones.fg, color: "white" }}><Icon name={icon} size={16} /></span>}
        <span className={`text-[10px] uppercase tracking-wider font-bold ${tones.chip}`}>/{max}</span>
      </div>
      <p className="font-display font-bold text-headline-md text-vnd-primary-900 mt-3 font-mono">{value}</p>
      <p className="text-[12px] font-semibold text-on-surface mt-0.5">{label}</p>
      {sub && <p className="text-[11px] text-on-surface-variant mt-0.5">{sub}</p>}
    </div>
  );
}

function Dimension({ label, value, target, color = "#0077ED" }) {
  return (
    <li>
      <div className="flex items-center justify-between text-[12.5px] mb-1.5">
        <span className="font-medium text-on-surface">{label}</span>
        <span className="font-mono text-on-surface-variant">{value}/{target}</span>
      </div>
      <div className="relative h-2 bg-surface-container-low rounded-full overflow-hidden">
        <div className="absolute inset-y-0 left-0 rounded-full transition-all" style={{ width: value + "%", backgroundColor: color }}></div>
        <div className="absolute inset-y-0 w-0.5 bg-vnd-primary-900" style={{ left: target + "%" }}></div>
      </div>
    </li>
  );
}

// =============== 1) BMI TRACK ===============
// BMI = Business Maturity Index
// Sub: (a) Sống Nền + Nếp  → CoC + VNDGO   (b) Biểu hiện EB + PoA
function BmiTrack() {
  const [main, setMain] = useState("song");
  const [songTab, setSongTab] = useState("nen");
  return (
    <>
      <PageHeader
        eyebrow="iLead · BMI Track"
        title="Business Maturity Index"
        sub="Chiều sâu hành vi & giá trị: Sống Nền (CoC), Sống Nếp (VNDGO), Biểu hiện EB + PoA."
        actions={
          <>
            <Button tone="ghost" size="sm" icon="info">Cách tính BMI</Button>
            <Button tone="outline" size="sm" icon="history">Lịch sử quý</Button>
          </>
        }
      />
      <Page>
        {/* Hero BMI summary */}
        <Card className="mb-5 p-7 bg-vnd-primary-900 text-white relative overflow-hidden">
          <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-vnd-primary-500/30 blur-3xl"></div>
          <div className="absolute -bottom-12 left-1/3 w-56 h-56 rounded-full bg-vnd-accent-green/20 blur-3xl"></div>
          <div className="relative grid grid-cols-12 gap-6 items-center">
            <div className="col-span-12 lg:col-span-7">
              <Badge tone="ghost" size="sm" className="bg-white/10 text-white border-white/20" icon="psychology">BMI Level</Badge>
              <p className="font-display font-bold mt-3 leading-none" style={{ fontSize: 64, letterSpacing: "-0.025em" }}>BMI-3</p>
              <p className="text-title-md text-white/80 mt-2">Trusted Advisor · 68% lên BMI-4</p>
              <div className="grid grid-cols-3 gap-3 mt-5">
                {[
                  { l: "Sống Nền (CoC)", v: 92 },
                  { l: "Sống Nếp (VNDGO)", v: 78 },
                  { l: "Biểu hiện EB + PoA", v: 64 }
                ].map((d, i) => (
                  <div key={i} className="bg-white/10 ring-1 ring-white/10 rounded-xl p-3">
                    <p className="text-[10.5px] uppercase tracking-wider text-white/60 font-bold">{d.l}</p>
                    <p className="font-display font-bold text-headline-md mt-1 font-mono">{d.v}</p>
                    <div className="h-1 bg-white/15 rounded-full overflow-hidden mt-2">
                      <div className="h-full rounded-full" style={{ width: d.v + "%", backgroundColor: d.v >= 80 ? "#00C97D" : d.v >= 65 ? "#0077ED" : "#FFB020" }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-span-12 lg:col-span-5 flex justify-center">
              <ProgressRing value={78} size={180} thickness={14} label="78" sub="BMI Composite" />
            </div>
          </div>
        </Card>

        {/* Sub-module selector */}
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <SubTabs value={main} onChange={setMain} tabs={[
            { id: "song", label: "Sống Nền + Nếp", icon: "self_improvement" },
            { id: "epa",  label: "Biểu hiện EB + PoA", icon: "auto_awesome" }
          ]} />
          <span className="text-[11.5px] text-on-surface-variant">Cập nhật: tự động cuối mỗi quý + check-in hàng tháng</span>
        </div>

        {main === "song" && (
          <>
            <SubTabs value={songTab} onChange={setSongTab} tabs={[
              { id: "nen", label: "Sống Nền (CoC)", icon: "shield" },
              { id: "nep", label: "Sống Nếp (VNDGO)", icon: "rhythm" }
            ]} />
            <div className="mt-4">
              {songTab === "nen" ? <SongNen /> : <SongNep />}
            </div>
          </>
        )}

        {main === "epa" && <BieuHienEbPoa />}
      </Page>
    </>
  );
}

function SongNen() {
  const principles = [
    { id: "P1", title: "Trung thực & Minh bạch", desc: "Không che giấu xung đột lợi ích · COI declaration đầy đủ", score: 96, trend: 1.2 },
    { id: "P2", title: "Khách hàng là trung tâm", desc: "Đặt lợi ích KH trước doanh thu cá nhân · Suitability gate", score: 94, trend: 0 },
    { id: "P3", title: "Bảo mật & Tuân thủ",     desc: "Tuân thủ AML, KYC, FATCA · không leak dữ liệu KH", score: 100, trend: 0 },
    { id: "P4", title: "Liêm chính nghề nghiệp", desc: "Không misselling, không churn · không kèo dìu xấu", score: 92, trend: 2.4 },
    { id: "P5", title: "Hợp tác & Tôn trọng",    desc: "Tôn trọng đồng nghiệp · không tranh giành KH thô bạo", score: 88, trend: -0.8 },
    { id: "P6", title: "Học hỏi & Cải tiến",     desc: "Liên tục nâng cấp · đón nhận feedback", score: 86, trend: 3.6 }
  ];
  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-12 lg:col-span-8">
        <SectionTitle sub="6 nguyên tắc nền tảng của Code of Conduct · điểm tổng hợp từ self-assess + peer-review + audit"
          action={<Badge tone="green" size="md" icon="verified">Compliant Q2/2026</Badge>}>
          Code of Conduct · 6 Nguyên tắc Nền
        </SectionTitle>
        <ul className="space-y-3">
          {principles.map(p => (
            <li key={p.id} className="rounded-xl ring-1 ring-outline-variant/30 p-4 flex items-start gap-4">
              <span className="w-10 h-10 rounded-xl bg-vnd-primary-50 text-vnd-primary-700 flex items-center justify-center font-display font-bold">{p.id}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-display font-semibold text-on-surface">{p.title}</p>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-vnd-primary-900 text-[15px]">{p.score}</span>
                    {p.trend !== 0 && <span className={`text-[11px] font-mono font-bold ${p.trend > 0 ? "text-emerald-600" : "text-red-600"}`}>{p.trend > 0 ? "+" : ""}{p.trend}</span>}
                  </div>
                </div>
                <p className="text-[12px] text-on-surface-variant mt-0.5">{p.desc}</p>
                <div className="h-1.5 bg-surface-container-low rounded-full overflow-hidden mt-2.5">
                  <div className={`h-full rounded-full ${p.score >= 90 ? "bg-emerald-500" : p.score >= 75 ? "bg-vnd-primary-500" : "bg-amber-500"}`} style={{ width: p.score + "%" }}></div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="col-span-12 lg:col-span-4">
        <SectionTitle sub="Tổng hợp Quý 2/2026">CoC Composite</SectionTitle>
        <div className="flex justify-center mb-4">
          <ProgressRing value={92} size={140} thickness={12} label="92" sub="CoC Score" />
        </div>
        <ul className="space-y-2 text-[12.5px]">
          <li className="flex items-center justify-between"><span className="text-on-surface-variant">Self-assess</span><span className="font-mono font-bold">94</span></li>
          <li className="flex items-center justify-between"><span className="text-on-surface-variant">Peer review (5)</span><span className="font-mono font-bold">91</span></li>
          <li className="flex items-center justify-between"><span className="text-on-surface-variant">Audit (Compliance)</span><span className="font-mono font-bold text-emerald-700">95</span></li>
          <li className="flex items-center justify-between"><span className="text-on-surface-variant">KH feedback NPS</span><span className="font-mono font-bold">88</span></li>
        </ul>
        <div className="mt-5 rounded-xl bg-mesh-blue p-4 ring-1 ring-vnd-primary-100">
          <p className="text-[10.5px] uppercase tracking-wider font-bold text-vnd-primary-700">Next milestone</p>
          <p className="text-[12.5px] text-on-surface mt-1">Đạt CoC ≥ 95 trong 2 quý liên tiếp để mở khoá BMI-4 promotion gate.</p>
        </div>
      </Card>
    </div>
  );
}

function SongNep() {
  const habits = [
    { l: "Daily NAC check trước 9AM",      cur: 26, target: 30, unit: "ngày/tháng" },
    { l: "≥3 1-on-1 KH/tuần",              cur: 11, target: 12, unit: "tuần/quý" },
    { l: "Cập nhật cadence đúng giờ",      cur: 94, target: 95, unit: "%" },
    { l: "Tham dự ≥2 live session/quý",    cur: 3,  target: 2,  unit: "session" },
    { l: "Log interaction trong 24h",      cur: 88, target: 90, unit: "%" },
    { l: "Mentor check-in hàng tháng",     cur: 3,  target: 3,  unit: "lần/quý" }
  ];
  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-12 lg:col-span-7">
        <SectionTitle sub="VNDGO — Vietnamese Discipline & Growth Operating standard · 6 nếp cốt lõi">Nếp hành vi (VNDGO)</SectionTitle>
        <ul className="space-y-3.5">
          {habits.map((h, i) => {
            const pct = Math.min(100, (h.cur / h.target) * 100);
            return (
              <li key={i}>
                <div className="flex items-center justify-between text-[13px] mb-1.5">
                  <span className="font-medium text-on-surface">{h.l}</span>
                  <span className="font-mono text-on-surface-variant">
                    <span className={pct >= 100 ? "text-emerald-700 font-bold" : "font-bold text-on-surface"}>{h.cur}</span>
                    <span className="opacity-60"> / {h.target} {h.unit}</span>
                  </span>
                </div>
                <div className="h-2 bg-surface-container-low rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${pct >= 100 ? "bg-emerald-500" : pct >= 80 ? "bg-vnd-primary-500" : "bg-amber-500"}`} style={{ width: pct + "%" }}></div>
                </div>
              </li>
            );
          })}
        </ul>
      </Card>

      <Card className="col-span-12 lg:col-span-5">
        <SectionTitle sub="Streak nếp sống · 90 ngày gần nhất">Habit streak</SectionTitle>
        <div className="grid grid-cols-15 gap-1" style={{ gridTemplateColumns: "repeat(15, minmax(0, 1fr))" }}>
          {Array.from({ length: 90 }).map((_, i) => {
            const intensity = Math.random();
            const bg = intensity > 0.85 ? "bg-emerald-600" : intensity > 0.6 ? "bg-emerald-400" : intensity > 0.35 ? "bg-emerald-200" : intensity > 0.15 ? "bg-emerald-100" : "bg-surface-container-high";
            return <span key={i} className={`aspect-square rounded ${bg}`} title={`Ngày ${i + 1}`}></span>;
          })}
        </div>
        <div className="flex items-center justify-between mt-4 text-[11px] text-on-surface-variant font-mono">
          <span>Ít</span>
          <div className="flex items-center gap-1">
            {["surface-container-high","emerald-100","emerald-200","emerald-400","emerald-600"].map(c => <span key={c} className={`w-3 h-3 rounded bg-${c}`}></span>)}
          </div>
          <span>Nhiều</span>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-surface-container-low p-3">
            <p className="font-display font-bold text-headline-sm text-vnd-primary-900">47</p>
            <p className="text-[10.5px] text-on-surface-variant uppercase">Active days</p>
          </div>
          <div className="rounded-lg bg-emerald-50 p-3">
            <p className="font-display font-bold text-headline-sm text-emerald-700">18</p>
            <p className="text-[10.5px] text-emerald-700/80 uppercase">Current streak</p>
          </div>
          <div className="rounded-lg bg-amber-50 p-3">
            <p className="font-display font-bold text-headline-sm text-amber-700">31</p>
            <p className="text-[10.5px] text-amber-700/80 uppercase">Longest</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

function BieuHienEbPoa() {
  return (
    <div className="grid grid-cols-12 gap-4">
      {/* EB - Employer Branding */}
      <Card className="col-span-12 lg:col-span-7">
        <SectionTitle sub="Hành vi đại diện thương hiệu VNDirect bên ngoài tổ chức">Employer Branding (EB)</SectionTitle>
        <div className="grid grid-cols-2 gap-3 mb-5">
          <ScoreCard label="Social presence" value={72} sub="LinkedIn + FB · share insights" tone="blue" icon="public" />
          <ScoreCard label="KH advocacy" value={84} sub="Referral active rate" tone="green" icon="favorite" />
          <ScoreCard label="Speaker/Panel" value={3} max={5} sub="Events Q2: 3 lần" tone="amber" icon="campaign" />
          <ScoreCard label="Brand alignment" value={91} sub="Audit messaging compliant" tone="purple" icon="verified" />
        </div>
        <p className="text-[11px] uppercase tracking-wider font-bold text-on-surface-variant mb-2">Hoạt động gần đây</p>
        <ul className="space-y-2">
          {[
            { t: "Panel discussion · CFP VN Conference 2026", d: "12/05", reach: "180 attendees", tone: "blue" },
            { t: "Bài chia sẻ \"Behavioral Coaching cho NĐT mới\"", d: "08/05", reach: "2.4K reads", tone: "green" },
            { t: "Workshop nội bộ Squad 04 — Q4 outlook", d: "03/05", reach: "12 advisor", tone: "amber" }
          ].map((a, i) => (
            <li key={i} className="flex items-center gap-3 p-3 rounded-xl ring-1 ring-outline-variant/30">
              <span className={`w-9 h-9 rounded-lg flex items-center justify-center
                ${{blue:"bg-vnd-primary-50 text-vnd-primary-700",green:"bg-emerald-50 text-emerald-700",amber:"bg-amber-50 text-amber-700"}[a.tone]}`}>
                <Icon name={i === 0 ? "groups" : i === 1 ? "article" : "school"} size={16} />
              </span>
              <div className="flex-1">
                <p className="text-[13px] font-semibold text-on-surface">{a.t}</p>
                <p className="text-[11px] text-on-surface-variant">{a.reach}</p>
              </div>
              <span className="font-mono text-[11px] text-on-surface-variant">{a.d}</span>
            </li>
          ))}
        </ul>
      </Card>

      {/* PoA - Path of Achievement */}
      <Card className="col-span-12 lg:col-span-5">
        <SectionTitle sub="Chuỗi thành tựu nghề nghiệp được công nhận">Path of Achievement (PoA)</SectionTitle>
        <ol className="relative pl-7 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-px before:bg-outline-variant/40">
          {[
            { y: "2026 Q2", t: "Top 10% advisor region South", state: "current", tone: "blue" },
            { y: "2025 Q4", t: "Đạt CFP® certification", state: "done", tone: "amber" },
            { y: "2025 Q3", t: "Mentor of the Quarter · Platinum", state: "done", tone: "purple" },
            { y: "2024",    t: "Quản lý AUM vượt mốc 150 tỷ", state: "done", tone: "green" },
            { y: "2023",    t: "Promotion: Senior Advisor (BMI-3)", state: "done", tone: "blue" }
          ].map((a, i) => (
            <li key={i} className="relative">
              <span className={`absolute -left-[20px] top-1 w-5 h-5 rounded-full ring-4 ring-white flex items-center justify-center
                ${a.state === "current" ? "bg-vnd-primary-500 text-white animate-pulse-soft" :
                  a.tone === "amber" ? "bg-amber-500 text-white" :
                  a.tone === "purple" ? "bg-fuchsia-500 text-white" :
                  a.tone === "green" ? "bg-emerald-500 text-white" : "bg-vnd-primary-100 text-vnd-primary-700"}`}>
                <Icon name={a.state === "current" ? "rocket_launch" : "check"} size={11} weight={600} />
              </span>
              <div>
                <p className="text-[12px] font-mono text-on-surface-variant">{a.y}</p>
                <p className="text-[13px] font-semibold text-on-surface">{a.t}</p>
              </div>
            </li>
          ))}
        </ol>
        <div className="mt-5 rounded-xl bg-mesh-blue p-4 ring-1 ring-vnd-primary-100">
          <p className="text-[10.5px] uppercase tracking-wider font-bold text-vnd-primary-700">Achievement kế tiếp</p>
          <p className="text-[13px] font-semibold text-vnd-primary-900 mt-1">BMI-4 promotion · Q2/2027</p>
          <p className="text-[11.5px] text-on-surface-variant mt-1">Còn 32% cần đạt · focus Behavioral & Estate.</p>
        </div>
      </Card>
    </div>
  );
}

// =============== 2) ICM TRACK ===============
// ICM = Individual Capability Measurement
// Sub: (a) SC + PSC → Self Competence + Pro Skill   (b) Forming → Living → Holding
function IcmTrack() {
  const [main, setMain] = useState("scpsc");
  const [scTab, setScTab] = useState("sc");
  return (
    <>
      <PageHeader
        eyebrow="iLead · ICM Track"
        title="Individual Capability Measurement"
        sub="Đo lường năng lực: Self Competence + Pro Skill, và chu kỳ Forming → Living → Holding."
        actions={
          <>
            <Button tone="ghost" size="sm" icon="auto_awesome">Đề xuất AI</Button>
            <Button tone="primary" size="sm" icon="flag">Đặt mục tiêu</Button>
          </>
        }
      />
      <Page>
        {/* Hero ICM */}
        <Card className="mb-5 p-7 relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-vnd-primary-50/80 blur-3xl"></div>
          <div className="relative grid grid-cols-12 gap-4 items-center">
            <div className="col-span-12 lg:col-span-7">
              <Badge tone="blue" size="sm" icon="school">ICM Composite</Badge>
              <p className="font-display font-bold text-vnd-primary-900 mt-3" style={{ fontSize: 56, lineHeight: 1 }}>782<span className="text-headline-md text-on-surface-variant font-normal">/1000</span></p>
              <p className="text-[13px] text-on-surface-variant mt-1">Top 18% region South · +24 điểm so Q1</p>
              <div className="grid grid-cols-2 gap-3 mt-5">
                <div className="rounded-xl bg-vnd-primary-50 p-4">
                  <p className="text-[11px] uppercase tracking-wider font-bold text-vnd-primary-700">SC · Self Competence</p>
                  <p className="font-display font-bold text-headline-md text-vnd-primary-900 mt-1 font-mono">348<span className="text-[12px] text-on-surface-variant ml-1">/450</span></p>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">Năng lực tự thân</p>
                </div>
                <div className="rounded-xl bg-emerald-50 p-4">
                  <p className="text-[11px] uppercase tracking-wider font-bold text-emerald-700">PSC · Pro Skill</p>
                  <p className="font-display font-bold text-headline-md text-emerald-700 mt-1 font-mono">434<span className="text-[12px] text-on-surface-variant ml-1">/550</span></p>
                  <p className="text-[11px] text-on-surface-variant mt-0.5">Kỹ năng chuyên môn</p>
                </div>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-5">
              <div className="flex justify-center">
                <ProgressRing value={78} size={200} thickness={16} label="78%" sub="ICM Coverage" />
              </div>
              <p className="text-center text-[12px] text-on-surface-variant mt-2">Lên ICM Gold (800+) cần thêm 18 điểm</p>
            </div>
          </div>
        </Card>

        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <SubTabs value={main} onChange={setMain} tabs={[
            { id: "scpsc", label: "SC + PSC", icon: "psychology" },
            { id: "flh",   label: "Forming → Living → Holding", icon: "loop" }
          ]} />
          <span className="text-[11.5px] text-on-surface-variant">Re-assess: mỗi quý · 360° peer review hàng năm</span>
        </div>

        {main === "scpsc" && (
          <>
            <SubTabs value={scTab} onChange={setScTab} tabs={[
              { id: "sc",  label: "SC — Self Competence", icon: "person" },
              { id: "psc", label: "PSC — Pro Skill", icon: "workspace_premium" }
            ]} />
            <div className="mt-4">
              {scTab === "sc" ? <SelfCompetence /> : <ProSkill />}
            </div>
          </>
        )}

        {main === "flh" && <FormingLivingHolding />}
      </Page>
    </>
  );
}

function SelfCompetence() {
  const dims = [
    { l: "Tự nhận thức (Self-awareness)", cur: 82, tgt: 90, color: "#0077ED" },
    { l: "Tự điều chỉnh (Self-regulation)", cur: 74, tgt: 85, color: "#0077ED" },
    { l: "Động lực nội tại (Motivation)", cur: 88, tgt: 90, color: "#0077ED" },
    { l: "Đồng cảm (Empathy)", cur: 70, tgt: 85, color: "#0077ED" },
    { l: "Quản lý cảm xúc dưới áp lực", cur: 64, tgt: 80, color: "#0077ED" },
    { l: "Kỷ luật cá nhân", cur: 86, tgt: 90, color: "#0077ED" }
  ];
  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-12 lg:col-span-7">
        <SectionTitle sub="6 dimension cốt lõi của năng lực tự thân">Self Competence Dimensions</SectionTitle>
        <ul className="space-y-3.5">
          {dims.map((d, i) => <Dimension key={i} {...d} value={d.cur} target={d.tgt} label={d.l} />)}
        </ul>
        <div className="mt-5 pt-4 border-t border-outline-variant/30 flex items-center justify-between text-[12px] text-on-surface-variant">
          <span>SC composite: <span className="font-mono font-bold text-vnd-primary-900">77.3</span></span>
          <span>Quarterly change: <span className="font-mono font-bold text-emerald-700">+4.2</span></span>
          <span>Last 360° peer: <span className="font-mono">Q1/2026</span></span>
        </div>
      </Card>
      <Card className="col-span-12 lg:col-span-5">
        <SectionTitle sub="Hành động đề xuất tuần">Self-development plan</SectionTitle>
        <ul className="space-y-2.5">
          {[
            { t: "Journal cảm xúc 5 phút mỗi tối", k: "Self-awareness", done: 4, target: 7 },
            { t: "Mock cuộc gặp KH khó tính", k: "Quản lý áp lực", done: 1, target: 2 },
            { t: "Mentor 1-on-1: review case behavioral", k: "Empathy", done: 1, target: 1 },
            { t: "Khoá Stoic Mindset for Advisors", k: "Self-regulation", done: 0, target: 1 }
          ].map((p, i) => (
            <li key={i} className="rounded-xl ring-1 ring-outline-variant/30 p-3.5">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[13px] font-semibold text-on-surface">{p.t}</p>
                <Badge tone="blue" size="xs">{p.k}</Badge>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-surface-container-low rounded-full overflow-hidden">
                  <div className="h-full bg-vnd-primary-500 rounded-full" style={{ width: (p.done / p.target * 100) + "%" }}></div>
                </div>
                <span className="font-mono text-[11px] text-on-surface-variant">{p.done}/{p.target}</span>
              </div>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  );
}

function ProSkill() {
  // Use existing SKILL_GAPS as professional skills
  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-12 lg:col-span-8">
        <SectionTitle sub="Hard skills theo chuẩn role · so với role hiện tại + role kế tiếp"
          action={<Badge tone="blue" size="sm" icon="trending_up">+6 điểm quý</Badge>}>
          Professional Skills
        </SectionTitle>
        <ul className="space-y-3.5">
          {SKILL_GAPS.map(s => (
            <Dimension key={s.skill} label={s.skill} value={s.current} target={s.target} color="#00C97D" />
          ))}
        </ul>
        <div className="mt-4 pt-4 border-t border-outline-variant/30 flex items-center gap-4 text-[11.5px] text-on-surface-variant">
          <span className="inline-flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm bg-vnd-accent-green"></span>Hiện tại</span>
          <span className="inline-flex items-center gap-1.5"><span className="w-0.5 h-3 bg-vnd-primary-900"></span>Target role</span>
          <span className="ml-auto">PSC composite: <span className="font-mono font-bold text-emerald-700">78.9</span></span>
        </div>
      </Card>
      <Card className="col-span-12 lg:col-span-4">
        <SectionTitle sub="Top 3 priority để lên BMI-4">Skill investment priority</SectionTitle>
        <ol className="space-y-2.5">
          {[
            { rk: 1, s: "Estate & Legacy", gap: 34, hours: 36, courses: 2 },
            { rk: 2, s: "Tax Optimization (VN)", gap: 26, hours: 24, courses: 2 },
            { rk: 3, s: "Behavioral Coaching", gap: 23, hours: 18, courses: 1 }
          ].map(s => (
            <li key={s.rk} className="rounded-xl ring-1 ring-outline-variant/30 p-3">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-md bg-vnd-primary-900 text-white flex items-center justify-center font-display font-bold text-[12px]">{s.rk}</span>
                <div className="flex-1">
                  <p className="text-[13px] font-semibold">{s.s}</p>
                  <p className="text-[11px] text-red-600 font-mono">Gap −{s.gap} điểm</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2 text-[11px] text-on-surface-variant">
                <span><Icon name="schedule" size={12} className="inline" /> {s.hours}h</span>
                <span><Icon name="menu_book" size={12} className="inline" /> {s.courses} khoá</span>
                <Button size="xs" tone="soft">Lộ trình</Button>
              </div>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}

function FormingLivingHolding() {
  const phases = [
    { id: "forming", label: "Forming",  desc: "Hình thành năng lực mới qua learning + drill",   pct: 100, state: "done",    color: "#FFB020", bg: "bg-amber-50" },
    { id: "living",  label: "Living",   desc: "Sống cùng năng lực qua thực hành hàng ngày",      pct: 68,  state: "current", color: "#0077ED", bg: "bg-vnd-primary-50" },
    { id: "holding", label: "Holding",  desc: "Giữ vững & truyền lại — mentor & best practice",  pct: 22,  state: "next",    color: "#00C97D", bg: "bg-emerald-50" }
  ];
  return (
    <div className="space-y-4">
      <Card className="p-7">
        <SectionTitle sub="Chu kỳ năng lực: hình thành → sống cùng → giữ vững. Mỗi competence sẽ đi qua 3 pha.">
          Forming → Living → Holding
        </SectionTitle>
        <ol className="grid grid-cols-3 gap-4 mt-2">
          {phases.map((p, i) => (
            <li key={p.id} className={`relative rounded-2xl ring-1 ${p.bg} p-5 ${p.state === "current" ? "ring-2 ring-vnd-primary-500 shadow-soft" : "ring-outline-variant/30"}`}>
              <div className="flex items-center justify-between mb-3">
                <span className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-display font-bold" style={{ backgroundColor: p.color }}>{i + 1}</span>
                {p.state === "done" && <Badge tone="green" size="xs" icon="check">Hoàn tất</Badge>}
                {p.state === "current" && <Badge tone="blue" size="xs" icon="bolt">Đang ở</Badge>}
                {p.state === "next" && <Badge tone="neutral" size="xs">Pha tiếp</Badge>}
              </div>
              <p className="font-display text-headline-sm text-vnd-primary-900">{p.label}</p>
              <p className="text-[12.5px] text-on-surface-variant mt-1">{p.desc}</p>
              <div className="mt-4">
                <div className="flex items-center justify-between text-[11px] mb-1 font-mono text-on-surface-variant">
                  <span>Phủ năng lực</span><span className="font-bold">{p.pct}%</span>
                </div>
                <div className="h-2 bg-white rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: p.pct + "%", backgroundColor: p.color }}></div>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Card>

      {/* Competence migration table */}
      <Card>
        <SectionTitle sub="Trạng thái của từng năng lực theo Forming/Living/Holding"
          action={<Button tone="ghost" size="sm" icon="filter_list">Lọc</Button>}>
          Competence migration
        </SectionTitle>
        <table className="w-full text-[13px]">
          <thead className="border-b border-outline-variant/30 text-[10.5px] uppercase tracking-wider font-semibold text-on-surface-variant">
            <tr className="text-left">
              <th className="pb-3">Năng lực</th>
              <th className="pb-3">Lĩnh vực</th>
              <th className="pb-3">Pha hiện tại</th>
              <th className="pb-3">Thời gian ở pha</th>
              <th className="pb-3 text-right">Bước kế</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">
            {[
              { s: "Compliance & AML", a: "Sản phẩm/Compliance", p: "Holding", t: "12 tháng", n: "Mentor 2 advisor mới" },
              { s: "Investment Planning", a: "Tư vấn", p: "Living", t: "8 tháng", n: "Apply vào 10 case PWealth" },
              { s: "Discovery Conversation", a: "Soft skills", p: "Living", t: "5 tháng", n: "Drill 3 buổi/tuần" },
              { s: "Behavioral Coaching", a: "Soft skills", p: "Forming", t: "2 tháng", n: "Hoàn tất Master Class" },
              { s: "Estate & Legacy", a: "Tư vấn", p: "Forming", t: "1 tháng", n: "Đăng ký khoá foundation" },
              { s: "Tax Optimization VN", a: "Sản phẩm", p: "Forming", t: "Chưa bắt đầu", n: "Khởi tạo plan" }
            ].map((r, i) => {
              const tone = r.p === "Forming" ? "amber" : r.p === "Living" ? "blue" : "green";
              return (
                <tr key={i} className="hover:bg-surface-container-low">
                  <td className="py-3 font-semibold">{r.s}</td>
                  <td className="py-3 text-on-surface-variant">{r.a}</td>
                  <td className="py-3"><Badge tone={tone} size="sm">{r.p}</Badge></td>
                  <td className="py-3 font-mono text-on-surface-variant">{r.t}</td>
                  <td className="py-3 text-right text-[12px]">{r.n}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

// =============== 3) CERT + IDP ===============
// Sub: Lộ trình (CCHN MG/PTĐT, CFA chuyên sâu) · IDP MG roadmap · Skill gap · Migration track
function CertIdp() {
  const [main, setMain] = useState("path");
  const [pathTab, setPathTab] = useState("local");
  return (
    <>
      <PageHeader
        eyebrow="iLead · Cert + IDP"
        title="Chứng chỉ & Lộ trình phát triển"
        sub="CCHN MG / PTĐT · CFA & chuyên sâu · IDP roadmap môi giới · Skill gap · Migration."
        actions={
          <>
            <Button tone="outline" size="sm" icon="download">Xuất CV năng lực</Button>
            <Button tone="primary" size="sm" icon="add">Đăng ký thi</Button>
          </>
        }
      />
      <Page>
        {/* Stats row */}
        <div className="grid grid-cols-12 gap-3 mb-5">
          {[
            { l: "Cert active", v: CERTS.filter(c => c.status === "active").length, i: "verified", tone: "green" },
            { l: "Sắp hết hạn", v: CERTS.filter(c => c.status === "renew").length, i: "schedule", tone: "amber" },
            { l: "Đang theo học", v: 3, i: "school", tone: "blue" },
            { l: "Skill gap mở", v: SKILL_GAPS.filter(s => s.delta > 10).length, i: "trending_down", tone: "red" }
          ].map((s, i) => (
            <div key={i} className="col-span-6 md:col-span-3"><Card><Stat label={s.l} value={s.v} icon={s.i} tone={s.tone} /></Card></div>
          ))}
        </div>

        <SubTabs value={main} onChange={setMain} tabs={[
          { id: "path",     label: "Lộ trình",         icon: "route" },
          { id: "idp",      label: "IDP MG roadmap",   icon: "flag" },
          { id: "gap",      label: "Skill gap analysis", icon: "trending_down" },
          { id: "migration",label: "Migration track",   icon: "compare_arrows" }
        ]} />

        <div className="mt-5">
          {main === "path" && (
            <>
              <SubTabs value={pathTab} onChange={setPathTab} tabs={[
                { id: "local", label: "CCHN MG / PTĐT", icon: "flag" },
                { id: "intl",  label: "CFA / Cert chuyên sâu", icon: "language" }
              ]} />
              <div className="mt-4">
                {pathTab === "local" ? <CertLocal /> : <CertIntl />}
              </div>
            </>
          )}

          {main === "idp" && <IdpRoadmap />}
          {main === "gap" && <SkillGapAnalysis />}
          {main === "migration" && <MigrationTrack />}
        </div>
      </Page>
    </>
  );
}

function CertLocal() {
  const certs = [
    { code: "CCHN MG-CK", name: "Chứng chỉ Hành nghề Môi giới Chứng khoán", body: "UBCKNN", state: "active", year: "2022", expire: "Vô thời hạn", required: true },
    { code: "CCHN PTĐT", name: "Chứng chỉ Phân tích Đầu tư", body: "UBCKNN", state: "active", year: "2023", expire: "Vô thời hạn", required: true },
    { code: "CCHN QLQ", name: "Chứng chỉ Quản lý Quỹ", body: "UBCKNN", state: "studying", year: "—", expire: "Đăng ký T9/2026", required: false, progress: 40 },
    { code: "CCHN TVDT", name: "Chứng chỉ Tư vấn Đầu tư Chứng khoán", body: "UBCKNN", state: "available", year: "—", expire: "Mở quanh năm", required: false },
    { code: "CCHN QLDM", name: "Chứng chỉ Quản lý Danh mục Đầu tư", body: "UBCKNN", state: "available", year: "—", expire: "Mở Q3/2026", required: false },
    { code: "LIC", name: "Life Insurance Consultant", body: "IRT VN", state: "renew", year: "2023", expire: "Q4/2025 — sắp hết", required: true }
  ];
  return (
    <div className="grid grid-cols-12 gap-4">
      {certs.map(c => (
        <Card key={c.code} className="col-span-12 md:col-span-6 xl:col-span-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 rounded-full bg-vnd-primary-50/60"></div>
          <div className="relative">
            <div className="flex items-start gap-3 mb-3">
              <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center text-white shadow-brand
                ${c.state === "active" ? "bg-emerald-600" : c.state === "renew" ? "bg-amber-500" : c.state === "studying" ? "bg-vnd-primary-700" : "bg-on-surface-variant"}`}>
                <Icon name="workspace_premium" size={18} filled />
                <span className="text-[8px] font-display font-bold mt-0.5">{c.code.split(" ")[0]}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <p className="font-display font-bold text-vnd-primary-900 text-[13px]">{c.code}</p>
                  {c.required && <Badge tone="red" size="xs">Required</Badge>}
                </div>
                <p className="text-[11.5px] text-on-surface-variant truncate">{c.body}</p>
              </div>
            </div>
            <p className="text-[12.5px] text-on-surface leading-snug">{c.name}</p>
            <div className="grid grid-cols-2 gap-2 mt-3 text-[11px]">
              <div className="rounded-md bg-surface-container-low p-2">
                <p className="text-[9px] uppercase tracking-wider text-on-surface-variant font-bold">Năm cấp</p>
                <p className="font-mono mt-0.5">{c.year}</p>
              </div>
              <div className="rounded-md bg-surface-container-low p-2">
                <p className="text-[9px] uppercase tracking-wider text-on-surface-variant font-bold">Hạn / Mở</p>
                <p className={`font-mono mt-0.5 ${c.state === "renew" ? "text-amber-700 font-bold" : ""}`}>{c.expire}</p>
              </div>
            </div>
            {c.state === "studying" && (
              <div className="mt-3">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-on-surface-variant">Đang ôn thi</span>
                  <span className="font-mono font-bold text-vnd-primary-700">{c.progress}%</span>
                </div>
                <div className="h-1.5 bg-surface-container-low rounded-full overflow-hidden">
                  <div className="h-full bg-vnd-primary-500 rounded-full" style={{ width: c.progress + "%" }}></div>
                </div>
              </div>
            )}
            <Button size="sm" tone={c.state === "active" ? "outline" : c.state === "renew" ? "primary" : "soft"}
              className="w-full justify-center mt-4"
              icon={c.state === "active" ? "open_in_new" : c.state === "renew" ? "autorenew" : c.state === "studying" ? "play_arrow" : "add"}>
              {c.state === "active" ? "Xem PDF" : c.state === "renew" ? "Tái chứng nhận" : c.state === "studying" ? "Tiếp tục ôn" : "Đăng ký"}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

function CertIntl() {
  const certs = [
    { code: "CFP®", name: "Certified Financial Planner", body: "FPSB", level: "Toàn phần", year: "2025", state: "active", desc: "Lập kế hoạch tài chính tổng thể" },
    { code: "CFA L1", name: "Chartered Financial Analyst Level 1", body: "CFA Institute", level: "Level 1", year: "2024", state: "active", desc: "Foundation đầu tư & ethics" },
    { code: "CFA L2", name: "Chartered Financial Analyst Level 2", body: "CFA Institute", level: "Level 2", year: "—", state: "studying", progress: 42, desc: "Asset valuation chuyên sâu" },
    { code: "FRM-1", name: "Financial Risk Manager Part 1", body: "GARP", level: "Part 1", year: "—", state: "available", desc: "Risk fundamentals" },
    { code: "CWM", name: "Certified Wealth Manager", body: "AAFM", level: "Toàn phần", year: "—", state: "available", desc: "Wealth advisory chuyên sâu" },
    { code: "ESG-1", name: "ESG Investing Foundation", body: "CFA Institute", level: "Foundation", year: "—", state: "available", desc: "Investing có trách nhiệm" }
  ];
  return (
    <div className="grid grid-cols-12 gap-4">
      {certs.map(c => (
        <Card key={c.code} className="col-span-12 md:col-span-6 xl:col-span-4 relative overflow-hidden hover:shadow-soft transition-shadow">
          <div className="absolute top-0 right-0 w-32 h-32 -mr-12 -mt-12 rounded-full bg-fuchsia-50/60"></div>
          <div className="relative">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-14 h-14 rounded-xl flex flex-col items-center justify-center text-white shadow-brand
                ${c.state === "active" ? "bg-fuchsia-600" : c.state === "studying" ? "bg-vnd-primary-700" : "bg-on-surface-variant"}`}>
                <Icon name="language" size={18} />
                <span className="text-[8.5px] font-display font-bold mt-0.5 px-1 text-center">{c.code.split(" ")[0]}</span>
              </div>
              <Badge tone={c.state === "active" ? "green" : c.state === "studying" ? "blue" : "neutral"} size="xs">
                {c.state === "active" ? "Active" : c.state === "studying" ? "Đang học" : "Available"}
              </Badge>
            </div>
            <p className="font-display font-bold text-vnd-primary-900">{c.code}</p>
            <p className="text-[12.5px] text-on-surface mt-0.5">{c.name}</p>
            <p className="text-[11px] text-on-surface-variant mt-1.5">{c.desc}</p>
            <div className="flex items-center gap-3 mt-3 text-[11px] text-on-surface-variant">
              <span><Icon name="business" size={12} className="inline" /> {c.body}</span>
              <span>·</span>
              <span>{c.level}</span>
              {c.year !== "—" && <><span>·</span><span className="font-mono">{c.year}</span></>}
            </div>
            {c.state === "studying" && (
              <div className="mt-3">
                <div className="h-1.5 bg-surface-container-low rounded-full overflow-hidden">
                  <div className="h-full bg-vnd-primary-500 rounded-full" style={{ width: c.progress + "%" }}></div>
                </div>
                <p className="text-[10.5px] font-mono text-vnd-primary-700 font-bold mt-1">{c.progress}% — exam T11/2026</p>
              </div>
            )}
            <Button size="sm" tone={c.state === "active" ? "outline" : c.state === "studying" ? "primary" : "soft"}
              className="w-full justify-center mt-4">
              {c.state === "active" ? "Xem chứng nhận" : c.state === "studying" ? "Mở lộ trình" : "Tìm hiểu thêm"}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

function IdpRoadmap() {
  const phases = [
    { id: 1, name: "Năm 1: New Broker", goal: "Pass CCHN MG · Live trên platform", done: true, items: ["CCHN MG-CK", "Onboarding 20 KH đầu", "Drill discovery 50 lần"] },
    { id: 2, name: "Năm 2: Trusted Broker", goal: "AUM 50 tỷ · NPS ≥ 50", done: true, items: ["CCHN PTĐT", "Behavioral basics", "Mentor 1 đồng nghiệp"] },
    { id: 3, name: "Năm 3-5: Senior Advisor", goal: "BMI-3 · CFP · Region top 30%", current: true, items: ["CFP®", "CFA L2", "Master Estate planning", "Lead 5 PWealth case"] },
    { id: 4, name: "Năm 6-8: Specialist", goal: "BMI-4 · Niche expertise + Mentor", items: ["CFA L3", "CWM", "Authoring + speaking", "Mentor cohort"] },
    { id: 5, name: "Năm 9+: Master / Region Lead", goal: "BMI-5 · Strategic leadership", items: ["FRM", "Region squad lead", "Industry thought leadership"] }
  ];
  return (
    <Card>
      <SectionTitle sub="IDP — Individual Development Plan cho hành trình môi giới · 9+ năm">
        IDP Môi giới · Roadmap 5 pha
      </SectionTitle>
      <ol className="relative pl-8 space-y-4 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-outline-variant/40">
        {phases.map(p => (
          <li key={p.id} className="relative">
            <span className={`absolute -left-[20px] top-1 w-7 h-7 rounded-full ring-4 ring-white flex items-center justify-center font-display font-bold text-[12px]
              ${p.done ? "bg-emerald-500 text-white" :
                p.current ? "bg-vnd-primary-500 text-white animate-pulse-soft" :
                "bg-surface-container-high text-on-surface-variant"}`}>
              {p.done ? <Icon name="check" size={14} weight={600} /> : p.id}
            </span>
            <div className={`rounded-xl ring-1 p-4 ${p.current ? "bg-vnd-primary-50 ring-vnd-primary-200" : "bg-white ring-outline-variant/30"}`}>
              <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
                <p className="font-display font-bold text-vnd-primary-900">{p.name}</p>
                {p.current && <Badge tone="blue" size="sm" icon="rocket_launch">Đang ở pha này</Badge>}
              </div>
              <p className="text-[12.5px] text-on-surface-variant mb-3">{p.goal}</p>
              <div className="flex flex-wrap gap-1.5">
                {p.items.map((it, i) => (
                  <span key={i} className={`inline-flex items-center text-[11px] font-medium px-2 py-1 rounded-md
                    ${p.done ? "bg-emerald-50 text-emerald-700" : p.current ? "bg-white text-on-surface ring-1 ring-vnd-primary-200" : "bg-surface-container-low text-on-surface-variant"}`}>
                    {p.done && <Icon name="check" size={11} className="mr-1" />}
                    {it}
                  </span>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}

function SkillGapAnalysis() {
  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-12 lg:col-span-8">
        <SectionTitle sub="Năng lực hiện tại vs chuẩn role tiếp theo (Senior Specialist · BMI-4)">
          Skill Gap chi tiết
        </SectionTitle>
        <ul className="space-y-3.5">
          {SKILL_GAPS.map(s => (
            <li key={s.skill}>
              <div className="flex items-center justify-between text-[12.5px] mb-1.5">
                <span className="font-medium text-on-surface">{s.skill}</span>
                <span className="font-mono text-on-surface-variant">
                  {s.current}/{s.target}
                  <span className={`ml-2 ${s.delta > 20 ? "text-red-600" : s.delta > 10 ? "text-amber-600" : "text-emerald-600"} font-bold`}>−{s.delta}</span>
                </span>
              </div>
              <div className="relative h-2.5 bg-surface-container-low rounded-full overflow-hidden">
                <div className="absolute inset-y-0 left-0 bg-vnd-primary-500 rounded-full" style={{ width: s.current + "%" }}></div>
                <div className="absolute inset-y-0 bg-vnd-primary-500/30 rounded-full" style={{ left: s.current + "%", width: (s.target - s.current) + "%" }}></div>
                <div className="absolute inset-y-0 w-0.5 bg-vnd-primary-900" style={{ left: s.target + "%" }}></div>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-4 pt-4 border-t border-outline-variant/30 flex items-center gap-4 text-[11.5px] text-on-surface-variant flex-wrap">
          <span className="inline-flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm bg-vnd-primary-500"></span>Hiện tại</span>
          <span className="inline-flex items-center gap-1.5"><span className="w-3 h-2 rounded-sm bg-vnd-primary-500/30"></span>Gap</span>
          <span className="inline-flex items-center gap-1.5"><span className="w-0.5 h-3 bg-vnd-primary-900"></span>Target</span>
        </div>
      </Card>

      <Card className="col-span-12 lg:col-span-4 bg-vnd-primary-900 text-white relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-vnd-primary-500/30 blur-3xl"></div>
        <div className="relative">
          <Badge tone="ghost" size="sm" className="bg-white/10 text-white border-white/20" icon="auto_awesome">AI Coach</Badge>
          <h4 className="font-display text-title-lg mt-3">Gap lớn nhất: Estate & Legacy</h4>
          <p className="text-[12.5px] text-white/80 mt-2">Để vượt qua promotion gate BMI-4 vào Q2/2027, bạn cần lấp gap 34 điểm ở Estate & Legacy + 26 điểm ở Tax Optimization.</p>
          <ul className="mt-4 space-y-1.5 text-[12px]">
            <li className="flex items-center gap-2"><Icon name="check" size={14} className="text-vnd-accent-green" />Đăng ký Estate Planning Fundamentals</li>
            <li className="flex items-center gap-2"><Icon name="check" size={14} className="text-vnd-accent-green" />Case study 3 KH PWealth Q3</li>
            <li className="flex items-center gap-2"><Icon name="check" size={14} className="text-vnd-accent-green" />Mentor session với Trần Hồng Vân</li>
          </ul>
          <Button tone="primary" icon="rocket_launch" className="mt-4 w-full justify-center">Tạo lộ trình 12 tuần</Button>
        </div>
      </Card>
    </div>
  );
}

function MigrationTrack() {
  return (
    <div className="space-y-4">
      {/* Hero */}
      <Card className="p-7 bg-mesh-blue ring-1 ring-vnd-primary-100">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <Badge tone="blue" size="sm" icon="compare_arrows">Migration track</Badge>
            <h3 className="font-display text-headline-md text-vnd-primary-900 mt-2">Chuyển dịch sự nghiệp: Môi giới → Advisor → Specialist</h3>
            <p className="text-[13px] text-on-surface-variant mt-1.5 max-w-2xl">Theo dõi quá trình chuyển role, ghi nhận milestone, đánh giá readiness cho bước tiếp theo.</p>
          </div>
          <div className="flex items-center gap-3">
            <ProgressRing value={68} size={86} thickness={9} label="68%" sub="Ready" />
          </div>
        </div>
      </Card>

      <Card>
        <SectionTitle sub="Trạng thái chuyển vai trò" action={<Badge tone="amber" size="md" icon="schedule">ETA Q2/2027</Badge>}>
          Migration: Trusted Advisor → Senior Specialist
        </SectionTitle>
        <div className="grid grid-cols-12 gap-4 items-stretch">
          <div className="col-span-12 md:col-span-5 rounded-2xl bg-emerald-50 ring-1 ring-emerald-200 p-5">
            <Badge tone="green" size="xs" icon="check_circle">Vai trò hiện tại</Badge>
            <p className="font-display text-headline-sm text-emerald-900 mt-2">Trusted Advisor</p>
            <p className="text-[12px] text-emerald-700 mt-1">BMI-3 · Năm thứ 6 · Region South</p>
            <ul className="mt-4 space-y-1.5 text-[12.5px] text-on-surface">
              <li className="flex items-start gap-1.5"><Icon name="check" size={14} className="text-emerald-600 mt-0.5" />128 active client</li>
              <li className="flex items-start gap-1.5"><Icon name="check" size={14} className="text-emerald-600 mt-0.5" />AUM 184 tỷ</li>
              <li className="flex items-start gap-1.5"><Icon name="check" size={14} className="text-emerald-600 mt-0.5" />ICM 782 · BMI 78</li>
              <li className="flex items-start gap-1.5"><Icon name="check" size={14} className="text-emerald-600 mt-0.5" />CFP® · CFA L1</li>
            </ul>
          </div>
          <div className="col-span-12 md:col-span-2 flex flex-col items-center justify-center gap-3">
            <Icon name="arrow_forward" size={32} className="text-vnd-primary-500" />
            <p className="text-[11px] text-on-surface-variant font-mono">68%<br />ready</p>
          </div>
          <div className="col-span-12 md:col-span-5 rounded-2xl bg-vnd-primary-50 ring-1 ring-vnd-primary-200 p-5">
            <Badge tone="blue" size="xs" icon="rocket_launch">Vai trò kế tiếp</Badge>
            <p className="font-display text-headline-sm text-vnd-primary-900 mt-2">Senior Specialist</p>
            <p className="text-[12px] text-vnd-primary-700 mt-1">BMI-4 · 8-12 năm · Niche specialist + mentor</p>
            <p className="text-[10.5px] uppercase tracking-wider font-bold text-on-surface-variant mt-3">Còn thiếu</p>
            <ul className="mt-2 space-y-1.5 text-[12.5px] text-on-surface">
              <li className="flex items-start gap-1.5"><Icon name="radio_button_unchecked" size={14} className="text-vnd-primary-500 mt-0.5" />CFA L2 (đang học · 42%)</li>
              <li className="flex items-start gap-1.5"><Icon name="radio_button_unchecked" size={14} className="text-vnd-primary-500 mt-0.5" />Estate gap −34 đ</li>
              <li className="flex items-start gap-1.5"><Icon name="radio_button_unchecked" size={14} className="text-vnd-primary-500 mt-0.5" />Mentor 2 advisor mới</li>
              <li className="flex items-start gap-1.5"><Icon name="radio_button_unchecked" size={14} className="text-vnd-primary-500 mt-0.5" />Niche selection: Private Wealth?</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Migration history */}
      <Card>
        <SectionTitle sub="Lịch sử chuyển role · các milestone đã đạt">
          Career migration history
        </SectionTitle>
        <ol className="relative pl-7 space-y-3 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-px before:bg-outline-variant/40">
          {[
            { d: "Q2 2026", t: "Đang chuyển dịch", n: "Trusted Advisor → Senior Specialist", state: "current" },
            { d: "Q3 2023", t: "Promotion", n: "Practitioner (BMI-2) → Trusted Advisor (BMI-3)", state: "done" },
            { d: "Q1 2022", t: "Promotion", n: "Foundational → Practitioner (BMI-2)", state: "done" },
            { d: "Q2 2020", t: "Onboard role", n: "New Broker · CCHN MG-CK đạt", state: "done" }
          ].map((m, i) => (
            <li key={i} className="relative">
              <span className={`absolute -left-[20px] top-1 w-5 h-5 rounded-full ring-4 ring-white flex items-center justify-center
                ${m.state === "current" ? "bg-vnd-primary-500 text-white" : "bg-emerald-500 text-white"}`}>
                <Icon name={m.state === "current" ? "rocket_launch" : "check"} size={11} weight={600} />
              </span>
              <div className="flex items-center justify-between gap-3 text-[13px]">
                <div>
                  <p className="font-semibold text-on-surface">{m.t}: {m.n}</p>
                </div>
                <span className="font-mono text-[11.5px] text-on-surface-variant">{m.d}</span>
              </div>
            </li>
          ))}
        </ol>
      </Card>
    </div>
  );
}

// =============================================================
// ONBOARDING MG · 30-60-90 ngày cho môi giới mới
// =============================================================
const ONBOARD_PROFILE = {
  name: "Minh Trần",
  initials: "MT",
  joinedAt: "06/04/2026",
  squad: "Squad 04 · Saigon Tower",
  manager: "Lý Khắc Anh (SU)",
  mentor: { name: "Lê Khánh", initials: "LK", role: "Senior CA · BMI-4 · 12 năm KN", segment: "Mass Affluent + MP", load: "2/3 mentees" },
  segment: "Mass / MP",
  day: 42, totalDays: 90,
  currentPhase: 2,
  cohort: "Cohort #14"
};

const ONBOARD_PHASES = [
  {
    id: 1, label: "Nền tảng", days: "Ngày 1-30", color: "#0077ED", bg: "bg-vnd-primary-50", ring: "ring-vnd-primary-200",
    goal: "Hiểu VNDS, compliance, sản phẩm cơ bản, biết dùng DSB",
    progress: 100, certificate: "🎓 Foundation Complete",
    tasksDone: 20, tasksTotal: 20,
    weeks: [
      { wk: "Tuần 1 · Làm quen", items: [
        { c: "HR", l: "Hoàn tất giấy tờ nhân sự", done: true },
        { c: "GẶP", l: "SU/BM chào mừng + set expectation", done: true },
        { c: "GẶP", l: "Mentor 1-1 đầu tiên", done: true },
        { c: "HỌC", l: "Video giới thiệu VNDS (30 phút)", done: true },
        { c: "HỌC", l: "Đọc Code of Conduct — Sống Nền", done: true },
        { c: "HỌC", l: "Đọc VNDGO Pattern — Sống Nếp", done: true },
        { c: "CERT", l: "Xác nhận chứng chỉ CCHN MG", done: true },
        { c: "HỆ THỐNG", l: "Setup tài khoản DSB + training", done: true },
        { c: "GẶP", l: "Gặp nhóm CA Squad (peer group)", done: true }
      ]},
      { wk: "Tuần 2-3 · Compliance & Sản phẩm", items: [
        { c: "HỌC", l: "Compliance cơ bản (Suitability · KYC/AML/PEP · COI · Audit trail)", done: true },
        { c: "HỌC", l: "Kiến thức sản phẩm Lv1 (CP/TP · Quỹ/ETF · Margin · Phí · Risk · Matching)", done: true },
        { c: "THỰC HÀNH", l: "Shadow senior CA 2 ngày · nghe 5 cuộc gọi KH", done: true },
        { c: "THỰC HÀNH", l: "Role-play: Tư vấn KH lần đầu", done: true }
      ]},
      { wk: "Tuần 4 · Kiểm tra", items: [
        { c: "THI", l: "Phase 1 Assessment (15 câu · ≥80% đậu)", done: true, score: "92%" },
        { c: "ĐÁNH GIÁ", l: "Mentor review + feedback", done: true },
        { c: "PHÊ DUYỆT", l: "SU/BM sign-off", done: true }
      ]}
    ],
    deliverables: [
      { l: "Đậu compliance quiz ≥80%", done: true },
      { l: "Đậu product Lv1", done: true },
      { l: "Nộp báo cáo shadow session", done: true },
      { l: "Manager phê duyệt", done: true }
    ]
  },
  {
    id: 2, label: "Thực chiến", days: "Ngày 31-60", color: "#FFB020", bg: "bg-amber-50", ring: "ring-amber-200",
    goal: "Bắt đầu làm việc thật với KH có giám sát · chốt KH đầu tiên",
    progress: 60, certificate: "🎓 Practice Complete",
    tasksDone: 14, tasksTotal: 25,
    isCurrent: true,
    weeks: [
      { wk: "Tuần 5-6 · Thực hành có hỗ trợ", items: [
        { c: "PHÂN CÔNG", l: "Nhận 5 leads đầu tiên (hot, mentor support)", done: true },
        { c: "THỰC HIỆN", l: "Gọi prospecting — target 10 calls/tuần", done: true, prog: 18, target: 20 },
        { c: "THỰC HIỆN", l: "Meeting acquisition — target 3 meetings", done: true, prog: 4, target: 6 },
        { c: "HỌC", l: "GTM Playbook (SOP 001-007)", done: true },
        { c: "HỌC", l: "CC Playbook (SOP 001-005)", done: true },
        { c: "HỆ THỐNG", l: "Thành thạo DSB 5 zones (Dashboard · Client · Product · Tool · Helpdesk)", done: true, prog: 4, target: 5 },
        { c: "GẶP", l: "Mentor 1-1 hàng tuần", done: true, prog: 3, target: 4, note: "Thiếu tuần này" },
        { c: "GẶP", l: "Peer learning circle (2 tuần/lần)", done: true }
      ]},
      { wk: "Tuần 7-8 · Chốt KH đầu tiên", items: [
        { c: "MILESTONE", l: "Chốt KH đầu tiên (target 1-2 KH)", done: false, current: true, prog: 0, target: 2, hot: true },
        { c: "THỰC HIỆN", l: "Session KYC với CSO/CSE", done: false },
        { c: "THỰC HIỆN", l: "Welcome call sau khi KH active", done: false },
        { c: "THỰC HIỆN", l: "Hỗ trợ giao dịch đầu tiên", done: false },
        { c: "HỌC", l: "Product Knowledge Lv2 (Tính năng nâng cao · Cross-sell · IPS · Build danh mục)", done: false, prog: 1, target: 4 },
        { c: "COMPLIANCE", l: "Thực hành khai báo COI", done: false },
        { c: "COMPLIANCE", l: "Drill Suitability Gate", done: false },
        { c: "QUAN SÁT", l: "Xem senior CA chăm sóc Stage 4-5", done: false }
      ]},
      { wk: "Tuần 9 · Kiểm tra giữa kỳ", items: [
        { c: "THI", l: "Phase 2 Assessment (20 câu)", done: false, locked: true },
        { c: "ĐÁNH GIÁ", l: "Debrief chốt KH đầu tiên", done: false, locked: true },
        { c: "ĐÁNH GIÁ", l: "Mentor review toàn diện", done: false, locked: true },
        { c: "PHÊ DUYỆT", l: "SU/BM sign-off + điều chỉnh mục tiêu", done: false, locked: true }
      ]}
    ],
    deliverables: [
      { l: "Chốt 1-2 KH", done: false, prog: 0, target: 2 },
      { l: "≥20 cuộc gọi prospecting log", done: false, prog: 18, target: 20 },
      { l: "Đậu product Lv2", done: false },
      { l: "Đậu GTM + CC Playbook quiz ≥80%", done: false }
    ]
  },
  {
    id: 3, label: "Độc lập", days: "Ngày 61-90", color: "#00C97D", bg: "bg-emerald-50", ring: "ring-emerald-200",
    goal: "Làm việc độc lập · xây dựng pipeline · 3-5 KH mới",
    progress: 0, certificate: "🎓 Onboarding Complete",
    tasksDone: 0, tasksTotal: 20,
    locked: true,
    weeks: [
      { wk: "Tuần 10-12 · Mở rộng quy mô", items: [
        { c: "PHÂN CÔNG", l: "Lead pool mở rộng (10-15 leads)" },
        { c: "MỤC TIÊU", l: "Chốt 3-5 KH mới" },
        { c: "MỤC TIÊU", l: "Activation: 2-3 KH trade trong 30 ngày" },
        { c: "THỰC HIỆN", l: "Quản lý cadence touchpoint (Stage 5 nurture)" },
        { c: "THỰC HIỆN", l: "Phát hiện và xử lý NAC (P3/P4)" },
        { c: "HỌC", l: "AC Playbook · NAC basics" },
        { c: "HỌC", l: "DSB nâng cao (NAC overlay · 4 la bàn KH · search cross-zone · mobile)" },
        { c: "HỌC", l: "Product Knowledge Lv3 (Structured · CK quốc tế · MG/ISA/PM intro · Phức tạp)" },
        { c: "MẠNG LƯỚI", l: "Mở rộng dLink: kết nối PD/PSO · AE/AME · peer CA group" }
      ]},
      { wk: "Tuần 13 · Đánh giá cuối", items: [
        { c: "MILESTONE", l: "Review pipeline (≥10 leads · ≥3 KH active)" },
        { c: "THI", l: "Phase 3 Comprehensive Assessment (30 câu)" },
        { c: "ĐÁNH GIÁ", l: "90-day review với SU/BM" },
        { c: "ĐÁNH GIÁ", l: "Mentor đánh giá cuối cùng" },
        { c: "KẾ HOẠCH", l: "Tạo IDP (Individual Development Plan)" },
        { c: "KẾ HOẠCH", l: "Set mục tiêu năm 1" }
      ]}
    ],
    deliverables: [
      { l: "Chốt 3-5 KH" },
      { l: "2-3 KH đang giao dịch tích cực" },
      { l: "Pipeline ≥10 leads" },
      { l: "Đậu comprehensive assessment ≥80%" },
      { l: "IDP được tạo & manager phê duyệt" }
    ]
  }
];

const AT_RISK_ALERTS = [
  { lvl: "warn",  icon: "schedule",    title: "1 task đã quá hạn 2 ngày",  body: 'Mentor 1-1 tuần 6 chưa diễn ra. Đặt lại lịch trước thứ Sáu.',  cta: "Đặt lịch ngay" },
  { lvl: "info",  icon: "trending_up", title: "Chưa chốt KH nào tại ngày 42/90", body: "Bạn đang ở 60% mục tiêu Phase 2. Cần chốt 1 KH trước ngày 50.", cta: "Xem 5 leads của tôi" }
];

const ONBOARD_TIMELINE = [
  { ts: "Hôm nay · 09:30", type: "mentor", title: "Mentor 1-1 chuẩn bị buổi gặp KH ABC Foods", who: "Lê Khánh", action: "Vào buổi" },
  { ts: "Mai · 14:00",     type: "training", title: "Live: Product Knowledge Level 2 — Module 2",  who: "Phạm Quỳnh", action: "Đăng ký" },
  { ts: "T5 · 10:00",      type: "peer",   title: "Peer Circle Cohort #14 (bi-weekly)",            who: "12 members", action: "Vào nhóm" },
  { ts: "T6 · 16:00",      type: "shadow", title: "Shadow senior CA — phiên Annual Review",        who: "Trần Hồng Vân", action: "Xác nhận" },
  { ts: "T7 · 09:30",      type: "exam",   title: "Phase 2 Mock Quiz (chuẩn bị thi giữa kỳ)",       who: "Self · 20 câu", action: "Làm thử" }
];

function OnboardingMG() {
  const [phaseTab, setPhaseTab] = useState(2);
  const [taskFilter, setTaskFilter] = useState("all");
  const phase = ONBOARD_PHASES.find(p => p.id === phaseTab);

  return (
    <>
      <PageHeader
        eyebrow="iLead · Onboarding"
        title="Lộ trình 30-60-90 cho môi giới mới"
        sub={`Cohort ${ONBOARD_PROFILE.cohort} · Ngày ${ONBOARD_PROFILE.day}/${ONBOARD_PROFILE.totalDays} · Mục tiêu: chốt KH đầu tiên trước ngày 50, hoàn tất onboarding ngày 90.`}
        actions={
          <>
            <Button tone="ghost" size="sm" icon="schedule">Đặt lịch mentor</Button>
            <Button tone="outline" size="sm" icon="quiz">Mock quiz</Button>
            <Button tone="primary" size="sm" icon="rocket_launch">Tiếp tục onboarding</Button>
          </>
        }
      />
      <Page>
        <OnboardingHero profile={ONBOARD_PROFILE} />

        {/* At-risk alerts */}
        {AT_RISK_ALERTS.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-5">
            {AT_RISK_ALERTS.map((a, i) => (
              <div key={i} className={`rounded-2xl p-4 ring-1 flex items-start gap-3
                ${a.lvl === "warn" ? "bg-amber-50/70 ring-amber-200" : "bg-vnd-primary-50/70 ring-vnd-primary-100"}`}>
                <span className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                  ${a.lvl === "warn" ? "bg-amber-500 text-white" : "bg-vnd-primary-500 text-white"}`}>
                  <Icon name={a.icon} size={20} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className={`font-display font-semibold ${a.lvl === "warn" ? "text-amber-900" : "text-vnd-primary-900"}`}>{a.title}</p>
                  <p className="text-[12.5px] text-on-surface-variant mt-1">{a.body}</p>
                </div>
                <Button size="sm" tone={a.lvl === "warn" ? "primary" : "soft"}>{a.cta}</Button>
              </div>
            ))}
          </div>
        )}

        {/* 3-phase strip */}
        <Card className="mt-5">
          <SectionTitle sub="Bấm vào từng phase để xem checklist chi tiết">3 Phases — Hành trình 90 ngày</SectionTitle>
          <div className="grid grid-cols-3 gap-0 relative">
            <div className="absolute top-7 left-[16.66%] right-[16.66%] h-1 bg-surface-container-high rounded-full"></div>
            <div className="absolute top-7 left-[16.66%] h-1 rounded-full bg-gradient-to-r from-vnd-primary-500 to-amber-500" style={{ width: `calc(${(ONBOARD_PROFILE.day / ONBOARD_PROFILE.totalDays) * 66.66}%)` }}></div>
            {ONBOARD_PHASES.map(p => {
              const isCurrent = p.id === ONBOARD_PROFILE.currentPhase;
              const isDone = p.id < ONBOARD_PROFILE.currentPhase;
              const isLocked = p.id > ONBOARD_PROFILE.currentPhase;
              const isActive = p.id === phaseTab;
              return (
                <button key={p.id} onClick={() => setPhaseTab(p.id)}
                  className={`relative pt-1 pb-2 px-2 text-left transition-transform ${isActive ? "" : "hover:translate-y-[-2px]"}`}>
                  <div className="flex flex-col items-center text-center">
                    <span className={`relative z-10 w-14 h-14 rounded-full flex items-center justify-center font-display font-bold text-white shadow-soft
                      ${isCurrent ? "ring-4 ring-vnd-primary-200" : ""} ${isActive ? "scale-110" : ""} transition-transform`}
                      style={{ backgroundColor: isLocked ? "#c2c6d5" : p.color }}>
                      {isDone ? <Icon name="check" size={26} weight={600} /> : <span className="text-[18px]">{p.id}</span>}
                    </span>
                    <p className={`mt-3 font-display font-bold text-[15px] ${isLocked ? "text-on-surface-variant" : "text-vnd-primary-900"}`}>Phase {p.id} · {p.label}</p>
                    <p className="text-[11.5px] text-on-surface-variant mt-0.5">{p.days}</p>
                    <p className="text-[12px] text-on-surface mt-2 max-w-[260px]">{p.goal}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-[11px] font-mono text-on-surface-variant">{p.tasksDone}/{p.tasksTotal} tasks</span>
                      <span className={`text-[11px] font-bold ${isDone ? "text-emerald-700" : isCurrent ? "text-amber-700" : "text-on-surface-variant"}`}>{p.progress}%</span>
                    </div>
                    {isDone && <Badge tone="green" size="xs" className="mt-1.5" icon="workspace_premium">{p.certificate}</Badge>}
                    {isCurrent && <Badge tone="amber" size="xs" className="mt-1.5" icon="bolt">Đang ở đây</Badge>}
                    {isLocked && <Badge tone="neutral" size="xs" className="mt-1.5" icon="lock">Mở khi xong Phase {p.id - 1}</Badge>}
                  </div>
                </button>
              );
            })}
          </div>
        </Card>

        {/* Active phase detail + sidebar */}
        <div className="grid grid-cols-12 gap-4 mt-5">
          <div className="col-span-12 xl:col-span-8 space-y-4">
            {/* Phase detail card */}
            <Card padded={false} className="overflow-hidden">
              <div className={`px-6 py-5 border-b border-outline-variant/30 ${phase.bg}`}>
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div>
                    <Badge tone="neutral" size="sm">Phase {phase.id} · {phase.days}</Badge>
                    <h3 className="font-display text-headline-md text-vnd-primary-900 mt-1.5">{phase.label}</h3>
                    <p className="text-[13px] text-on-surface mt-1">{phase.goal}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[11px] uppercase tracking-wider font-bold text-on-surface-variant">Tiến độ</p>
                    <p className="font-display font-bold text-display-sm font-mono mt-0.5" style={{ color: phase.color }}>{phase.progress}%</p>
                    <p className="text-[11px] font-mono text-on-surface-variant">{phase.tasksDone}/{phase.tasksTotal} tasks</p>
                  </div>
                </div>
                <div className="h-2 bg-white/60 rounded-full overflow-hidden mt-4">
                  <div className="h-full rounded-full transition-all" style={{ width: phase.progress + "%", backgroundColor: phase.color }}></div>
                </div>
              </div>

              <div className="px-6 py-4 border-b border-outline-variant/30 flex items-center gap-2 flex-wrap">
                <FilterBar>
                  <ChipToggle active={taskFilter === "all"} onClick={() => setTaskFilter("all")}>Tất cả</ChipToggle>
                  <ChipToggle active={taskFilter === "pending"} onClick={() => setTaskFilter("pending")} icon="schedule">Chưa làm</ChipToggle>
                  <ChipToggle active={taskFilter === "current"} onClick={() => setTaskFilter("current")} icon="bolt">Đang làm</ChipToggle>
                  <ChipToggle active={taskFilter === "done"} onClick={() => setTaskFilter("done")} icon="check_circle">Đã xong</ChipToggle>
                </FilterBar>
                <span className="ml-auto text-[11.5px] text-on-surface-variant">Cập nhật 14:32 hôm nay</span>
              </div>

              <div className="p-6 space-y-5">
                {phase.weeks.map((w, wi) => (
                  <div key={wi}>
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-display font-semibold text-vnd-primary-900 text-[14px]">{w.wk}</p>
                      <span className="text-[11px] font-mono text-on-surface-variant">{w.items.filter(x => x.done).length}/{w.items.length} hoàn tất</span>
                    </div>
                    <ul className="space-y-2">
                      {w.items
                        .filter(it => taskFilter === "all"
                          || (taskFilter === "pending" && !it.done && !it.current)
                          || (taskFilter === "current" && it.current)
                          || (taskFilter === "done" && it.done))
                        .map((it, i) => <TaskRow key={i} item={it} phaseColor={phase.color} />)}
                    </ul>
                  </div>
                ))}

                {/* Deliverables */}
                <div className="mt-2 rounded-2xl ring-1 ring-outline-variant/30 p-5 bg-surface-container-low/60">
                  <div className="flex items-center gap-2 mb-3">
                    <Icon name="task_alt" size={18} className="text-vnd-primary-700" />
                    <p className="font-display font-semibold text-vnd-primary-900">Tiêu chí hoàn thành Phase {phase.id}</p>
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {phase.deliverables.map((d, i) => (
                      <li key={i} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white ring-1 ring-outline-variant/30">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center
                          ${d.done ? "bg-emerald-500 text-white" : "bg-surface-container-high text-on-surface-variant"}`}>
                          {d.done ? <Icon name="check" size={12} weight={600} /> : null}
                        </span>
                        <span className={`flex-1 text-[12.5px] ${d.done ? "text-on-surface line-through opacity-70" : "text-on-surface font-medium"}`}>{d.l}</span>
                        {d.prog != null && <span className="font-mono text-[11px] text-on-surface-variant">{d.prog}/{d.target}</span>}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>

            {/* Assessment readiness */}
            {phase.id === 2 && (
              <Card>
                <SectionTitle sub="Sẵn sàng tới đâu — quiz, deliverables, mentor sign-off"
                  action={<Button tone="primary" size="sm" icon="quiz">Bắt đầu mock quiz</Button>}>
                  Phase 2 Assessment Readiness
                </SectionTitle>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {[
                    { l: "Mock quiz Phase 2", v: "82%", sub: "Avg 3 lần thử · ≥80% cần đạt", tone: "green" },
                    { l: "Deliverables xong", v: "1/4", sub: "Còn 3: chốt KH · product Lv2 · GTM quiz", tone: "amber" },
                    { l: "Mentor review", v: "Pending", sub: "Lên lịch buổi review tuần 9", tone: "blue" }
                  ].map((s, i) => (
                    <div key={i} className="rounded-xl ring-1 ring-outline-variant/30 p-4">
                      <p className="text-[10.5px] uppercase tracking-wider text-on-surface-variant font-bold">{s.l}</p>
                      <p className={`font-display font-bold text-headline-md mt-1 ${s.tone === "green" ? "text-emerald-700" : s.tone === "amber" ? "text-amber-700" : "text-vnd-primary-900"}`}>{s.v}</p>
                      <p className="text-[11.5px] text-on-surface-variant mt-1">{s.sub}</p>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <aside className="col-span-12 xl:col-span-4 space-y-4">
            <MentorCard mentor={ONBOARD_PROFILE.mentor} />
            <UpcomingActivities />
            <CertificatesEarned />
          </aside>
        </div>

        {/* Bottom: Manager view */}
        <Card className="mt-5">
          <SectionTitle sub="Bạn cần làm gì để giữ on-track — bản tóm tắt cho SU/BM"
            action={<Button tone="ghost" size="sm" icon="open_in_new">Mở dashboard manager</Button>}>
            Manager Snapshot · Lý Khắc Anh (SU)
          </SectionTitle>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat label="Tiến độ tổng" value={`${Math.round((ONBOARD_PROFILE.day / ONBOARD_PROFILE.totalDays) * 100)}%`} sub={`Ngày ${ONBOARD_PROFILE.day}/${ONBOARD_PROFILE.totalDays}`} tone="blue" icon="schedule" />
            <Stat label="Pipeline hiện tại" value="5 leads" sub="Hot 3 · Warm 2" tone="green" icon="diversity_3" />
            <Stat label="Calls đã log" value="18/20" sub="Còn 2 để đạt mục tiêu tuần" tone="amber" icon="call" trend={12} />
            <Stat label="Mentor sessions" value="3/4" sub="Đang thiếu buổi tuần 6" tone="purple" icon="psychology" />
          </div>
          <div className="mt-4 rounded-xl bg-mesh-blue p-4 ring-1 ring-vnd-primary-100">
            <p className="text-[11px] uppercase tracking-wider font-bold text-vnd-primary-700 mb-1.5">Recommendation tuần này</p>
            <ul className="space-y-1 text-[12.5px] text-on-surface">
              <li className="flex items-start gap-2"><Icon name="check_circle" size={14} className="text-emerald-600 mt-0.5" /><span>Đặt lại buổi mentor 1-1 với Lê Khánh trước thứ Sáu.</span></li>
              <li className="flex items-start gap-2"><Icon name="check_circle" size={14} className="text-emerald-600 mt-0.5" /><span>Push 2 lead Lê Văn A và Trần B sang Stage 4 — đã warm sẵn.</span></li>
              <li className="flex items-start gap-2"><Icon name="check_circle" size={14} className="text-emerald-600 mt-0.5" /><span>Đăng ký Phase 2 Mock Quiz T7 09:30 để đo readiness.</span></li>
            </ul>
          </div>
        </Card>
      </Page>
    </>
  );
}

function OnboardingHero({ profile }) {
  return (
    <Card className="bg-vnd-primary-900 text-white relative overflow-hidden p-7">
      <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-vnd-primary-500/30 blur-3xl"></div>
      <div className="absolute -bottom-12 left-1/3 w-56 h-56 rounded-full bg-vnd-accent-green/20 blur-3xl"></div>
      <div className="relative grid grid-cols-12 gap-6 items-center">
        <div className="col-span-12 lg:col-span-7">
          <div className="flex items-center gap-3 flex-wrap">
            <Badge tone="ghost" size="sm" className="bg-white/10 text-white border-white/20" icon="rocket_launch">Onboarding · {profile.cohort}</Badge>
            <Badge tone="ghost" size="sm" className="bg-white/10 text-white border-white/20" icon="psychology">Mentor: {profile.mentor.name}</Badge>
          </div>
          <div className="flex items-end gap-4 mt-4">
            <Avatar initials={profile.initials} size={72} tone="blue" />
            <div>
              <p className="font-display font-bold text-display-sm text-white" style={{ letterSpacing: "-0.02em" }}>{profile.name}</p>
              <p className="text-[13.5px] text-white/80 mt-1">{profile.squad} · Quản lý: {profile.manager}</p>
              <p className="text-[12px] text-white/60 mt-0.5">Segment ưu tiên: {profile.segment} · Join {profile.joinedAt}</p>
            </div>
          </div>
        </div>
        <div className="col-span-12 lg:col-span-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] uppercase tracking-wider font-bold text-white/70">Hành trình</span>
            <span className="font-display font-bold text-headline-md font-mono">Ngày {profile.day}/{profile.totalDays}</span>
          </div>
          <div className="relative h-3 bg-white/10 rounded-full overflow-hidden">
            <div className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-vnd-primary-500 via-amber-400 to-vnd-accent-green transition-all" style={{ width: `${(profile.day / profile.totalDays) * 100}%` }}></div>
            <div className="absolute inset-y-0 w-0.5 bg-white" style={{ left: "33.3%" }} title="End Phase 1"></div>
            <div className="absolute inset-y-0 w-0.5 bg-white" style={{ left: "66.6%" }} title="End Phase 2"></div>
          </div>
          <div className="flex items-center justify-between text-[10.5px] font-mono text-white/70 mt-1">
            <span>Phase 1</span><span>Phase 2 ← bạn ở đây</span><span>Phase 3</span>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4">
            {[
              { l: "Đã chốt", v: "0", sub: "/2 KH" },
              { l: "Calls log", v: "18", sub: "/20 tuần" },
              { l: "ETA chốt KH 1", v: "~8d", sub: "trước ngày 50" }
            ].map((s, i) => (
              <div key={i} className="bg-white/10 ring-1 ring-white/10 rounded-lg p-3 text-center">
                <p className="text-[10px] uppercase tracking-wider font-bold text-white/60">{s.l}</p>
                <p className="font-display font-bold text-headline-sm mt-0.5 font-mono">{s.v}</p>
                <p className="text-[10px] text-white/60">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
}

function TaskRow({ item, phaseColor }) {
  const styles = item.done
    ? "bg-white ring-outline-variant/30 opacity-90"
    : item.current
    ? "bg-vnd-primary-50 ring-vnd-primary-300"
    : item.locked
    ? "bg-surface-container-low/40 ring-outline-variant/20 opacity-60"
    : "bg-white ring-outline-variant/30 hover:ring-vnd-primary-300 transition-all";
  return (
    <li className={`flex items-center gap-3 p-3 rounded-xl ring-1 ${styles}`}>
      <span className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0
        ${item.done ? "bg-emerald-500 text-white" : item.current ? "text-white" : item.locked ? "bg-surface-container-high text-on-surface-variant" : "bg-white ring-1 ring-outline-variant text-on-surface-variant"}`}
        style={item.current ? { backgroundColor: phaseColor } : {}}>
        {item.done ? <Icon name="check" size={14} weight={600} /> : item.locked ? <Icon name="lock" size={12} /> : item.current ? <Icon name="play_arrow" size={14} weight={600} /> : null}
      </span>
      <span className={`inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-md font-display tracking-wider min-w-[68px] justify-center
        ${item.done ? "bg-surface-container-high text-on-surface-variant"
        : item.locked ? "bg-surface-container-high text-on-surface-variant/60"
        : "bg-vnd-primary-900/5 text-vnd-primary-700"}`}>{item.c}</span>
      <span className={`flex-1 text-[12.5px] ${item.done ? "text-on-surface-variant line-through" : item.locked ? "text-on-surface-variant" : "text-on-surface font-medium"}`}>{item.l}</span>
      {item.score && <Badge tone="green" size="xs" icon="emoji_events">{item.score}</Badge>}
      {item.hot && <Badge tone="red" size="xs" icon="local_fire_department">Milestone</Badge>}
      {item.prog != null && <span className="font-mono text-[11px] text-on-surface-variant flex-shrink-0">{item.prog}/{item.target}</span>}
      {item.note && <Badge tone="amber" size="xs" icon="warning">{item.note}</Badge>}
      {!item.done && !item.locked && (
        item.current
          ? <Button size="xs" tone="primary">Mở</Button>
          : <Button size="xs" tone="ghost" icon="play_arrow">Bắt đầu</Button>
      )}
    </li>
  );
}

function MentorCard({ mentor }) {
  return (
    <Card>
      <SectionTitle sub="Auto-matched theo segment + capacity + style"
        action={<Button tone="ghost" size="xs" icon="cached">Re-match</Button>}>
        Mentor đồng hành
      </SectionTitle>
      <div className="flex items-center gap-3">
        <Avatar initials={mentor.initials} size={56} tone="purple" />
        <div className="flex-1 min-w-0">
          <p className="font-display font-bold text-vnd-primary-900">{mentor.name}</p>
          <p className="text-[12px] text-on-surface-variant">{mentor.role}</p>
          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
            <Badge tone="purple" size="xs">Primary mentor</Badge>
            <Badge tone="amber" size="xs" icon="local_fire_department">3 tuần streak</Badge>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-4">
        <div className="rounded-lg bg-surface-container-low p-2.5">
          <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Segment</p>
          <p className="text-[12.5px] font-semibold mt-0.5">{mentor.segment}</p>
        </div>
        <div className="rounded-lg bg-surface-container-low p-2.5">
          <p className="text-[10px] uppercase tracking-wider text-on-surface-variant font-bold">Capacity</p>
          <p className="text-[12.5px] font-semibold mt-0.5">{mentor.load}</p>
        </div>
      </div>
      <div className="mt-4 rounded-xl bg-mesh-blue p-3 ring-1 ring-vnd-primary-100">
        <p className="text-[11px] uppercase tracking-wider font-bold text-vnd-primary-700">1-on-1 tiếp theo</p>
        <p className="text-[13px] font-semibold text-vnd-primary-900 mt-1">Thứ Sáu · 14:00 — Highlands Lê Lợi</p>
        <p className="text-[11.5px] text-on-surface-variant mt-0.5">Chủ đề: chuẩn bị buổi gặp KH đầu tiên (ABC Foods)</p>
        <div className="flex gap-1.5 mt-3">
          <Button size="xs" tone="primary" icon="videocam">Vào buổi</Button>
          <Button size="xs" tone="ghost" icon="event_repeat">Đổi lịch</Button>
        </div>
      </div>
      <p className="text-[10.5px] text-on-surface-variant mt-3 font-mono">Match score 86% · Expertise 40 · Capacity 25 · Style 16 · Availability 5</p>
    </Card>
  );
}

function UpcomingActivities() {
  return (
    <Card>
      <SectionTitle sub="7 ngày tới">Lịch sắp tới</SectionTitle>
      <ol className="relative pl-6 space-y-3 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-outline-variant/40">
        {ONBOARD_TIMELINE.map((e, i) => {
          const tone = {
            mentor:   { dot: "bg-fuchsia-500", icon: "psychology" },
            training: { dot: "bg-vnd-primary-500", icon: "menu_book" },
            peer:     { dot: "bg-emerald-500", icon: "groups" },
            shadow:   { dot: "bg-amber-500", icon: "visibility" },
            exam:     { dot: "bg-red-500", icon: "quiz" }
          }[e.type];
          return (
            <li key={i} className="relative">
              <span className={`absolute -left-[18px] top-1 w-3 h-3 rounded-full ring-4 ring-surface-container-lowest ${tone.dot}`}></span>
              <p className="text-[11.5px] font-mono text-on-surface-variant">{e.ts}</p>
              <p className="text-[13px] font-semibold text-on-surface mt-0.5">{e.title}</p>
              <div className="flex items-center justify-between mt-1.5">
                <span className="text-[11.5px] text-on-surface-variant inline-flex items-center gap-1"><Icon name={tone.icon} size={12} />{e.who}</span>
                <Button size="xs" tone="ghost">{e.action}</Button>
              </div>
            </li>
          );
        })}
      </ol>
    </Card>
  );
}

function CertificatesEarned() {
  return (
    <Card>
      <SectionTitle sub="2 milestone đã đạt · 1 đang khoá">Chứng chỉ Onboarding</SectionTitle>
      <ul className="space-y-2.5">
        {[
          { l: "🎓 Foundation Complete", date: "Phase 1 · 06/05/2026", earned: true, code: "FND-001" },
          { l: "🎓 Practice Complete", date: "Phase 2 · dự kiến tuần 9", earned: false, locked: false, code: "PRC-002" },
          { l: "🎓 Onboarding Complete", date: "Phase 3 · ngày 90", earned: false, locked: true, code: "ONB-003" }
        ].map((c, i) => (
          <li key={i} className={`flex items-center gap-3 p-3 rounded-xl ring-1
            ${c.earned ? "ring-emerald-200 bg-emerald-50/60" : c.locked ? "ring-outline-variant/30 bg-surface-container-low/40 opacity-70" : "ring-amber-200 bg-amber-50/40"}`}>
            <span className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
              ${c.earned ? "bg-emerald-500 text-white" : c.locked ? "bg-surface-container-high text-on-surface-variant" : "bg-amber-500 text-white"}`}>
              <Icon name={c.locked ? "lock" : "workspace_premium"} size={20} filled={c.earned} />
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-display font-semibold text-on-surface text-[13px]">{c.l}</p>
              <p className="text-[11px] text-on-surface-variant font-mono">{c.code} · {c.date}</p>
            </div>
            {c.earned && <Button size="xs" tone="ghost" icon="download">PDF</Button>}
          </li>
        ))}
      </ul>
    </Card>
  );
}

Object.assign(window, { ScreenILead, OnboardingMG });
