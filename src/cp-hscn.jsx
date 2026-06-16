/* global React, window */
// ============== DGO › HỒ SƠ CÁ NHÂN (4 nested tabs) ==============
// Thông tin cơ bản · Danh sách tài khoản · Danh sách uỷ quyền · Tài khoản thụ hưởng
// Report-style layouts (matching production screens) refined to the DSB system.
(function () {
  const { CP_DATA } = window.DSB_DATA;
  const NA = <span className="text-on-surface-variant/55 italic font-normal">Chưa có thông tin</span>;

  // ---- reusable report table ----
  function ReportTable({ title, icon, columns, rows, searchKey, searchPlaceholder = "Tìm kiếm", empty, action }) {
    const [q, setQ] = useState("");
    const filtered = !q || !searchKey ? rows : rows.filter(r => String(r[searchKey] || "").toLowerCase().includes(q.toLowerCase()));
    return (
      <section className="bg-white rounded-2xl shadow-soft ring-1 ring-vnd-primary-900/5 overflow-hidden">
        <header className="flex items-center justify-between gap-3 px-5 pt-4 pb-3">
          <div className="flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-vnd-primary-50 text-vnd-primary-700 flex items-center justify-center"><Icon name={icon} size={18} /></span>
            <h3 className="font-display text-title-md text-vnd-primary-900">{title}</h3>
            <span className="text-[11px] font-bold rounded-full px-2 py-0.5 bg-surface-container-high text-on-surface-variant">{rows.length}</span>
          </div>
          {action}
        </header>
        {searchKey && (
          <div className="px-5 pb-3">
            <div className="max-w-xs">
              <TextField icon="search" placeholder={searchPlaceholder} value={q} onChange={(e) => setQ(e.target.value)} />
            </div>
          </div>
        )}
        <div className="overflow-x-auto scrollbar-thin">
          {filtered.length === 0 ? (
            <Empty icon={empty?.icon || "inbox"} title={empty?.title || "No Data"} sub={empty?.sub} />
          ) : (
            <table className="w-full text-[12.5px] border-t border-outline-variant/30">
              <thead className="bg-surface-container-low/70 text-[10.5px] uppercase tracking-wide text-on-surface-variant">
                <tr>
                  {columns.map((c, i) => (
                    <th key={i} className={`font-semibold py-2.5 px-3 whitespace-nowrap ${c.align === "center" ? "text-center" : c.align === "right" ? "text-right" : "text-left"} ${c.thClassName || ""}`}>{c.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20">
                {filtered.map((r, ri) => (
                  <tr key={ri} className="hover:bg-vnd-primary-50/30 transition-colors">
                    {columns.map((c, ci) => (
                      <td key={ci} className={`py-2.5 px-3 align-middle ${c.align === "center" ? "text-center" : c.align === "right" ? "text-right" : "text-left"} ${c.tdClassName || ""}`}>
                        {c.render ? c.render(r, ri) : r[c.key]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </section>
    );
  }

  const statusBadge = (v, tone = "green") => <Badge tone={tone} size="sm">{v}</Badge>;
  const idxCol = { label: "#", align: "center", thClassName: "w-10", tdClassName: "text-on-surface-variant font-mono", render: (_r, i) => i + 1 };
  const actionCol = {
    label: "Thao tác", align: "center", thClassName: "w-24",
    render: () => (
      <div className="inline-flex items-center gap-1">
        <button className="w-7 h-7 rounded-md text-on-surface-variant hover:bg-surface-container-high hover:text-vnd-primary-700 flex items-center justify-center" title="Xem chi tiết"><Icon name="visibility" size={16} /></button>
        <button className="w-7 h-7 rounded-md text-on-surface-variant hover:bg-surface-container-high hover:text-vnd-primary-700 flex items-center justify-center" title="Thêm"><Icon name="more_horiz" size={16} /></button>
      </div>
    )
  };
  const accountColumns = [
    idxCol,
    { label: "Số tài khoản", render: (r) => <span className="font-mono font-semibold text-vnd-primary-900">{r.no}</span> },
    { label: "Loại TK giao dịch", key: "type" },
    { label: "Gói tài khoản", render: (r) => <span className="text-on-surface">{r.pkg}</span> },
    { label: "NVCS", render: (r) => <span className="font-mono text-on-surface-variant">{r.nvcs}</span> },
    { label: "TT tài khoản", align: "center", render: (r) => statusBadge(r.status, "green") },
    { label: "Trạng thái VSD", align: "center", render: (r) => r.vsd === "—" ? <span className="text-on-surface-variant">—</span> : statusBadge(r.vsd, "blue") },
    { label: "TT hoàn thiện", align: "center", render: (r) => statusBadge(r.done, "green") },
    { label: "Ngày activate TK", render: (r) => <span className="font-mono text-on-surface-variant whitespace-nowrap">{r.activatedAt}</span> },
    { label: "Ngày khởi tạo TK", render: (r) => <span className="font-mono text-on-surface-variant whitespace-nowrap">{r.createdAt}</span> },
    actionCol
  ];

  // ===== TAB 1 · Thông tin cơ bản =====
  function TabBasic({ client }) {
    const d = CP_DATA.hsCaNhan;
    const id = d.identity, addr = d.address, sys = d.system;
    const fmtDob = (s) => { if (!s) return NA; const [y, m, dd] = s.split("-"); return `${dd}/${m}/${y}`; };
    const sb = (o) => o?.state === "ok" ? <Badge tone="green" size="sm" icon="check">{o.v}</Badge> : <span className="font-medium">{o?.v || ""}</span>;
    return (
      <div>
        <div className="flex items-center justify-end mb-3">
          <Button tone="outline" size="sm" icon="download">Tải hợp đồng</Button>
        </div>
        <div className="grid grid-cols-12 gap-4">
          <CPCard title="Định danh khách hàng" icon="badge" className="col-span-12 lg:col-span-5">
            <KVRow label="Tên khách hàng" value={<span className="font-semibold">{client.name}</span>} />
            <KVRow label="Loại KH" value="Cá nhân trong nước" />
            <KVRow label="Quốc tịch" value="Việt Nam" />
            <KVRow label="Giới tính / Loại hình" value={client.gender} />
            <KVRow label="Ngày tháng năm sinh" value={fmtDob(client.dob)} />
            <KVRow label="CMND / CCCD / Hộ chiếu" value={<span className="font-mono">{client.cccd}</span>} />
            <KVRow label="Ngày cấp" value={id.idIssueDate} />
            <KVRow label="Nơi cấp" value={id.idIssuePlace} />
            <KVRow label="Ngày hết hạn" value={id.idExpiry} />
            <KVRow label="Email" value={client.email} />
            <KVRow label="SĐT di động" value={<span className="font-mono">{client.phone}</span>} />
            <KVRow label="SĐT cố định" value={id.landline || NA} />
          </CPCard>

          <CPCard title="Địa chỉ liên hệ" icon="location_on" className="col-span-12 lg:col-span-3">
            <div className="rounded-xl bg-surface-container-low/60 ring-1 ring-outline-variant/30 p-3.5 mb-2">
              <CPLabel className="mb-1">Địa chỉ cụ thể</CPLabel>
              <p className="text-[13px] text-on-surface leading-snug">{addr.detail}, {addr.ward}, {addr.cityFull}</p>
            </div>
            <KVRow label="Phường / Xã" value={addr.ward} />
            <KVRow label="Tỉnh / Thành phố" value={addr.cityFull} />
            <KVRow label="Khu vực CSKH" value={`${client.district}, ${client.city}`} />
          </CPCard>

          <CPCard title="Trạng thái hệ thống" icon="dns" className="col-span-12 lg:col-span-4">
            <KVRow label="Tên đăng nhập" value={<span className="font-mono">{sys.username}</span>} />
            <KVRow label="CustomerId" value={<span className="font-mono">{sys.customerId}</span>} />
            <KVRow label="Số lưu ký" value={<span className="font-mono">{sys.custodyNo}</span>} />
            <KVRow label="TT xác thực KH" value={sb(sys.verifyKH)} />
            <KVRow label="TT xác thực C06" value={sb(sys.verifyC06)} />
            <KVRow label="TT khách hàng" value={sb(sys.custStatus)} />
            <KVRow label="TT hợp đồng" value={sb(sys.contractStatus)} />
            <KVRow label="TT đặt lệnh" value={<Badge tone="blue" size="sm">{sys.orderStatus.v}</Badge>} />
            <KVRow label="SID" value={sys.sid ? <span className="font-mono">{sys.sid}</span> : NA} />
            <KVRow label="PCOD" value={sys.pcod ? <span className="font-mono">{sys.pcod}</span> : NA} />
          </CPCard>
        </div>
      </div>
    );
  }

  // ===== TAB 2 · Danh sách tài khoản =====
  function TabAccounts() {
    const d = CP_DATA.hsCaNhan;
    return (
      <div className="space-y-4">
        <ReportTable title="Danh sách tài khoản cơ sở" icon="account_balance" columns={accountColumns} rows={d.baseAccounts}
          searchKey="no" searchPlaceholder="Số tài khoản" />
        <ReportTable title="Danh sách tài khoản phái sinh" icon="show_chart" columns={accountColumns} rows={d.derivativeAccounts}
          searchKey="no" searchPlaceholder="Số tài khoản" empty={{ icon: "inbox", title: "No Data", sub: "Khách hàng chưa có tài khoản phái sinh." }} />
        <ReportTable title="Tài khoản chứng chỉ quỹ" icon="pie_chart" columns={accountColumns} rows={d.fundCertAccounts}
          searchKey="no" searchPlaceholder="Số tài khoản" />
      </div>
    );
  }

  // ===== TAB 3 · Danh sách uỷ quyền =====
  function TabAuthorization() {
    const d = CP_DATA.hsCaNhan;
    const PERMS = [
      ["View", "View"], ["Report", "Report"], ["Cash", "Cash"], ["Buy", "Buy"], ["Sell", "Sell"],
      ["Sign", "Sign"], ["Transfer", "Transfer"], ["Margin", "Margin"], ["RightOff", "Right Off"]
    ];
    const permCell = (on) => on
      ? <Icon name="check_circle" size={17} className="text-emerald-600 ico-fill" filled />
      : <Icon name="remove" size={16} className="text-on-surface-variant/40" />;
    const columns = [
      idxCol,
      { label: "STK uỷ quyền", render: (r) => <span className="font-mono font-semibold text-vnd-primary-900">{r.stk}</span> },
      { label: "Bên nhận uỷ quyền", render: (r) => (
          <div className="flex items-center gap-2 min-w-[150px]">
            <Avatar name={r.grantee} size={28} tone="purple" />
            <div className="leading-tight">
              <p className="font-semibold text-on-surface">{r.grantee}</p>
              <p className="text-[11px] text-on-surface-variant">{r.relation}</p>
            </div>
          </div>
        ) },
      { label: "CustomerID", render: (r) => <span className="font-mono text-on-surface-variant">{r.customerId}</span> },
      { label: "Ngày bắt đầu", render: (r) => <span className="font-mono text-on-surface-variant">{r.from}</span> },
      { label: "Ngày kết thúc", render: (r) => <span className="font-mono text-on-surface-variant">{r.to}</span> },
      ...PERMS.map(([k, lbl]) => ({ label: lbl, align: "center", thClassName: "px-2", tdClassName: "px-2", render: (r) => permCell(r.perms[k]) }))
    ];
    return (
      <ReportTable title="Danh sách uỷ quyền" icon="manage_accounts" columns={columns} rows={d.authorizations}
        searchKey="stk" searchPlaceholder="Số tài khoản"
        action={<Button tone="soft" size="sm" icon="add">Thêm uỷ quyền</Button>}
        empty={{ icon: "manage_accounts", title: "No Data", sub: "Tài khoản chưa có người được uỷ quyền giao dịch." }} />
    );
  }

  // ===== TAB 4 · Tài khoản thụ hưởng =====
  function TabBeneficiary() {
    const d = CP_DATA.hsCaNhan;
    const bankColumns = [
      idxCol,
      { label: "Số tài khoản", render: (r) => <span className="font-mono font-semibold text-vnd-primary-900">{r.no}</span> },
      { label: "Người thụ hưởng", render: (r) => <span className="font-medium">{r.beneficiary}</span> },
      { label: "Ngân hàng", render: (r) => (
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-vnd-primary-50 text-vnd-primary-700 flex items-center justify-center font-display font-bold text-[12px]">{r.bank[0]}</span>
            <div className="leading-tight">
              <p className="font-medium text-on-surface">{r.bank}</p>
              <p className="text-[11px] text-on-surface-variant">{r.branch}</p>
            </div>
          </div>
        ) },
      { label: "Mặc định", align: "center", render: (r) => r.isDefault ? <Badge tone="green" size="sm" icon="star">Mặc định</Badge> : <span className="text-on-surface-variant">—</span> },
      actionCol
    ];
    const counterpartColumns = [
      idxCol,
      { label: "Số tài khoản", render: (r) => <span className="font-mono font-semibold text-vnd-primary-900">{r.no}</span> },
      { label: "Chủ tài khoản", key: "owner" },
      actionCol
    ];
    return (
      <div className="space-y-4">
        <ReportTable title="Tài khoản ngân hàng" icon="account_balance" columns={bankColumns} rows={d.bankAccounts}
          searchKey="no" searchPlaceholder="Số tài khoản"
          action={<Button tone="soft" size="sm" icon="add">Thêm tài khoản</Button>} />
        <ReportTable title="Tài khoản đối ứng" icon="swap_horiz" columns={counterpartColumns} rows={d.counterpartAccounts}
          searchKey="no" searchPlaceholder="Số tài khoản"
          empty={{ icon: "swap_horiz", title: "No Data", sub: "Chưa có tài khoản đối ứng được khai báo." }} />
      </div>
    );
  }

  // ===== container (controlled by `sub` from the DGO left nav) =====
  function HsCaNhan({ client, sub = "basic" }) {
    return (
      <div>
        {sub === "basic" && <TabBasic client={client} />}
        {sub === "accounts" && <TabAccounts />}
        {sub === "auth" && <TabAuthorization />}
        {sub === "beneficiary" && <TabBeneficiary />}
      </div>
    );
  }

  window.HsCaNhan = HsCaNhan;
})();
