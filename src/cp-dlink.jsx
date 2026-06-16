/* global React, window */
// ============== TAB 4 · Dlink — Quan hệ & tương tác ==============
// Groups: CareBy ownership · Hồ sơ quan hệ · Interaction log
(function () {
  const { CP_DATA, INTERACTIONS } = window.DSB_DATA;

  const ROLE_INFO = {
    CA:  { title: "CC owner · Client Advisor", visibility: "Luôn hiển thị — chủ sở hữu chính của khách hàng.", resp: ["Sở hữu quan hệ & kế hoạch chăm sóc", "Chịu trách nhiệm cadence & doanh thu", "Điều phối các owner khác"] },
    AE:  { title: "AC owner · Advisor Expert", visibility: "Hiển thị khi có NAC đang hoạt động.", resp: ["Tư vấn chuyên sâu sản phẩm/đầu tư", "Hỗ trợ xử lý NAC phức tạp", "Đồng hành các deal lớn"] },
    CSA: { title: "PC owner · Client Service", visibility: "Kích hoạt khi hợp đồng đã signed.", resp: ["Vận hành hồ sơ & dịch vụ sau bán", "Xử lý yêu cầu giao dịch/giấy tờ", "Đảm bảo SLA dịch vụ"] },
    CSE: { title: "Backup · Client Service Exec", visibility: "Dự phòng khi owner chính vắng mặt.", resp: ["Trực thay khi owner bận", "Đảm bảo liên tục dịch vụ", "Theo dõi hàng chờ"] }
  };

  function OwnerPanel({ code }) {
    const o = CP_DATA.careBy.find(x => x.code === code);
    const info = ROLE_INFO[code];
    return (
      <CPCard title={info.title} sub={o.active ? "Đang phụ trách" : "Chưa phân công"} icon="badge">
        <div className="flex items-center gap-4 mb-5">
          {o.active
            ? <Avatar name={o.name} size={56} tone={o.tone} />
            : <span className="w-14 h-14 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center"><Icon name="person_off" size={26} /></span>}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-display text-title-md text-vnd-primary-900">{o.active ? o.name : "—"}</p>
              <Badge tone={o.tone === "blue" ? "blue" : o.tone === "green" ? "green" : o.tone === "amber" ? "amber" : "neutral"} size="sm">{o.code}</Badge>
            </div>
            <p className="text-[12.5px] text-on-surface-variant mt-0.5">{o.role}</p>
            {o.active
              ? <span className="inline-flex items-center gap-1 text-[11.5px] font-medium text-emerald-600 mt-1.5"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Active</span>
              : <span className="inline-flex items-center gap-1 text-[11.5px] font-medium text-on-surface-variant mt-1.5"><span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>Chưa gán</span>}
          </div>
          {o.active && (
            <div className="flex items-center gap-1.5">
              <Button tone="outline" size="sm" icon="call">Gọi</Button>
              <Button tone="outline" size="sm" icon="mail">Email</Button>
            </div>
          )}
        </div>
        <div className="rounded-lg bg-vnd-primary-50/50 ring-1 ring-vnd-primary-100 p-3 flex items-start gap-2 mb-4">
          <Icon name="visibility" size={16} className="text-vnd-primary-700 mt-0.5" />
          <p className="text-[12px] text-on-surface">{info.visibility}</p>
        </div>
        <CPLabel className="mb-2">Trách nhiệm</CPLabel>
        <ul className="space-y-1.5">
          {info.resp.map((r, i) => (
            <li key={i} className="flex items-center gap-2.5 text-[12.5px]"><Icon name="check_circle" size={16} className="text-emerald-600" filled /><span>{r}</span></li>
          ))}
        </ul>
      </CPCard>
    );
  }

  function NetworkPanel() {
    const n = CP_DATA.network;
    return (
      <CPCard title="Hồ sơ quan hệ" sub="Referral · KH giới thiệu · nội bộ VNDS" icon="hub">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div>
            <CPLabel className="mb-2">Người giới thiệu</CPLabel>
            <div className="flex items-center gap-2.5 p-3 rounded-xl ring-1 ring-outline-variant/30">
              <Avatar initials={n.referredBy.avatar} size={36} tone="green" />
              <div className="min-w-0">
                <p className="text-[12.5px] font-semibold truncate">{n.referredBy.name}</p>
                <p className="text-[11px] text-on-surface-variant truncate">{n.referredBy.relation}</p>
              </div>
            </div>
          </div>
          <div>
            <CPLabel className="mb-2">KH do KH này giới thiệu</CPLabel>
            <ul className="space-y-2">
              {n.referredOut.map((r, i) => (
                <li key={i} className="flex items-center gap-2.5 p-3 rounded-xl ring-1 ring-outline-variant/30">
                  <Avatar initials={r.avatar} size={32} tone="blue" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold truncate">{r.name}</p>
                    <p className="text-[10.5px] text-on-surface-variant truncate">{r.status}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <CPLabel className="mb-2">Nội bộ VNDS hỗ trợ</CPLabel>
            <ul className="space-y-2">
              {n.internal.map((r, i) => (
                <li key={i} className="flex items-center gap-2.5 p-3 rounded-xl ring-1 ring-outline-variant/30">
                  <Avatar initials={r.avatar} size={32} tone="purple" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-semibold truncate">{r.name}</p>
                    <p className="text-[10.5px] text-on-surface-variant truncate">{r.role}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CPCard>
    );
  }

  function InteractionPanel({ client }) {
    const toast = useToast();
    const cad = CP_DATA.cadence, coi = CP_DATA.coi;
    return (
      <div className="grid grid-cols-12 gap-4">
        <CPCard title="Lịch sử liên hệ" sub="Interaction log · channel · owner" icon="forum" className="col-span-12 lg:col-span-7"
          action={
            <div className="flex items-center gap-1.5">
              <Button tone="outline" size="xs" icon="call" onClick={() => toast?.("Mở trình gọi", { icon: "call" })}>Gọi</Button>
              <Button tone="outline" size="xs" icon="chat">Zalo</Button>
              <Button tone="primary" size="xs" icon="add">Log mới</Button>
            </div>
          }>
          <ol className="relative pl-7 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-px before:bg-outline-variant/40">
            {INTERACTIONS.map(i => (
              <li key={i.id} className="relative">
                <span className={`absolute -left-[20px] top-1 w-5 h-5 rounded-full ring-4 ring-white flex items-center justify-center ${i.pending ? "bg-amber-100 text-amber-700" : "bg-vnd-primary-100 text-vnd-primary-700"}`}>
                  <Icon name={i.channelIcon} size={11} />
                </span>
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-on-surface">{i.title}</p>
                    <p className="text-[11.5px] text-on-surface-variant mt-0.5">{i.note}</p>
                    <div className="flex items-center gap-3 mt-1.5 text-[11px] text-on-surface-variant">
                      <span className="inline-flex items-center gap-1"><Icon name="person" size={12} />{i.owner}</span>
                      <span className="font-mono">{i.when}</span>
                    </div>
                  </div>
                  <Badge tone={i.pending ? "amber" : "green"} size="sm">{i.outcome}</Badge>
                </div>
              </li>
            ))}
          </ol>
        </CPCard>

        <div className="col-span-12 lg:col-span-5 space-y-4">
          <CPCard title="Cadence" sub="Cam kết theo segment" icon="event_repeat">
            <KVRow label="Cadence cam kết" value={cad.committed} />
            <KVRow label="Liên hệ tiếp theo" value={<span className="text-emerald-700 font-semibold">{cad.nextContact}</span>} />
            <KVRow label="Touchpoint" value={cad.period} tone={cad.missing > 0 ? "neg" : undefined} />
          </CPCard>
          <CPCard title="COI" sub="Conflict of Interest" icon="gavel">
            <div className="rounded-xl ring-1 ring-emerald-200 bg-emerald-50/50 p-3 mb-2 flex items-start gap-2.5">
              <Icon name="verified_user" size={17} className="text-emerald-700 mt-0.5 shrink-0" />
              <div><p className="text-[12px] font-semibold text-emerald-800">Standing</p><p className="text-[11.5px] text-emerald-700/90 mt-0.5">{coi.standing}</p></div>
            </div>
            <div className="rounded-xl ring-1 ring-amber-200 bg-amber-50/50 p-3 flex items-start gap-2.5">
              <Icon name="pending_actions" size={17} className="text-amber-700 mt-0.5 shrink-0" />
              <div className="flex-1"><p className="text-[12px] font-semibold text-amber-800">Per-call</p><p className="text-[11.5px] text-amber-700/90 mt-0.5">{coi.perCall}</p>
                <Button tone="outline" size="xs" icon="check" className="mt-2">Khai báo COI</Button></div>
            </div>
          </CPCard>
        </div>
      </div>
    );
  }

  function TabDlink({ client }) {
    const ProfileLayout = window.ProfileLayout;
    const groups = [
      { id: "care", label: "CareBy ownership", icon: "badge", items: [
        { id: "care:cc", label: "CC owner (CA)", icon: "person" },
        { id: "care:ac", label: "AC owner (AE/AME)", icon: "psychology" },
        { id: "care:pc", label: "PC owner (CSA)", icon: "support_agent" },
        { id: "care:backup", label: "Backup (CSE)", icon: "shield" }
      ] },
      { id: "rel", label: "Hồ sơ quan hệ", icon: "hub", items: [
        { id: "rel:network", label: "Quan hệ", icon: "diversity_3" }
      ] },
      { id: "log", label: "Interaction log", icon: "forum", items: [
        { id: "log:history", label: "Lịch sử liên hệ", icon: "history" }
      ] }
    ];
    const [active, setActive] = useState("care:cc");
    const render = () => {
      switch (active) {
        case "care:cc": return <OwnerPanel code="CA" />;
        case "care:ac": return <OwnerPanel code="AE" />;
        case "care:pc": return <OwnerPanel code="CSA" />;
        case "care:backup": return <OwnerPanel code="CSE" />;
        case "rel:network": return <NetworkPanel />;
        case "log:history": return <InteractionPanel client={client} />;
        default: return null;
      }
    };
    return <ProfileLayout groups={groups} value={active} onChange={setActive}>{render()}</ProfileLayout>;
  }

  Object.assign(window, { NetworkPanel });
  window.TabDlink = TabDlink;
})();
