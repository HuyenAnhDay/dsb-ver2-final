/* global window */
// Mock data for DSB prototype. All names/values fictional.

const ADVISOR = {
  name: "Nguyễn Hoàng Anh",
  shortName: "Hoàng Anh",
  initials: "NA",
  role: "Senior Financial Advisor · Region South",
  bmiLevel: "BMI-3 · Trusted Advisor",
  icmScore: 782,
  avatarHue: 215,
  team: "Saigon Tower · Squad 04",
};

const COMPASSES = [
  { id: "ilead", label: "iLead", question: "Học gì để giỏi hơn?", icon: "school", color: "#8B2E8F" },
  { id: "dwork", label: "dWork", question: "Hôm nay làm gì với KH nào?", icon: "rocket_launch", color: "#0077ED" },
  { id: "dlink", label: "dLink", question: "Cần ai để làm tốt hơn?", icon: "hub", color: "#00C97D" },
  { id: "daccount", label: "dAccount", question: "Đang ở đâu, tạo ra gì?", icon: "trending_up", color: "#FF8C33" }
];

// Sidebar sitemap — flat top-level items shown in left rail.
// `route` = the destination when user clicks. `match` = which routes mark this item active.
const SIDEBAR_NAV = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard",      route: "dwork/dashboard", group: "primary" },
  { id: "ilead",     label: "iLead",     icon: "school",         route: "ilead/job",        group: "primary", compassId: "ilead" },
  { id: "dwork",     label: "dWork",     icon: "rocket_launch",  route: "dwork/clients",    group: "primary", compassId: "dwork" },
  { id: "dlink",     label: "dLink",     icon: "hub",            route: "dlink/ipax",       group: "primary", compassId: "dlink" },
  { id: "daccount",  label: "dAccount",  icon: "trending_up",    route: "daccount",         group: "primary", compassId: "daccount" },
  { id: "toolbox",   label: "Toolbox",   icon: "build",          route: "toolbox",          group: "utility" },
  { id: "library",   label: "Library",   icon: "menu_book",      route: "library",          group: "utility" }
];

function matchSidebarItem(route) {
  // Dashboard takes precedence over dWork when on the dashboard sub-route
  if (route === "dwork/dashboard" || route === "dashboard") return "dashboard";
  if (route === "toolbox" || route.startsWith("toolbox/")) return "toolbox";
  if (route === "library" || route.startsWith("library/")) return "library";
  const compass = route.split("/")[0];
  return compass; // ilead | dwork | dlink | daccount
}

// =============== 3-LEVEL NAV MODEL ===============
// Level 1 = sidebar compass (ilead / dwork / dlink / daccount + toolbox / library)
// Level 2 = group (optional) — rendered as a dropdown when a compass has >1 group
// Level 3 = module — rendered as tabs below the header bar
// `tone` drives the group color (primary / neutral / green / purple / amber).
const NAV = {
  ilead: {
    groups: [
      { id: "track", label: null, modules: [
        { id: "ilead/job",   label: "Job Track",   icon: "badge",       sub: "Career Track · Functional Domain" },
        { id: "ilead/depth", label: "DEPTH Track", icon: "insights",    sub: "5 baseline · 14 giá trị" },
        { id: "ilead/idp",   label: "IDP Track",   icon: "flag",        sub: "Roadmap · Migration" }
      ] }
    ]
  },
  dwork: {
    groups: [
      { id: "FC", label: "Formal Chain", tone: "primary", hint: "Chuỗi chính thức — luồng nghiệp vụ cốt lõi", modules: [
        { id: "dwork/dashboard", label: "Dashboard",    icon: "dashboard",   sub: "Cockpit hằng ngày" },
        { id: "dwork/clients",   label: "Client Zone",  icon: "diversity_3", sub: "Pipeline · Profile" },
        { id: "dwork/omni",      label: "Omnichannel",  icon: "forum",       sub: "OM · DM · Workflow" },
        { id: "dwork/product",   label: "Product Zone", icon: "inventory_2", sub: "Portfolio · AFA" }
      ] },
      { id: "OC", label: "Operating Chain", tone: "neutral", hint: "Chuỗi vận hành — quy trình hỗ trợ & lịch biểu", modules: [
        { id: "dwork/oc", label: "OC Workspace", icon: "schedule", comingSoon: true }
      ] }
    ]
  },
  dlink: {
    groups: [
      { id: "IPAX", label: "IPAX", tone: "primary", hint: "Phân tích mạng lưới nội bộ", modules: [
        { id: "dlink/ipax", label: "Network Analytics", icon: "groups" }
      ] },
      { id: "XLink", label: "Cross-Link", tone: "green", hint: "Liên kết chéo — network theo từng La Bàn", modules: [
        { id: "dlink/ilead", label: "iLead network", icon: "school" },
        { id: "dlink/dwork", label: "dWork network", icon: "rocket_launch" }
      ] }
    ]
  },
  daccount: {
    groups: [
      { id: "main", label: null, modules: [
        { id: "daccount", label: "dAccount", icon: "trending_up", comingSoon: true, full: true }
      ] }
    ]
  }
};

// Find which Level-2 group owns a given route; falls back to the first group.
function navGroupForRoute(compassId, route) {
  const cfg = NAV[compassId];
  if (!cfg) return null;
  const hit = cfg.groups.find(g => g.modules.some(m => m.id === route));
  return hit || cfg.groups[0];
}

const PIPELINE_STAGES = [
  { id: "identify", label: "Nhận dạng", count: 28, value: "—", tint: "bg-vnd-neutral-100", accent: "border-vnd-neutral-950/10" },
  { id: "bant", label: "BANT Qualify", count: 14, value: "8.4 tỷ", tint: "bg-vnd-primary-50", accent: "border-vnd-primary-200" },
  { id: "approach", label: "Tiếp cận", count: 9, value: "12.1 tỷ", tint: "bg-vnd-primary-50", accent: "border-vnd-primary-200" },
  { id: "schedule", label: "Đặt lịch hẹn", count: 6, value: "6.8 tỷ", tint: "bg-amber-50", accent: "border-amber-200" },
  { id: "advise", label: "Gặp tư vấn", count: 5, value: "9.2 tỷ", tint: "bg-amber-50", accent: "border-amber-200" },
  { id: "propose", label: "Đề xuất mở TK", count: 3, value: "4.6 tỷ", tint: "bg-emerald-50", accent: "border-emerald-200" }
];

