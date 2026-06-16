/* global React, window */
const { PRODUCTS, TOOLS } = window.DSB_DATA;

// ============== PRODUCT ZONE ==============
function ScreenDworkProduct() {
  const [tab, setTab] = useState("portfolio");
  return (
    <>
      <PageHeader
        eyebrow="dWork · Product Zone"
        title="Kho sản phẩm & Danh mục Advisory"
        sub="Quản lý sản phẩm đang phân phối và tra cứu danh sách sản phẩm được phép tư vấn."
        actions={
          <>
            <Button tone="outline" size="sm" icon="bookmark_added">Đã lưu</Button>
            <Button tone="primary" size="sm" icon="upload">Đề xuất cho KH</Button>
          </>
        }
        tabs={[
          { id: "portfolio", label: "Product Portfolio", icon: "inventory_2", count: 12 },
          { id: "afa",       label: "AFA — Available for Advisory", icon: "verified", count: 184 }
        ]}
        tabValue={tab} onTab={setTab}
      />
      <Page>
        {tab === "portfolio" ? <PortfolioGrid /> : <ProductSearch />}
      </Page>
    </>
  );
}

function PortfolioGrid() {
  return (
    <>
      <div className="grid grid-cols-12 gap-4 mb-5">
        <Card className="col-span-12 lg:col-span-8 p-6">
          <SectionTitle sub="12 sản phẩm đang phân phối">Hiệu suất danh mục</SectionTitle>
          <div className="grid grid-cols-4 gap-4">
            <Stat label="Tổng AUM" value="184 tỷ" trend={6.8} tone="blue" icon="account_balance" />
            <Stat label="Sản phẩm hot" value="3" sub="Tích sản · Bond" tone="amber" icon="local_fire_department" />
            <Stat label="Avg yield" value="9.4%" sub="YTD weighted" tone="green" icon="trending_up" />
            <Stat label="Cross-sell ratio" value="2.4" sub="sản phẩm / KH" tone="purple" icon="diversity_3" />
          </div>
        </Card>
        <Card className="col-span-12 lg:col-span-4 bg-vnd-primary-900 text-white relative overflow-hidden">
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-vnd-accent-green/30 blur-3xl"></div>
          <p className="text-[11px] uppercase tracking-wider text-white/60 font-bold">Sản phẩm mới · 30 ngày</p>
          <p className="font-display text-headline-md text-white mt-2">Sunlife Edu Future 2026</p>
          <p className="text-[12.5px] text-white/80 mt-1.5">Bảo hiểm liên kết đầu tư cho mục tiêu giáo dục 15 năm. Phí 1.4%, ROI dự kiến 8-12% p.a.</p>
          <div className="flex gap-2 mt-4">
            <Button size="xs" tone="primary">Xem chi tiết</Button>
            <Button size="xs" tone="ghost" className="text-white">Thêm vào portfolio</Button>
          </div>
        </Card>
      </div>

      <Card padded={false}>
        <div className="px-5 py-4 flex items-center justify-between gap-3 flex-wrap border-b border-outline-variant/30">
          <FilterBar>
            <ChipToggle active>Tất cả (12)</ChipToggle>
            <ChipToggle icon="show_chart">Investment Fund (4)</ChipToggle>
            <ChipToggle icon="shield">Insurance (3)</ChipToggle>
            <ChipToggle icon="request_quote">Bond (3)</ChipToggle>
            <ChipToggle icon="trending_up">Equity (2)</ChipToggle>
          </FilterBar>
          <div className="flex items-center gap-2">
            <TextField icon="search" placeholder="Tìm sản phẩm…" className="w-64" />
            <Button tone="ghost" size="sm" icon="filter_list">Lọc nâng cao</Button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-5">
          {PRODUCTS.map(p => (
            <article key={p.id} className="rounded-xl ring-1 ring-outline-variant/30 hover:shadow-soft hover:ring-vnd-primary-200 transition-all bg-white overflow-hidden group">
              <div className="relative">
                <ImageSlot ratio="16/9" label={p.category} className="rounded-none" />
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                  <Badge tone={p.recommended ? "blue" : "neutral"} size="sm" icon={p.recommended ? "star" : "label"}>
                    {p.recommended ? "Recommended" : p.category}
                  </Badge>
                  <button className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-on-surface-variant flex items-center justify-center"><Icon name="bookmark_border" size={16} /></button>
                </div>
              </div>
              <div className="p-4">
                <p className="font-display font-semibold text-on-surface text-[14px]">{p.name}</p>
                <p className="text-[11.5px] text-on-surface-variant mt-0.5 font-mono">{p.id} · Risk: {p.risk}</p>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="rounded-lg bg-surface-container-low p-2">
                    <p className="text-[10px] uppercase tracking-wider text-on-surface-variant">AUM</p>
                    <p className="font-mono text-[12.5px] font-semibold text-vnd-primary-900">{p.aum}</p>
                  </div>
                  <div className="rounded-lg bg-surface-container-low p-2">
                    <p className="text-[10px] uppercase tracking-wider text-on-surface-variant">Yield</p>
                    <p className="font-mono text-[12.5px] font-semibold text-emerald-700">{p.yield}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 mt-3">
                  <Button tone="soft" size="xs" className="flex-1 justify-center">Đề xuất KH</Button>
                  <Button tone="ghost" size="icon" icon="open_in_new" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </Card>
    </>
  );
}

function ProductSearch() {
  const [risk, setRisk] = useState("all");
  const [type, setType] = useState("all");
  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-12 lg:col-span-3 sticky top-[124px] self-start">
        <p className="font-display font-semibold text-vnd-primary-900 mb-3">Bộ lọc tìm kiếm</p>
        <div className="space-y-4">
          <FilterGroup label="Theo nhu cầu KH">
            <Toggle on label="Tích sản dài hạn" />
            <Toggle label="Hưu trí" />
            <Toggle label="Giáo dục con" />
            <Toggle on label="Bảo vệ thu nhập" />
            <Toggle label="Tăng trưởng nhanh" />
          </FilterGroup>
          <FilterGroup label="Mức rủi ro">
            <FilterBar>
              {["all","Thấp","TB","Cao"].map(r => (
                <ChipToggle key={r} active={risk === r} onClick={() => setRisk(r)}>{r}</ChipToggle>
              ))}
            </FilterBar>
          </FilterGroup>
          <FilterGroup label="Loại sản phẩm">
            <FilterBar>
              {["all","Quỹ","Bond","Insurance","Equity"].map(r => (
                <ChipToggle key={r} active={type === r} onClick={() => setType(r)}>{r}</ChipToggle>
              ))}
            </FilterBar>
          </FilterGroup>
          <FilterGroup label="Yield kỳ vọng (p.a)">
            <input type="range" min="0" max="20" defaultValue="8" className="w-full accent-vnd-primary-500" />
            <p className="text-[11.5px] text-on-surface-variant font-mono">≥ 8% p.a</p>
          </FilterGroup>
        </div>
      </Card>

      <div className="col-span-12 lg:col-span-9 space-y-3">
        <div className="flex items-center justify-between">
          <p className="text-[13px] text-on-surface-variant">Có <span className="font-semibold text-vnd-primary-900">184 sản phẩm</span> được duyệt cho advisory (AFA)</p>
          <FilterBar>
            <ChipToggle icon="sort">Recommended</ChipToggle>
            <ChipToggle icon="trending_up">Yield ↓</ChipToggle>
            <ChipToggle icon="shield">Risk ↑</ChipToggle>
          </FilterBar>
        </div>
        <ul className="space-y-2.5">
          {PRODUCTS.concat(PRODUCTS).slice(0, 10).map((p, i) => (
            <li key={i} className="bg-white rounded-xl ring-1 ring-outline-variant/30 hover:shadow-soft transition-all p-4 flex items-center gap-4">
              <span className="w-12 h-12 rounded-xl bg-vnd-primary-50 text-vnd-primary-700 flex items-center justify-center">
                <Icon name={p.category.includes("Insurance") ? "shield" : p.category.includes("Bond") ? "request_quote" : "stacked_line_chart"} size={22} />
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-display font-semibold text-on-surface truncate">{p.name}</p>
                  {p.recommended && <Badge tone="blue" size="xs" icon="star">Match</Badge>}
                </div>
                <p className="text-[11.5px] text-on-surface-variant font-mono">{p.id} · {p.category} · Risk {p.risk}</p>
              </div>
              <div className="hidden md:block text-right min-w-[120px]">
                <p className="text-[10.5px] uppercase tracking-wider text-on-surface-variant">Yield</p>
                <p className="font-mono text-[14px] font-semibold text-emerald-700">{p.yield}</p>
              </div>
              <div className="hidden md:block text-right min-w-[120px]">
                <p className="text-[10.5px] uppercase tracking-wider text-on-surface-variant">AUM</p>
                <p className="font-mono text-[13px] text-on-surface">{p.aum}</p>
              </div>
              <div className="flex flex-col gap-1.5">
                <Button size="xs" tone="primary">Đề xuất</Button>
                <Button size="xs" tone="ghost" icon="bookmark_border">Lưu</Button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function FilterGroup({ label, children }) {
  return (
    <div>
      <p className="text-[10.5px] uppercase tracking-wider font-bold text-on-surface-variant mb-2">{label}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

// ============== TOOL ZONE ==============
function ScreenDworkTools() {
  const [openTool, setOpenTool] = useState(null);
  return (
    <>
      <PageHeader
        eyebrow="dWork · Tool Zone"
        title="Bộ công cụ hỗ trợ cuộc gặp"
        sub="Soạn agenda, ghi nhận, mô phỏng danh mục và tạo báo cáo nhanh cho KH."
      />
      <Page>
        <div className="grid grid-cols-12 gap-4 mb-5">
          <Card className="col-span-12 lg:col-span-7 bg-mesh-blue ring-1 ring-vnd-primary-100">
            <p className="text-[11px] uppercase tracking-wider text-vnd-primary-500 font-bold">Featured · Hôm nay</p>
            <h3 className="font-display text-headline-md text-vnd-primary-900 mt-1.5">Portfolio Simulator V3</h3>
            <p className="text-[13.5px] text-on-surface mt-1.5 max-w-md">Mô phỏng 3 kịch bản allocation theo Monte Carlo · so sánh với benchmark VN-Index 10 năm.</p>
            <div className="flex gap-2 mt-4">
              <Button tone="primary" icon="play_arrow" onClick={() => setOpenTool(TOOLS[3])}>Khởi chạy</Button>
              <Button tone="ghost" icon="play_circle">Xem demo</Button>
            </div>
          </Card>
          <Card className="col-span-12 lg:col-span-5">
            <SectionTitle sub="Mở gần đây">Quick start</SectionTitle>
            <ul className="space-y-1.5">
              {[
                { l: "Agenda Annual Review · Trần Ngọc Nhi", i: "list_alt", t: "2 phút" },
                { l: "Compliance check · Bảo Logistics", i: "fact_check", t: "Hôm qua" },
                { l: "Báo cáo Q3 · Lê Văn Việt", i: "summarize", t: "3 ngày" }
              ].map((r, i) => (
                <li key={i}>
                  <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-surface-container-low text-left">
                    <Icon name={r.i} size={18} className="text-vnd-primary-700" />
                    <span className="flex-1 text-[13px] truncate">{r.l}</span>
                    <span className="text-[11px] font-mono text-on-surface-variant">{r.t}</span>
                  </button>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {TOOLS.map(t => (
            <article key={t.id} className="bg-white rounded-2xl ring-1 ring-outline-variant/30 p-5 hover:shadow-lift hover:ring-vnd-primary-200 transition-all cursor-pointer group"
              onClick={() => setOpenTool(t)}>
              <div className="flex items-start justify-between mb-4">
                <span className={`w-12 h-12 rounded-xl flex items-center justify-center text-white`} style={{ backgroundColor: getCssColor(t.color) }}>
                  <Icon name={t.icon} size={22} />
                </span>
                <Icon name="arrow_outward" size={18} className="text-on-surface-variant group-hover:text-vnd-primary-700 group-hover:rotate-12 transition-all" />
              </div>
              <p className="font-display font-semibold text-[16px] text-vnd-primary-900">{t.title}</p>
              <p className="text-[12.5px] text-on-surface-variant mt-1.5 leading-relaxed">{t.desc}</p>
              <div className="mt-4 pt-4 border-t border-outline-variant/30 flex items-center justify-between text-[11px] text-on-surface-variant">
                <span className="inline-flex items-center gap-1"><Icon name="schedule" size={12} /> ~5 phút</span>
                <span className="inline-flex items-center gap-1"><Icon name="favorite" size={12} /> 124 uses</span>
              </div>
            </article>
          ))}
        </div>

        <Modal open={!!openTool} onClose={() => setOpenTool(null)} title={openTool?.title}
          sub={openTool?.desc} size="md"
          footer={
            <>
              <Button tone="ghost" onClick={() => setOpenTool(null)}>Đóng</Button>
              <Button tone="primary" icon="play_arrow">Bắt đầu</Button>
            </>
          }>
          <div className="rounded-xl bg-mesh-blue p-5 ring-1 ring-vnd-primary-100">
            <p className="text-[13px] text-on-surface">Đây là preview của <span className="font-semibold">{openTool?.title}</span>. Module thật sẽ mở trong workspace tools với input, output và auto-log về KH.</p>
            <p className="text-[12px] text-on-surface-variant mt-3">Tích hợp sẵn với Client Profile + Omnichannel workflow.</p>
          </div>
        </Modal>
      </Page>
    </>
  );
}

function getCssColor(name) {
  const map = {
    "vnd-primary-500": "#0077ED", "vnd-primary-700": "#005CBD", "vnd-primary-900": "#00205B",
    "vnd-accent-green": "#00C97D", "anvie-primary": "#FF6B35", "vnd-warning": "#FF8C33",
    "pti-primary": "#8B2E8F"
  };
  return map[name] || "#0077ED";
}

// ============== HELPDESK ==============
function ScreenDworkHelpdesk() {
  const [tab, setTab] = useState("library");
  return (
    <>
      <PageHeader
        eyebrow="dWork · Helpdesk"
        title="Tra cứu & Hỗ trợ"
        sub="Thư viện kiến thức nội bộ và cộng đồng Q&A của advisor."
        actions={<Button tone="primary" size="sm" icon="add">Đặt câu hỏi</Button>}
        tabs={[
          { id: "library", label: "Library", icon: "menu_book", count: 248 },
          { id: "qna", label: "Q&A", icon: "question_answer", count: 32 }
        ]}
        tabValue={tab} onTab={setTab}
      />
      <Page>
        {tab === "library" ? <Library /> : <QnA />}
      </Page>
    </>
  );
}

function Library() {
  const categories = [
    { id: "prod", label: "Sản phẩm", icon: "inventory_2", count: 64, color: "blue" },
    { id: "policy", label: "Chính sách", icon: "policy", count: 38, color: "purple" },
    { id: "playbook", label: "Playbook", icon: "menu_book", count: 52, color: "green" },
    { id: "compliance", label: "Compliance", icon: "verified_user", count: 26, color: "amber" },
    { id: "training", label: "Training", icon: "school", count: 41, color: "blue" },
    { id: "faq", label: "FAQ", icon: "help", count: 27, color: "slate" }
  ];
  return (
    <>
      <div className="bg-mesh-blue rounded-2xl p-8 ring-1 ring-vnd-primary-100 mb-5 text-center">
        <p className="text-[11px] uppercase tracking-wider font-bold text-vnd-primary-700">Helpdesk Library</p>
        <h2 className="font-display text-headline-lg text-vnd-primary-900 mt-1.5">Tìm câu trả lời cho mọi tình huống</h2>
        <p className="text-[13.5px] text-on-surface-variant mt-1.5 max-w-2xl mx-auto">248 bài viết · cập nhật hằng tuần · đồng bộ với compliance team.</p>
        <div className="max-w-xl mx-auto mt-5">
          <TextField icon="search" placeholder='Hỏi: "Quy trình xử lý KH muốn rút sớm?" hoặc gõ keyword…' />
        </div>
        <div className="flex items-center justify-center gap-2 mt-3 text-[11px] text-on-surface-variant">
          <span>Phổ biến:</span>
          <ChipToggle>AML threshold mới</ChipToggle>
          <ChipToggle>Quy trình KYC fast-track</ChipToggle>
          <ChipToggle>Linked insurance allocation</ChipToggle>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mb-5">
        {categories.map(c => (
          <button key={c.id} className="bg-white rounded-xl ring-1 ring-outline-variant/30 p-4 text-left hover:shadow-soft hover:ring-vnd-primary-200 transition-all">
            <span className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3
              ${{blue:"bg-vnd-primary-50 text-vnd-primary-700", purple:"bg-fuchsia-50 text-fuchsia-700",
                 green:"bg-emerald-50 text-emerald-700", amber:"bg-amber-50 text-amber-700",
                 slate:"bg-surface-container-high text-on-surface-variant"}[c.color]}`}>
              <Icon name={c.icon} size={20} />
            </span>
            <p className="font-display font-semibold text-on-surface">{c.label}</p>
            <p className="text-[11.5px] text-on-surface-variant mt-0.5">{c.count} bài</p>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-4">
        <Card className="col-span-12 lg:col-span-8">
          <SectionTitle sub="Cập nhật trong tuần"
            action={<Button tone="link" size="sm" iconRight="arrow_forward">Xem tất cả</Button>}>
            Bài viết mới nhất
          </SectionTitle>
          <ul className="divide-y divide-outline-variant/20">
            {[
              { t: "Policy Update Q4 2025 — AML threshold giảm còn 350M", c: "Compliance", a: "Đỗ Thanh Hà", d: "Hôm nay", read: 42 },
              { t: "Hướng dẫn KYC fast-track cho khách Private Wealth", c: "Playbook", a: "Trần Quân", d: "Hôm qua", read: 88 },
              { t: "Cấu trúc danh mục linked insurance 70-20-10", c: "Sản phẩm", a: "Phạm Quỳnh", d: "2 ngày", read: 124 },
              { t: "Xử lý KH yêu cầu rút sớm trong hợp đồng linked", c: "FAQ", a: "Team Ops", d: "3 ngày", read: 66 },
              { t: "Checklist Annual Review cho KH Mass Affluent", c: "Playbook", a: "Lê Khánh", d: "Tuần trước", read: 215 }
            ].map((b, i) => (
              <li key={i} className="py-3.5 flex items-start gap-4 hover:bg-surface-container-low rounded-lg px-2 -mx-2 cursor-pointer transition-colors">
                <span className="w-10 h-10 rounded-lg bg-vnd-primary-50 text-vnd-primary-700 flex items-center justify-center flex-shrink-0">
                  <Icon name="article" size={18} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-display font-semibold text-on-surface text-[14px]">{b.t}</p>
                  <p className="text-[11.5px] text-on-surface-variant mt-0.5 flex items-center gap-2">
                    <Badge tone="blue" size="xs">{b.c}</Badge>
                    <span>· {b.a}</span>
                    <span>· {b.d}</span>
                    <span className="ml-auto inline-flex items-center gap-1"><Icon name="visibility" size={12} />{b.read}</span>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <Card className="col-span-12 lg:col-span-4 bg-vnd-primary-900 text-white">
          <p className="text-[11px] uppercase tracking-wider text-white/60 font-bold">AI Assist · Beta</p>
          <h4 className="font-display text-title-lg mt-2">Hỏi DSB bằng ngôn ngữ tự nhiên</h4>
          <p className="text-[12.5px] text-white/80 mt-2">Câu hỏi gần nhất:</p>
          <ul className="space-y-2 mt-2">
            {[
              "Quy trình AML cho giao dịch trên 500M là gì?",
              "Có sản phẩm bond nào yield > 9% kỳ hạn ≤ 24T?",
              "KH muốn rút sớm 70%, phí phạt như thế nào?"
            ].map((q, i) => (
              <li key={i} className="bg-white/10 hover:bg-white/15 rounded-lg p-3 text-[12.5px] cursor-pointer">
                "{q}"
              </li>
            ))}
          </ul>
          <Button tone="primary" icon="auto_awesome" className="mt-4 w-full justify-center">Mở chat</Button>
        </Card>
      </div>
    </>
  );
}

function QnA() {
  return (
    <div className="grid grid-cols-12 gap-4">
      <div className="col-span-12 lg:col-span-8 space-y-3">
        {[
          { q: "Khi KH yêu cầu chuyển 30% allocation từ Equity sang Bond giữa kỳ, nên xử lý như thế nào?",
            who: "Lê Khánh · Senior Advisor", ago: "2h", tag: "Allocation", answers: 4, votes: 12, hot: true },
          { q: "Làm sao đề xuất Sunlife Edu Future cho KH có 2 con tuổi 6 và 9?",
            who: "Hồ Mỹ Linh", ago: "Hôm qua", tag: "Sản phẩm", answers: 6, votes: 8 },
          { q: "Phí phạt rút sớm hợp đồng linked tính theo quý hay theo năm?",
            who: "Tô Anh Khoa", ago: "2 ngày", tag: "FAQ", answers: 2, votes: 5 },
          { q: "Có template proposal nào cho KH segment Emerging Affluent < 200M không?",
            who: "Vũ Đức Tâm", ago: "3 ngày", tag: "Template", answers: 9, votes: 18, hot: true }
        ].map((q, i) => (
          <Card key={i} className="hover:shadow-soft transition-shadow">
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center gap-1.5 min-w-[48px]">
                <button className="w-8 h-8 rounded-md hover:bg-vnd-primary-50 hover:text-vnd-primary-700 text-on-surface-variant flex items-center justify-center"><Icon name="arrow_drop_up" size={20} /></button>
                <span className="font-display font-bold text-vnd-primary-900">{q.votes}</span>
                <button className="w-8 h-8 rounded-md hover:bg-vnd-primary-50 hover:text-vnd-primary-700 text-on-surface-variant flex items-center justify-center"><Icon name="arrow_drop_down" size={20} /></button>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <Badge tone="blue" size="xs">{q.tag}</Badge>
                  {q.hot && <Badge tone="red" size="xs" icon="local_fire_department">Hot</Badge>}
                </div>
                <p className="font-display font-semibold text-on-surface">{q.q}</p>
                <div className="flex items-center gap-3 mt-3 text-[12px] text-on-surface-variant">
                  <span className="inline-flex items-center gap-1.5"><Avatar name={q.who} size={20} tone="blue" />{q.who}</span>
                  <span>· {q.ago}</span>
                  <span className="ml-auto inline-flex items-center gap-1"><Icon name="comment" size={14} />{q.answers} trả lời</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <div className="col-span-12 lg:col-span-4 space-y-4">
        <Card>
          <p className="font-display font-semibold text-vnd-primary-900">Top contributors tuần này</p>
          <ul className="mt-3 space-y-2.5">
            {[
              { n: "Lê Khánh", r: "Sr. Advisor", p: 42 },
              { n: "Phạm Quỳnh", r: "Product", p: 38 },
              { n: "Trần Quân", r: "CA", p: 27 },
              { n: "Đỗ Thanh Hà", r: "Compliance", p: 22 }
            ].map((t, i) => (
              <li key={t.n} className="flex items-center gap-3">
                <span className="w-5 text-center font-display font-bold text-vnd-primary-900">{i + 1}</span>
                <Avatar name={t.n} size={32} tone={["amber","blue","green","purple"][i]} />
                <div className="flex-1">
                  <p className="text-[13px] font-semibold">{t.n}</p>
                  <p className="text-[11px] text-on-surface-variant">{t.r}</p>
                </div>
                <Badge tone="amber" size="xs" icon="emoji_events">{t.p} điểm</Badge>
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <p className="font-display font-semibold text-vnd-primary-900">Tag phổ biến</p>
          <FilterBar className="mt-3">
            {["AML","Allocation","FAQ","Bond","Linked","Onboarding","Compliance","KYC","Rebalance"].map(t => (
              <ChipToggle key={t}>{t}</ChipToggle>
            ))}
          </FilterBar>
        </Card>
      </div>
    </div>
  );
}

// ============== COMPLIANCE ==============
function ScreenDworkCompliance() {
  const [tab, setTab] = useState("kyc");
  return (
    <>
      <PageHeader
        eyebrow="dWork · Compliance"
        title="Giám sát & Tuân thủ"
        sub="KYC status, AML monitoring và Audit trail cho team / cá nhân."
        actions={
          <>
            <Button tone="outline" size="sm" icon="download">Xuất audit</Button>
            <Button tone="primary" size="sm" icon="flag">Báo cáo sự cố</Button>
          </>
        }
        tabs={[
          { id: "kyc", label: "KYC Status", icon: "badge", count: 4 },
          { id: "aml", label: "AML Monitoring", icon: "policy", count: 2 },
          { id: "audit", label: "Audit Trail", icon: "history" }
        ]}
        tabValue={tab} onTab={setTab}
      />
      <Page>
        <div className="grid grid-cols-12 gap-4 mb-5">
          {[
            { l: "KYC active", v: "126", t: 1.2, tone: "green", i: "verified" },
            { l: "Sắp hết hạn 30d", v: "8", t: 0, tone: "amber", i: "schedule" },
            { l: "AML alerts mở", v: "3", t: -2, tone: "red", i: "warning" },
            { l: "Audit events 7d", v: "1,284", t: 5.4, tone: "blue", i: "history" }
          ].map((s, i) => (
            <div key={i} className="col-span-12 md:col-span-6 xl:col-span-3"><Card><Stat label={s.l} value={s.v} trend={s.t} tone={s.tone} icon={s.i} /></Card></div>
          ))}
        </div>

        {tab === "kyc" && <KycPanel />}
        {tab === "aml" && <AmlPanel />}
        {tab === "audit" && <AuditTrail />}
      </Page>
    </>
  );
}

function KycPanel() {
  const rows = [
    { c: "Đỗ Trung Kiên", id: "C-1118", s: "Active", e: "T1/2027", risk: "Low" },
    { c: "Bùi Thu Trang", id: "L-2824", s: "Pending", e: "—", risk: "—" },
    { c: "Lê Văn Việt", id: "C-1142", s: "Expiring", e: "32 ngày", risk: "Medium" },
    { c: "Trần Ngọc Nhi", id: "C-1138", s: "Active", e: "Q3/2027", risk: "Low" },
    { c: "Hoàng Thị Mai", id: "C-1124", s: "Renew", e: "Quá hạn 3d", risk: "Medium" }
  ];
  return (
    <Card padded={false}>
      <div className="px-5 py-4 border-b border-outline-variant/30 flex items-center justify-between flex-wrap gap-3">
        <FilterBar>
          <ChipToggle active>Tất cả (126)</ChipToggle>
          <ChipToggle icon="verified">Active (118)</ChipToggle>
          <ChipToggle icon="schedule">Expiring (8)</ChipToggle>
          <ChipToggle icon="warning">Renew quá hạn (3)</ChipToggle>
        </FilterBar>
        <TextField icon="search" placeholder="Tìm KH…" className="w-64" />
      </div>
      <table className="w-full text-[13px]">
        <thead className="bg-surface-container-low">
          <tr className="text-left text-[10.5px] uppercase tracking-wider text-on-surface-variant font-semibold">
            <th className="px-5 py-3">Khách hàng</th>
            <th className="py-3">ID</th>
            <th className="py-3">Status</th>
            <th className="py-3">Hết hạn</th>
            <th className="py-3">Risk Score</th>
            <th className="py-3 pr-5 text-right">Hành động</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-outline-variant/20">
          {rows.map((r, i) => (
            <tr key={i} className="hover:bg-surface-container-low">
              <td className="px-5 py-3"><div className="flex items-center gap-2.5"><Avatar name={r.c} size={32} tone={["blue","green","amber","purple","rose"][i % 5]} /><span className="font-semibold">{r.c}</span></div></td>
              <td className="py-3 font-mono text-on-surface-variant">{r.id}</td>
              <td className="py-3"><Badge tone={r.s === "Active" ? "green" : r.s === "Pending" ? "neutral" : r.s === "Expiring" ? "amber" : "red"} size="sm">{r.s}</Badge></td>
              <td className="py-3 font-mono text-on-surface-variant">{r.e}</td>
              <td className="py-3">{r.risk === "—" ? <span className="text-on-surface-variant/50">—</span> : <Badge tone={r.risk === "Low" ? "green" : "amber"} size="sm">{r.risk}</Badge>}</td>
              <td className="py-3 pr-5 text-right">
                <Button size="xs" tone={r.s === "Active" ? "ghost" : "primary"}>{r.s === "Active" ? "Xem hồ sơ" : "Mở lại"}</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function AmlPanel() {
  return (
    <div className="grid grid-cols-12 gap-4">
      <Card className="col-span-12 lg:col-span-8">
        <SectionTitle sub="2 alert chưa xử lý · 1 đã đóng tuần này">AML Alerts</SectionTitle>
        <ul className="space-y-3">
          {[
            { lvl: "high", c: "Hoàng Thị Mai", id: "C-1124", reason: "Giao dịch in/out > 800M trong 5 ngày", at: "Hôm nay 11:22", state: "open" },
            { lvl: "med",  c: "Đỗ Trung Kiên", id: "C-1118", reason: "Pattern không khớp risk profile", at: "Hôm qua 17:08", state: "open" },
            { lvl: "low",  c: "Phạm Quốc Bảo", id: "C-1130", reason: "Source of funds chưa xác minh", at: "3 ngày", state: "closed" }
          ].map((a, i) => (
            <li key={i} className={`rounded-2xl ring-1 p-4 flex items-start gap-4
              ${a.state === "open" ? a.lvl === "high" ? "ring-red-200 bg-red-50/40" : "ring-amber-200 bg-amber-50/40" : "ring-outline-variant/30 bg-white"}`}>
              <span className={`w-10 h-10 rounded-xl flex items-center justify-center
                ${a.lvl === "high" ? "bg-red-500 text-white" : a.lvl === "med" ? "bg-amber-500 text-white" : "bg-surface-container-high text-on-surface-variant"}`}>
                <Icon name="warning" size={20} weight={600} />
              </span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-display font-semibold text-on-surface">{a.c}</span>
                  <span className="text-[11px] font-mono text-on-surface-variant">{a.id}</span>
                  <Badge tone={a.lvl === "high" ? "red" : a.lvl === "med" ? "amber" : "neutral"} size="xs">{a.lvl.toUpperCase()}</Badge>
                  {a.state === "closed" && <Badge tone="green" size="xs" icon="check">Closed</Badge>}
                </div>
                <p className="text-[13px] text-on-surface">{a.reason}</p>
                <p className="text-[11px] font-mono text-on-surface-variant mt-1">{a.at}</p>
                {a.state === "open" && (
                  <div className="flex gap-2 mt-3">
                    <Button size="xs" tone="primary" icon="play_arrow">Mở case</Button>
                    <Button size="xs" tone="outline" icon="forward">Escalate</Button>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Card>
      <Card className="col-span-12 lg:col-span-4">
        <SectionTitle sub="30 ngày gần nhất">Alert distribution</SectionTitle>
        <DonutChart data={[
          { label: "High", pct: 8, color: "#EF4444" },
          { label: "Medium", pct: 22, color: "#FF8C33" },
          { label: "Low", pct: 70, color: "#0077ED" }
        ]} size={160} thickness={20} centerValue="42" centerLabel="alerts" />
        <ul className="mt-4 space-y-2 text-[12.5px]">
          <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-sm bg-red-500"></span><span className="flex-1">High</span><span className="font-mono">3</span></li>
          <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-sm bg-vnd-warning"></span><span className="flex-1">Medium</span><span className="font-mono">9</span></li>
          <li className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-sm bg-vnd-primary-500"></span><span className="flex-1">Low</span><span className="font-mono">30</span></li>
        </ul>
      </Card>
    </div>
  );
}

function AuditTrail() {
  const events = [
    { who: "Hoàng Anh", what: "logged Call interaction", obj: "C-1142 Lê Văn Việt", at: "14:32", ip: "10.0.4.21" },
    { who: "Trần Quân", what: "completed onboarding step 7 (Handoff)", obj: "ON-440 Bảo Logistics", at: "13:11", ip: "10.0.4.18" },
    { who: "System Bot", what: "ran AML scan", obj: "C-1124 Hoàng Thị Mai", at: "11:22", ip: "—" },
    { who: "Hoàng Anh", what: "edited risk profile", obj: "C-1118 Đỗ Trung Kiên", at: "10:45", ip: "10.0.4.21" },
    { who: "Đỗ Thanh Hà", what: "approved KYC document", obj: "L-2824 Bùi Thu Trang", at: "09:30", ip: "10.0.6.04" }
  ];
  return (
    <Card>
      <SectionTitle sub="1,284 sự kiện trong 7 ngày"
        action={
          <FilterBar>
            <ChipToggle active>All</ChipToggle>
            <ChipToggle>My actions</ChipToggle>
            <ChipToggle>Compliance</ChipToggle>
            <ChipToggle>System</ChipToggle>
          </FilterBar>
        }>
        Audit Trail
      </SectionTitle>
      <ol className="relative pl-7 space-y-3 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-px before:bg-outline-variant/40">
        {events.map((e, i) => (
          <li key={i} className="relative">
            <span className="absolute -left-[20px] top-1 w-5 h-5 rounded-full bg-white ring-2 ring-vnd-primary-500 flex items-center justify-center">
              <Icon name="history" size={11} className="text-vnd-primary-700" />
            </span>
            <div className="flex items-center justify-between gap-3 text-[13px]">
              <p className="text-on-surface">
                <span className="font-semibold">{e.who}</span> <span className="text-on-surface-variant">{e.what}</span> <span className="font-semibold text-vnd-primary-700">{e.obj}</span>
              </p>
              <div className="text-right flex-shrink-0">
                <p className="font-mono text-[11.5px] text-on-surface-variant">{e.at}</p>
                <p className="font-mono text-[10.5px] text-on-surface-variant/70">{e.ip}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </Card>
  );
}

Object.assign(window, { ScreenDworkProduct, ScreenDworkTools, ScreenDworkHelpdesk, ScreenDworkCompliance });
