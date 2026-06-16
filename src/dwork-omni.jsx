/* global React, window */
const { OM_LIST } = window.DSB_DATA;

// ============== OMNICHANNEL · 3 COLUMN ==============
function ScreenDworkOmni() {
  const [selectedId, setSelectedId] = useState(OM_LIST[0].id);
  const [filter, setFilter] = useState("all");
  const [composeOpen, setComposeOpen] = useState(false);
  const [markDoneOpen, setMarkDoneOpen] = useState(false);
  const selected = OM_LIST.find(x => x.id === selectedId);
  const toast = useToast();

  const items = OM_LIST.filter(x =>
    filter === "all" ? true : filter === "OM" ? x.kind === "OM" : filter === "DM" ? x.kind === "DM" : x.state === filter
  );

  return (
    <>
      <PageHeader
        eyebrow="dWork · Omnichannel"
        title="Workflow outreach đa kênh"
        sub="Điều phối OM (workflow campaign) + DM (direct) với KH. Compose & Mark Done log tự động vào hành trình."
        actions={
          <>
            <Button tone="ghost" size="sm" icon="settings">Workflow builder</Button>
            <Button tone="outline" size="sm" icon="bolt">Templates</Button>
            <Button tone="primary" size="sm" icon="add">OM mới</Button>
          </>
        }
      />
      <div className="grid grid-cols-12 gap-0 h-[calc(100vh-178px)]">
        {/* Col 1: OM List */}
        <aside className="col-span-12 lg:col-span-3 border-r border-outline-variant/40 bg-white flex flex-col min-h-0">
          <div className="p-4 border-b border-outline-variant/40">
            <TextField icon="search" placeholder="Tìm workflow / KH…" />
            <FilterBar className="mt-3">
              {[
                { id: "all", label: "All" }, { id: "OM", label: "OM" }, { id: "DM", label: "DM" },
                { id: "overdue", label: "Quá hạn" }, { id: "due", label: "Hôm nay" }
              ].map(f => (
                <ChipToggle key={f.id} active={filter === f.id} onClick={() => setFilter(f.id)}>{f.label}</ChipToggle>
              ))}
            </FilterBar>
          </div>
          <ul className="flex-1 overflow-y-auto scrollbar-thin divide-y divide-outline-variant/20">
            {items.map(om => {
              const active = om.id === selectedId;
              return (
                <li key={om.id}>
                  <button onClick={() => setSelectedId(om.id)}
                    className={`w-full text-left p-4 transition-colors block
                      ${active ? "bg-vnd-primary-50 border-l-4 border-vnd-primary-500" : "hover:bg-surface-container-low border-l-4 border-transparent"}`}>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2">
                        <Avatar initials={om.initials} size={28} tone={["blue","green","amber","purple","slate","rose"][OM_LIST.indexOf(om) % 6]} />
                        <span className="text-[13px] font-semibold text-on-surface">{om.client}</span>
                      </div>
                      <Badge tone={om.kind === "OM" ? "blue" : "purple"} size="xs">{om.kind}</Badge>
                    </div>
                    <p className="text-[12px] font-display font-semibold text-vnd-primary-900 mb-1 truncate">{om.workflow}</p>
                    <p className="text-[11px] text-on-surface-variant truncate">{om.channel}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-mono text-[10.5px] text-on-surface-variant">{om.id} · Bước {om.step}</span>
                      <Badge tone={om.state === "overdue" ? "red" : om.state === "due" ? "amber" : om.state === "pending" ? "purple" : "green"} size="xs">{om.due}</Badge>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="p-3 border-t border-outline-variant/40 bg-surface-container-low">
            <Button tone="dark" icon="add" className="w-full justify-center">Khởi tạo OM mới</Button>
          </div>
        </aside>

        {/* Col 2: Workflow Steps (Node Detail) */}
        <section className="col-span-12 lg:col-span-4 border-r border-outline-variant/40 bg-surface-container-low/40 flex flex-col min-h-0">
          <div className="p-5 border-b border-outline-variant/40 bg-white">
            <div className="flex items-center justify-between gap-2 mb-1">
              <Badge tone={selected.kind === "OM" ? "blue" : "purple"} size="sm">{selected.kind} · {selected.id}</Badge>
              <button className="text-on-surface-variant hover:text-vnd-primary-700"><Icon name="more_horiz" size={20} /></button>
            </div>
            <h3 className="font-display text-title-lg text-vnd-primary-900 mt-1.5">{selected.workflow}</h3>
            <p className="text-[12px] text-on-surface-variant mt-1">KH: {selected.client} · Kênh: {selected.channel}</p>
            <div className="flex items-center gap-2 mt-3">
              <Button tone="primary" size="sm" icon="send" onClick={() => setComposeOpen(true)}>Compose</Button>
              <Button tone="outline" size="sm" icon="check_circle" onClick={() => setMarkDoneOpen(true)}>Mark Done</Button>
              <Button tone="ghost" size="sm" icon="pause">Pause</Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin p-5">
            <p className="text-[10.5px] uppercase tracking-wider text-on-surface-variant font-semibold mb-3">Workflow Steps</p>
            <ol className="space-y-3">
              {[
                { i: 1, l: "Trigger: Annual review window", c: "Auto · system", state: "done", at: "10/05 09:00" },
                { i: 2, l: "Email — Welcome back + agenda", c: "Email · Template AR-01", state: "done", at: "10/05 09:32" },
                { i: 3, l: "Call — Confirm khung họp", c: "Voice · ghi âm", state: "current", at: "Hôm nay 15:00", due: true },
                { i: 4, l: "Zalo — Gửi sample report", c: "Zalo · Template AR-03", state: "pending", at: "—" },
                { i: 5, l: "Meeting — Annual review", c: "Video · Google Meet", state: "pending", at: "—" }
              ].map(node => (
                <li key={node.i} className={`relative rounded-xl p-4 transition-all
                  ${node.state === "current" ? "bg-vnd-primary-50 ring-2 ring-vnd-primary-300 shadow-soft" :
                    node.state === "done" ? "bg-white ring-1 ring-outline-variant/30" :
                    "bg-white/70 ring-1 ring-dashed ring-outline-variant"}`}>
                  <div className="flex items-start gap-3">
                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                      ${node.state === "done" ? "bg-emerald-500 text-white" :
                        node.state === "current" ? "bg-vnd-primary-500 text-white" :
                        "bg-surface-container-high text-on-surface-variant"}`}>
                      {node.state === "done" ? <Icon name="check" size={16} weight={600} /> :
                        <span className="font-display font-bold text-[12px]">{node.i}</span>}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[13px] font-semibold ${node.state === "pending" ? "text-on-surface-variant" : "text-on-surface"}`}>{node.l}</p>
                      <p className="text-[11.5px] text-on-surface-variant mt-0.5">{node.c}</p>
                      <p className="text-[11px] font-mono text-on-surface-variant mt-1.5">
                        {node.state === "done" ? `Done · ${node.at}` :
                         node.state === "current" ? `Due ${node.at}` : node.at}
                      </p>
                      {node.state === "current" && (
                        <div className="flex items-center gap-1.5 mt-2.5">
                          <Button size="xs" tone="primary" onClick={() => setMarkDoneOpen(true)}>Hoàn tất</Button>
                          <Button size="xs" tone="ghost" icon="event_repeat">Hoãn</Button>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
            <div className="mt-5 rounded-xl bg-mesh-blue p-4 ring-1 ring-vnd-primary-100">
              <p className="text-[10.5px] uppercase tracking-wider text-vnd-primary-700 font-bold mb-1.5">Outbound log</p>
              <p className="text-[12px] text-on-surface">3 outreach đã gửi · 2 message thành công · 1 KH đã trả lời.</p>
            </div>
          </div>
        </section>

        {/* Col 3: Workflow Feed */}
        <section className="col-span-12 lg:col-span-5 bg-white flex flex-col min-h-0">
          <div className="px-5 py-4 border-b border-outline-variant/40 flex items-center justify-between">
            <div>
              <p className="font-display text-title-md text-vnd-primary-900">Workflow Feed</p>
              <p className="text-[11.5px] text-on-surface-variant">Timeline tương tác · cập nhật real-time</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone="green" size="sm" icon="circle">Live</Badge>
              <Button tone="ghost" size="sm" icon="filter_list">Filter</Button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-4">
            <FeedItem who={selected.client} side="in" channel="Zalo" when="14:08" >
              Anh ơi anh check giùm em proposal V2 nha, em thấy phần allocation bond hợp lý hơn rồi á.
            </FeedItem>
            <FeedItem who="Hoàng Anh" side="out" channel="Zalo" when="14:12" >
              Dạ vâng anh, em đã chỉnh allocation bond từ 20% → 28% theo trao đổi hôm qua. Em đính kèm file PDF v2.
            </FeedItem>
            <SystemNote>
              Auto-log · Outbound email "AR-03 Sample Report" đã gửi · 14:25
            </SystemNote>
            <FeedItem who="Trần Quân (CA)" side="note" channel="Internal note" when="14:30">
              Cần đính kèm bản tóm tắt 1 trang cho buổi gặp thứ Sáu — KH dạng visual learner.
            </FeedItem>
            <FeedItem who={selected.client} side="in" channel="Email" when="14:42">
              Ok anh em chốt 14:30 thứ Sáu tại Highlands Lê Lợi. Anh nhớ mang theo bản in giùm em.
            </FeedItem>

            {/* AI panel */}
            <div className="rounded-2xl bg-vnd-primary-900 text-white p-5 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-vnd-primary-500/30 blur-3xl"></div>
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-6 h-6 rounded-md bg-white/15 flex items-center justify-center"><Icon name="auto_awesome" size={14} /></span>
                  <p className="font-display font-semibold text-[13px]">AI · Next Best Action</p>
                </div>
                <p className="text-[12.5px] text-white/80 leading-relaxed">
                  KH đã confirm khung họp. Gợi ý gửi <span className="text-white font-semibold">checklist agenda 5 mục</span> + booking link để KH chuẩn bị câu hỏi. Soạn nhanh?
                </p>
                <div className="flex gap-2 mt-3">
                  <Button size="xs" tone="primary" icon="auto_awesome">Soạn cho tôi</Button>
                  <Button size="xs" tone="ghost" className="text-white">Bỏ qua</Button>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-outline-variant/40 p-4 bg-surface-container-low/60">
            <div className="bg-white rounded-xl ring-1 ring-outline-variant/40 focus-within:ring-vnd-primary-500 px-3 py-2.5 flex items-end gap-2">
              <textarea rows="2" placeholder="Soạn tin nhắn (Zalo/Email/SMS)..." className="flex-1 resize-none bg-transparent outline-none text-sm placeholder:text-on-surface-variant/70"></textarea>
              <div className="flex flex-col gap-1.5">
                <Button size="icon" tone="ghost" icon="attach_file" />
                <Button size="icon" tone="primary" icon="send" onClick={() => toast?.("Đã gửi tin nhắn", { tone: "success" })} />
              </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <ChipToggle icon="auto_awesome">AI Compose</ChipToggle>
              <ChipToggle icon="description">Template</ChipToggle>
              <ChipToggle icon="event">Đính lịch</ChipToggle>
              <span className="ml-auto text-[11px] text-on-surface-variant">Channel: <span className="font-semibold">{selected.channel}</span></span>
            </div>
          </div>
        </section>
      </div>

      <Modal open={composeOpen} onClose={() => setComposeOpen(false)} title="Compose — Email"
        sub={`Workflow ${selected.workflow} · Bước hiện tại 3/5`} size="lg"
        footer={
          <>
            <Button tone="ghost" onClick={() => setComposeOpen(false)}>Lưu nháp</Button>
            <Button tone="primary" icon="send" onClick={() => { setComposeOpen(false); toast?.("Đã gửi email", { tone: "success", icon: "send" }); }}>Gửi</Button>
          </>
        }>
        <div className="space-y-3">
          <TextField label="Tới" defaultValue={`${selected.client.toLowerCase().replace(/\s/g, "")}@email.com`} icon="person" />
          <TextField label="Tiêu đề" defaultValue="Annual Review · Xác nhận khung họp 14:30 thứ Sáu" icon="subject" />
          <div>
            <p className="text-[12px] font-semibold mb-1.5">Template gợi ý</p>
            <FilterBar>
              <ChipToggle active>AR-03 Confirm Slot</ChipToggle>
              <ChipToggle>AR-04 Pre-meeting Brief</ChipToggle>
              <ChipToggle>AR-05 Reschedule</ChipToggle>
            </FilterBar>
          </div>
          <TextField as="textarea" label="Nội dung" rows="8"
            defaultValue={`Kính gửi anh,\n\nXin xác nhận khung họp Annual Review:\n• Thời gian: 14:30 thứ Sáu, 16/05/2026\n• Địa điểm: Highlands Lê Lợi, Q1\n• Agenda: review danh mục Q3, allocation Q4, rebalance bond/equity\n\nMọi thắc mắc xin liên hệ trực tiếp Hoàng Anh.`}
            inputClassName="min-h-[180px] py-2 font-sans"
          />
          <div className="flex items-center gap-3 text-[12.5px]">
            <label className="inline-flex items-center gap-2"><input type="checkbox" defaultChecked /> Tự log vào Interaction History</label>
            <label className="inline-flex items-center gap-2"><input type="checkbox" /> Theo dõi open/click</label>
          </div>
        </div>
      </Modal>

      <Modal open={markDoneOpen} onClose={() => setMarkDoneOpen(false)} title="Hoàn tất bước — Call confirm"
        sub="Ghi outcome và field value để chuyển sang bước kế tiếp"
        footer={
          <>
            <Button tone="ghost" onClick={() => setMarkDoneOpen(false)}>Huỷ</Button>
            <Button tone="primary" icon="check_circle" onClick={() => { setMarkDoneOpen(false); toast?.("Hoàn tất bước · chuyển sang Bước 4", { tone: "success", icon: "check_circle" }); }}>Lưu & next</Button>
          </>
        }>
        <div className="space-y-3">
          <div>
            <p className="text-[12px] font-semibold mb-1.5">Outcome</p>
            <FilterBar>
              <ChipToggle active icon="check_circle">Confirmed</ChipToggle>
              <ChipToggle icon="event_repeat">Rescheduled</ChipToggle>
              <ChipToggle icon="block">Declined</ChipToggle>
              <ChipToggle icon="phone_missed">No answer</ChipToggle>
            </FilterBar>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <TextField label="Thời lượng cuộc gọi" defaultValue="08:42" icon="schedule" />
            <TextField label="Khung họp đã chốt" defaultValue="14:30 Thứ Sáu 16/05" icon="event" />
          </div>
          <TextField as="textarea" label="Ghi chú" rows="4" defaultValue="KH OK, sẽ chuẩn bị câu hỏi về rebalance. Yêu cầu bản in tại buổi gặp." inputClassName="min-h-[100px] py-2" />
        </div>
      </Modal>
    </>
  );
}

function FeedItem({ who, side, channel, when, children }) {
  if (side === "note") {
    return (
      <div className="rounded-xl bg-amber-50/60 ring-1 ring-amber-200 p-3">
        <div className="flex items-center gap-2 text-[11px] text-amber-700">
          <Icon name="sticky_note_2" size={12} />
          <span className="font-semibold">{who}</span>
          <span className="font-mono opacity-70 ml-auto">{when}</span>
        </div>
        <p className="text-[12.5px] text-on-surface mt-1.5">{children}</p>
      </div>
    );
  }
  const isOut = side === "out";
  return (
    <div className={`flex gap-2.5 ${isOut ? "flex-row-reverse" : ""}`}>
      <Avatar name={who} size={32} tone={isOut ? "blue" : "green"} />
      <div className={`max-w-[78%] ${isOut ? "items-end" : ""}`}>
        <div className="flex items-center gap-2 mb-1 text-[11px] text-on-surface-variant">
          <span className="font-semibold text-on-surface">{who}</span>
          <span>·</span>
          <Badge tone="neutral" size="xs">{channel}</Badge>
          <span className="font-mono">{when}</span>
        </div>
        <div className={`rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed
          ${isOut ? "bg-vnd-primary-500 text-white rounded-tr-sm" : "bg-surface-container-low text-on-surface rounded-tl-sm"}`}>
          {children}
        </div>
      </div>
    </div>
  );
}

function SystemNote({ children }) {
  return (
    <div className="flex items-center gap-2 text-[11px] text-on-surface-variant justify-center">
      <span className="flex-1 h-px bg-outline-variant/40"></span>
      <Icon name="bolt" size={12} />
      <span className="font-mono">{children}</span>
      <span className="flex-1 h-px bg-outline-variant/40"></span>
    </div>
  );
}

Object.assign(window, { ScreenDworkOmni });