const LEADS = [
  { id: "L-2841", name: "Lê Văn Việt", company: "Công ty CP Hạ tầng Việt", value: 500, currency: "M", source: "Referral · Anh Tuấn", stage: "advise", priority: "P1", lastTouch: "2 giờ trước", avatarSeed: "LV", tag: "Hot", note: "Quan tâm gói Tích sản 5 năm + bảo hiểm nhân thọ.", phone: "+84 90 218 4419", nac: true, days: 2 },
  { id: "L-2840", name: "Trần Ngọc Nhi", company: "Boutique 21 — Quận 1", value: 1250, currency: "M", source: "Hội thảo VPBank", stage: "propose", priority: "P1", lastTouch: "Hôm qua", avatarSeed: "TN", tag: "VIP", note: "Đã ký LOI. Đang review phụ lục hợp đồng.", phone: "+84 93 778 0011", nac: true, days: 1 },
  { id: "L-2838", name: "Phạm Quốc Bảo", company: "Bảo Logistics JSC", value: 320, currency: "M", source: "Inbound · Zalo", stage: "bant", priority: "P2", lastTouch: "3 ngày", avatarSeed: "PB", tag: null, note: "Đang xác minh ngân sách & timeline.", phone: "+84 96 224 1188", nac: false, days: 5 },
  { id: "L-2835", name: "Hoàng Thị Mai", company: "Mai Education Group", value: 880, currency: "M", source: "Network · CA team", stage: "schedule", priority: "P1", lastTouch: "Sáng nay", avatarSeed: "HM", tag: "Hot", note: "Đã chốt khung 09:30 thứ Sáu.", phone: "+84 90 511 2299", nac: true, days: 0 },
  { id: "L-2831", name: "Đỗ Trung Kiên", company: "Cá nhân — Founder", value: 410, currency: "M", source: "Webinar Q2", stage: "approach", priority: "P2", lastTouch: "Tuần trước", avatarSeed: "DK", tag: null, note: "Đang gửi sample portfolio.", phone: "+84 91 880 4521", nac: false, days: 9 },
  { id: "L-2828", name: "Vũ Hà Linh", company: "Linh & Cộng sự", value: 240, currency: "M", source: "Lead Gen · TikTok", stage: "identify", priority: "P3", lastTouch: "Chưa liên hệ", avatarSeed: "VL", tag: null, note: "Mới import từ campaign tháng này.", phone: "+84 97 612 8843", nac: false, days: 12 },
  { id: "L-2827", name: "Nguyễn Thanh Hà", company: "Hà Beauty Chain", value: 660, currency: "M", source: "Referral · Chị Nhi", stage: "approach", priority: "P1", lastTouch: "Hôm qua", avatarSeed: "NH", tag: "Hot", note: "Chuẩn bị tài liệu mở TK con.", phone: "+84 90 999 1212", nac: true, days: 1 },
  { id: "L-2825", name: "Lý Minh Quân", company: "Quân Architecture", value: 180, currency: "M", source: "Cold outreach", stage: "identify", priority: "P3", lastTouch: "Chưa liên hệ", avatarSeed: "LQ", tag: null, note: "—", phone: "+84 93 045 2210", nac: false, days: 14 },
  { id: "L-2824", name: "Bùi Thu Trang", company: "Trang Pharma", value: 540, currency: "M", source: "Inbound · website", stage: "bant", priority: "P2", lastTouch: "2 ngày", avatarSeed: "BT", tag: null, note: "Cần xác nhận khẩu vị rủi ro.", phone: "+84 96 778 0099", nac: false, days: 4 },
  { id: "L-2821", name: "Tô Anh Khoa", company: "Khoa Trading Co.", value: 210, currency: "M", source: "Network · Mentor", stage: "identify", priority: "P3", lastTouch: "Chưa liên hệ", avatarSeed: "TK", tag: null, note: "—", phone: "+84 98 221 4400", nac: false, days: 16 }
];

// Journey signals (Tín hiệu hành trình) — Customer Journey stage
const JOURNEY = {
  start:   { key: "start",   label: "Khởi đầu",    tone: "slate",  order: 1 },
  grow:    { key: "grow",    label: "Phát triển",  tone: "blue",   order: 2 },
  mature:  { key: "mature",  label: "Trưởng thành", tone: "green",  order: 3 },
  auto:    { key: "auto",    label: "Tự chủ",      tone: "purple", order: 4 }
};
// Data-gap micro-inputs surfaced inline (Lấp đầy Data Gap)
const GAP_PROMPTS = {
  risk:     { key: "risk",     label: "Khẩu vị rủi ro",   weight: 30, question: "Khẩu vị rủi ro của KH là gì?", options: ["Bảo vệ tài sản", "Cân bằng", "Tăng trưởng", "Mạo hiểm"] },
  passport: { key: "passport", label: "Passport / eKYC",  weight: 20, question: "Loại giấy tờ định danh đã thu thập?", options: ["CCCD gắn chip", "Hộ chiếu", "Chưa có"] },
  fatca:    { key: "fatca",    label: "FATCA tái xác nhận", weight: 12, question: "Trạng thái FATCA của KH?", options: ["Non-US person", "US person", "Cần bổ sung"] },
  source:   { key: "source",   label: "Nguồn tiền (SoF)", weight: 15, question: "Nguồn hình thành tài sản chính?", options: ["Kinh doanh", "Lương / thu nhập", "Thừa kế", "Đầu tư"] },
  goal:     { key: "goal",     label: "Mục tiêu tài chính", weight: 10, question: "Mục tiêu đầu tư ưu tiên?", options: ["Tích sản", "Hưu trí", "Giáo dục con", "Bảo toàn vốn"] }
};

