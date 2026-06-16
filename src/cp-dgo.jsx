/* global React, window */
// ============== TAB 1 · DGO — Năng lực & hồ sơ ==============
// Groups: Hồ sơ cá nhân · KYC profile · Hồ sơ đầu tư · Hành trình phát triển (IDP)
(function () {
  const { CP_DATA } = window.DSB_DATA;

  // ---------- Hồ sơ cá nhân › Life events ----------
  function LifeEventsPanel() {
    const d = CP_DATA.lifeEvents;
    return (
      <div className="grid grid-cols-12 gap-4">
        <CPCard title="Life events" sub="Dòng thời gian sự kiện đời sống ảnh hưởng tài chính" icon="event" className="col-span-12 lg:col-span-7">
          <CPLabel className="mb-2">Đã xảy ra</CPLabel>
          <ol className="relative pl-6 space-y-3 mb-5 before:absolute before:left-2 before:top-1.5 before:bottom-1.5 before:w-px before:bg-outline-variant/40">
            {d.past.map((e, i) => (
              <li key={i} className="relative">
                <span className="absolute -left-[18px] top-0.5 w-3 h-3 rounded-full bg-vnd-primary-500 ring-4 ring-white"></span>
                <div className="flex items-center gap-2">
                  <Icon name={e.icon} size={16} className="text-on-surface-variant" />
                  <p className="text-[13px] font-medium flex-1">{e.label}</p>
                  <span className="font-mono text-[11.5px] text-on-surface-variant">{e.when}</span>
                </div>
              </li>
            ))}
          </ol>
          <CPLabel className="mb-2">Sắp tới (dự kiến)</CPLabel>
          <ul className="space-y-2">
            {d.upcoming.map((e, i) => (
              <li key={i} className="flex items-center gap-2.5 p-3 rounded-xl bg-amber-50/50 ring-1 ring-amber-100">
                <Icon name={e.icon} size={18} className="text-amber-700" />
                <p className="text-[13px] font-medium flex-1">{e.label}</p>
                <Badge tone="amber" size="sm">{e.when}</Badge>
              </li>
            ))}
          </ul>
        </CPCard>
        <CPCard title="Gợi ý hành động" sub="Theo sự kiện đời sống" icon="lightbulb" className="col-span-12 lg:col-span-5">
          <ul className="space-y-2.5">
            <li className="rounded-xl ring-1 ring-outline-variant/30 p-3">
              <p className="text-[12.5px] font-semibold">Con vào đại học (Q3/2026)</p>
              <p className="text-[11.5px] text-on-surface-variant mt-0.5">Kích hoạt giải ngân quỹ giáo dục · review VNDSIP.</p>
            </li>
            <li className="rounded-xl ring-1 ring-outline-variant/30 p-3">
              <p className="text-[12.5px] font-semibold">Nghỉ hưu một phần (2028)</p>
              <p className="text-[11.5px] text-on-surface-variant mt-0.5">Dịch chuyển dần sang danh mục thu nhập cố định.</p>
            </li>
          </ul>
        </CPCard>
      </div>
    );
  }

  // ---------- KYC › Need map ----------
  function NeedMapPanel() {
    const rows = CP_DATA.kyc.needMap;
    const prTone = { "Cao": "red", "Trung bình": "amber", "Thấp": "neutral" };
    const stTone = { "Đủ": "green", "Đang đáp ứng": "green", "Một phần": "amber", "Thiếu": "red" };
    return (
      <CPCard title="Need map" sub="Bản đồ nhu cầu tài chính · mức độ đáp ứng" icon="travel_explore">
        <ul className="space-y-3">
          {rows.map((n, i) => (
            <li key={i} className="rounded-xl ring-1 ring-outline-variant/30 p-3.5">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-9 h-9 rounded-lg bg-vnd-primary-50 text-vnd-primary-700 flex items-center justify-center shrink-0"><Icon name={n.icon} size={18} /></span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold">{n.need}</p>
                  <p className="text-[11.5px] text-on-surface-variant">Đề xuất: {n.product}</p>
                </div>
                <Badge tone={prTone[n.priority]} size="sm">Ưu tiên {n.priority}</Badge>
                <Badge tone={stTone[n.status]} size="sm">{n.status}</Badge>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-surface-container-high rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${n.coverage >= 70 ? "bg-emerald-500" : n.coverage >= 40 ? "bg-amber-500" : "bg-red-400"}`} style={{ width: n.coverage + "%" }}></div>
                </div>
                <span className="font-mono text-[11.5px] font-bold text-on-surface w-10 text-right">{n.coverage}%</span>
              </div>
            </li>
          ))}
        </ul>
      </CPCard>
    );
  }

  // ---------- KYC › Risk map ----------
  function RiskMapPanel() {
    const r = CP_DATA.kyc.riskMap;
    return (
      <div className="grid grid-cols-12 gap-4">
        <CPCard title="Risk map" sub="Khẩu vị · khả năng · mức yêu cầu" icon="radar" className="col-span-12 lg:col-span-5">
          <div className="flex items-center justify-around py-2">
            <div className="text-center"><ProgressRing value={r.tolerance} size={84} thickness={8} sub="Tolerance" /><p className="text-[11px] text-on-surface-variant mt-1.5">Sẵn sàng</p></div>
            <div className="text-center"><ProgressRing value={r.capacity} size={84} thickness={8} sub="Capacity" /><p className="text-[11px] text-on-surface-variant mt-1.5">Khả năng</p></div>
            <div className="text-center"><ProgressRing value={r.required} size={84} thickness={8} sub="Required" /><p className="text-[11px] text-on-surface-variant mt-1.5">Yêu cầu</p></div>
          </div>
          <div className="mt-2 flex items-center justify-center"><Badge tone="purple" size="md" icon="speed">{r.profile}</Badge></div>
          <div className="mt-3 rounded-lg bg-amber-50/60 ring-1 ring-amber-100 p-3 flex items-start gap-2">
            <Icon name="info" size={16} className="text-amber-700 mt-0.5" />
            <p className="text-[12px] text-on-surface">{r.note}</p>
          </div>
        </CPCard>
        <CPCard title="Yếu tố cấu thành" sub="Risk profiling factors" icon="tune" className="col-span-12 lg:col-span-7">
          <ul className="space-y-3">
            {r.factors.map((f, i) => (
              <li key={i}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[12.5px] font-medium">{f.k}</span>
                  <span className="text-[12px] text-on-surface-variant">{f.v}</span>
                </div>
                <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                  <div className="h-full bg-vnd-primary-500 rounded-full" style={{ width: f.score + "%" }}></div>
                </div>
              </li>
            ))}
          </ul>
        </CPCard>
      </div>
    );
  }

  // ---------- KYC › X-map ----------
  function XMapPanel() {
    const rows = CP_DATA.kyc.xMap;
    return (
      <CPCard title="X-map" sub="Bản đồ cross-sell · độ phù hợp sản phẩm" icon="hub">
        <ul className="space-y-3">
          {rows.map((x, i) => (
            <li key={i} className="rounded-xl ring-1 ring-outline-variant/30 p-3.5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold">{x.product}</p>
                  <p className="text-[11.5px] text-on-surface-variant mt-0.5">{x.reason}</p>
                </div>
                <Badge tone={x.tone} size="sm">{x.status}</Badge>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[11px] text-on-surface-variant">Fit score</span>
                <div className="flex-1 h-2 bg-surface-container-high rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${x.fit >= 80 ? "bg-emerald-500" : x.fit >= 60 ? "bg-vnd-primary-500" : "bg-amber-500"}`} style={{ width: x.fit + "%" }}></div>
                </div>
                <span className="font-mono text-[12px] font-bold w-9 text-right">{x.fit}</span>
                <Button tone="soft" size="xs" icon="play_arrow">Đề xuất</Button>
              </div>
            </li>
          ))}
        </ul>
      </CPCard>
    );
  }

  // ---------- Hồ sơ đầu tư › Investment track ----------
  function InvestTrackPanel() {
    const t = CP_DATA.investTrack;
    return (
      <CPCard title="Investment track" sub="Track tư vấn đang áp dụng" icon="account_tree">
        <div className="flex items-center gap-2 mb-3">
          <Badge tone="blue" size="md" icon="account_tree">{t.track}</Badge>
          <span className="text-[12px] text-on-surface-variant">Áp dụng từ {t.since}</span>
        </div>
        <p className="text-[13px] text-on-surface leading-relaxed mb-4">{t.desc}</p>
        <CPLabel className="mb-2">Lịch sử track</CPLabel>
        <ol className="relative pl-6 space-y-2.5 before:absolute before:left-2 before:top-1.5 before:bottom-1.5 before:w-px before:bg-outline-variant/40">
          {t.milestones.map((m, i) => (
            <li key={i} className="relative">
              <span className="absolute -left-[18px] top-0.5 w-3 h-3 rounded-full bg-vnd-primary-500 ring-4 ring-white"></span>
              <div className="flex items-center gap-2">
                <p className="text-[12.5px] font-medium flex-1">{m.label}</p>
                <span className="font-mono text-[11px] text-on-surface-variant">{m.at}</span>
              </div>
            </li>
          ))}
        </ol>
      </CPCard>
    );
  }

  // ---------- Hồ sơ đầu tư › Risk profile + suitability ----------
  function RiskSuitabilityPanel() {
    const inv = CP_DATA.investor;
    return (
      <div className="grid grid-cols-12 gap-4">
        <CPCard title="Risk profile" sub="Khẩu vị rủi ro" icon="speed" className="col-span-12 lg:col-span-6">
          <div className="flex items-center gap-2 mb-4"><Badge tone="purple" size="md" icon="psychology">{inv.risk}</Badge></div>
          <KVRow label="Mức độ chấp nhận rủi ro" value="72 / 100" />
          <KVRow label="Mục tiêu lợi nhuận kỳ vọng" value="11–14% / năm" />
          <KVRow label="Mức sụt giảm chấp nhận" value="≤ 20%" />
        </CPCard>
        <CPCard title="Suitability" sub="Mức độ phù hợp sản phẩm" icon="rule" className="col-span-12 lg:col-span-6">
          <div className="flex items-center gap-4">
            <ProgressRing value={72} size={92} thickness={9} sub="Score" />
            <div className="flex-1">
              <Badge tone="green" size="md" icon="verified">{inv.suitability}</Badge>
              <p className="text-[12px] text-on-surface-variant mt-2 leading-relaxed">Danh mục hiện tại phù hợp khẩu vị Growth. Cảnh báo khi tỷ trọng sản phẩm rủi ro cao vượt 60%.</p>
            </div>
          </div>
        </CPCard>
      </div>
    );
  }

  // ---------- Hồ sơ đầu tư › Wisdom / experience level ----------
  function WisdomPanel() {
    const w = CP_DATA.wisdom;
    return (
      <CPCard title="Wisdom level" sub="Mức độ trưởng thành đầu tư" icon="emoji_objects">
        <div className="flex items-center gap-3 mb-5">
          <Badge tone="purple" size="md" icon="workspace_premium">Level {w.level} · {w.levelName}</Badge>
          <div className="flex-1 h-2 bg-surface-container-high rounded-full overflow-hidden max-w-xs">
            <div className="h-full bg-vnd-primary-500 rounded-full" style={{ width: w.progress + "%" }}></div>
          </div>
          <span className="font-mono text-[12px] font-bold text-vnd-primary-700">{w.progress}%</span>
        </div>
        <ol className="grid grid-cols-5 gap-2 mb-4">
          {w.ladder.map((l) => (
            <li key={l.lv} className="flex flex-col items-center text-center">
              <span className={`w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold
                ${l.current ? "bg-vnd-primary-500 text-white ring-4 ring-vnd-primary-100" : l.done ? "bg-emerald-500 text-white" : "bg-surface-container-high text-on-surface-variant"}`}>
                {l.done ? <Icon name="check" size={16} /> : l.lv}
              </span>
              <span className={`mt-1.5 text-[10.5px] font-medium ${l.current ? "text-vnd-primary-900" : "text-on-surface-variant"}`}>{l.name}</span>
            </li>
          ))}
        </ol>
        <div className="rounded-lg bg-vnd-primary-50/60 ring-1 ring-vnd-primary-100 p-3 flex items-start gap-2">
          <Icon name="lightbulb" size={16} className="text-vnd-primary-700 mt-0.5" />
          <p className="text-[12px] text-on-surface">{w.note}</p>
        </div>
      </CPCard>
    );
  }

  // ---------- Hồ sơ đầu tư › Kinh nghiệm đầu tư ----------
  function ExperiencePanel() {
    const e = CP_DATA.experienceDetail;
    return (
      <CPCard title="Kinh nghiệm đầu tư" sub="Thâm niên · mức thành thạo công cụ" icon="history_edu">
        <div className="grid grid-cols-2 gap-3 mb-5">
          <KVTile label="Thâm niên" value={e.years} tone="blue" mono={false} />
          <KVTile label="Phong cách" value={e.style} tone="purple" mono={false} />
        </div>
        <CPLabel className="mb-2">Mức thành thạo theo công cụ</CPLabel>
        <ul className="space-y-3">
          {e.instruments.map((it, i) => (
            <li key={i}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[12.5px] font-medium">{it.k}</span>
                <Badge tone={it.score >= 75 ? "green" : it.score >= 50 ? "blue" : "neutral"} size="xs">{it.lv}</Badge>
              </div>
              <div className="h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${it.score >= 75 ? "bg-emerald-500" : it.score >= 50 ? "bg-vnd-primary-500" : "bg-outline-variant"}`} style={{ width: it.score + "%" }}></div>
              </div>
            </li>
          ))}
        </ul>
      </CPCard>
    );
  }

  // ---------- IDP panels ----------
  function IdpPositionPanel({ client }) {
    const idp = CP_DATA.idp;
    return (
      <div className="grid grid-cols-12 gap-4">
        <CPCard title="Vị thế đầu tư hiện tại" sub="Tier & quy mô tài sản" icon="my_location" className="col-span-12 lg:col-span-6">
          <div className="flex items-center gap-2 mb-4"><Badge tone="blue" size="md" icon="workspace_premium">{idp.current}</Badge></div>
          <KVRow label="NAV tại VNDS" value={trToTy(client.nav)} />
          <KVRow label="Segment" value={client.segment} />
          <KVRow label="Khách hàng từ" value={client.joinedAt} />
          <KVRow label="Cadence cam kết" value={client.cadence} />
        </CPCard>
        <CPCard title="Định vị trên thang tier" sub="Mass → Institutional" icon="stairs" className="col-span-12 lg:col-span-6">
          <ol className="space-y-2">
            {window.DSB_DATA.TIER_LADDER.map((t) => {
              const isCur = t === idp.current, isNext = t === idp.next;
              return (
                <li key={t} className={`flex items-center gap-3 p-2.5 rounded-lg ${isCur ? "bg-vnd-primary-50 ring-1 ring-vnd-primary-200" : isNext ? "bg-fuchsia-50/50 ring-1 ring-fuchsia-100" : "ring-1 ring-outline-variant/20"}`}>
                  <Icon name={isCur ? "radio_button_checked" : isNext ? "flag" : "radio_button_unchecked"} size={18} className={isCur ? "text-vnd-primary-700" : isNext ? "text-fuchsia-700" : "text-on-surface-variant"} />
                  <span className={`text-[13px] flex-1 ${isCur || isNext ? "font-semibold" : "text-on-surface-variant"}`}>{t}</span>
                  {isCur && <Badge tone="blue" size="xs">Hiện tại</Badge>}
                  {isNext && <Badge tone="purple" size="xs">Mục tiêu</Badge>}
                </li>
              );
            })}
          </ol>
        </CPCard>
      </div>
    );
  }
  function IdpTierPanel() {
    const idp = CP_DATA.idp;
    return (
      <CPCard title="Lộ trình lên tier tiếp theo" sub="Điều kiện & tiến độ" icon="trending_up">
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <Badge tone="blue" size="md">{idp.current}</Badge>
          <Icon name="arrow_forward" size={18} className="text-on-surface-variant" />
          <Badge tone="purple" size="md" icon="workspace_premium">{idp.next}</Badge>
        </div>
        <div className="rounded-lg bg-surface-container-low/70 ring-1 ring-outline-variant/30 p-3 mb-4">
          <CPLabel className="mb-1">Điều kiện lên tier</CPLabel>
          <p className="text-[13px] text-on-surface">{idp.requirement}</p>
        </div>
        <div className="flex items-center justify-between mb-1.5"><CPLabel>Tiến độ lên tier</CPLabel><span className="font-mono text-[12px] font-bold text-vnd-primary-700">{idp.tierProgress}%</span></div>
        <div className="h-2.5 bg-surface-container-high rounded-full overflow-hidden mb-3"><div className="h-full bg-vnd-primary-500 rounded-full" style={{ width: idp.tierProgress + "%" }}></div></div>
        <div className="rounded-lg bg-vnd-primary-50/60 ring-1 ring-vnd-primary-100 p-3 flex items-start gap-2">
          <Icon name="lightbulb" size={16} className="text-vnd-primary-700 mt-0.5" />
          <p className="text-[12px] text-on-surface">{idp.note}</p>
        </div>
      </CPCard>
    );
  }
  function IdpContractPanel() {
    const idp = CP_DATA.idp;
    return (
      <CPCard title="Tiến độ hợp đồng chuyển đổi" sub="Chuyển đổi sang gói/track mục tiêu" icon="description">
        <div className="flex items-center gap-4 mb-4">
          <ProgressRing value={idp.contractProgress} size={92} thickness={9} sub="Hoàn tất" />
          <div className="flex-1">
            <p className="text-[13px] font-semibold text-on-surface">Hợp đồng nâng hạng KHL Pro</p>
            <p className="text-[12px] text-on-surface-variant mt-1">Đã hoàn tất {idp.contractProgress}% các bước hồ sơ & phê duyệt.</p>
          </div>
        </div>
        <ul className="space-y-2">
          {[["Thu thập hồ sơ bổ sung", true], ["Thẩm định nội bộ", true], ["Ký phụ lục hợp đồng", false], ["Kích hoạt gói mới", false]].map(([s, done], i) => (
            <li key={i} className="flex items-center gap-2.5 p-2.5 rounded-lg ring-1 ring-outline-variant/30">
              <Icon name={done ? "check_circle" : "radio_button_unchecked"} size={18} className={done ? "text-emerald-600" : "text-on-surface-variant"} filled={!!done} />
              <span className={`text-[12.5px] ${done ? "font-medium" : "text-on-surface-variant"}`}>{s}</span>
            </li>
          ))}
        </ul>
      </CPCard>
    );
  }

  // ---------- container ----------
  function TabDgo({ client, p }) {
    const HsCaNhan = window.HsCaNhan;
    const ProfileLayout = window.ProfileLayout;
    const h = CP_DATA.hsCaNhan;
    const groups = [
      { id: "hscn", label: "Hồ sơ cá nhân", icon: "contact_page", items: [
        { id: "hscn:basic", label: "Thông tin cơ bản", icon: "person" },
        { id: "hscn:accounts", label: "Danh sách tài khoản", icon: "account_balance", count: h.baseAccounts.length + h.fundCertAccounts.length },
        { id: "hscn:auth", label: "Danh sách uỷ quyền", icon: "manage_accounts", count: h.authorizations.length },
        { id: "hscn:beneficiary", label: "Tài khoản thụ hưởng", icon: "savings", count: h.bankAccounts.length },
        { id: "hscn:events", label: "Life events", icon: "event" }
      ] },
      { id: "kyc", label: "KYC profile", icon: "fact_check", items: [
        { id: "kyc:need", label: "Need map", icon: "travel_explore" },
        { id: "kyc:risk", label: "Risk map", icon: "radar" },
        { id: "kyc:xmap", label: "X-map", icon: "hub" }
      ] },
      { id: "inv", label: "Hồ sơ đầu tư", icon: "insights", items: [
        { id: "inv:track", label: "Investment track", icon: "account_tree" },
        { id: "inv:risk", label: "Risk profile + suitability", icon: "rule" },
        { id: "inv:wisdom", label: "Wisdom / experience", icon: "emoji_objects" },
        { id: "inv:exp", label: "Kinh nghiệm đầu tư", icon: "history_edu" }
      ] },
      { id: "idp", label: "Hành trình phát triển (IDP)", icon: "trending_up", items: [
        { id: "idp:position", label: "Vị thế đầu tư hiện tại", icon: "my_location" },
        { id: "idp:tier", label: "Lộ trình lên tier", icon: "stairs" },
        { id: "idp:contract", label: "Tiến độ HĐ chuyển đổi", icon: "description" }
      ] }
    ];
    const [active, setActive] = useState("hscn:basic");
    const render = () => {
      switch (active) {
        case "hscn:basic": return <HsCaNhan client={client} sub="basic" />;
        case "hscn:accounts": return <HsCaNhan client={client} sub="accounts" />;
        case "hscn:auth": return <HsCaNhan client={client} sub="auth" />;
        case "hscn:beneficiary": return <HsCaNhan client={client} sub="beneficiary" />;
        case "hscn:events": return <LifeEventsPanel />;
        case "kyc:need": return <NeedMapPanel />;
        case "kyc:risk": return <RiskMapPanel />;
        case "kyc:xmap": return <XMapPanel />;
        case "inv:track": return <InvestTrackPanel />;
        case "inv:risk": return <RiskSuitabilityPanel />;
        case "inv:wisdom": return <WisdomPanel />;
        case "inv:exp": return <ExperiencePanel />;
        case "idp:position": return <IdpPositionPanel client={client} />;
        case "idp:tier": return <IdpTierPanel />;
        case "idp:contract": return <IdpContractPanel />;
        default: return null;
      }
    };
    return <ProfileLayout groups={groups} value={active} onChange={setActive}>{render()}</ProfileLayout>;
  }

  window.TabDgo = TabDgo;
})();
