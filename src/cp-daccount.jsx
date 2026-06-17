/* global React, window */
// ============== TAB 2 · Daccount — Tài sản & hiệu suất ==============
// Groups: Tổng quan · Chứng khoán · Tiền · Nợ · Hiệu suất
(function () {
  const { CP_DATA, ALLOCATION } = window.DSB_DATA;

  // dual-line comparison (portfolio vs benchmark), values in %
  function LineCompare({ a, b, height = 160 }) {
    const all = [...a, ...b];
    const max = Math.max(...all), min = Math.min(...all, 0);
    const r = max - min || 1;
    const W = 100, H = height;
    const toPts = (arr) => arr.map((v, i) => {
      const x = (i / (arr.length - 1)) * W;
      const y = H - 6 - ((v - min) / r) * (H - 16);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(" ");
    return (
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="w-full" style={{ height }}>
        <polyline points={toPts(b)} fill="none" stroke="#727784" strokeWidth="1.4" strokeDasharray="3 2" vectorEffect="non-scaling-stroke" />
        <polyline points={toPts(a)} fill="none" stroke="#0077ED" strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
      </svg>
    );
  }

  // small statement table
  function MiniTable({ head, rows }) {
    return (
      <div className="overflow-x-auto scrollbar-thin">
        <table className="w-full text-[12.5px]">
          <thead className="text-[10.5px] uppercase tracking-wide text-on-surface-variant border-b border-outline-variant/30">
            <tr>{head.map((h, i) => <th key={i} className={`font-semibold py-2 px-2 ${h.align === "right" ? "text-right" : "text-left"}`}>{h.label}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-outline-variant/20">{rows}</tbody>
        </table>
      </div>
    );
  }

  const sums = (client) => {
    const heldAwaySum = CP_DATA.heldAway.reduce((s, x) => s + x.value, 0);
    const consolidated = client.nav + heldAwaySum;
    return { heldAwaySum, consolidated, netWorth: consolidated - CP_DATA.debt.marginUsed };
  };

  // ===== Tổng quan · Báo cáo tài sản (tree report — matches production) =====
  // recursively sum leaf values (tr = million VND)
  function nodeSum(n) {
    if (n.children && n.children.length) return n.children.reduce((s, c) => s + nodeSum(c), 0);
    return n.value || 0;
  }
  function flattenLeaves(nodes, acc) {
    nodes.forEach(n => {
      if (n.children && n.children.length) flattenLeaves(n.children, acc);
      else acc.push(n);
    });
    return acc;
  }
  // full đồng with vi-VN grouping
  const fmtVnd = (tr) => Math.round(tr * 1e6).toLocaleString("vi-VN");

  function AssetTree({ nodes }) {
    // expand top categories by default; deeper expandables collapsed
    const initial = {};
    const seed = (list, path, depth) => list.forEach((n, i) => {
      const key = path + "/" + i;
      if (n.children && n.children.length) { initial[key] = depth === 0; seed(n.children, key, depth + 1); }
    });
    seed(nodes, "", 0);
    const [open, setOpen] = useState(initial);

    const rows = [];
    const walk = (list, path, depth) => {
      list.forEach((n, i) => {
        const key = path + "/" + i;
        const hasKids = !!(n.children && n.children.length);
        const isOpen = open[key];
        const isCat = depth === 0;
        const val = nodeSum(n);
        rows.push(
          <tr key={key} className={`border-b border-outline-variant/25 ${isCat ? "" : "hover:bg-vnd-primary-50/40"} transition-colors`}>
            <td className="py-[9px] pr-3" style={{ paddingLeft: 12 + depth * 20 }}>
              <button
                onClick={() => hasKids && setOpen(o => ({ ...o, [key]: !o[key] }))}
                className={`flex items-center gap-1 text-left ${hasKids ? "cursor-pointer" : "cursor-default"}`}>
                {hasKids
                  ? <Icon name={isOpen ? "arrow_drop_up" : "arrow_drop_down"} size={20} className={isCat ? "text-vnd-primary-600 -ml-1.5" : "text-on-surface-variant -ml-1.5"} />
                  : <span className="inline-block w-[6px]" />}
                <span className={isCat
                  ? "text-[12.5px] font-semibold uppercase tracking-wide text-vnd-primary-700"
                  : `text-[12.5px] ${hasKids ? "font-medium text-on-surface" : "text-on-surface-variant"}`}>
                  {n.label}
                </span>
              </button>
            </td>
            <td className={`py-[9px] pr-3 text-right font-mono tabular-nums ${isCat ? "text-[12.5px] font-bold text-vnd-primary-700" : "text-[12.5px] text-on-surface"}`}>
              {fmtVnd(val)}
            </td>
          </tr>
        );
        if (hasKids && isOpen) walk(n.children, key, depth + 1);
      });
    };
    walk(nodes, "", 0);
    return <tbody>{rows}</tbody>;
  }

  function AssetReportPanel({ client }) {
    const rep = CP_DATA.assetReport;
    const [byProduct, setByProduct] = useState(false);
    const [account, setAccount] = useState("all");
    const subAccount = account !== "all";
    const accounts = [
      ...CP_DATA.hsCaNhan.baseAccounts.map(a => a.no),
      ...CP_DATA.hsCaNhan.fundCertAccounts.map(a => a.no)
    ];

    const totalAssets = rep.assets.reduce((s, n) => s + nodeSum(n), 0);
    const totalDebt = rep.debts.reduce((s, n) => s + nodeSum(n), 0);
    const netWorth = totalAssets - totalDebt;
    const debtRatio = totalAssets ? (totalDebt / totalAssets) * 100 : 0;
    const buyingPower = 560; // tiền được rút theo sức mua (tr)

    // per-account status rows (mock)
    const accStatus = [
      ["Số dư tiền được rút", fmtVnd(560)],
      ["Tiền tối đa được ứng", fmtVnd(1210)],
      ["Dư nợ thực tế", fmtVnd(850)],
      ["RTT", "43%"],
      ["Số tiền cần bổ sung", fmtVnd(0)],
      ["Hạn mức còn lại", fmtVnd(1150)]
    ];

    // product (flat) view: leaves sorted desc by value
    const flatAssets = flattenLeaves(rep.assets, []).filter(n => (n.value || 0) > 0).sort((a, b) => (b.value || 0) - (a.value || 0));
    const flatDebts = flattenLeaves(rep.debts, []).filter(n => (n.value || 0) > 0).sort((a, b) => (b.value || 0) - (a.value || 0));

    const SummaryRow = ({ label, value, info }) => (
      <div className="flex items-center justify-between py-1.5">
        <span className="inline-flex items-center gap-1.5 text-[12.5px] text-on-surface-variant">
          {label}{info && <Icon name="info" size={14} className="text-on-surface-variant/50" />}
        </span>
        <span className="font-mono tabular-nums text-[13.5px] font-semibold text-on-surface">{value}</span>
      </div>
    );

    const ColHead = ({ left }) => (
      <thead>
        <tr className="border-b-2 border-outline-variant/40 text-[11px] uppercase tracking-wider text-on-surface-variant">
          <th className="text-left font-bold py-2 pl-3">{left}</th>
          <th className="text-right font-bold py-2 pr-3">
            <span className="inline-flex items-center gap-1">Giá trị <Icon name="swap_vert" size={14} className="text-on-surface-variant/50" /></span>
          </th>
        </tr>
      </thead>
    );

    const FlatBody = ({ rows }) => (
      <tbody>
        {rows.map((n, i) => (
          <tr key={i} className="border-b border-outline-variant/25 hover:bg-vnd-primary-50/40">
            <td className="py-[9px] pl-3 text-[12.5px] text-on-surface">{n.label}</td>
            <td className="py-[9px] pr-3 text-right font-mono tabular-nums text-[12.5px] text-on-surface">{fmtVnd(n.value || 0)}</td>
          </tr>
        ))}
      </tbody>
    );

    // summary band — left metrics + right (buying power when sub-account) + Nợ/Tài sản
    const SummaryBand = (
      <div className="bg-white rounded-2xl shadow-soft ring-1 ring-vnd-primary-900/5 p-5">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-1">
          <div className="divide-y divide-outline-variant/20">
            <SummaryRow label="Tổng tài sản" info value={fmtVnd(totalAssets)} />
            <SummaryRow label="Tổng nợ" info value={fmtVnd(totalDebt)} />
            <SummaryRow label="Tài sản ròng" info value={fmtVnd(netWorth)} />
          </div>
          <div className={subAccount ? "divide-y divide-outline-variant/20" : ""}>
            {subAccount && <SummaryRow label="Tiền được rút theo sức mua" value={fmtVnd(buyingPower)} />}
            <div className="flex items-center justify-between py-1.5">
              <span className="text-[12.5px] text-on-surface-variant">Nợ / Tài sản</span>
              <span className="font-mono tabular-nums text-[13.5px] font-semibold text-vnd-primary-700">{debtRatio.toFixed(1).replace(/\.0$/, "")}%</span>
            </div>
          </div>
        </div>
      </div>
    );

    // two-column tree card
    const TreeCard = (
      <div className="bg-white rounded-2xl shadow-soft ring-1 ring-vnd-primary-900/5 p-5">
        <div className="flex justify-end mb-2">
          <button onClick={() => setByProduct(v => !v)}
            className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-vnd-primary-700 hover:text-vnd-primary-800">
            <Icon name="swap_horiz" size={16} />
            <span>{byProduct ? "Xem theo Phân lớp" : "Xem theo Sản phẩm"}</span>
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-8">
          <div className="lg:border-r lg:border-outline-variant/30 lg:pr-8">
            <table className="w-full">
              <ColHead left="Tài sản" />
              {byProduct ? <FlatBody rows={flatAssets} /> : <AssetTree nodes={rep.assets} />}
            </table>
          </div>
          <div className="lg:pl-0 mt-6 lg:mt-0">
            <table className="w-full">
              <ColHead left="Nợ" />
              {byProduct ? <FlatBody rows={flatDebts} /> : <AssetTree nodes={rep.debts} />}
            </table>
          </div>
        </div>
      </div>
    );

    // right rail — only on a specific sub-account
    const SideRail = (
      <aside className="space-y-4">
        <div className="bg-white rounded-2xl shadow-soft ring-1 ring-vnd-primary-900/5 p-5">
          <h3 className="text-[11px] uppercase tracking-wider font-bold text-on-surface-variant mb-3">Trạng thái tài khoản</h3>
          <div className="divide-y divide-outline-variant/20">
            {accStatus.map(([k, v], i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <span className="text-[12px] text-on-surface-variant">{k}</span>
                <span className="font-mono tabular-nums text-[12.5px] font-semibold text-on-surface">{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow-soft ring-1 ring-vnd-primary-900/5 p-5">
          <h3 className="text-[11px] uppercase tracking-wider font-bold text-on-surface-variant mb-3">Phân bổ tài sản</h3>
          <div className="flex flex-col items-center gap-4">
            <DonutChart data={ALLOCATION} size={150} thickness={20} centerValue={trToTy(client.nav).split(" ")[0]} centerLabel="NAV" />
            <ul className="w-full space-y-1.5">
              {ALLOCATION.map(a => (
                <li key={a.label} className="flex items-center gap-2 text-[12px]">
                  <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: a.color }}></span>
                  <span className="flex-1 min-w-0 truncate">{a.label}</span>
                  <span className="font-mono text-on-surface-variant">{a.pct}%</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </aside>
    );

    return (
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="bg-white rounded-2xl shadow-soft ring-1 ring-vnd-primary-900/5 px-4 py-3 flex flex-wrap items-center gap-2">
          <div className="relative">
            <select value={account} onChange={(e) => setAccount(e.target.value)}
              className="appearance-none h-9 pl-3 pr-9 rounded-lg text-[13px] bg-white ring-1 ring-outline-variant/60 text-on-surface focus:outline-none focus:ring-vnd-primary-300 min-w-[180px]">
              <option value="all">Tất cả tài khoản</option>
              {accounts.map(no => <option key={no} value={no}>{no}</option>)}
            </select>
            <Icon name="expand_more" size={18} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
          </div>
          <button className="inline-flex items-center gap-2 h-9 px-3 rounded-lg text-[13px] bg-white ring-1 ring-outline-variant/60 text-on-surface-variant hover:bg-surface-container-low">
            <span>Chọn thời gian</span><Icon name="calendar_today" size={15} />
          </button>
          <button className="inline-flex items-center gap-2 h-9 px-3 rounded-lg text-[13px] bg-white ring-1 ring-outline-variant/60 text-on-surface hover:bg-surface-container-low">
            <Icon name="refresh" size={16} /><span>Làm mới</span>
          </button>
          <div className="ml-auto flex items-center gap-2">
            <button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-[13px] font-medium bg-white ring-1 ring-outline-variant/60 text-emerald-700 hover:bg-emerald-50">
              <Icon name="description" size={16} /><span>Xuất excel</span>
            </button>
          </div>
        </div>

        {subAccount ? (
          <div className="space-y-4 min-w-0">{SummaryBand}{TreeCard}</div>
        ) : (
          <>{SummaryBand}{TreeCard}</>
        )}
      </div>
    );
  }
  function PortfolioPanel({ client }) {
    const acc = "0101" + (client.id || "00012345").toString().slice(-6);
    const fmt = (n) => n == null ? "—" : n.toLocaleString("vi-VN");
    const today = "16/06/2026";

    // ---- sample data ----
    const cashRows = [
      { acc, total: 590000000, baseCash: 560000000, derivCash: 0,
        sellPending: 22000000, divPending: 8000000, derivWithdraw: 0, bondReturn: 12000000, otherReturn: 0,
        buyMatch: 10000000, derivDeposit: 0, otherLock: 0 }
    ];
    const secRows = [
      { acc, code: "FPT", type: "Cổ phiếu", total: 8000, maxSell: 8000, costPrice: 69500, costValue: 556000000, mktPrice: 138000, mktValue: 1104000000, pnl: 548000000, pnlPct: 98.6, waitCustody: 0, waitTrade: 0, buyReturn: 0, rightReturn: 0, sellUnmatched: 0, pledge: 0, transferPending: 0, withdrawPending: 0, otherLock: 0 },
      { acc, code: "HPG", type: "Cổ phiếu", total: 12000, maxSell: 12000, costPrice: 27800, costValue: 333600000, mktPrice: 28950, mktValue: 347400000, pnl: 13800000, pnlPct: 4.1, waitCustody: 0, waitTrade: 0, buyReturn: 0, rightReturn: 0, sellUnmatched: 0, pledge: 0, transferPending: 0, withdrawPending: 0, otherLock: 0 },
      { acc, code: "E1VFVN30", type: "CCQ ETF", type2: true, total: 5000, maxSell: 5000, costPrice: 26000, costValue: 130000000, mktPrice: 27400, mktValue: 137000000, pnl: 7000000, pnlPct: 5.4, waitCustody: 0, waitTrade: 0, buyReturn: 0, rightReturn: 0, sellUnmatched: 0, pledge: 0, transferPending: 0, withdrawPending: 0, otherLock: 0 }
    ];
    const bondRows = [
      { acc, code: "DBOND2027", coupon: 8.5, maturity: "15/09/2027", qty: 1800, sellable: 1800, avgPrice: 100000, buyValue: 180000000, curValue: 186300000, custody: "Đã lưu ký" },
      { acc, code: "VBOND2026", coupon: 7.2, maturity: "20/12/2026", qty: 600, sellable: 600, avgPrice: 100000, buyValue: 60000000, curValue: 61450000, custody: "Đã lưu ký" }
    ];

    const TH = ({ children, span, rows, className = "", align = "center" }) => (
      <th colSpan={span} rowSpan={rows}
        className={`border border-outline-variant/40 bg-surface-container-low px-3 py-2 text-[11.5px] font-semibold text-on-surface text-${align} whitespace-nowrap align-middle ${className}`}>{children}</th>
    );
    const TD = ({ children, align = "right", className = "" }) => (
      <td className={`border border-outline-variant/30 px-3 py-2 text-[12px] text-${align} whitespace-nowrap ${className}`}>{children}</td>
    );
    const SectionHead = ({ children }) => (
      <h3 className="text-[12.5px] font-bold uppercase tracking-wide text-amber-700 mb-2.5">{children}</h3>
    );
    const FilterChip = ({ label }) => (
      <div className="relative inline-block mb-2.5">
        <select className="appearance-none h-8 pl-3 pr-8 rounded-lg text-[12px] bg-white ring-1 ring-outline-variant/60 text-on-surface-variant focus:outline-none">
          <option>{label}</option>
        </select>
        <Icon name="expand_more" size={16} className="absolute right-2 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
      </div>
    );

    return (
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="bg-white rounded-2xl shadow-soft ring-1 ring-vnd-primary-900/5 px-4 py-3 flex flex-wrap items-center gap-2">
          <div className="relative">
            <select className="appearance-none h-9 pl-3 pr-9 rounded-lg text-[13px] bg-white ring-1 ring-outline-variant/60 text-on-surface focus:outline-none min-w-[200px]">
              <option>Tất cả các tài khoản</option>
            </select>
            <Icon name="expand_more" size={18} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
          </div>
          <div className="relative">
            <input readOnly value={today}
              className="h-9 pl-3 pr-9 rounded-lg text-[13px] bg-white ring-1 ring-outline-variant/60 text-on-surface focus:outline-none w-[160px]" />
            <Icon name="calendar_today" size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
          </div>
          <div className="relative">
            <select className="appearance-none h-9 pl-3 pr-9 rounded-lg text-[13px] bg-white ring-1 ring-outline-variant/60 text-on-surface-variant focus:outline-none min-w-[180px]">
              <option>Chọn sản phẩm</option>
            </select>
            <Icon name="expand_more" size={18} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
          </div>
          <button className="inline-flex items-center gap-2 h-9 px-3 rounded-lg text-[13px] bg-white ring-1 ring-outline-variant/60 text-on-surface hover:bg-surface-container-low">
            <Icon name="refresh" size={16} /><span>Làm mới</span>
          </button>
        </div>

        {/* Description */}
        <div className="text-[12px] text-on-surface-variant leading-relaxed px-0.5">
          <p>Danh mục hiện tại tổng hợp chi tiết cấu phần từng loại tài sản của Khách hàng tại thời điểm xem báo cáo</p>
          <p>Danh mục được tổng hợp theo trạng thái giao dịch, không thể hiện tính sở hữu với loại hình tài sản của khách hàng</p>
        </div>

        {/* ===== DANH MỤC TIỀN ===== */}
        <div className="bg-white rounded-2xl shadow-soft ring-1 ring-vnd-primary-900/5 p-5">
          <SectionHead>Danh mục tiền</SectionHead>
          <div className="overflow-x-auto scrollbar-thin">
            <table className="border-collapse min-w-[1100px] w-full">
              <thead>
                <tr>
                  <TH rows={2}>Số tài khoản</TH>
                  <TH rows={2}>Tổng tiền</TH>
                  <TH span={2}>Tiền thực có</TH>
                  <TH span={5}>Tiền chờ về</TH>
                  <TH span={3}>Tiền phong tỏa</TH>
                </tr>
                <tr>
                  <TH>Số dư tiền tài khoản cơ sở</TH>
                  <TH>Số dư tiền tài khoản phái sinh</TH>
                  <TH>Bán chờ về</TH>
                  <TH>Cổ tức chờ về</TH>
                  <TH>Chờ rút ký quỹ phái sinh</TH>
                  <TH>Chờ về trái phiếu</TH>
                  <TH>Chờ về khác</TH>
                  <TH>Mua chờ khớp</TH>
                  <TH>Chờ nộp ký quỹ phái sinh</TH>
                  <TH>Phong tỏa khác</TH>
                </tr>
              </thead>
              <tbody>
                {cashRows.map((r, i) => (
                  <tr key={i} className="hover:bg-surface-container-low/50">
                    <TD align="left" className="font-mono">{r.acc}</TD>
                    <TD className="font-mono font-semibold">{fmt(r.total)}</TD>
                    <TD className="font-mono">{fmt(r.baseCash)}</TD>
                    <TD className="font-mono">{fmt(r.derivCash)}</TD>
                    <TD className="font-mono">{fmt(r.sellPending)}</TD>
                    <TD className="font-mono">{fmt(r.divPending)}</TD>
                    <TD className="font-mono">{fmt(r.derivWithdraw)}</TD>
                    <TD className="font-mono">{fmt(r.bondReturn)}</TD>
                    <TD className="font-mono">{fmt(r.otherReturn)}</TD>
                    <TD className="font-mono">{fmt(r.buyMatch)}</TD>
                    <TD className="font-mono">{fmt(r.derivDeposit)}</TD>
                    <TD className="font-mono">{fmt(r.otherLock)}</TD>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ===== DANH MỤC CHỨNG KHOÁN CƠ SỞ ===== */}
        <div className="bg-white rounded-2xl shadow-soft ring-1 ring-vnd-primary-900/5 p-5">
          <SectionHead>Danh mục chứng khoán cơ sở (cổ phiếu, chứng chỉ quỹ đóng)</SectionHead>
          <FilterChip label="Mã chứng khoán" />
          <div className="overflow-x-auto scrollbar-thin">
            <table className="border-collapse min-w-[1900px] w-full">
              <thead>
                <tr>
                  <TH rows={2}>Số tài khoản</TH>
                  <TH rows={2}>Mã CK</TH>
                  <TH rows={2}>Loại CK</TH>
                  <TH rows={2}>Tổng SLCK</TH>
                  <TH rows={2}>SLCK tối đa được bán</TH>
                  <TH rows={2}>Giá vốn</TH>
                  <TH rows={2}>Giá trị vốn</TH>
                  <TH rows={2}>Giá thị trường</TH>
                  <TH rows={2}>Giá trị thị trường</TH>
                  <TH rows={2}>Lãi/Lỗ</TH>
                  <TH rows={2}>% Lãi/Lỗ</TH>
                  <TH rows={2}>SLCK chờ lưu ký</TH>
                  <TH rows={2}>SLCK chờ giao dịch</TH>
                  <TH span={2}>SLCK chờ về</TH>
                  <TH span={5}>SLCK phong tỏa</TH>
                </tr>
                <tr>
                  <TH>SLCK mua chờ về</TH>
                  <TH>SLCK hưởng quyền chờ về</TH>
                  <TH>SLCK bán chưa khớp</TH>
                  <TH>SLCK cầm cố</TH>
                  <TH>SLCK chờ chuyển</TH>
                  <TH>SLCK chờ rút</TH>
                  <TH>SLCK phong tỏa khác</TH>
                </tr>
              </thead>
              <tbody>
                {secRows.map((r, i) => (
                  <tr key={i} className="hover:bg-surface-container-low/50">
                    <TD align="left" className="font-mono">{r.acc}</TD>
                    <TD align="left" className="font-semibold text-vnd-primary-700">{r.code}</TD>
                    <TD align="left">{r.type}</TD>
                    <TD className="font-mono">{fmt(r.total)}</TD>
                    <TD className="font-mono">{fmt(r.maxSell)}</TD>
                    <TD className="font-mono">{fmt(r.costPrice)}</TD>
                    <TD className="font-mono">{fmt(r.costValue)}</TD>
                    <TD className="font-mono">{fmt(r.mktPrice)}</TD>
                    <TD className="font-mono">{fmt(r.mktValue)}</TD>
                    <TD className={`font-mono font-semibold ${r.pnl >= 0 ? "text-emerald-600" : "text-red-600"}`}>{r.pnl >= 0 ? "+" : ""}{fmt(r.pnl)}</TD>
                    <TD className={`font-mono font-semibold ${r.pnl >= 0 ? "text-emerald-600" : "text-red-600"}`}>{r.pnl >= 0 ? "+" : ""}{r.pnlPct}%</TD>
                    <TD className="font-mono">{fmt(r.waitCustody)}</TD>
                    <TD className="font-mono">{fmt(r.waitTrade)}</TD>
                    <TD className="font-mono">{fmt(r.buyReturn)}</TD>
                    <TD className="font-mono">{fmt(r.rightReturn)}</TD>
                    <TD className="font-mono">{fmt(r.sellUnmatched)}</TD>
                    <TD className="font-mono">{fmt(r.pledge)}</TD>
                    <TD className="font-mono">{fmt(r.transferPending)}</TD>
                    <TD className="font-mono">{fmt(r.withdrawPending)}</TD>
                    <TD className="font-mono">{fmt(r.otherLock)}</TD>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-end justify-between mt-2.5 gap-3">
            <p className="text-[11.5px] italic text-on-surface-variant">Số lượng cổ tức, cổ phiếu đã về tài khoản, được phép giao dịch. Khi bán sẽ chịu thuế TNCN 5%</p>
            <button disabled className="text-[12px] text-on-surface-variant/40 cursor-not-allowed whitespace-nowrap shrink-0">Xem thêm</button>
          </div>
        </div>

        {/* ===== DANH MỤC TRÁI PHIẾU VBOND ===== */}
        <div className="bg-white rounded-2xl shadow-soft ring-1 ring-vnd-primary-900/5 p-5">
          <SectionHead>Danh mục trái phiếu VBond</SectionHead>
          <FilterChip label="Mã trái phiếu" />
          <div className="overflow-x-auto scrollbar-thin">
            <table className="border-collapse min-w-[1100px] w-full">
              <thead>
                <tr>
                  <TH>Số tài khoản</TH>
                  <TH>Mã VBond</TH>
                  <TH>Lãi suất coupon trái phiếu (%/năm)</TH>
                  <TH>Ngày đáo hạn</TH>
                  <TH>SLTP</TH>
                  <TH>SLTP có thể bán</TH>
                  <TH>Giá mua bình quân</TH>
                  <TH>Giá trị mua</TH>
                  <TH>Giá trị hiện tại</TH>
                  <TH>Trạng thái lưu ký</TH>
                </tr>
              </thead>
              <tbody>
                {bondRows.map((r, i) => (
                  <tr key={i} className="hover:bg-surface-container-low/50">
                    <TD align="left" className="font-mono">{r.acc}</TD>
                    <TD align="left" className="font-semibold text-vnd-primary-700">{r.code}</TD>
                    <TD className="font-mono">{r.coupon}%</TD>
                    <TD align="center" className="font-mono">{r.maturity}</TD>
                    <TD className="font-mono">{fmt(r.qty)}</TD>
                    <TD className="font-mono">{fmt(r.sellable)}</TD>
                    <TD className="font-mono">{fmt(r.avgPrice)}</TD>
                    <TD className="font-mono">{fmt(r.buyValue)}</TD>
                    <TD className="font-mono">{fmt(r.curValue)}</TD>
                    <TD align="center"><Badge tone="green" size="xs">{r.custody}</Badge></TD>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-end justify-between mt-2.5 gap-3">
            <p className="text-[11.5px] italic text-on-surface-variant">Số tiền lãi dự tính đến ngày hiện tại là tổng tiền lãi coupon của mã trái phiếu của tất cả giao dịch tính đến ngày báo cáo, chưa khấu trừ các chi phí về phí giao dịch và thuế từ lãi coupon</p>
            <button disabled className="text-[12px] text-on-surface-variant/40 cursor-not-allowed whitespace-nowrap shrink-0">Xem thêm</button>
          </div>
        </div>
      </div>
    );
  }
  function GrowthPanel() {
    const d = CP_DATA;
    return (
      <CPCard title="Báo cáo tăng trưởng tài sản" sub="NAV 12 tháng gần nhất" icon="show_chart"
        action={<span className="font-mono text-[12px] text-emerald-700 font-semibold">+25.2% YoY</span>}>
        <BarChart data={d.navSeries.map((v, i) => ({ value: v, label: "T" + (i + 1), highlight: i === d.navSeries.length - 1 }))} height={200} format={(v) => trToTy(v)} />
      </CPCard>
    );
  }
  function BalanceSheetPanel({ client }) {
    const d = CP_DATA, s = sums(client);
    const assets = [
      { k: "Chứng khoán tại VNDS", v: client.nav },
      { k: "Tiền & tương đương", v: 612 },
      { k: "Tài sản ngoài VNDS", v: s.heldAwaySum }
    ];
    const debts = [
      { k: "Dư nợ margin", v: d.debt.marginUsed },
      { k: "Lãi & phí", v: 18 }
    ];
    const totalA = assets.reduce((x, y) => x + y.v, 0), totalD = debts.reduce((x, y) => x + y.v, 0);
    return (
      <div className="grid grid-cols-12 gap-4">
        <CPCard title="Tài sản" icon="trending_up" className="col-span-12 lg:col-span-6">
          {assets.map((a, i) => <KVRow key={i} label={a.k} value={trToTy(a.v)} />)}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-outline-variant/40">
            <span className="text-[12.5px] font-semibold">Tổng tài sản</span>
            <span className="font-mono font-bold text-emerald-700">{trToTy(totalA)}</span>
          </div>
        </CPCard>
        <CPCard title="Nợ phải trả" icon="trending_down" className="col-span-12 lg:col-span-6">
          {debts.map((a, i) => <KVRow key={i} label={a.k} value={trToTy(a.v)} />)}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-outline-variant/40">
            <span className="text-[12.5px] font-semibold">Tổng nợ</span>
            <span className="font-mono font-bold text-red-700">{trToTy(totalD)}</span>
          </div>
          <div className="mt-3 rounded-xl bg-vnd-primary-900 text-white px-4 py-3 flex items-center justify-between">
            <span className="text-[12px] text-white/80">Net worth</span>
            <span className="font-display font-bold text-title-lg font-mono">{trToTy(totalA - totalD)}</span>
          </div>
        </CPCard>
      </div>
    );
  }

  // ===== Chứng khoán =====
  function SecBalancePanel() {
    const holdings = [
      { code: "FPT", name: "FPT Corporation", qty: "4,200", price: "132.5", value: "556.5 tr", pnl: "+18.4%", up: true },
      { code: "HPG", name: "Hoà Phát Group", qty: "12,000", price: "27.8", value: "333.6 tr", pnl: "+6.2%", up: true },
      { code: "MWG", name: "Thế Giới Di Động", qty: "3,500", price: "61.2", value: "214.2 tr", pnl: "−2.1%", up: false },
      { code: "VNM", name: "Vinamilk", qty: "2,800", price: "68.0", value: "190.4 tr", pnl: "+1.5%", up: true }
    ];
    return (
      <CPCard title="Báo cáo số dư chứng khoán" sub="Danh mục nắm giữ tại VNDS" icon="inventory">
        <MiniTable
          head={[{ label: "Mã" }, { label: "Tên" }, { label: "KL", align: "right" }, { label: "Giá", align: "right" }, { label: "Giá trị", align: "right" }, { label: "Lãi/lỗ", align: "right" }]}
          rows={holdings.map((h, i) => (
            <tr key={i} className="hover:bg-surface-container-low">
              <td className="py-2.5 px-2 font-mono font-bold text-vnd-primary-900">{h.code}</td>
              <td className="px-2 text-on-surface-variant">{h.name}</td>
              <td className="px-2 text-right font-mono">{h.qty}</td>
              <td className="px-2 text-right font-mono">{h.price}</td>
              <td className="px-2 text-right font-mono font-semibold">{h.value}</td>
              <td className={`px-2 text-right font-mono font-semibold ${h.up ? "text-emerald-700" : "text-red-700"}`}>{h.pnl}</td>
            </tr>
          ))}
        />
      </CPCard>
    );
  }
  function SecAccountPanel() {
    const acc = CP_DATA.hsCaNhan.baseAccounts[0];
    return (
      <CPCard title="Tài khoản giao dịch chứng khoán" sub="Thông tin & sức mua" icon="account_balance">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
          <KVTile label="Sức mua khả dụng" value="1.21 tỷ" tone="blue" />
          <KVTile label="Tiền mặt" value="612 tr" tone="green" />
          <KVTile label="Hạn mức margin" value="2 tỷ" tone="neutral" />
          <KVTile label="Margin đã dùng" value="850 tr" tone="amber" />
        </div>
        <KVRow label="Số tài khoản" value={<span className="font-mono">{acc.no}</span>} />
        <KVRow label="Loại tài khoản" value={acc.type} />
        <KVRow label="Gói dịch vụ" value={acc.pkg} />
        <KVRow label="Trạng thái" value={<Badge tone="green" size="sm">{acc.status}</Badge>} />
        <KVRow label="Ngày kích hoạt" value={<span className="font-mono">{acc.activatedAt}</span>} />
      </CPCard>
    );
  }

  // ===== Tiền =====
  function CashStatementPanel() {
    const d = CP_DATA.cashStatement;
    return (
      <CPCard title="Sao kê tiền" sub="Dòng tiền vào/ra tài khoản" icon="receipt_long">
        <MiniTable
          head={[{ label: "Ngày" }, { label: "Diễn giải" }, { label: "Số tiền", align: "right" }, { label: "Số dư", align: "right" }]}
          rows={d.map((r, i) => (
            <tr key={i} className="hover:bg-surface-container-low">
              <td className="py-2.5 px-2 font-mono text-on-surface-variant whitespace-nowrap">{r.d}</td>
              <td className="px-2">{r.desc}</td>
              <td className={`px-2 text-right font-mono font-semibold ${r.flow === "in" ? "text-emerald-700" : "text-red-700"}`}>{r.amt}</td>
              <td className="px-2 text-right font-mono text-on-surface-variant">{r.bal}</td>
            </tr>
          ))}
        />
      </CPCard>
    );
  }
  function CashFlowPanel() {
    const d = CP_DATA.cashFlow;
    return (
      <CPCard title="Lịch dòng tiền" sub="Sự kiện dòng tiền dự kiến" icon="calendar_month">
        <ul className="space-y-2">
          {d.map((c, i) => (
            <li key={i} className="flex items-center gap-3 p-3 rounded-xl ring-1 ring-outline-variant/30">
              <span className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${c.flow === "in" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}><Icon name={c.icon} size={17} /></span>
              <div className="flex-1 min-w-0">
                <p className="text-[12.5px] font-semibold">{c.label}</p>
                <p className="text-[11px] text-on-surface-variant font-mono">{c.d}</p>
              </div>
              <span className={`font-mono text-[13px] font-bold ${c.flow === "in" ? "text-emerald-700" : "text-red-700"}`}>{c.amt}</span>
            </li>
          ))}
        </ul>
      </CPCard>
    );
  }

  // ===== Nợ =====
  function DebtStatusPanel() {
    const fmt = (n) => n.toLocaleString("vi-VN");
    const acc = "0000122929";
    const groups = [
      { label: "Tiền", rows: [
        { desc: "Tiền mặt", tsdb: 300000000, mkt: 200000000, total: 300000000, loanRatio: 0.03, tsdbRatio: 0.05, tsdbPrice: 450000000, totalTsdb: 1000000000 },
        { desc: "Số tiền tạm giữ", tsdb: 300000000, mkt: 200000000, total: 300000000, loanRatio: 0.03, tsdbRatio: 0.05, tsdbPrice: 450000000, totalTsdb: 1000000000 }
      ] },
      { label: "Nợ", rows: [
        { desc: "Số tiền tạm giữ", tsdb: 300000000, mkt: 200000000, total: 300000000, loanRatio: 0.03, tsdbRatio: 0.05, tsdbPrice: 450000000, totalTsdb: 1000000000 }
      ] },
      { label: "Chứng khoán", rows: [
        { desc: "Số tiền tạm giữ", tsdb: 300000000, mkt: 200000000, total: 300000000, loanRatio: 0.03, tsdbRatio: 0.05, tsdbPrice: 450000000, totalTsdb: 1000000000 },
        { desc: "Số tiền tạm giữ", tsdb: 300000000, mkt: 200000000, total: 300000000, loanRatio: 0.03, tsdbRatio: 0.05, tsdbPrice: 450000000, totalTsdb: 1000000000 },
        { desc: "Số tiền tạm giữ", tsdb: 300000000, mkt: 200000000, total: 300000000, loanRatio: 0.03, tsdbRatio: 0.05, tsdbPrice: 450000000, totalTsdb: 1000000000 },
        { desc: "Số tiền tạm giữ", tsdb: 300000000, mkt: 200000000, total: 300000000, loanRatio: 0.03, tsdbRatio: 0.05, tsdbPrice: 450000000, totalTsdb: 1000000000 }
      ] }
    ];
    const grandMkt = 2100000000, grandTsdb = 7000000000;
    const cols = ["Số tài khoản", "Diễn giải", "Tài sản đảm bảo", "Giá thị trường", "Tổng giá trị", "Tỉ lệ cho vay", "Tỉ lệ tính TSđB", "Giá tính TSđB", "Tổng TS đảm bảo"];

    return (
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="bg-white rounded-2xl shadow-soft ring-1 ring-vnd-primary-900/5 px-4 py-3">
          <div className="flex flex-wrap items-end gap-3">
            <div>
              <label className="block text-[11.5px] font-medium text-on-surface-variant mb-1">Tài khoản</label>
              <div className="relative">
                <select className="appearance-none h-9 pl-3 pr-9 rounded-lg text-[13px] bg-white ring-1 ring-outline-variant/60 text-on-surface focus:outline-none min-w-[200px]">
                  <option>2827389112</option>
                </select>
                <Icon name="expand_more" size={18} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-[11.5px] font-medium text-on-surface-variant mb-1">Thời gian</label>
              <div className="relative">
                <input readOnly value="08/12/2023"
                  className="h-9 pl-3 pr-9 rounded-lg text-[13px] bg-white ring-1 ring-outline-variant/60 text-on-surface focus:outline-none w-[170px]" />
                <Icon name="calendar_today" size={16} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
              </div>
            </div>
            <div className="relative">
              <Icon name="search" size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none" />
              <input placeholder="Tìm kiếm nội dung diễn giải"
                className="h-9 pl-9 pr-3 rounded-lg text-[13px] bg-white ring-1 ring-outline-variant/60 text-on-surface focus:outline-none w-[240px]" />
            </div>
            <button className="inline-flex items-center gap-2 h-9 px-3 rounded-lg text-[13px] bg-white ring-1 ring-vnd-warning/50 text-vnd-warning hover:bg-amber-50">
              <Icon name="refresh" size={16} /><span>Làm mới</span>
            </button>
            <div className="ml-auto flex items-center gap-2">
              <button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-[13px] font-medium bg-white ring-1 ring-outline-variant/60 text-emerald-700 hover:bg-emerald-50">
                <Icon name="description" size={16} /><span>Xuất excel</span>
              </button>
              <button className="inline-flex items-center gap-1.5 h-9 px-3 rounded-lg text-[13px] font-medium bg-white ring-1 ring-outline-variant/60 text-red-600 hover:bg-red-50">
                <Icon name="picture_as_pdf" size={16} /><span>Xuất PDF</span>
              </button>
              <button className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg text-[13px] font-semibold bg-vnd-warning text-white hover:brightness-95">
                <Icon name="mail" size={16} /><span>Gửi email</span>
              </button>
            </div>
          </div>
          {/* Summary */}
          <div className="mt-3 space-y-0.5 text-[12.5px]">
            <div className="flex"><span className="text-on-surface-variant w-[160px]">Tỉ lệ thực tế(%):</span><span className="font-mono">102.2</span></div>
            <div className="flex"><span className="text-on-surface-variant w-[160px]">Tổng giá trị TSĐB (VND):</span><span className="font-mono">1,123,234,567</span></div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-soft ring-1 ring-vnd-primary-900/5 overflow-hidden">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="min-w-[1100px] w-full text-[12.5px]">
              <thead>
                <tr className="bg-surface-container-low text-on-surface">
                  {cols.map((c, i) => (
                    <th key={i} className={`px-3 py-2.5 font-semibold whitespace-nowrap ${i < 2 ? "text-left" : "text-right"}`}>{c}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {groups.map((g, gi) => (
                  <React.Fragment key={gi}>
                    <tr className="bg-surface-container-high/70">
                      <td colSpan={cols.length} className="px-3 py-2 font-semibold text-on-surface">{g.label}</td>
                    </tr>
                    {g.rows.map((r, ri) => (
                      <tr key={ri} className="border-t border-outline-variant/30 hover:bg-surface-container-low/50">
                        <td className="px-3 py-2.5 font-mono whitespace-nowrap">{acc}</td>
                        <td className="px-3 py-2.5">{r.desc}</td>
                        <td className="px-3 py-2.5 text-right font-mono">{fmt(r.tsdb)}</td>
                        <td className="px-3 py-2.5 text-right font-mono">{fmt(r.mkt)}</td>
                        <td className="px-3 py-2.5 text-right font-mono">{fmt(r.total)}</td>
                        <td className="px-3 py-2.5 text-right font-mono">{r.loanRatio}</td>
                        <td className="px-3 py-2.5 text-right font-mono">{r.tsdbRatio}</td>
                        <td className="px-3 py-2.5 text-right font-mono">{fmt(r.tsdbPrice)}</td>
                        <td className="px-3 py-2.5 text-right font-mono">{fmt(r.totalTsdb)}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
                <tr className="border-t-2 border-outline-variant/50 font-semibold">
                  <td className="px-3 py-2.5">Tổng cộng</td>
                  <td></td>
                  <td></td>
                  <td className="px-3 py-2.5 text-right font-mono">{fmt(grandMkt)}</td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td className="px-3 py-2.5 text-right font-mono">{fmt(grandTsdb)}</td>
                </tr>
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex items-center justify-end gap-4 px-4 py-3 border-t border-outline-variant/30 text-[12.5px] text-on-surface-variant">
            <span>Tổng 70 đơn</span>
            <div className="flex items-center gap-1">
              <button className="w-7 h-7 rounded-md hover:bg-surface-container-low flex items-center justify-center"><Icon name="chevron_left" size={16} /></button>
              {[8, 9, 10, 11, 12].map((p, i) => (
                <button key={p} className={`min-w-[28px] h-7 px-1.5 rounded-md text-[12.5px] ${i === 0 ? "ring-1 ring-vnd-warning text-vnd-warning font-semibold" : "hover:bg-surface-container-low"}`}>{p}</button>
              ))}
              <span className="px-1">…</span>
              <button className="w-7 h-7 rounded-md hover:bg-surface-container-low flex items-center justify-center"><Icon name="chevron_right" size={16} /></button>
            </div>
            <div className="relative">
              <select className="appearance-none h-7 pl-2.5 pr-7 rounded-md text-[12.5px] bg-white ring-1 ring-outline-variant/60 focus:outline-none">
                <option>10 / trang</option>
              </select>
              <Icon name="expand_more" size={15} className="absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  function DebtReportPanel() {
    const dd = CP_DATA.debtDetail;
    const total = "867.9 tr";
    return (
      <CPCard title="Báo cáo nợ" sub="Chi tiết dư nợ theo cấu phần" icon="summarize">
        {dd.outstanding.map((o, i) => <KVRow key={i} label={o.k} value={o.v} />)}
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-outline-variant/40">
          <span className="text-[12.5px] font-semibold">Tổng dư nợ</span>
          <span className="font-mono font-bold text-red-700">{total}</span>
        </div>
      </CPCard>
    );
  }
  function DebtStatementPanel() {
    const dd = CP_DATA.debtDetail;
    return (
      <CPCard title="Sao kê nợ" sub="Lịch sử ghi nợ / trả nợ" icon="receipt_long">
        <MiniTable
          head={[{ label: "Ngày" }, { label: "Diễn giải" }, { label: "Ghi nợ", align: "right" }, { label: "Trả nợ", align: "right" }, { label: "Dư nợ", align: "right" }]}
          rows={dd.statement.map((r, i) => (
            <tr key={i} className="hover:bg-surface-container-low">
              <td className="py-2.5 px-2 font-mono text-on-surface-variant whitespace-nowrap">{r.d}</td>
              <td className="px-2">{r.desc}</td>
              <td className="px-2 text-right font-mono text-red-700">{r.debit}</td>
              <td className="px-2 text-right font-mono text-emerald-700">{r.credit}</td>
              <td className="px-2 text-right font-mono font-semibold">{r.bal}</td>
            </tr>
          ))}
        />
      </CPCard>
    );
  }
  function InterestPanel() {
    const d = CP_DATA.debt;
    return (
      <CPCard title="Bảng kê lãi vay" sub="Lãi margin theo kỳ" icon="percent">
        <MiniTable
          head={[{ label: "Ngày" }, { label: "Diễn giải" }, { label: "Lãi", align: "right" }]}
          rows={d.statements.map((r, i) => (
            <tr key={i} className="hover:bg-surface-container-low">
              <td className="py-2.5 px-2 font-mono text-on-surface-variant whitespace-nowrap">{r.d}</td>
              <td className="px-2">{r.desc}</td>
              <td className="px-2 text-right font-mono font-semibold text-red-700">{r.amt}</td>
            </tr>
          ))}
        />
      </CPCard>
    );
  }

  // ===== Hiệu suất =====
  function RealizedPanel() {
    const perf = CP_DATA.performance;
    return (
      <CPCard title="Lãi lỗ đã thực hiện" sub="P&L realized · ROI · vs benchmark" icon="leaderboard">
        <div className="grid grid-cols-3 gap-3 mb-5">
          <KVTile label="Realized P&L" value={`+${trToTy(perf.realized)}`} tone="green" />
          <KVTile label="Unrealized P&L" value={`+${trToTy(perf.unrealized)}`} tone="green" />
          <KVTile label="ROI tích luỹ" value={`+${perf.cumulativeRoi}%`} tone="blue" />
        </div>
        <div className="flex items-center justify-between mb-1">
          <CPLabel>Danh mục vs VN-Index (12T)</CPLabel>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="inline-flex items-center gap-1.5"><span className="w-4 h-0.5 bg-vnd-primary-500 inline-block"></span>Danh mục</span>
            <span className="inline-flex items-center gap-1.5"><span className="w-4 h-0 border-t border-dashed border-on-surface-variant inline-block"></span>VN-Index</span>
          </div>
        </div>
        <LineCompare a={perf.portfolioSeries} b={perf.benchSeries} height={170} />
        <p className="text-[12px] text-on-surface-variant mt-1">Vượt benchmark <span className="font-semibold text-emerald-700">+{(perf.portfolioSeries.at(-1) - perf.benchSeries.at(-1)).toFixed(0)}pp</span> trong 12 tháng.</p>
      </CPCard>
    );
  }
  function AssetEventsPanel() {
    const ca = CP_DATA.corporateActions;
    return (
      <CPCard title="Lịch sự kiện" sub="Sự kiện ảnh hưởng tài sản (cổ tức · quyền)" icon="event">
        <CPLabel className="mb-2">Sắp diễn ra</CPLabel>
        <ul className="space-y-2 mb-4">
          {ca.upcoming.map((c, i) => (
            <li key={i} className="flex items-center gap-3 p-3 rounded-xl ring-1 ring-amber-100 bg-amber-50/40">
              <span className="w-9 h-9 rounded-lg bg-white text-amber-700 flex items-center justify-center shrink-0 ring-1 ring-amber-200"><Icon name={c.icon} size={17} /></span>
              <div className="flex-1 min-w-0">
                <p className="text-[12.5px] font-semibold"><span className="font-mono">{c.code}</span> · {c.type}</p>
                <p className="text-[11px] text-on-surface-variant truncate">{c.detail}</p>
              </div>
              <span className="font-mono text-[11.5px] font-semibold text-amber-700">{c.d}</span>
            </li>
          ))}
        </ul>
        <CPLabel className="mb-2">Đã thực hiện</CPLabel>
        <ul className="space-y-1.5">
          {ca.history.map((c, i) => (
            <li key={i} className="flex items-center justify-between gap-2 py-1.5 border-b border-outline-variant/20 last:border-0">
              <span className="text-[12px]"><span className="font-mono font-semibold">{c.code}</span> · {c.type}</span>
              <span className="text-[11px] text-on-surface-variant">{c.detail}</span>
            </li>
          ))}
        </ul>
      </CPCard>
    );
  }

  function TabDaccount({ client }) {
    const ProfileLayout = window.ProfileLayout;
    const groups = [
      { id: "ov", label: "Tổng quan", icon: "dashboard", items: [
        { id: "ov:report", label: "Báo cáo tài sản", icon: "account_balance_wallet" },
        { id: "ov:portfolio", label: "Danh mục tài sản", icon: "donut_small" }
      ] },
      { id: "debt", label: "Nợ", icon: "credit_card", items: [
        { id: "debt:status", label: "Báo cáo trạng thái tài khoản nợ", icon: "health_and_safety" }
      ] }
    ];
    const [active, setActive] = useState("ov:report");
    const render = () => {
      switch (active) {
        case "ov:report": return <AssetReportPanel client={client} />;
        case "ov:portfolio": return <PortfolioPanel client={client} />;
        case "ov:growth": return <GrowthPanel />;
        case "ov:balance": return <BalanceSheetPanel client={client} />;
        case "sec:balance": return <SecBalancePanel />;
        case "sec:account": return <SecAccountPanel />;
        case "cash:statement": return <CashStatementPanel />;
        case "cash:flow": return <CashFlowPanel />;
        case "debt:status": return <DebtStatusPanel />;
        case "debt:report": return <DebtReportPanel />;
        case "debt:statement": return <DebtStatementPanel />;
        case "debt:interest": return <InterestPanel />;
        case "perf:realized": return <RealizedPanel />;
        case "perf:events": return <AssetEventsPanel />;
        default: return null;
      }
    };
    return <ProfileLayout groups={groups} value={active} onChange={setActive}>{render()}</ProfileLayout>;
  }

  Object.assign(window, {
    AssetReportPanel, PortfolioPanel, GrowthPanel, BalanceSheetPanel,
    SecBalancePanel, SecAccountPanel, CashStatementPanel, CashFlowPanel,
    DebtStatusPanel, DebtReportPanel, DebtStatementPanel, InterestPanel,
    RealizedPanel, AssetEventsPanel
  });
  window.TabDaccount = TabDaccount;
})();