const ACTIVE_CLIENTS = [
  {
    id: "C-1142", name: "Lê Văn Việt", company: "Hạ tầng Việt JSC", cadence: "P1 · Daily",
    initials: "LV", segment: "Private Wealth", joinedAt: "Q3/2023", openDate: "2023-08-15",
    city: "Hà Nội", district: "Cầu Giấy", gender: "Nam", dob: "1979-05-12",
    nav: 4820, pnlYtd: 14.6, pnlToday: 0.8, roi: 12.4, benchmark: 9.1,
    completeness: 80, missing: ["source"], cashPct: 12, lastDays: 0, journey: "mature", nac: "watch",
    flags: { missedCall: true, pendingReply: false }, owners: ["Hoàng Anh", "Trần Quân"],
    phone: "+84 90 218 4419", email: "viet.le@hatangviet.vn", cif: "CIF0099142", cccd: "079201004419"
  },
  {
    id: "C-1138", name: "Trần Ngọc Nhi", company: "Boutique 21", cadence: "P1 · Daily",
    initials: "TN", segment: "Mass Affluent", joinedAt: "Q1/2024", openDate: "2024-02-20",
    city: "TP. Hồ Chí Minh", district: "Quận 1", gender: "Nữ", dob: "1990-11-03",
    nav: 1280, pnlYtd: 8.2, pnlToday: 0.3, roi: 7.4, benchmark: 9.1,
    completeness: 40, missing: ["risk", "passport"], cashPct: 35, lastDays: 2, journey: "grow", nac: "none",
    flags: { missedCall: false, pendingReply: true }, owners: ["Hoàng Anh"],
    phone: "+84 93 778 0011", email: "nhi.tran@boutique21.vn", cif: "CIF0099138", cccd: "001298770011"
  },
  {
    id: "C-1130", name: "Phạm Quốc Bảo", company: "Bảo Logistics", cadence: "P2 · Weekly",
    initials: "PB", segment: "Mass Affluent", joinedAt: "Q4/2023", openDate: "2023-11-08",
    city: "Hải Phòng", district: "Lê Chân", gender: "Nam", dob: "1985-02-21",
    nav: 980, pnlYtd: 6.0, pnlToday: -0.2, roi: 6.2, benchmark: 9.1,
    completeness: 95, missing: [], cashPct: 48, lastDays: 12, journey: "grow", nac: "none",
    flags: { missedCall: false, pendingReply: false }, owners: ["Hoàng Anh", "Lê Khánh"],
    phone: "+84 96 224 1188", email: "bao.pham@baologistics.com", cif: "CIF0099130", cccd: "025190021188"
  },
  {
    id: "C-1124", name: "Hoàng Thị Mai", company: "Mai Education", cadence: "P3 · Bi-weekly",
    initials: "HM", segment: "Private Wealth", joinedAt: "Q2/2022", openDate: "2022-05-12",
    city: "Hà Nội", district: "Đống Đa", gender: "Nữ", dob: "1972-08-30",
    nav: 6420, pnlYtd: 19.2, pnlToday: 1.1, roi: 11.8, benchmark: 9.1,
    completeness: 100, missing: [], cashPct: 8, lastDays: 34, journey: "auto", nac: "none",
    flags: { missedCall: false, pendingReply: false }, owners: ["Hoàng Anh"],
    phone: "+84 90 511 2299", email: "mai.h@maiedu.vn", cif: "CIF0099124", cccd: "001188552299"
  },
  {
    id: "C-1118", name: "Đỗ Trung Kiên", company: "Founder · Tech", cadence: "P2 · Weekly",
    initials: "DK", segment: "Emerging Affluent", joinedAt: "Q3/2024", openDate: "2024-09-03",
    city: "Đà Nẵng", district: "Hải Châu", gender: "Nam", dob: "1995-01-17",
    nav: 540, pnlYtd: -2.1, pnlToday: -1.8, roi: -1.4, benchmark: 9.1,
    completeness: 55, missing: ["risk"], cashPct: 62, lastDays: 41, journey: "start", nac: "alert",
    flags: { missedCall: true, pendingReply: true }, owners: ["Hoàng Anh"],
    phone: "+84 91 880 4521", email: "kien.do@gmail.com", cif: "CIF0099118", cccd: "079199014521"
  },
  {
    id: "C-1109", name: "Nguyễn Thanh Hà", company: "Hà Beauty Chain", cadence: "P1 · Daily",
    initials: "NH", segment: "Private Wealth", joinedAt: "Q4/2022", openDate: "2022-10-19",
    city: "TP. Hồ Chí Minh", district: "Quận 3", gender: "Nữ", dob: "1981-06-25",
    nav: 8950, pnlYtd: 22.1, pnlToday: 0.6, roi: 13.6, benchmark: 9.1,
    completeness: 88, missing: ["fatca"], cashPct: 22, lastDays: 1, journey: "auto", nac: "none",
    flags: { missedCall: false, pendingReply: false }, owners: ["Hoàng Anh", "Trần Quân"],
    phone: "+84 90 999 1212", email: "ha.nguyen@habeauty.vn", cif: "CIF0099109", cccd: "001293331212"
  }
];

const INTERACTIONS = [
  { id: 1, when: "Hôm nay · 09:42", channel: "Call", channelIcon: "call", owner: "Hoàng Anh", title: "Gọi xác nhận lịch ký hợp đồng", outcome: "Confirmed", note: "Khách OK 14:30 thứ Sáu tại Highlands Lê Lợi.", pending: false },
  { id: 2, when: "Hôm qua · 17:12", channel: "Zalo", channelIcon: "chat", owner: "Hoàng Anh", title: "Gửi sample portfolio Q4", outcome: "Sent", note: "Đã gửi file PDF + voice 2 phút giải thích allocation.", pending: false },
  { id: 3, when: "2 ngày trước · 11:00", channel: "Email", channelIcon: "mail", owner: "Trần Quân (CA)", title: "Phản hồi yêu cầu báo cáo P&L", outcome: "Replied", note: "Đã gửi P&L tháng 10 + giải thích phần giảm.", pending: false },
  { id: 4, when: "3 ngày trước · 14:30", channel: "Meeting", channelIcon: "videocam", owner: "Hoàng Anh", title: "Họp review danh mục quý 3", outcome: "Completed · 48 min", note: "Đồng thuận tăng allocation bond từ 20% → 28%.", pending: false },
  { id: 5, when: "5 ngày trước · 10:00", channel: "Zalo", channelIcon: "chat", owner: "Hoàng Anh", title: "Hỏi thăm sau buổi gặp", outcome: "Pending reply", note: "Đang đợi feedback của khách về proposal V2.", pending: true }
];

const ALLOCATION = [
  { label: "Equity VN", pct: 36, color: "#0077ED" },
  { label: "Bond/Fixed Income", pct: 24, color: "#00C97D" },
  { label: "Mutual Fund", pct: 18, color: "#FFB020" },
  { label: "Insurance — Linked", pct: 12, color: "#8B2E8F" },
  { label: "Cash & Equivalent", pct: 10, color: "#727784" }
];

const COURSES = [
  { id: "C-401", title: "Tư vấn Đầu tư Có Trách nhiệm", category: "Chuyên môn cốt lõi", duration: "6h 20m", level: "Intermediate", required: true, progress: 64, tag: "Required", instructor: "Dr. Phạm Quỳnh" },
  { id: "C-402", title: "AML & Suspicious Transaction Reporting", category: "Compliance", duration: "3h 00m", level: "Foundational", required: true, progress: 100, tag: "Required", instructor: "Lê Hồng Phong" },
  { id: "C-403", title: "Behavioral Finance for Advisors", category: "Kỹ năng tư vấn", duration: "4h 45m", level: "Advanced", required: false, progress: 22, tag: "Recommended", instructor: "Nguyễn Bảo Châu" },
  { id: "C-404", title: "Sản phẩm Bảo hiểm Liên kết Đầu tư 2026", category: "Sản phẩm", duration: "2h 15m", level: "Foundational", required: false, progress: 0, tag: "New", instructor: "Trần Đức Minh" },
  { id: "C-405", title: "Discovery Conversation — Master Class", category: "Kỹ năng tư vấn", duration: "5h 00m", level: "Advanced", required: false, progress: 48, tag: "Recommended", instructor: "Cathy Lin" },
  { id: "C-406", title: "Portfolio Rebalancing Strategy", category: "Chuyên môn cốt lõi", duration: "3h 30m", level: "Intermediate", required: false, progress: 0, tag: "Recommended", instructor: "Đỗ Thanh Hà" }
];

const SKILL_GAPS = [
  { skill: "Investment Planning", current: 78, target: 90, delta: 12 },
  { skill: "Behavioral Coaching", current: 62, target: 85, delta: 23 },
  { skill: "Tax Optimization (VN)", current: 54, target: 80, delta: 26 },
  { skill: "Estate & Legacy", current: 41, target: 75, delta: 34 },
  { skill: "Insurance Linked Products", current: 71, target: 85, delta: 14 },
  { skill: "Compliance & AML", current: 92, target: 95, delta: 3 }
];

const CERTS = [
  { code: "CFP®", name: "Certified Financial Planner", issued: "2022 · Renewed 2025", status: "active", expires: "Q3/2028" },
  { code: "IFP", name: "Investment Foundation Program", issued: "2021", status: "active", expires: "Lifetime" },
  { code: "AML-2", name: "Advanced AML Specialist", issued: "2024", status: "active", expires: "Q1/2027" },
  { code: "LIC", name: "Life Insurance Consultant", issued: "2023", status: "renew", expires: "Q4/2025 — sắp hết hạn" }
];

