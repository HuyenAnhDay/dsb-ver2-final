/* global React, window */
// ============== TAB 3 · Dinvest — Giao dịch & hành động ==============
// Groups: Giao dịch · Sự kiện · Sản phẩm
(function () {
  const { CP_DATA } = window.DSB_DATA;

  // ===== Giao dịch =====
  function MatchedPanel() {
    const d = CP_DATA.trades;
    return (
      <CPCard title="Báo cáo KQ khớp lệnh" sub="Lệnh khớp gần đây" icon="swap_horiz"
        action={<Button tone="ghost" size="sm" icon="arrow_outward">Sao kê đầy đủ</Button>}>
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-[12.5px]">
            <thead className="text-[10.5px] uppercase text-on-surface-variant border-b border-outline-variant/30">
              <tr className="text-left"><th className="py-2 px-2">Ngày</th><th className="px-2">Sản phẩm</th><th className="px-2">Loại</th><th className="px-2">Trạng thái</th><th className="px-2 text-right">Số tiền</th></tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {d.map((tx, i) => (
                <tr key={i} className="hover:bg-surface-container-low">
                  <td className="py-2.5 px-2 font-mono text-on-surface-variant whitespace-nowrap">{tx.d}</td>
                  <td className="px-2">{tx.p}</td>
                  <td className="px-2"><Badge tone={tx.t === "BUY" ? "green" : tx.t === "SELL" ? "red" : "neutral"} size="xs">{tx.t}</Badge></td>
                  <td className="px-2 text-[11px] text-on-surface-variant">{tx.status}</td>
                  <td className={`px-2 text-right font-mono font-semibold ${tx.v.startsWith("+") ? "text-emerald-700" : "text-red-700"}`}>{tx.v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CPCard>
    );
  }
  function ResultPanel() {
    return (
      <div className="grid grid-cols-12 gap-4">
        <CPCard title="Kết quả giao dịch" sub="Tổng hợp hoạt động giao dịch 30 ngày" icon="analytics" className="col-span-12 lg:col-span-7">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <KVTile label="Số lệnh" value="18" tone="blue" />
            <KVTile label="GT mua" value="+384 tr" tone="green" />
            <KVTile label="GT bán" value="−85 tr" tone="red" />
            <KVTile label="Tỷ lệ thắng" value="72%" tone="purple" />
          </div>
        </CPCard>
        <CPCard title="Phân bổ lệnh" sub="Theo loại" icon="pie_chart" className="col-span-12 lg:col-span-5">
          <ul className="space-y-2.5 pt-1">
            {[["Mua (BUY)", 70, "bg-emerald-500"], ["Bán (SELL)", 18, "bg-red-400"], ["Khác", 12, "bg-vnd-primary-400"]].map(([l, v, c], i) => (
              <li key={i}>
                <div className="flex items-center justify-between mb-1"><span className="text-[12.5px]">{l}</span><span className="font-mono text-[11.5px] text-on-surface-variant">{v}%</span></div>
                <div className="h-2 bg-surface-container-high rounded-full overflow-hidden"><div className={`h-full rounded-full ${c}`} style={{ width: v + "%" }}></div></div>
              </li>
            ))}
          </ul>
        </CPCard>
      </div>
    );
  }

  // ===== Sự kiện =====
  function RightsUpcomingPanel() {
    const ca = CP_DATA.corporateActions;
    return (
      <CPCard title="Báo cáo lịch sự kiện quyền" sub="Sự kiện quyền sắp diễn ra" icon="confirmation_number">
        <ul className="space-y-2">
          {ca.upcoming.map((c, i) => (
            <li key={i} className="flex items-center gap-3 p-3 rounded-xl ring-1 ring-amber-100 bg-amber-50/40">
              <span className="w-10 h-10 rounded-lg bg-white text-amber-700 flex items-center justify-center shrink-0 ring-1 ring-amber-200"><Icon name={c.icon} size={18} /></span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold"><span className="font-mono">{c.code}</span> · {c.type}</p>
                <p className="text-[11.5px] text-on-surface-variant">{c.detail}</p>
              </div>
              <Badge tone="amber" size="sm">{c.d}</Badge>
            </li>
          ))}
        </ul>
      </CPCard>
    );
  }
  function RightsHistoryPanel() {
    const ca = CP_DATA.corporateActions;
    return (
      <CPCard title="Báo cáo lịch sử thực hiện quyền" sub="Quyền đã thực hiện" icon="history">
        <div className="overflow-x-auto scrollbar-thin">
          <table className="w-full text-[12.5px]">
            <thead className="text-[10.5px] uppercase text-on-surface-variant border-b border-outline-variant/30">
              <tr className="text-left"><th className="py-2 px-2">Ngày</th><th className="px-2">Mã</th><th className="px-2">Loại quyền</th><th className="px-2">Chi tiết</th></tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {ca.history.map((c, i) => (
                <tr key={i} className="hover:bg-surface-container-low">
                  <td className="py-2.5 px-2 font-mono text-on-surface-variant">{c.d}</td>
                  <td className="px-2 font-mono font-bold text-vnd-primary-900">{c.code}</td>
                  <td className="px-2">{c.type}</td>
                  <td className="px-2 text-on-surface-variant">{c.detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CPCard>
    );
  }

  // ===== Sản phẩm =====
  function ServicesPanel() {
    const d = CP_DATA.products;
    return (
      <CPCard title="Sản phẩm & dịch vụ" sub="Sản phẩm đang sử dụng" icon="inventory_2">
        <ul className="space-y-2">
          {d.map((pr, i) => (
            <li key={i} className="flex items-center gap-3 p-3 rounded-xl ring-1 ring-outline-variant/30">
              <span className="w-9 h-9 rounded-lg bg-vnd-primary-50 text-vnd-primary-700 flex items-center justify-center shrink-0"><Icon name={pr.icon} size={18} /></span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold truncate">{pr.name}</p>
                <p className="text-[11.5px] text-on-surface-variant truncate">{pr.type}</p>
              </div>
              <span className="text-[11px] font-mono text-on-surface-variant text-right shrink-0">{pr.meta}</span>
            </li>
          ))}
        </ul>
      </CPCard>
    );
  }
  function DcashPanel() {
    return (
      <div className="grid grid-cols-12 gap-4">
        <CPCard title="Dcash Grow" sub="Tiền gửi linh hoạt sinh lời" icon="savings" className="col-span-12 lg:col-span-7">
          <div className="grid grid-cols-3 gap-3 mb-4">
            <KVTile label="Số dư" value="320 tr" tone="blue" />
            <KVTile label="Lãi suất" value="4.6%/năm" tone="green" />
            <KVTile label="Lãi tháng này" value="+1.23 tr" tone="green" />
          </div>
          <KVRow label="Trạng thái" value={<Badge tone="green" size="sm">Đang hoạt động</Badge>} />
          <KVRow label="Kỳ tính lãi" value="Hàng ngày · trả cuối tháng" />
          <KVRow label="Rút linh hoạt" value="Không kỳ hạn · T+0" />
        </CPCard>
        <CPCard title="Tăng trưởng số dư" sub="6 tháng" icon="show_chart" className="col-span-12 lg:col-span-5">
          <BarChart data={[280, 290, 298, 305, 312, 320].map((v, i) => ({ value: v, label: "T" + (i + 1), highlight: i === 5 }))} height={150} format={(v) => v + " tr"} />
        </CPCard>
      </div>
    );
  }

  function TabDinvest({ client }) {
    const ProfileLayout = window.ProfileLayout;
    const groups = [
      { id: "tx", label: "Giao dịch", icon: "swap_horiz", items: [
        { id: "tx:matched", label: "Báo cáo KQ khớp lệnh", icon: "receipt_long" },
        { id: "tx:result", label: "Kết quả giao dịch", icon: "analytics" }
      ] },
      { id: "ev", label: "Sự kiện", icon: "confirmation_number", items: [
        { id: "ev:upcoming", label: "Lịch sự kiện quyền", icon: "event_upcoming" },
        { id: "ev:history", label: "Lịch sử thực hiện quyền", icon: "history" }
      ] },
      { id: "pr", label: "Sản phẩm", icon: "inventory_2", items: [
        { id: "pr:services", label: "Sản phẩm dịch vụ", icon: "category" },
        { id: "pr:dcash", label: "Dcash grow", icon: "savings" }
      ] }
    ];
    const [active, setActive] = useState("tx:matched");
    const render = () => {
      switch (active) {
        case "tx:matched": return <MatchedPanel />;
        case "tx:result": return <ResultPanel />;
        case "ev:upcoming": return <RightsUpcomingPanel />;
        case "ev:history": return <RightsHistoryPanel />;
        case "pr:services": return <ServicesPanel />;
        case "pr:dcash": return <DcashPanel />;
        default: return null;
      }
    };
    return <ProfileLayout groups={groups} value={active} onChange={setActive}>{render()}</ProfileLayout>;
  }

  Object.assign(window, {
    MatchedPanel, ResultPanel, RightsUpcomingPanel, RightsHistoryPanel, ServicesPanel, DcashPanel
  });
  window.TabDinvest = TabDinvest;
})();
