/* global React, window, useState, Icon, CPCard, Button */
// ============================================================
// Compass tabs — recomposes existing panels into the new
// 2-tier customer-profile navigation (sitemap):
//   La Bàn Năng Lực (coming soon) · La Bàn Hành Động ·
//   Mạng Lưới Kết Nối · Tháp Tài Sản
// Leaf content reuses panels exported by cp-dinvest /
// cp-daccount / cp-dlink; leaves without data show a Placeholder.
// ============================================================
(function () {
  const ProfileLayout = window.ProfileLayout;

  // ---- generic "content pending" leaf ----
  function Placeholder({ title, sub, icon = "construction" }) {
    return (
      <CPCard title={title} sub={sub} icon={icon}>
        <div className="flex flex-col items-center justify-center text-center py-12 px-4">
          <span className="w-14 h-14 rounded-2xl bg-surface-container-high text-on-surface-variant flex items-center justify-center mb-3">
            <Icon name={icon} size={26} />
          </span>
          <p className="text-[14px] font-display font-semibold text-on-surface">Đang hoàn thiện nội dung</p>
          <p className="text-[12.5px] text-on-surface-variant mt-1 max-w-[42ch]">
            Báo cáo cho mục này sẽ được kết nối với dữ liệu nguồn trong giai đoạn tới.
          </p>
        </div>
      </CPCard>
    );
  }

  // ---- whole-compass coming-soon screen (no 2nd-tier strip) ----
  function ComaSoon({ title, sub }) {
    return (
      <div className="mt-6 rounded-3xl ring-1 ring-outline-variant/40 bg-gradient-to-b from-surface-container-low to-surface px-8 py-16 flex flex-col items-center text-center">
        <span className="w-16 h-16 rounded-2xl bg-vnd-primary-50 text-vnd-primary-700 flex items-center justify-center mb-4">
          <Icon name="explore" size={30} filled />
        </span>
        <p className="text-[11px] uppercase tracking-[0.14em] font-bold text-vnd-primary-600 mb-2">Coming soon</p>
        <h3 className="font-display text-headline-sm text-vnd-primary-900">{title}</h3>
        <p className="text-[13.5px] text-on-surface-variant mt-2 max-w-[52ch]">{sub}</p>
      </div>
    );
  }

  // ====================================================
  // 1 · LA BÀN NĂNG LỰC — coming soon
  // ====================================================
  function TabNangLuc() {
    return (
      <ComaSoon
        title="La Bàn Hiểu Biết"
        sub="Bản đồ năng lực & hồ sơ khách hàng (hồ sơ cá nhân, KYC, hồ sơ đầu tư, hành trình phát triển) đang được hoàn thiện và sẽ ra mắt trong phiên bản kế tiếp."
      />
    );
  }

  // ====================================================
  // 2 · LA BÀN HÀNH ĐỘNG — Sao kê · Lịch & dòng tiền
  // ====================================================
  function TabHanhDong({ client }) {
    const W = window;
    const groups = [
      { id: "stmt", label: "Sao kê", icon: "description", items: [
        { id: "stmt:cash",      section: "Tiền",                 label: "Sao kê tiền",                     icon: "payments" },
        { id: "stmt:debt",      section: "Nợ",                   label: "Sao kê nợ",                       icon: "credit_card" },
        { id: "stmt:interest",  section: "Nợ",                   label: "Bảng kê lãi vay",                 icon: "percent" },
        { id: "stmt:secacct",   section: "Chứng khoán",          label: "Tài khoản giao dịch chứng khoán", icon: "account_balance" },
        { id: "stmt:result",    section: "Chứng khoán",          label: "Kết quả giao dịch",               icon: "analytics" },
        { id: "stmt:realized",  section: "Chứng khoán",          label: "Lãi/lỗ đã thực hiện",             icon: "trending_up" },
        { id: "stmt:matched",   section: "Thực hiện giao dịch",  label: "Báo cáo kết quả khớp lệnh",       icon: "receipt_long" },
        { id: "stmt:txresult",  section: "Thực hiện giao dịch",  label: "Kết quả giao dịch",               icon: "swap_horiz" }
      ] },
      { id: "flow", label: "Lịch & dòng tiền", icon: "calendar_month", items: [
        { id: "flow:calendar", label: "Lịch dòng tiền",                icon: "calendar_month" },
        { id: "flow:rights",   label: "Báo cáo lịch sự kiện quyền",    icon: "event_upcoming" },
        { id: "flow:history",  label: "Báo cáo lịch sử thực hiện quyền", icon: "history" }
      ] }
    ];
    const [active, setActive] = useState("stmt:cash");
    const render = () => {
      switch (active) {
        // Sao kê
        case "stmt:cash":      return <W.CashStatementPanel />;
        case "stmt:debt":      return <W.DebtStatementPanel />;
        case "stmt:interest":  return <W.InterestPanel />;
        case "stmt:secacct":   return <W.SecAccountPanel />;
        case "stmt:result":    return <W.ResultPanel />;
        case "stmt:realized":  return <W.RealizedPanel />;
        case "stmt:matched":   return <W.MatchedPanel />;
        case "stmt:txresult":  return <W.ResultPanel />;
        // Lịch & dòng tiền
        case "flow:calendar":  return <W.CashFlowPanel />;
        case "flow:rights":    return <W.RightsUpcomingPanel />;
        case "flow:history":   return <W.RightsHistoryPanel />;
        default: return null;
      }
    };
    return <ProfileLayout module="hanhdong" groups={groups} value={active} onChange={setActive}>{render()}</ProfileLayout>;
  }

  // ====================================================
  // 3 · MẠNG LƯỚI KẾT NỐI — Hồ sơ quan hệ
  // ====================================================
  function TabKetNoi({ client }) {
    const W = window;
    const groups = [
      { id: "rel", label: "Hồ sơ quan hệ", icon: "hub", items: [
        { id: "rel:network", label: "Hồ sơ quan hệ", icon: "diversity_3" }
      ] }
    ];
    const [active, setActive] = useState("rel:network");
    const render = () => {
      return W.NetworkPanel ? <W.NetworkPanel /> : <Placeholder title="Hồ sơ quan hệ" icon="hub" />;
    };
    return <ProfileLayout module="ketnoi" groups={groups} value={active} onChange={setActive}>{render()}</ProfileLayout>;
  }

  // ====================================================
  // 4 · LA BÀN GIÁ TRỊ — Báo cáo tài sản · Quản lý sản phẩm
  // ====================================================
  function TabTaiSan({ client }) {
    const W = window;
    const groups = [
      { id: "report", label: "Báo cáo tài sản", icon: "assessment", items: [
        { id: "rpt:asset",      section: "Tổng quan",   label: "Báo cáo tài sản",             icon: "account_balance_wallet" },
        { id: "rpt:portfolio",  section: "Tổng quan",   label: "Danh mục tài sản",            icon: "donut_small" },
        { id: "rpt:debtstatus", section: "Nợ",          label: "Báo cáo trạng thái tài khoản nợ", icon: "health_and_safety" }
      ] }
    ];
    const [active, setActive] = useState("rpt:asset");
    const render = () => {
      switch (active) {
        // 1 · Báo cáo tài sản
        case "rpt:asset":      return <W.AssetReportPanel client={client} />;
        case "rpt:portfolio":  return <W.PortfolioPanel client={client} />;
        case "rpt:growth":     return <W.GrowthPanel />;
        case "rpt:debtstatus": return <W.DebtStatusPanel />;
        case "rpt:debt":       return <W.DebtReportPanel />;
        case "rpt:secbal":     return <W.SecBalancePanel />;
        case "rpt:matched":    return <W.MatchedPanel />;
        // 2 · Quản lý sản phẩm
        case "prod:services":  return <W.ServicesPanel />;
        case "prod:dcash":     return <W.DcashPanel />;
        default: return null;
      }
    };
    return <ProfileLayout module="taisan" groups={groups} value={active} onChange={setActive}>{render()}</ProfileLayout>;
  }

  Object.assign(window, { TabNangLuc, TabHanhDong, TabKetNoi, TabTaiSan });
})();