const BADGES = [
  { name: "Discovery Pro", earned: true, tier: "Gold" },
  { name: "Onboarding Speedster", earned: true, tier: "Silver" },
  { name: "AML Sentinel", earned: true, tier: "Gold" },
  { name: "Behavioral Coach", earned: false, tier: "Bronze" },
  { name: "Portfolio Architect", earned: false, tier: "Silver" },
  { name: "Mentor of the Quarter", earned: true, tier: "Platinum" }
];

const NETWORK_PEOPLE = [
  { id: "P-01", name: "Trần Quân", role: "Client Advisor · CA", strength: 92, channel: "Co-owner C-1142", avatar: "TQ", tag: "Peer" },
  { id: "P-02", name: "Lê Khánh", role: "Senior Advisor · BMI-4", strength: 78, channel: "Mentor", avatar: "LK", tag: "Mentor" },
  { id: "P-03", name: "Phạm Quỳnh", role: "Product Specialist · Bond", strength: 64, channel: "Expert", avatar: "PQ", tag: "Expert" },
  { id: "P-04", name: "Nguyễn Bảo Châu", role: "Behavioral Finance", strength: 48, channel: "Trainer", avatar: "BC", tag: "Expert" },
  { id: "P-05", name: "Đỗ Thanh Hà", role: "Compliance Officer", strength: 70, channel: "Support", avatar: "TH", tag: "Support" },
  { id: "P-06", name: "Lý Khắc Anh", role: "Region Director", strength: 32, channel: "Leadership", avatar: "KA", tag: "Leader" },
  { id: "P-07", name: "Hồ Mỹ Linh", role: "Mass Affluent Advisor", strength: 56, channel: "Peer", avatar: "ML", tag: "Peer" },
  { id: "P-08", name: "Vũ Đức Tâm", role: "Insurance Expert", strength: 60, channel: "Expert", avatar: "VT", tag: "Expert" }
];

const KPI_VALUE = [
  { name: "Client Satisfaction (NPS)", value: 64, target: 60, unit: "", trend: 8, kind: "value" },
  { name: "Retention Rate 12T", value: 96.4, target: 94, unit: "%", trend: 1.2, kind: "value" },
  { name: "Portfolio Quality Score", value: 8.6, target: 8.0, unit: "/10", trend: 0.4, kind: "value" },
  { name: "Time-to-Onboard", value: 4.2, target: 5.0, unit: " ngày", trend: -0.6, kind: "value" }
];
const KPI_TRAD = [
  { name: "Doanh số YTD", value: 18.4, target: 22.0, unit: " tỷ", trend: 12.2, kind: "trad" },
  { name: "AUM phụ trách", value: 184.2, target: 200, unit: " tỷ", trend: 6.8, kind: "trad" },
  { name: "Số hợp đồng mới", value: 42, target: 50, unit: "", trend: 4, kind: "trad" },
  { name: "Số KH active", value: 128, target: 130, unit: "", trend: 6, kind: "trad" }
];

const OM_LIST = [
  { id: "OM-882", client: "Lê Văn Việt", initials: "LV", workflow: "Q4 Reactivation · Wealth", channel: "Email + Zalo", step: "3/5", due: "Hôm nay 15:00", state: "due", kind: "OM" },
  { id: "OM-879", client: "Trần Ngọc Nhi", initials: "TN", workflow: "Onboard Follow-up D+14", channel: "Email", step: "2/4", due: "Mai", state: "ok", kind: "OM" },
  { id: "DM-771", client: "Phạm Quốc Bảo", initials: "PB", workflow: "Direct — Question reply", channel: "Zalo", step: "—", due: "Pending 2h", state: "pending", kind: "DM" },
  { id: "OM-868", client: "Hoàng Thị Mai", initials: "HM", workflow: "Annual Review Kick-off", channel: "Email + Call", step: "1/6", due: "Thứ Sáu", state: "ok", kind: "OM" },
  { id: "OM-866", client: "Đỗ Trung Kiên", initials: "DK", workflow: "Risk Re-profile Campaign", channel: "Zalo", step: "4/5", due: "Quá hạn 1d", state: "overdue", kind: "OM" },
  { id: "DM-770", client: "Nguyễn Thanh Hà", initials: "NH", workflow: "Direct — Schedule call", channel: "Call", step: "—", due: "Today 17:00", state: "due", kind: "DM" }
];

const TOOLS = [
  { id: "agenda", title: "Agenda Builder", desc: "Soạn agenda cho buổi gặp KH theo template hoặc tuỳ biến", icon: "list_alt", color: "vnd-primary-500" },
  { id: "recorder", title: "Session Recorder", desc: "Tóm tắt cuộc gặp: notes, action items, follow-up", icon: "mic", color: "vnd-accent-green" },
  { id: "report", title: "Report Generator", desc: "Tạo báo cáo tuỳ chỉnh theo KH hoặc danh mục", icon: "summarize", color: "vnd-primary-700" },
  { id: "sim", title: "Portfolio Simulator", desc: "Mô phỏng kịch bản danh mục đầu tư / bảo hiểm", icon: "ssid_chart", color: "anvie-primary" },
  { id: "compliance", title: "Compliance Check", desc: "Kiểm tra tính phù hợp với hồ sơ KH", icon: "fact_check", color: "vnd-warning" },
  { id: "templates", title: "Templates", desc: "Email, script cuộc gọi, proposal deck", icon: "auto_awesome_mosaic", color: "pti-primary" },
  { id: "calc", title: "Calculators", desc: "FV/PV, bảo hiểm nhân thọ, retirement", icon: "calculate", color: "vnd-primary-500" }
];

const PRODUCTS = [
  { id: "P-INV-21", name: "VPF Tích sản 5 năm", category: "Investment Fund", risk: "Trung bình", aum: "1,820 tỷ", yield: "9.4% YTD", trend: "up", recommended: true },
  { id: "P-INS-04", name: "Manulife Heritage Linked", category: "Insurance Linked", risk: "Thấp - TB", aum: "—", yield: "Phí 2%", trend: "flat", recommended: true },
  { id: "P-BND-12", name: "VIB Trái phiếu Doanh nghiệp 24T", category: "Bond", risk: "Trung bình", aum: "640 tỷ", yield: "8.2% p.a", trend: "up", recommended: false },
  { id: "P-EQT-08", name: "VietCap Growth Equity Basket", category: "Equity Basket", risk: "Cao", aum: "320 tỷ", yield: "16.1% YTD", trend: "up", recommended: false },
  { id: "P-INV-29", name: "VinaCapital Balanced Fund", category: "Mutual Fund", risk: "Trung bình", aum: "2,140 tỷ", yield: "11.2% YTD", trend: "up", recommended: true },
  { id: "P-INS-09", name: "Sunlife Edu Future", category: "Insurance Linked", risk: "Thấp", aum: "—", yield: "Phí 1.4%", trend: "flat", recommended: false }
];

