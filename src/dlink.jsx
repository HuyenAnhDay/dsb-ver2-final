/* global React, window */
const { NETWORK_PEOPLE } = window.DSB_DATA;

function ScreenDLink({ screen }) {
  if (screen === "dlink/ipax")      return <NetworkAnalytics />;
  if (screen === "dlink/ilead")     return <ILeadNetwork />;
  if (screen === "dlink/dwork")     return <DWorkNetwork />;
  if (screen === "dlink/analytics") return <NetworkAnalytics />;
  return <NetworkAnalytics />;
}

// ============================================================
// Shared header card (question-driven)
// ============================================================
function NetworkHero({ tone, badge, title, question, stats }) {
  const bgClass = tone === "dark" ? "bg-vnd-primary-900 text-white" : "bg-mesh-blue ring-1 ring-vnd-primary-100";
  const textMuted = tone === "dark" ? "text-white/80" : "text-on-surface-variant";
  return (
    <Card padded={false} className={`relative overflow-hidden ${bgClass}`}>
      <div className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-vnd-primary-500/20 blur-3xl"></div>
      <div className="absolute -bottom-12 left-1/3 w-56 h-56 rounded-full bg-vnd-accent-green/15 blur-3xl"></div>
      <div className="relative px-7 py-7 grid grid-cols-12 gap-4 items-center">
        <div className="col-span-12 lg:col-span-7">
          <Badge tone={tone === "dark" ? "ghost" : "blue"} size="sm" icon={badge.icon}
            className={tone === "dark" ? "bg-white/10 text-white border-white/20" : ""}>{badge.label}</Badge>
          <h2 className={`font-display text-headline-lg mt-3 ${tone === "dark" ? "text-white" : "text-vnd-primary-900"}`}>{title}</h2>
          <p className={`text-[14px] mt-2 ${textMuted}`}>
            <span className="font-mono opacity-70">Mạng này giúp bạn trả lời:</span> <span className="font-semibold italic">"{question}"</span>
          </p>
        </div>
        <div className="col-span-12 lg:col-span-5 grid grid-cols-3 gap-3">
          {stats.map((s, i) => (
            <div key={i} className={`rounded-xl p-3 ${tone === "dark" ? "bg-white/10 ring-1 ring-white/10" : "bg-white/80 ring-1 ring-outline-variant/30"}`}>
              <p className={`text-[10px] uppercase tracking-wider font-bold ${tone === "dark" ? "text-white/60" : "text-on-surface-variant"}`}>{s.l}</p>
              <p className={`font-display font-bold text-headline-md mt-1 font-mono ${tone === "dark" ? "" : "text-vnd-primary-900"}`}>{s.v}</p>
              {s.sub && <p className={`text-[10.5px] mt-0.5 ${tone === "dark" ? "text-white/60" : "text-on-surface-variant"}`}>{s.sub}</p>}
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}

// People card
function PeopleCard({ avatar, name, role, sub, badges, strength, lastContact, channel, primary, onContact }) {
  return (
    <div className="rounded-xl bg-white ring-1 ring-outline-variant/30 p-4 hover:ring-vnd-primary-300 hover:shadow-soft transition-all">
      <div className="flex items-start gap-3">
        <Avatar initials={avatar.initials} size={44} tone={avatar.tone} />
        <div className="flex-1 min-w-0">
          <p className="font-display font-semibold text-on-surface truncate">{name}</p>
          <p className="text-[11.5px] text-on-surface-variant">{role}</p>
          {sub && <p className="text-[11px] text-on-surface-variant/80 mt-0.5">{sub}</p>}
        </div>
      </div>
      {badges && badges.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-3">
          {badges.map((b, i) => <Badge key={i} tone={b.tone} size="xs" icon={b.icon}>{b.label}</Badge>)}
        </div>
      )}
      {typeof strength === "number" && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-[11px] mb-1 font-mono">
            <span className="text-on-surface-variant">Strength</span>
            <span className="font-bold text-vnd-primary-900">{strength}/100</span>
          </div>
          <div className="h-1.5 bg-surface-container-low rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${strength >= 60 ? "bg-emerald-500" : strength >= 30 ? "bg-amber-500" : "bg-on-surface-variant"}`} style={{ width: strength + "%" }}></div>
          </div>
        </div>
      )}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-outline-variant/30 text-[11px] text-on-surface-variant">
        {lastContact ? <span><Icon name="schedule" size={12} className="inline" /> {lastContact}</span> : <span>&nbsp;</span>}
        <div className="flex gap-1.5">
          {channel && <Button size="xs" tone="ghost" icon={channel}>Liên hệ</Button>}
          <Button size="xs" tone={primary ? "primary" : "soft"} onClick={onContact}>Mở</Button>
        </div>
      </div>
    </div>
  );
}

// Reusable section title (used inside each module section)
function ModuleSection({ icon, title, sub, children, action, tone = "blue" }) {
  const tones = {
    blue:   "bg-vnd-primary-50 text-vnd-primary-700",
    green:  "bg-emerald-50 text-emerald-700",
    amber:  "bg-amber-50 text-amber-700",
    purple: "bg-fuchsia-50 text-fuchsia-700",
    rose:   "bg-rose-50 text-rose-700"
  };
  return (
    <Card>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="flex items-start gap-3">
          <span className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${tones[tone]}`}>
            <Icon name={icon} size={20} />
          </span>
          <div>
            <h3 className="font-display text-title-lg text-vnd-primary-900">{title}</h3>
            {sub && <p className="text-[12.5px] text-on-surface-variant mt-0.5">{sub}</p>}
          </div>
        </div>
        {action}
      </div>
      {children}
    </Card>
  );
}

// ============================================================
// 1) iLEAD NETWORK · Mạng để HỌC và PHÁT TRIỂN
// ============================================================
function ILeadNetwork() {
  return (
    <>
      <PageHeader
        eyebrow="dLink · iLead Network"
        title="Mạng để HỌC và PHÁT TRIỂN"
        sub="Mentor giúp bạn cách cư xử nghề nghiệp. Coach nâng cao kỹ năng chuyên môn. Peer Circle cùng học. Training là các khoá chính quy."
        actions={
          <>
            <Button tone="ghost" size="sm" icon="search">Tìm kết nối</Button>
            <Button tone="primary" size="sm" icon="person_add">Yêu cầu mentor / coach</Button>
          </>
        }
      />
      <Page>
        <NetworkHero
          tone="light"
          badge={{ icon: "school", label: "iLead Network" }}
          title="Làm sao để tôi giỏi hơn?"
          question="Làm sao để tôi giỏi hơn?"
          stats={[
            { l: "Mentor active", v: "2", sub: "BMI senior" },
            { l: "Coach", v: "1", sub: "ICM tracking" },
            { l: "Peer circle", v: "12", sub: "đồng nghiệp" }
          ]}
        />

        <div className="grid grid-cols-12 gap-4 mt-5">
          {/* A. Mentor */}
          <div className="col-span-12 xl:col-span-6">
            <ModuleSection
              icon="psychology"
              title="Mentor — BMI senior"
              sub="Người dẫn dắt về cách cư xử nghề nghiệp · 'Sư phụ' về đạo đức nghề"
              tone="purple"
              action={<Button tone="ghost" size="xs" icon="add">Tìm mentor mới</Button>}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <PeopleCard
                  avatar={{ initials: "LK", tone: "purple" }}
                  name="Lê Khánh"
                  role="Senior Advisor · BMI-4"
                  sub="12 năm KN · Region South"
                  badges={[{ tone: "purple", icon: "verified", label: "Primary mentor" }, { tone: "amber", icon: "local_fire_department", label: "8 tháng streak" }]}
                  strength={92}
                  lastContact="Hôm qua · 1-on-1"
                  channel="videocam"
                  primary
                />
                <PeopleCard
                  avatar={{ initials: "TV", tone: "purple" }}
                  name="Trần Hồng Vân"
                  role="Master Advisor · BMI-5"
                  sub="Specialist: Estate planning"
                  badges={[{ tone: "blue", icon: "stars", label: "Topic mentor" }]}
                  strength={64}
                  lastContact="2 tuần · Office hours"
                  channel="event"
                />
              </div>
              <div className="mt-3 rounded-xl bg-mesh-blue p-3.5 ring-1 ring-vnd-primary-100">
                <p className="text-[11px] uppercase tracking-wider font-bold text-vnd-primary-700 mb-1.5">Sắp tới</p>
                <ul className="text-[12.5px] space-y-1">
                  <li className="flex items-center gap-2"><Icon name="event" size={13} className="text-vnd-primary-700" /><span>Mentor 1-on-1 · Review case Estate planning — <span className="font-mono text-on-surface-variant">T6 14:00 · LK</span></span></li>
                  <li className="flex items-center gap-2"><Icon name="event" size={13} className="text-vnd-primary-700" /><span>Office hours T.H.Vân (mở) — <span className="font-mono text-on-surface-variant">T2 16:00 · TV</span></span></li>
                </ul>
              </div>
            </ModuleSection>
          </div>

          {/* B. Coach */}
          <div className="col-span-12 xl:col-span-6">
            <ModuleSection
              icon="fitness_center"
              title="Coach — ICM tracking"
              sub="HLV nâng cao kỹ năng chuyên môn · phân tích sản phẩm, báo cáo đầu tư"
              tone="green"
              action={<Button tone="ghost" size="xs" icon="add">Yêu cầu coach</Button>}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <PeopleCard
                  avatar={{ initials: "CL", tone: "green" }}
                  name="Cathy Lin"
                  role="Behavioral Coach"
                  sub="Discovery & KH psychology"
                  badges={[{ tone: "green", icon: "verified", label: "Active coach" }, { tone: "blue", icon: "trending_up", label: "ICM +24 đ" }]}
                  strength={84}
                  lastContact="Hôm nay · Drill"
                  channel="chat"
                  primary
                />
                <PeopleCard
                  avatar={{ initials: "PQ", tone: "amber" }}
                  name="Phạm Quỳnh"
                  role="Product Specialist · Bond"
                  sub="Phân tích sản phẩm chuyên sâu"
                  badges={[{ tone: "amber", icon: "schedule", label: "On request" }]}
                  strength={48}
                  lastContact="3 tuần · case bond"
                  channel="mail"
                />
              </div>
              <div className="mt-3 rounded-xl bg-emerald-50/60 p-3.5 ring-1 ring-emerald-200">
                <p className="text-[11px] uppercase tracking-wider font-bold text-emerald-700 mb-1.5">ICM track tuần này</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { l: "Drill discovery", v: "3/3", ok: true },
                    { l: "Case analysis", v: "2/2", ok: true },
                    { l: "Self-review", v: "1/2", ok: false }
                  ].map((m, i) => (
                    <div key={i} className={`rounded-lg bg-white p-2 text-center ${m.ok ? "" : "ring-1 ring-amber-300"}`}>
                      <p className={`font-mono font-bold ${m.ok ? "text-emerald-700" : "text-amber-700"}`}>{m.v}</p>
                      <p className="text-[10px] text-on-surface-variant">{m.l}</p>
                    </div>
                  ))}
                </div>
              </div>
            </ModuleSection>
          </div>

          {/* C. Peer Learning Circle */}
          <div className="col-span-12 xl:col-span-7">
            <ModuleSection
              icon="groups"
              title="Peer Learning Circle"
              sub="Nhóm đồng nghiệp cùng cấp học hỏi · 'Câu lạc bộ học tập'"
              tone="blue"
              action={<Button tone="ghost" size="xs" icon="add">Tạo circle</Button>}>
              <ul className="space-y-2.5">
                {[
                  { n: "BMI-3 Cohort · South", desc: "12 advisors cùng level, share case mỗi 2 tuần", members: 12, next: "T6 17:00", new: 2, lead: "Lê Khánh", role: "Member" },
                  { n: "Behavioral Practitioners", desc: "Practice behavioral techniques drill chung", members: 16, next: "T4 17:00 hàng tuần", new: 5, lead: "Cathy Lin", role: "Co-host" },
                  { n: "Estate Case Discussion", desc: "Case study estate cho PWealth", members: 8, next: "T2 09:00", new: 1, lead: "Trần Hồng Vân", role: "Member" },
                  { n: "CFA L2 Study Group", desc: "Cùng ôn CFA Level 2 đến T11/2026", members: 6, next: "T7 sáng", new: 0, lead: "Self", role: "Founder" }
                ].map((g, i) => (
                  <li key={i} className="flex items-center gap-3 p-3 rounded-xl ring-1 ring-outline-variant/30 hover:bg-surface-container-low transition-colors cursor-pointer">
                    <span className="w-9 h-9 rounded-lg bg-vnd-primary-50 text-vnd-primary-700 flex items-center justify-center"><Icon name="groups" size={16} /></span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="font-display font-semibold text-on-surface truncate">{g.n}</p>
                        <Badge tone={g.role === "Co-host" ? "purple" : g.role === "Founder" ? "amber" : "blue"} size="xs">{g.role}</Badge>
                        {g.new > 0 && <Badge tone="red" size="xs">{g.new} mới</Badge>}
                      </div>
                      <p className="text-[11.5px] text-on-surface-variant mt-0.5 truncate">{g.desc}</p>
                    </div>
                    <div className="text-right hidden md:block">
                      <p className="text-[11px] text-on-surface-variant">Lead: <span className="font-semibold text-on-surface">{g.lead}</span></p>
                      <p className="text-[11px] font-mono text-on-surface-variant">{g.members} · {g.next}</p>
                    </div>
                    <Button size="xs" tone="outline">Vào</Button>
                  </li>
                ))}
              </ul>
            </ModuleSection>
          </div>

          {/* D. Training Program */}
          <div className="col-span-12 xl:col-span-5">
            <ModuleSection
              icon="menu_book"
              title="Training Program"
              sub="Khoá đào tạo chính thức công ty · 'Lớp học chính quy'"
              tone="amber"
              action={<Button tone="ghost" size="xs" icon="open_in_new">Catalogue</Button>}>
              <ul className="space-y-2.5">
                {[
                  { t: "AML/CFT Master 2026", req: true, prog: 64, dl: "30/06" , kind: "Compliance"},
                  { t: "Sản phẩm linked Q4 cập nhật", req: true, prog: 0, dl: "31/07", kind: "Sản phẩm" },
                  { t: "Behavioral Coaching Cohort #14", req: false, prog: 42, dl: "Live · weekly", kind: "Soft skill" },
                  { t: "CCHN QLQ — Bootcamp ôn thi", req: false, prog: 22, dl: "Thi T9/2026", kind: "Cert" }
                ].map((c, i) => (
                  <li key={i} className="rounded-xl ring-1 ring-outline-variant/30 p-3">
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <p className="text-[13px] font-semibold text-on-surface">{c.t}</p>
                      {c.req && <Badge tone="red" size="xs">Required</Badge>}
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge tone="neutral" size="xs">{c.kind}</Badge>
                      <span className="text-[11px] font-mono text-on-surface-variant">DL: {c.dl}</span>
                    </div>
                    {c.prog > 0 ? (
                      <div>
                        <div className="h-1.5 bg-surface-container-low rounded-full overflow-hidden">
                          <div className="h-full bg-vnd-primary-500 rounded-full" style={{ width: c.prog + "%" }}></div>
                        </div>
                        <p className="text-[10.5px] font-mono text-on-surface-variant mt-1">{c.prog}% · tiếp tục</p>
                      </div>
                    ) : (
                      <Button size="xs" tone="primary" icon="play_arrow">Bắt đầu</Button>
                    )}
                  </li>
                ))}
              </ul>
            </ModuleSection>
          </div>
        </div>
      </Page>
    </>
  );
}

// ============================================================
// 2) DWORK NETWORK · Mạng để LÀM VIỆC hàng ngày
// ============================================================
function DWorkNetwork() {
  return (
    <>
      <PageHeader
        eyebrow="dLink · dWork Network"
        title="Mạng để LÀM VIỆC hàng ngày"
        sub="GTM chain (quản lý kinh doanh) · VCO chain (hỗ trợ vận hành) · Peer CA/CSA cùng KH."
        actions={
          <>
            <Button tone="ghost" size="sm" icon="search">Tìm nhanh</Button>
            <Button tone="primary" size="sm" icon="forward">Escalate vấn đề</Button>
          </>
        }
      />
      <Page>
        <NetworkHero
          tone="dark"
          badge={{ icon: "hub", label: "dWork Network" }}
          title="Tôi cần ai để giải quyết vấn đề này?"
          question="Tôi cần ai để giải quyết vấn đề này?"
          stats={[
            { l: "GTM chain", v: "3", sub: "Manager line" },
            { l: "VCO chain", v: "4", sub: "Support team" },
            { l: "Peer CA/CSA", v: "8", sub: "Cùng KH" }
          ]}
        />

        <div className="space-y-4 mt-5">
          {/* A. GTM Chain */}
          <ModuleSection
            icon="apartment"
            title="GTM Chain · Go-To-Market"
            sub="Chuỗi quản lý kinh doanh — SU → BM → L2 Manager. Quyết định KPI, hoa hồng, chiến lược."
            tone="blue"
            action={<Badge tone="blue" size="md" icon="account_tree">Reporting line</Badge>}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative">
              {/* Visual reporting line */}
              <div className="hidden md:block absolute top-1/2 left-[16.6%] right-[16.6%] h-0.5 bg-vnd-primary-200 -translate-y-1/2 z-0"></div>
              {[
                {
                  rk: 1, label: "SU · Squad Unit Lead", who: "Lý Khắc Anh", role: "Squad 04 Lead", scope: "Quản lý 8 advisor trong squad",
                  ex: "Daily standup · approve giờ làm · review cadence", initials: "KA", strength: 88, active: true
                },
                {
                  rk: 2, label: "BM · Branch Manager", who: "Phạm Văn Sơn", role: "BM Saigon Tower", scope: "Phê duyệt commission · KPI tháng",
                  ex: "Bạn cần tăng chỉ tiêu → BM duyệt", initials: "PS", strength: 64
                },
                {
                  rk: 3, label: "L2 Manager", who: "Đinh Thuý Anh", role: "Regional VP", scope: "Chiến lược region, deals lớn",
                  ex: "Khuyến mãi cho KH lớn → L2 duyệt", initials: "TA", strength: 32
                }
              ].map((p, i) => (
                <div key={p.rk} className="relative z-10 rounded-2xl bg-white ring-1 ring-outline-variant/40 p-4 hover:shadow-soft transition-shadow">
                  <div className="flex items-center justify-between mb-3">
                    <span className="w-7 h-7 rounded-md bg-vnd-primary-900 text-white flex items-center justify-center font-display font-bold text-[12px]">L{p.rk}</span>
                    {p.active && <Badge tone="green" size="xs" icon="circle">Trực tiếp</Badge>}
                  </div>
                  <p className="text-[10.5px] uppercase tracking-wider font-bold text-vnd-primary-700">{p.label}</p>
                  <div className="flex items-center gap-2.5 mt-2">
                    <Avatar initials={p.initials} size={36} tone="blue" />
                    <div>
                      <p className="font-display font-semibold text-on-surface text-[13.5px]">{p.who}</p>
                      <p className="text-[11px] text-on-surface-variant">{p.role}</p>
                    </div>
                  </div>
                  <p className="text-[12px] text-on-surface mt-3 leading-snug">{p.scope}</p>
                  <p className="text-[11px] text-on-surface-variant italic mt-1.5">VD: {p.ex}</p>
                  <div className="flex gap-1.5 mt-3 pt-3 border-t border-outline-variant/30">
                    <Button size="xs" tone="primary" icon="chat" className="flex-1 justify-center">Nhắn</Button>
                    <Button size="xs" tone="outline" icon="event">Lịch</Button>
                  </div>
                </div>
              ))}
            </div>
          </ModuleSection>

          {/* B. VCO Chain */}
          <ModuleSection
            icon="engineering"
            title="VCO Chain · Value Chain Operations"
            sub="Đội hỗ trợ chuyên môn — khi cần xử lý vấn đề kỹ thuật, NAC, hoặc kiến thức sản phẩm."
            tone="green"
            action={<Badge tone="green" size="md" icon="support">Support team</Badge>}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-2xl ring-1 ring-vnd-primary-100 bg-vnd-primary-50/40 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-9 h-9 rounded-lg bg-vnd-primary-500 text-white flex items-center justify-center"><Icon name="headset_mic" size={18} /></span>
                  <div>
                    <p className="font-display font-bold text-vnd-primary-900">CSO / CSE</p>
                    <p className="text-[11px] text-on-surface-variant">Client Service Officer / Executive</p>
                  </div>
                </div>
                <p className="text-[12.5px] text-on-surface mb-2">Hỗ trợ KH vấn đề <span className="font-semibold">kỹ thuật, giấy tờ</span>.</p>
                <p className="text-[11px] text-on-surface-variant italic mb-3">VD: KH quên mật khẩu, cần làm lại KYC → CSO/CSE.</p>
                <ul className="space-y-1.5">
                  {[
                    { n: "Đỗ Hà", role: "CSE Saigon · Lv2", sla: "<30 phút", initials: "DH" },
                    { n: "Nguyễn Mai", role: "CSO general", sla: "<2h", initials: "NM" }
                  ].map((p, i) => (
                    <li key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white">
                      <Avatar initials={p.initials} size={26} tone="blue" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold truncate">{p.n}</p>
                        <p className="text-[10.5px] text-on-surface-variant">{p.role}</p>
                      </div>
                      <Badge tone="green" size="xs" icon="speed">{p.sla}</Badge>
                    </li>
                  ))}
                </ul>
                <Button size="xs" tone="soft" className="w-full justify-center mt-3" icon="chat">Mở ticket</Button>
              </div>

              <div className="rounded-2xl ring-1 ring-amber-200 bg-amber-50/40 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-9 h-9 rounded-lg bg-amber-500 text-white flex items-center justify-center"><Icon name="warning" size={18} /></span>
                  <div>
                    <p className="font-display font-bold text-vnd-primary-900">AE / AME</p>
                    <p className="text-[11px] text-on-surface-variant">Account Executive / Manager — NAC desk</p>
                  </div>
                </div>
                <p className="text-[12.5px] text-on-surface mb-2">Xử lý KH <span className="font-semibold">'cần quan tâm đặc biệt'</span> — rủi ro, lỗ lớn, margin cao.</p>
                <p className="text-[11px] text-on-surface-variant italic mb-3">VD: KH margin 40% → AE/AME vào cuộc.</p>
                <ul className="space-y-1.5">
                  {[
                    { n: "Vũ Đức Tâm", role: "AME · NAC P1/P2", sla: "Live · same day", initials: "VT" },
                    { n: "Lê Anh Tuấn", role: "AE general", sla: "<4h", initials: "AT" }
                  ].map((p, i) => (
                    <li key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white">
                      <Avatar initials={p.initials} size={26} tone="amber" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold truncate">{p.n}</p>
                        <p className="text-[10.5px] text-on-surface-variant">{p.role}</p>
                      </div>
                      <Badge tone="amber" size="xs">{p.sla}</Badge>
                    </li>
                  ))}
                </ul>
                <Button size="xs" tone="primary" className="w-full justify-center mt-3" icon="warning">Báo NAC alert</Button>
              </div>

              <div className="rounded-2xl ring-1 ring-fuchsia-200 bg-fuchsia-50/40 p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-9 h-9 rounded-lg bg-fuchsia-600 text-white flex items-center justify-center"><Icon name="inventory_2" size={18} /></span>
                  <div>
                    <p className="font-display font-bold text-vnd-primary-900">PD / PSO</p>
                    <p className="text-[11px] text-on-surface-variant">Product Dev / Product Specialist</p>
                  </div>
                </div>
                <p className="text-[12.5px] text-on-surface mb-2">Cung cấp <span className="font-semibold">kiến thức chuyên sâu</span> về sản phẩm.</p>
                <p className="text-[11px] text-on-surface-variant italic mb-3">VD: Cần hiểu rõ quỹ đầu tư mới → PD/PSO.</p>
                <ul className="space-y-1.5">
                  {[
                    { n: "Phạm Quỳnh", role: "PSO · Bond & Fund", sla: "Same week", initials: "PQ" },
                    { n: "Lê Hồng", role: "PD · Insurance linked", sla: "On request", initials: "LH" }
                  ].map((p, i) => (
                    <li key={i} className="flex items-center gap-2 p-2 rounded-lg bg-white">
                      <Avatar initials={p.initials} size={26} tone="purple" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-semibold truncate">{p.n}</p>
                        <p className="text-[10.5px] text-on-surface-variant">{p.role}</p>
                      </div>
                      <Badge tone="purple" size="xs">{p.sla}</Badge>
                    </li>
                  ))}
                </ul>
                <Button size="xs" tone="soft" className="w-full justify-center mt-3" icon="question_mark">Hỏi chuyên gia</Button>
              </div>
            </div>
          </ModuleSection>

          {/* C. Peer CA / CSA cùng KH */}
          <ModuleSection
            icon="diversity_3"
            title="Peer CA / CSA cùng KH"
            sub="Đồng nghiệp cùng chăm sóc 1 KH — phối hợp chia sẻ thông tin."
            tone="rose"
            action={<Badge tone="rose" size="md" icon="link">Shared accounts</Badge>}
          >
            <table className="w-full text-[13px]">
              <thead className="border-b border-outline-variant/30 text-[10.5px] uppercase tracking-wider font-semibold text-on-surface-variant">
                <tr className="text-left">
                  <th className="pb-3">Khách hàng</th>
                  <th className="pb-3">Vai trò của bạn</th>
                  <th className="pb-3">Peer (cùng phụ trách)</th>
                  <th className="pb-3">Phụ trách</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {[
                  { c: "Lê Văn Việt", ci: "LV", myRole: "CA", peer: "Trần Quân", peerRole: "CSA", peerCovers: "Tư vấn chuyên sâu Estate", initials: "TQ", urgent: true },
                  { c: "Hoàng Thị Mai", ci: "HM", myRole: "CA", peer: "Phạm Quỳnh", peerRole: "PSO", peerCovers: "Sản phẩm bond + fund", initials: "PQ" },
                  { c: "Nguyễn Thanh Hà", ci: "NH", myRole: "CSA", peer: "Lê Khánh", peerRole: "CA primary", peerCovers: "Giao dịch hàng ngày", initials: "LK" },
                  { c: "Phạm Quốc Bảo", ci: "PB", myRole: "CA", peer: "Đỗ Thanh Hà", peerRole: "Compliance", peerCovers: "AML monitoring", initials: "TH" },
                  { c: "Đỗ Trung Kiên", ci: "DK", myRole: "CA", peer: "Vũ Đức Tâm", peerRole: "AME", peerCovers: "NAC handling — margin alert", initials: "VT", urgent: true }
                ].map((r, i) => (
                  <tr key={i} className="hover:bg-surface-container-low">
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar initials={r.ci} size={32} tone={["blue","green","amber","purple","rose"][i % 5]} />
                        <div>
                          <p className="font-semibold text-on-surface">{r.c}</p>
                          {r.urgent && <Badge tone="red" size="xs" icon="bolt">Cần sync</Badge>}
                        </div>
                      </div>
                    </td>
                    <td className="py-3"><Badge tone="blue" size="sm">{r.myRole}</Badge></td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <Avatar initials={r.initials} size={28} tone="green" />
                        <div>
                          <p className="font-semibold">{r.peer}</p>
                          <p className="text-[11px] text-on-surface-variant">{r.peerRole}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-[12px] text-on-surface-variant">{r.peerCovers}</td>
                    <td className="py-3 text-right">
                      <div className="inline-flex gap-1.5">
                        <Button size="xs" tone="ghost" icon="chat">Sync</Button>
                        <Button size="xs" tone="outline" icon="open_in_new">Mở KH</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </ModuleSection>
        </div>
      </Page>
    </>
  );
}

// ============================================================
// 3) NETWORK ANALYTICS (unchanged structure, lightly updated)
// ============================================================
function NetworkAnalytics() {
  return (
    <>
      <PageHeader
        eyebrow="dLink · Analytics"
        title="Đo lường giá trị mạng lưới"
        sub="Composition giữa iLead Network và dWork Network · impact theo thời gian · goals tracking."
        actions={<Button tone="outline" size="sm" icon="download">Export</Button>}
      />
      <Page>
        <div className="grid grid-cols-12 gap-4 mb-5">
          {[
            { l: "iLead Network", v: "15", t: 4, tone: "purple", i: "school", sub: "Mentor · Coach · Peer · Training" },
            { l: "dWork Network", v: "15", t: 2, tone: "blue", i: "hub", sub: "GTM · VCO · Peer" },
            { l: "Strong ties", v: "12", t: 2, tone: "green", i: "favorite", sub: "Strength ≥ 60" },
            { l: "Referral revenue", v: "2.4 tỷ", t: 18, tone: "amber", i: "payments", sub: "YTD" }
          ].map((s, i) => (
            <div key={i} className="col-span-12 md:col-span-6 xl:col-span-3">
              <Card><Stat {...s} icon={s.i} /></Card>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-4">
          <Card className="col-span-12 lg:col-span-7">
            <SectionTitle sub="Phân bổ giữa 2 mạng và các vai trò bên trong">Composition</SectionTitle>
            <div className="flex items-center gap-6">
              <DonutChart data={[
                { label: "Peer CA/CSA", pct: 26, color: "#E11D48" },
                { label: "GTM chain", pct: 16, color: "#0077ED" },
                { label: "VCO chain", pct: 18, color: "#00C97D" },
                { label: "Peer circle", pct: 22, color: "#3391F0" },
                { label: "Mentor", pct: 8, color: "#8B2E8F" },
                { label: "Coach", pct: 6, color: "#FFB020" },
                { label: "Training", pct: 4, color: "#727784" }
              ]} size={200} thickness={26} centerValue="30" centerLabel="people" />
              <ul className="flex-1 space-y-1.5">
                {[
                  { l: "Peer CA/CSA (dWork)", p: 26, c: "#E11D48" },
                  { l: "Peer circle (iLead)",  p: 22, c: "#3391F0" },
                  { l: "VCO chain (dWork)",     p: 18, c: "#00C97D" },
                  { l: "GTM chain (dWork)",     p: 16, c: "#0077ED" },
                  { l: "Mentor (iLead)",        p: 8,  c: "#8B2E8F" },
                  { l: "Coach (iLead)",         p: 6,  c: "#FFB020" },
                  { l: "Training (iLead)",      p: 4,  c: "#727784" }
                ].map(r => (
                  <li key={r.l} className="flex items-center gap-2 text-[12.5px]">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: r.c }}></span>
                    <span className="flex-1 font-medium">{r.l}</span>
                    <span className="font-mono text-on-surface-variant w-10 text-right">{r.p}%</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>

          <Card className="col-span-12 lg:col-span-5">
            <SectionTitle sub="12 tháng gần nhất">Network growth</SectionTitle>
            <BarChart
              data={[18,20,22,23,25,26,27,28,29,29,30,30].map((v, i) => ({ value: v, label: `T${i+1}`, highlight: i === 11 }))}
              height={180}
            />
            <p className="text-[12px] text-on-surface-variant mt-3">Net new: <span className="font-mono font-bold text-emerald-700">+12 kết nối</span> · churned: <span className="font-mono">2</span></p>
          </Card>

          <Card className="col-span-12">
            <SectionTitle sub="Giá trị tạo ra từ mạng lưới · 12 tháng"
              action={<Button tone="ghost" size="sm" icon="filter_list">12 tháng</Button>}>
              Network Impact
            </SectionTitle>
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-12 lg:col-span-7">
                <div className="relative h-56">
                  <svg viewBox="0 0 700 220" className="w-full h-full">
                    <defs>
                      <linearGradient id="impactGrad2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0077ED" stopOpacity="0.30" />
                        <stop offset="100%" stopColor="#0077ED" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    {[0,1,2,3,4].map(i => <line key={i} x1="0" y1={(i+1)*40} x2="700" y2={(i+1)*40} stroke="#E1E2EB" strokeDasharray="3 4" />)}
                    <path d="M0,180 L60,170 L120,155 L180,160 L240,140 L300,120 L360,108 L420,90 L480,82 L540,68 L600,55 L660,40 L700,30 L700,220 L0,220 Z" fill="url(#impactGrad2)" />
                    <path d="M0,180 L60,170 L120,155 L180,160 L240,140 L300,120 L360,108 L420,90 L480,82 L540,68 L600,55 L660,40 L700,30" stroke="#0077ED" strokeWidth="2.4" fill="none" />
                    <path d="M0,200 L60,195 L120,190 L180,180 L240,178 L300,170 L360,160 L420,155 L480,140 L540,130 L600,118 L660,108 L700,98" stroke="#00C97D" strokeWidth="2" fill="none" strokeDasharray="4 3" />
                    {["T1","T2","T3","T4","T5","T6","T7","T8","T9","T10","T11","T12"].map((m, i) => (
                      <text key={m} x={i * 60 + 5} y="215" fontSize="10" fill="#727784" fontFamily="JetBrains Mono">{m}</text>
                    ))}
                  </svg>
                </div>
                <div className="flex items-center gap-4 mt-2 text-[12px]">
                  <span className="inline-flex items-center gap-1.5"><span className="w-3 h-0.5 bg-vnd-primary-500"></span>Referral revenue cộng dồn (dWork)</span>
                  <span className="inline-flex items-center gap-1.5"><span className="w-3 h-0.5 bg-vnd-accent-green border-dashed"></span>ICM uplift từ mentor/coach (iLead)</span>
                </div>
              </div>
              <div className="col-span-12 lg:col-span-5 space-y-3">
                {[
                  { l: "Goal: 4 mentor sessions/tháng", p: 75, sub: "3/4 · còn 1 tuần" },
                  { l: "Goal: VCO ticket SLA < 4h trung bình", p: 100, sub: "Đạt — avg 2.6h" },
                  { l: "Goal: 10 peer-CA sync/quý", p: 70, sub: "7/10 · ổn" }
                ].map((g, i) => (
                  <div key={i} className="rounded-xl ring-1 ring-outline-variant/30 p-4">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[13px] font-semibold text-on-surface">{g.l}</p>
                      <span className="font-mono font-bold text-vnd-primary-900">{g.p}%</span>
                    </div>
                    <div className="h-1.5 bg-surface-container-low rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${g.p >= 100 ? "bg-emerald-500" : "bg-vnd-primary-500"}`} style={{ width: Math.min(100, g.p) + "%" }}></div>
                    </div>
                    <p className="text-[11px] text-on-surface-variant mt-1.5">{g.sub}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </Page>
    </>
  );
}

Object.assign(window, { ScreenDLink });