const TASKS = [
  { id: "T-01", title: "Gọi xác nhận buổi gặp 14:30 với Lê Văn Việt", project: "Pipeline · Advise", priority: "P1", due: "09:30", done: false, nac: true },
  { id: "T-02", title: "Gửi proposal V2 cho Trần Ngọc Nhi", project: "Onboarding · Step 5", priority: "P1", due: "11:00", done: false, nac: true },
  { id: "T-03", title: "Review compliance check — Bảo Logistics", project: "Compliance", priority: "P2", due: "13:00", done: false, nac: false },
  { id: "T-04", title: "Callback missed call — Đỗ Trung Kiên", project: "Active · DK", priority: "P1", due: "14:00", done: false, nac: true },
  { id: "T-05", title: "Soạn agenda họp annual review — H.M Education", project: "Tool · Agenda", priority: "P2", due: "16:00", done: true, nac: false },
  { id: "T-06", title: "Log interaction Zalo — Tô Anh Khoa", project: "Lead · Identify", priority: "P3", due: "17:30", done: false, nac: false }
];

const ONBOARD_STEPS = [
  { id: 1, key: "intake", label: "Tiếp nhận hồ sơ", state: "done", note: "CMND/CCCD + thông tin liên hệ", actor: "Hoàng Anh", at: "T2 09:15" },
  { id: 2, key: "ekyc", label: "eKYC", state: "done", note: "Đã xác minh khuôn mặt + liveness", actor: "Auto", at: "T2 09:42" },
  { id: 3, key: "aml", label: "AML / PEP Check", state: "done", note: "Sạch · Watchlist clear", actor: "Compliance Bot", at: "T2 10:11", gate: true },
  { id: 4, key: "risk", label: "Risk Profiling", state: "current", note: "Đang chờ KH hoàn thành bảng câu hỏi (12/20)", actor: "KH thực hiện", at: "Đang chạy", gate: true },
  { id: 5, key: "contract", label: "Ký hợp đồng", state: "pending", note: "—", actor: "—", at: "—" },
  { id: 6, key: "account", label: "Cấp tài khoản", state: "pending", note: "—", actor: "Ops team", at: "—" },
  { id: 7, key: "handoff", label: "Handoff sang CA", state: "pending", note: "—", actor: "Trần Quân (CA)", at: "—" }
];

const ANNOUNCEMENTS = [
  { id: 1, level: "info", title: "Sản phẩm mới: Sunlife Edu Future 2026", body: "Tài liệu training đã có trên iLead · Course Library.", at: "Sáng nay" },
  { id: 2, level: "warn", title: "Chứng chỉ LIC sắp hết hạn", body: "Đăng ký renewal trước 30/11 để giữ trạng thái active.", at: "2 ngày" },
  { id: 3, level: "info", title: "Cập nhật chính sách AML Q4", body: "Threshold giao dịch nội địa giảm xuống 350M.", at: "Tuần trước" }
];

// =============== CLIENT PROFILE — DETAIL MOCK ===============
// Tier ladder (Mass → Institutional). Mapped from a client's segment.
const TIER_LADDER = ["Mass", "MP", "KHL Standard", "KHL Pro", "Institutional"];
const SEGMENT_TO_TIER = {
  "Emerging Affluent": "MP",
  "Mass Affluent": "KHL Standard",
  "Private Wealth": "KHL Pro"
};

// CJ (Customer Journey) stages with order, used for the journey strip.
const CJ_STAGES = [
  { key: "start",  label: "Khởi đầu",     icon: "flag" },
  { key: "grow",   label: "Phát triển",   icon: "trending_up" },
  { key: "mature", label: "Trưởng thành", icon: "workspace_premium" },
  { key: "auto",   label: "Tự chủ",       icon: "auto_awesome" }
];

// Per-client NAC (Next Action / alert) state → overlay content.
const NAC_BY_STATE = {
  alert: {
    severity: "P1", sla: "04:12:38", slaPct: 38,
    trigger: "Margin call risk",
    desc: "Tỷ lệ ký quỹ chạm ngưỡng cảnh báo (87%) sau phiên giảm. Cần liên hệ trong SLA 4 giờ.",
    carePlan: 25
  },
  watch: {
    severity: "P3", sla: "1 ngày 06:00", slaPct: 64,
    trigger: "Missed cadence",
    desc: "KH chưa được liên hệ theo cadence cam kết. Touchpoint tuần này còn thiếu.",
    carePlan: 0
  }
};

// Single rich mock detail. Values reflect the lead client (Lê Văn Việt);
// the profile blends in each client's own name/NAV/owners/contact where natural.
const CP_DATA = {
  // ---- DGO ----
  personal: {
    occupation: "Chủ doanh nghiệp · Hạ tầng",
    income: "> 5 tỷ / năm",
    channelPref: "Zalo",
    timePref: "Sáng 9–11h · T2–T6",
    language: "Tiếng Việt",
    education: "Thạc sĩ QTKD"
  },
  investor: {
    track: "VNDWealth",
    risk: "Tăng trưởng (Growth)",
    suitability: "Phù hợp · 72/100",
    wisdom: "Level 3 · Trusted Investor",
    experience: "8 năm",
    instruments: "Cổ phiếu · Quỹ mở · Trái phiếu DN"
  },
  lifeGoals: [
    { goal: "Tích sản giáo dục con", horizon: "15 năm", target: 8000, current: 2560, progress: 32 },
    { goal: "Quỹ hưu trí", horizon: "20 năm", target: 20000, current: 3600, progress: 18 },
    { goal: "Quỹ khẩn cấp (12 tháng chi tiêu)", horizon: "Liên tục", target: 1200, current: 1008, progress: 84 }
  ],
  lifeEvents: {
    past: [
      { when: "2024", label: "Thoái vốn cổ phần công ty con", icon: "sell" },
      { when: "2022", label: "Nhận thừa kế bất động sản", icon: "real_estate_agent" },
      { when: "2021", label: "Thành lập doanh nghiệp thứ 2", icon: "domain_add" }
    ],
    upcoming: [
      { when: "Q3/2026", label: "Con vào đại học (dự kiến)", icon: "school" },
      { when: "2028", label: "Nghỉ hưu một phần", icon: "beach_access" }
    ]
  },
  idp: {
    current: "KHL Standard", next: "KHL Pro",
    requirement: "NAV ≥ 5 tỷ · sở hữu ≥ 3 nhóm sản phẩm",
    tierProgress: 68, contractProgress: 40,
    note: "Còn thiếu 180 tr NAV và 1 nhóm sản phẩm (Bảo hiểm liên kết)."
  },
  products: [
    { name: "VNDWealth Managed", type: "Quản lý danh mục uỷ thác", meta: "Từ 2023", icon: "account_balance" },
    { name: "Dcash Grow", type: "Tiền gửi linh hoạt", meta: "Số dư 320 tr · 4.6%/năm", icon: "savings" },
    { name: "Margin VNDTrade", type: "Hạn mức ký quỹ", meta: "Hạn mức 2 tỷ", icon: "trending_up" },
    { name: "VNDSIP", type: "Đầu tư định kỳ", meta: "12 tr/tháng", icon: "event_repeat" }
  ],
  accountInfra: [
    { k: "Tài khoản CK", v: "066C123456" },
    { k: "Tài khoản phái sinh", v: "Chưa kích hoạt" },
    { k: "Ngân hàng liên kết", v: "VCB · ••••4419" },
    { k: "eContract", v: "Đã ký · 12/2023" }
  ],
  compliance: [
    { k: "KYC", state: "valid", note: "Hết hạn 12/2027" },
    { k: "AML screening", state: "valid", note: "Clear watchlist" },
    { k: "PEP flag", state: "valid", note: "Non-PEP" },
    { k: "FATCA", state: "valid", note: "Non-US person" },
    { k: "COI hôm nay", state: "pending", note: "Chưa khai báo trước cuộc gọi" }
  ],

  // ---- DACCOUNT ----
  balanceSheet: { assets: 19620, liabilities: 850 },
  // NAV growth (tr) — last 12 points
  navSeries: [3850, 3920, 4010, 3980, 4120, 4260, 4180, 4340, 4480, 4520, 4690, 4820],
  vndsCash: [
    { k: "Tiền mặt khả dụng", v: "612 tr" },
    { k: "Chờ về (T+2)", v: "85 tr" },
    { k: "Phong toả", v: "0 tr" }
  ],
  heldAway: [
    { type: "Chứng khoán tại broker khác", detail: "SSI · VPS", value: 1800, icon: "account_balance_wallet" },
    { type: "Bất động sản", detail: "2 BĐS · TP.HCM, Đà Lạt", value: 12000, icon: "home_work" },
    { type: "Tiền gửi ngân hàng", detail: "VCB · TCB", value: 2400, icon: "account_balance" },
    { type: "Vàng & tài sản khác", detail: "Vàng miếng · sưu tầm", value: 600, icon: "diamond" }
  ],
  household: {
    members: [
      { name: "Phạm Thị Lan", relation: "Vợ", nav: 3200, tone: "purple" },
      { name: "Lê Minh Khôi", relation: "Con · Trust", nav: 1500, tone: "amber" }
    ],
    structures: "1 trust giáo dục · 1 công ty holding gia đình"
  },
  debt: {
    marginUsed: 850, marginLimit: 2000, rate: "13.5% / năm",
    statements: [
      { d: "01/05", desc: "Lãi vay margin tháng 4", amt: "−9.2 tr" },
      { d: "01/04", desc: "Lãi vay margin tháng 3", amt: "−8.7 tr" }
    ]
  },
  performance: {
    realized: 420, unrealized: 180, cumulativeRoi: 38.4,
    benchSeries: [0, 2, 3, 5, 4, 7, 9, 8, 11, 12, 13, 15],
    portfolioSeries: [0, 3, 5, 6, 9, 12, 11, 15, 18, 22, 24, 28]
  },

  // ---- DINVEST ----
  journeyHistory: [
    { stage: "Khởi đầu", at: "Q3/2023", note: "Mở tài khoản · onboard" },
    { stage: "Phát triển", at: "Q1/2024", note: "Đa dạng hoá danh mục" },
    { stage: "Trưởng thành", at: "Q4/2025", note: "Uỷ thác VNDWealth" }
  ],
  trades: [
    { d: "14/05", p: "VPF Tích sản 5 năm", t: "BUY", v: "+120 tr", status: "Khớp" },
    { d: "10/05", p: "VIB Trái phiếu DN 24T", t: "BUY", v: "+200 tr", status: "Khớp" },
    { d: "02/05", p: "VietCap Equity Basket", t: "SELL", v: "−85 tr", status: "Khớp" },
    { d: "28/04", p: "Sunlife Edu Future", t: "Premium", v: "−18 tr", status: "Thành công" },
    { d: "20/04", p: "HPG", t: "BUY", v: "+64 tr", status: "Khớp một phần" }
  ],
  corporateActions: {
    upcoming: [
      { d: "18/06", code: "HPG", type: "Cổ tức tiền mặt", detail: "500đ/cp · ~3.2 tr", icon: "payments" },
      { d: "25/06", code: "MWG", type: "Quyền mua", detail: "Tỷ lệ 10:1 · giá 30.000đ", icon: "confirmation_number" }
    ],
    history: [
      { d: "12/03", code: "FPT", type: "Cổ tức cổ phiếu", detail: "Tỷ lệ 20% · đã về" },
      { d: "04/02", code: "VNM", type: "Cổ tức tiền mặt", detail: "1.450đ/cp · đã nhận" }
    ]
  },
  nba: [
    { action: "Rebalance: tăng tỷ trọng trái phiếu 24% → 30%", reason: "Khẩu vị Growth nhưng cash 12% đang nhàn rỗi; giảm beta trước mùa báo cáo.", type: "Rebalance", priority: "P1" },
    { action: "Cross-sell: Bảo hiểm liên kết đầu tư", reason: "Còn thiếu để lên tier KHL Pro · phù hợp goal giáo dục con.", type: "Cross-sell", priority: "P2" },
    { action: "Đặt lịch Annual Review Q2", reason: "Cadence P1 · đã 34 ngày chưa review danh mục.", type: "Cadence", priority: "P2" }
  ],

  // ---- DLINK ----
  careBy: [
    { role: "CC · Client Advisor", name: "Hoàng Anh", code: "CA", tone: "blue", active: true, note: "Chủ sở hữu chính" },
    { role: "AC · Advisor Expert", name: "Trần Quân", code: "AE", tone: "green", active: true, note: "Hiện khi NAC active" },
    { role: "PC · Client Service", name: "Lê Khánh", code: "CSA", tone: "amber", active: false, note: "Hiện khi HĐ signed" },
    { role: "Backup · CSE", name: "Hồ Mỹ Linh", code: "CSE", tone: "slate", active: true, note: "Dự phòng" }
  ],
  network: {
    referredBy: { name: "Nguyễn Văn Tuấn", relation: "Referral · KH hiện hữu", avatar: "NT" },
    referredOut: [
      { name: "Đặng Thu Hằng", relation: "Đồng nghiệp", status: "Đã mở TK", avatar: "DH" },
      { name: "Vũ Quốc Hùng", relation: "Đối tác KD", status: "Đang pipeline", avatar: "VH" }
    ],
    internal: [
      { name: "Phạm Quỳnh", role: "Product Specialist · Bond", avatar: "PQ" },
      { name: "Đỗ Thanh Hà", role: "Compliance Officer", avatar: "TH" }
    ]
  },
  cadence: {
    committed: "P1 · Hàng ngày (touchpoint ≥ 2/tuần)",
    nextContact: "Thứ Sáu · 14:30",
    missing: 1,
    period: "Tuần này: 1/2 touchpoint"
  },
  coi: {
    standing: "Không có xung đột lợi ích được khai báo · cập nhật Q1/2026",
    perCall: "Chưa khai báo COI trước cuộc gọi hôm nay"
  },

  // ---- KYC profile (Need map · Risk map · X-map) ----
  kyc: {
    needMap: [
      { need: "Tích sản dài hạn", priority: "Cao", coverage: 70, status: "Đang đáp ứng", product: "VNDWealth Managed", icon: "savings" },
      { need: "Giáo dục con", priority: "Cao", coverage: 45, status: "Một phần", product: "VNDSIP 12tr/tháng", icon: "school" },
      { need: "Hưu trí", priority: "Cao", coverage: 25, status: "Thiếu", product: "Quỹ hưu trí (gợi ý)", icon: "elderly" },
      { need: "Bảo vệ thu nhập", priority: "Trung bình", coverage: 30, status: "Thiếu", product: "BH liên kết (gợi ý)", icon: "health_and_safety" },
      { need: "Thanh khoản khẩn cấp", priority: "Trung bình", coverage: 90, status: "Đủ", product: "Dcash Grow", icon: "bolt" }
    ],
    riskMap: {
      tolerance: 72, capacity: 65, required: 58, profile: "Tăng trưởng (Growth)",
      note: "Khả năng chịu rủi ro (capacity 65) thấp hơn mức sẵn sàng (tolerance 72) — nên giữ beta danh mục ở mức vừa phải.",
      factors: [
        { k: "Thời gian đầu tư", v: "Dài (>10 năm)", score: 80 },
        { k: "Tỷ trọng thu nhập từ đầu tư", v: "Trung bình", score: 60 },
        { k: "Kinh nghiệm thị trường", v: "8 năm", score: 75 },
        { k: "Phản ứng khi thua lỗ", v: "Bình tĩnh, mua thêm", score: 70 },
        { k: "Nghĩa vụ tài chính", v: "Có khoản vay margin", score: 50 }
      ]
    },
    xMap: [
      { product: "Bảo hiểm liên kết đầu tư", fit: 88, reason: "Lấp nhu cầu bảo vệ + đủ điều kiện lên tier KHL Pro", status: "Ưu tiên", tone: "green" },
      { product: "Quỹ hưu trí tự nguyện", fit: 76, reason: "Mục tiêu hưu trí đang thiếu coverage (25%)", status: "Đề xuất", tone: "blue" },
      { product: "Trái phiếu DN kỳ hạn 24T", fit: 64, reason: "Tăng thu nhập cố định, giảm beta trước mùa báo cáo", status: "Đề xuất", tone: "blue" },
      { product: "Margin top-up", fit: 40, reason: "Hạn mức còn 1.15 tỷ — cân nhắc theo khẩu vị rủi ro", status: "Theo dõi", tone: "amber" }
    ]
  },

  // ---- Daccount › Báo cáo tài sản (asset/debt tree) ----
  assetReport: {
    assets: [
      { label: "TIỀN", cat: true, children: [
        { label: "Tiền sẵn sàng giao dịch", children: [
          { label: "Số dư tiền tài khoản phái sinh", value: 0 },
          { label: "Số dư tiền tài khoản cơ sở", value: 560 }
        ] },
        { label: "Tiền chờ về", children: [
          { label: "Tiền cổ tức chờ về", value: 8 },
          { label: "Tiền bán chờ về chưa ứng", children: [
            { label: "Tiền bán khớp", value: 22 },
            { label: "Tiền bán đã ứng trước", value: 0 }
          ] },
          { label: "Tiền chờ về trái phiếu", value: 12 },
          { label: "Tiền ký quỹ phái sinh chờ rút", value: 0 },
          { label: "Tiền chờ về khác", value: 0 }
        ] },
        { label: "Tiền phong tỏa", children: [
          { label: "Tiền mua chờ khớp", value: 10 },
          { label: "Tiền chờ ký quỹ phái sinh", value: 0 },
          { label: "Tiền phong tỏa khác", value: 0 }
        ] }
      ] },
      { label: "DCASH GROW", cat: true, value: 320 },
      { label: "HEALTH - TÀI CHÍNH AN SINH", cat: true, children: [
        { label: "Tích sản hưu trí", value: 150 },
        { label: "Đầu tư tạo thu nhập cố định", children: [
          { label: "Tiền chờ giao dịch", children: [
            { label: "Số dư tiền qua đêm", value: 0 },
            { label: "Số dư tiền khác", value: 0 }
          ] },
          { label: "Quỹ mở trái phiếu", value: 0 },
          { label: "Trái phiếu", children: [
            { label: "DBond", value: 180 },
            { label: "VBond", value: 60 },
            { label: "Trái phiếu khác", value: 0 }
          ] }
        ] },
        { label: "DSIP hưu trí", value: 60 },
        { label: "DSIP dự phòng", value: 40 }
      ] },
      { label: "WEALTH - ĐẦU TƯ TÍCH SẢN MỤC TIÊU", cat: true, children: [
        { label: "Tích sản mục tiêu", value: 200 },
        { label: "Quỹ mở cổ phiếu", value: 180 },
        { label: "Single Stock Saving", value: 90 },
        { label: "DSIP Linh hoạt", value: 70 },
        { label: "DSIP Mục tiêu", value: 110 }
      ] },
      { label: "GROWTH - ĐẦU TƯ TĂNG TRƯỞNG", cat: true, children: [
        { label: "Chứng chỉ quỹ ETF", value: 130 },
        { label: "Cổ phiếu, chứng chỉ quỹ đóng", children: [
          { label: "Danh mục cổ phiếu", value: 1104 },
          { label: "Quyền chờ về", value: 0 }
        ] },
        { label: "Chứng quyền", value: 25 },
        { label: "DSIP Tăng trưởng", value: 85 },
        { label: "Chứng khoán phái sinh", value: 40 }
      ] }
    ],
    debts: [
      { label: "NỢ DỰ KIẾN TĂNG CUỐI NGÀY", cat: true, value: 0 },
      { label: "DƯ NỢ THẤU CHI PHÁI SINH", cat: true, value: 0 },
      { label: "GIAO DỊCH KÝ QUỸ", cat: true, children: [
        { label: "Dư nợ gốc", children: [
          { label: "+ DMargin", value: 850 },
          { label: "+ Smart T+", value: 0 },
          { label: "+ T10", value: 0 },
          { label: "+ T15", value: 0 },
          { label: "+ Khác", value: 0 }
        ] },
        { label: "Lãi vay", children: [
          { label: "+ DMargin", value: 18 },
          { label: "+ Smart T+", value: 0 },
          { label: "+ T10", value: 0 },
          { label: "+ T15", value: 0 },
          { label: "+ Khác", value: 0 }
        ] }
      ] },
      { label: "PHÍ", cat: true, children: [
        { label: "Phí lưu ký phải trả", value: 0.3 },
        { label: "Phí phái sinh", children: [
          { label: "Phí quản lý tài sản ký quỹ", children: [
            { label: "Phí ký quỹ cộng dồn", value: 0 },
            { label: "Phí ký quỹ đến hạn", value: 0 }
          ] }
        ] },
        { label: "Phí giao dịch", value: 0 },
        { label: "Phí trả sở", value: 0 },
        { label: "Phí vị thế", value: 0 },
        { label: "Thuế thu nhập", value: 0 }
      ] }
    ]
  },

  // ---- Daccount › Tiền ----
  cashStatement: [
    { d: "14/05", desc: "Mua VPF Tích sản 5 năm", flow: "out", amt: "−120 tr", bal: "612 tr" },
    { d: "12/05", desc: "Cổ tức tiền mặt FPT", flow: "in", amt: "+8.4 tr", bal: "732 tr" },
    { d: "10/05", desc: "Nạp tiền từ VCB ••••4419", flow: "in", amt: "+300 tr", bal: "723.6 tr" },
    { d: "02/05", desc: "Bán VietCap Equity Basket", flow: "in", amt: "+85 tr", bal: "423.6 tr" },
    { d: "01/05", desc: "Lãi vay margin tháng 4", flow: "out", amt: "−9.2 tr", bal: "338.6 tr" }
  ],
  cashFlow: [
    { d: "18/06", label: "Cổ tức HPG", flow: "in", amt: "+3.2 tr", icon: "payments" },
    { d: "25/06", label: "Quyền mua MWG (nộp tiền)", flow: "out", amt: "−30 tr", icon: "confirmation_number" },
    { d: "01/07", label: "Lãi vay margin tháng 6", flow: "out", amt: "−8.9 tr", icon: "credit_card" },
    { d: "05/07", label: "Đáo hạn trái phiếu VIB (coupon)", flow: "in", amt: "+12 tr", icon: "account_balance" }
  ],

  // ---- Daccount › Nợ (chi tiết) ----
  debtDetail: {
    status: "Bình thường", marginRatio: 43, callLevel: 87, forceLevel: 95,
    outstanding: [
      { k: "Dư nợ margin gốc", v: "850 tr" },
      { k: "Lãi dồn tích", v: "17.9 tr" },
      { k: "Phí khác", v: "0 tr" }
    ],
    statement: [
      { d: "01/05", desc: "Giải ngân margin", debit: "+200 tr", credit: "", bal: "850 tr" },
      { d: "01/05", desc: "Ghi lãi vay tháng 4", debit: "+9.2 tr", credit: "", bal: "859.2 tr" },
      { d: "20/04", desc: "Trả nợ một phần", debit: "", credit: "−150 tr", bal: "650 tr" },
      { d: "05/04", desc: "Giải ngân margin", debit: "+300 tr", credit: "", bal: "800 tr" }
    ]
  },

  // ---- Hồ sơ đầu tư (chi tiết) ----
  investTrack: {
    track: "VNDWealth", since: "Q1/2024",
    desc: "Track tư vấn uỷ thác toàn phần — VND chủ động phân bổ theo khẩu vị Growth và mục tiêu dài hạn.",
    milestones: [
      { at: "Q3/2023", label: "Gia nhập · VNDTrade tự giao dịch" },
      { at: "Q1/2024", label: "Chuyển sang VNDWealth (uỷ thác)" },
      { at: "Q4/2025", label: "Nâng hạn mức uỷ thác · thêm bond" }
    ]
  },
  wisdom: {
    level: 3, levelName: "Trusted Investor", progress: 64,
    ladder: [
      { lv: 1, name: "Beginner", done: true },
      { lv: 2, name: "Informed", done: true },
      { lv: 3, name: "Trusted Investor", done: false, current: true },
      { lv: 4, name: "Autonomous", done: false },
      { lv: 5, name: "Mentor", done: false }
    ],
    note: "Đạt Level 4 khi hoàn tất 2 khoá chứng chỉ và duy trì kỷ luật rebalance 3 quý liên tiếp."
  },
  experienceDetail: {
    years: "8 năm", style: "Đầu tư giá trị · tích sản",
    instruments: [
      { k: "Cổ phiếu niêm yết", lv: "Thành thạo", score: 85 },
      { k: "Quỹ mở / ETF", lv: "Thành thạo", score: 80 },
      { k: "Trái phiếu doanh nghiệp", lv: "Khá", score: 65 },
      { k: "Phái sinh", lv: "Cơ bản", score: 30 },
      { k: "Sản phẩm cấu trúc", lv: "Cơ bản", score: 25 }
    ]
  },

  // ---- DGO › HỒ SƠ CÁ NHÂN (4 nested tabs) ----
  hsCaNhan: {
    // Tab 1 · Thông tin cơ bản — only mock-specific fields; client.* spliced at render
    identity: {
      idIssueDate: "05/01/2019",
      idIssuePlace: "Cục CSQLHC về TTXH",
      idExpiry: "Không thời hạn",
      landline: null
    },
    address: {
      detail: "Số 24, ngõ 18 Trần Duy Hưng",
      ward: "Phường Trung Hoà",
      cityFull: "Thành phố Hà Nội"
    },
    system: {
      username: "0902184419",
      customerId: "0002052433",
      custodyNo: "021C906291",
      verifyKH: { v: "VERIFIED_ID", state: "ok" },
      verifyC06: { v: "Đã xác thực", state: "ok" },
      custStatus: { v: "ACTIVATED", state: "ok" },
      contractStatus: { v: "COMPLETED", state: "ok" },
      orderStatus: { v: "Mở đặt lệnh", state: "ok" },
      sid: "1234567890",
      pcod: null
    },
    // Tab 2 · Danh sách tài khoản
    baseAccounts: [
      { no: "0001833096", type: "Tài khoản giao dịch cơ sở", pkg: "DBA — Gói dịch vụ tư vấn đầu tư chứng khoán", nvcs: "ipa\\a.mg", status: "Active", vsd: "VSD xác nhận", done: "COMPLETED", activatedAt: "22/04/2026 16:01", createdAt: "22/04/2026 16:01" },
      { no: "0001833096-1", type: "Tài khoản ký quỹ (Margin)", pkg: "VNDTrade — Hạn mức 2 tỷ", nvcs: "ipa\\a.mg", status: "Active", vsd: "VSD xác nhận", done: "COMPLETED", activatedAt: "10/06/2026 09:20", createdAt: "08/06/2026 14:05" }
    ],
    derivativeAccounts: [],
    fundCertAccounts: [
      { no: "FUND-77210", type: "Tài khoản chứng chỉ quỹ", pkg: "VNDS Fmarket — Quỹ mở", nvcs: "ipa\\a.mg", status: "Active", vsd: "—", done: "COMPLETED", activatedAt: "15/05/2026 10:30", createdAt: "15/05/2026 10:30" }
    ],
    // Tab 3 · Danh sách uỷ quyền
    authorizations: [
      {
        stk: "0001833096", grantee: "Phạm Thị Lan", relation: "Vợ", customerId: "0002052901",
        from: "01/05/2026", to: "01/05/2027",
        perms: { View: true, Report: true, Cash: true, Buy: true, Sell: true, Sign: false, Transfer: false, Margin: false, RightOff: true }
      }
    ],
    // Tab 4 · Tài khoản thụ hưởng
    bankAccounts: [
      { no: "0902184419", beneficiary: "Lê Văn Việt", bank: "Vietcombank", branch: "CN Cầu Giấy", isDefault: true },
      { no: "19036712884019", beneficiary: "Lê Văn Việt", bank: "Techcombank", branch: "CN Hà Nội", isDefault: false }
    ],
    counterpartAccounts: []
  }
};

window.DSB_DATA = {
  ADVISOR, COMPASSES, SIDEBAR_NAV, matchSidebarItem, NAV, navGroupForRoute, PIPELINE_STAGES, LEADS, ACTIVE_CLIENTS, INTERACTIONS, ALLOCATION,
  COURSES, SKILL_GAPS, CERTS, BADGES, NETWORK_PEOPLE, KPI_VALUE, KPI_TRAD, OM_LIST, TOOLS,
  PRODUCTS, TASKS, ONBOARD_STEPS, ANNOUNCEMENTS, JOURNEY, GAP_PROMPTS,
  TIER_LADDER, SEGMENT_TO_TIER, CJ_STAGES, NAC_BY_STATE, CP_DATA
};
