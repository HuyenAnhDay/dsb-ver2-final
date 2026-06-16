/* global React, window */
// Shared UI primitives for DSB. Loaded before screen modules.

const { useState, useEffect, useRef, useMemo, useCallback, createContext, useContext, Fragment } = React;

// --- Icon ---
function Icon({ name, className = "", filled = false, weight = 400, size = 20, style }) {
  const fvs = `'FILL' ${filled ? 1 : 0}, 'wght' ${weight}, 'GRAD' 0, 'opsz' 24`;
  return (
    <span
      className={`material-symbols-outlined select-none ${className}`}
      style={{ fontVariationSettings: fvs, fontSize: size, lineHeight: 1, ...(style || {}) }}
    >{name}</span>
  );
}

// --- Avatar ---
function Avatar({ initials, name, size = 36, tone = "blue", className = "", subtle = false }) {
  const palette = {
    blue:   ["#0077ED", "#CCE5FF"],
    green:  ["#00C97D", "#CFF6E5"],
    amber:  ["#FF8C33", "#FFE3CC"],
    purple: ["#8B2E8F", "#EDD8EE"],
    slate:  ["#424753", "#E1E2EB"],
    rose:   ["#E11D48", "#FDD5DE"]
  };
  const [fg, bg] = palette[tone] || palette.blue;
  const label = initials || (name ? name.split(" ").slice(-2).map(s => s[0]).join("").toUpperCase() : "??");
  return (
    <div
      className={`inline-flex items-center justify-center rounded-full font-display font-semibold tracking-tight ${className}`}
      style={{
        width: size, height: size, fontSize: Math.max(11, Math.round(size * 0.36)),
        backgroundColor: subtle ? bg : bg,
        color: subtle ? fg : fg,
        boxShadow: subtle ? "none" : `inset 0 0 0 1px rgba(0,32,91,0.06)`
      }}
      title={name}
    >{label}</div>
  );
}

// --- Badge / Chip ---
function Badge({ children, tone = "neutral", size = "sm", icon, className = "" }) {
  const tones = {
    neutral:  "bg-surface-container-high text-on-surface-variant",
    blue:     "bg-vnd-primary-50 text-vnd-primary-700",
    green:    "bg-emerald-50 text-emerald-700",
    amber:    "bg-amber-50 text-amber-700",
    red:      "bg-red-50 text-red-700",
    purple:   "bg-fuchsia-50 text-fuchsia-700",
    dark:     "bg-vnd-primary-900 text-white",
    outline:  "border border-outline-variant text-on-surface-variant",
    ghost:    "bg-white/60 backdrop-blur text-on-surface-variant border border-outline-variant/40"
  };
  const sizes = {
    xs: "text-[10px] px-1.5 py-0.5 gap-1",
    sm: "text-[11px] px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5"
  };
  return (
    <span className={`inline-flex items-center rounded-full font-semibold tracking-wide ${tones[tone]} ${sizes[size]} ${className}`}>
      {icon && <Icon name={icon} size={size === "md" ? 14 : 12} />}
      {children}
    </span>
  );
}

// --- Priority pill (P1/P2/P3/P4) ---
function PriorityPill({ level = "P2", className = "" }) {
  const map = {
    P1: { bg: "bg-red-500/10",     fg: "text-red-600",      ring: "ring-red-500/30",     dot: "bg-red-500" },
    P2: { bg: "bg-amber-500/10",   fg: "text-amber-700",    ring: "ring-amber-500/30",   dot: "bg-amber-500" },
    P3: { bg: "bg-vnd-primary-50", fg: "text-vnd-primary-700", ring: "ring-vnd-primary-200", dot: "bg-vnd-primary-500" },
    P4: { bg: "bg-surface-container-high", fg: "text-on-surface-variant", ring: "ring-outline-variant/50", dot: "bg-on-surface-variant" }
  }[level] || {};
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 text-[11px] font-bold ring-1 ${map.bg} ${map.fg} ${map.ring} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${map.dot}`}></span>{level}
    </span>
  );
}

// --- Button ---
function Button({ children, tone = "primary", size = "md", icon, iconRight, className = "", as: As = "button", ...props }) {
  const sizes = {
    xs: "h-7 px-2.5 text-[12px] gap-1.5 rounded-md",
    sm: "h-8 px-3 text-[13px] gap-1.5 rounded-lg",
    md: "h-9 px-4 text-sm gap-2 rounded-lg",
    lg: "h-11 px-5 text-[15px] gap-2 rounded-xl",
    icon: "w-9 h-9 rounded-lg justify-center"
  };
  const tones = {
    primary:   "bg-vnd-primary-500 text-white hover:bg-vnd-primary-700 active:scale-[.98] shadow-xs",
    dark:      "bg-vnd-primary-900 text-white hover:bg-vnd-primary-950 active:scale-[.98]",
    soft:      "bg-vnd-primary-50 text-vnd-primary-700 hover:bg-vnd-primary-100",
    neutral:   "bg-surface-container-high text-on-surface hover:bg-surface-container-highest",
    outline:   "bg-white text-on-surface ring-1 ring-outline-variant hover:bg-surface-container-low",
    ghost:     "text-on-surface-variant hover:bg-surface-container-high",
    danger:    "bg-red-50 text-red-700 hover:bg-red-100",
    success:   "bg-emerald-500 text-white hover:bg-emerald-600",
    link:      "text-vnd-primary-700 hover:underline px-0 h-auto"
  };
  return (
    <As
      className={`inline-flex items-center font-display font-medium whitespace-nowrap transition-all ${sizes[size]} ${tones[tone]} ${className}`}
      {...props}
    >
      {icon && <Icon name={icon} size={size === "lg" ? 18 : 16} weight={500} />}
      {children}
      {iconRight && <Icon name={iconRight} size={size === "lg" ? 18 : 16} weight={500} />}
    </As>
  );
}

// --- Card ---
function Card({ children, className = "", padded = true, hoverable = false }) {
  return (
    <section className={`bg-surface-container-lowest rounded-2xl shadow-soft ring-1 ring-vnd-primary-900/5 ${padded ? "p-6" : ""} ${hoverable ? "transition-shadow hover:shadow-lift" : ""} ${className}`}>
      {children}
    </section>
  );
}

function SectionTitle({ children, sub, action, className = "" }) {
  return (
    <div className={`flex items-end justify-between gap-4 mb-4 ${className}`}>
      <div>
        <h3 className="font-display text-title-lg text-vnd-primary-900">{children}</h3>
        {sub && <p className="text-body-sm text-on-surface-variant mt-0.5">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

// --- Tabs ---
function Tabs({ value, onChange, tabs, dense = false, className = "" }) {
  return (
    <div className={`flex items-center gap-1 ${dense ? "" : "border-b border-outline-variant/40"} ${className}`}>
      {tabs.map(t => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`relative inline-flex items-center gap-2 font-display font-medium transition-all
              ${dense ? "px-3 py-1.5 rounded-md text-[13px]" : "px-4 py-3 text-sm"}
              ${active
                ? (dense ? "bg-vnd-primary-900 text-white" : "text-vnd-primary-700")
                : (dense ? "text-on-surface-variant hover:bg-surface-container-high" : "text-on-surface-variant hover:text-on-surface")}`}
          >
            {t.icon && <Icon name={t.icon} size={16} />}
            <span>{t.label}</span>
            {typeof t.count === "number" && (
              <span className={`text-[10px] font-bold rounded-full px-1.5 py-0.5 ${active && !dense ? "bg-vnd-primary-700 text-white" : "bg-surface-container-high text-on-surface-variant"}`}>{t.count}</span>
            )}
            {!dense && active && <span className="absolute left-2 right-2 -bottom-px h-0.5 rounded-full bg-vnd-primary-700"></span>}
          </button>
        );
      })}
    </div>
  );
}

// --- Toggle / Switch ---
function Toggle({ on, onChange, label, hint }) {
  return (
    <label className="inline-flex items-center gap-3 cursor-pointer select-none">
      <span className={`relative w-9 h-5 rounded-full transition-colors ${on ? "bg-vnd-primary-500" : "bg-surface-container-highest"}`}>
        <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${on ? "translate-x-4" : ""}`}></span>
      </span>
      {(label || hint) && (
        <span>
          {label && <span className="block text-sm font-medium text-on-surface">{label}</span>}
          {hint && <span className="block text-[12px] text-on-surface-variant">{hint}</span>}
        </span>
      )}
      <input type="checkbox" className="sr-only" checked={!!on} onChange={(e) => onChange?.(e.target.checked)} />
    </label>
  );
}

// --- Modal ---
function Modal({ open, onClose, title, sub, children, footer, size = "md" }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => { if (e.key === "Escape") onClose?.(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  const widths = { sm: "max-w-md", md: "max-w-2xl", lg: "max-w-4xl", xl: "max-w-6xl" };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 animate-fade-in">
      <div className="absolute inset-0 bg-vnd-primary-950/40 backdrop-blur-sm" onClick={onClose}></div>
      <div className={`relative z-10 w-full ${widths[size]} bg-white rounded-2xl shadow-lift overflow-hidden`}>
        <div className="flex items-start justify-between gap-6 px-6 py-5 border-b border-outline-variant/40">
          <div>
            <h2 className="font-display text-title-lg text-vnd-primary-900">{title}</h2>
            {sub && <p className="text-body-sm text-on-surface-variant mt-1">{sub}</p>}
          </div>
          <button className="w-9 h-9 rounded-full hover:bg-surface-container-high flex items-center justify-center text-on-surface-variant" onClick={onClose}>
            <Icon name="close" size={20} />
          </button>
        </div>
        <div className="px-6 py-5 max-h-[70vh] overflow-y-auto scrollbar-thin">{children}</div>
        {footer && <div className="px-6 py-4 border-t border-outline-variant/40 flex items-center justify-end gap-2 bg-surface-container-low">{footer}</div>}
      </div>
    </div>
  );
}

// --- Drawer (right side) ---
function Drawer({ open, onClose, children, width = 720 }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 animate-fade-in">
      <div className="absolute inset-0 bg-vnd-primary-950/30 backdrop-blur-sm" onClick={onClose}></div>
      <aside
        className="absolute top-0 right-0 h-full bg-surface-container-low shadow-lift animate-slide-in overflow-hidden flex flex-col"
        style={{ width: `min(${width}px, 95vw)` }}
      >
        {children}
      </aside>
    </div>
  );
}

// --- TextField (uncontrolled-friendly) ---
function TextField({ label, hint, error, icon, suffix, className = "", inputClassName = "", as = "input", ...props }) {
  const C = as;
  return (
    <label className={`block ${className}`}>
      {label && <span className="block text-[12px] font-semibold text-on-surface mb-1">{label}</span>}
      <span className={`flex items-center gap-2 bg-white rounded-lg ring-1 ${error ? "ring-red-400" : "ring-outline-variant/60"} focus-within:ring-2 focus-within:ring-vnd-primary-500 px-3 h-10 transition-all`}>
        {icon && <Icon name={icon} size={18} className="text-on-surface-variant" />}
        <C className={`flex-1 bg-transparent outline-none text-sm placeholder:text-on-surface-variant/70 ${inputClassName}`} {...props} />
        {suffix}
      </span>
      {(hint || error) && <span className={`block text-[11px] mt-1 ${error ? "text-red-600" : "text-on-surface-variant"}`}>{error || hint}</span>}
    </label>
  );
}

// --- Empty state ---
function Empty({ icon = "inbox", title, sub, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-6">
      <div className="w-14 h-14 rounded-2xl bg-surface-container-high text-on-surface-variant flex items-center justify-center mb-4">
        <Icon name={icon} size={26} />
      </div>
      <p className="font-display text-title-md text-vnd-primary-900">{title}</p>
      {sub && <p className="text-body-sm text-on-surface-variant mt-1 max-w-sm">{sub}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// --- Sparkline ---
function Sparkline({ data, width = 120, height = 36, stroke = "#0077ED", fill = "rgba(0,119,237,0.12)" }) {
  if (!data || !data.length) return null;
  const max = Math.max(...data), min = Math.min(...data);
  const r = max - min || 1;
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * (width - 2) + 1;
    const y = height - 2 - ((d - min) / r) * (height - 6);
    return [x, y];
  });
  const line = pts.map((p, i) => (i ? "L" : "M") + p[0].toFixed(1) + "," + p[1].toFixed(1)).join(" ");
  const area = line + ` L${(width - 1).toFixed(1)},${(height - 1).toFixed(1)} L1,${(height - 1).toFixed(1)} Z`;
  return (
    <svg width={width} height={height} className="block">
      <path d={area} fill={fill} />
      <path d={line} fill="none" stroke={stroke} strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// --- Bar chart (simple) ---
function BarChart({ data, height = 160, format }) {
  const max = Math.max(...data.map(d => d.value)) || 1;
  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
          <span className="text-[10px] font-mono text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity">
            {format ? format(d.value) : d.value}
          </span>
          <div
            className={`w-full rounded-t-md transition-all ${d.highlight ? "bg-vnd-primary-500" : "bg-vnd-primary-100 group-hover:bg-vnd-primary-400"}`}
            style={{ height: `${(d.value / max) * 90 + 6}%` }}
          ></div>
          <span className="text-[10px] text-on-surface-variant">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

// --- DonutChart (allocation) ---
function DonutChart({ data, size = 180, thickness = 22, centerLabel, centerValue }) {
  const r = size / 2 - thickness / 2 - 2;
  const c = 2 * Math.PI * r;
  let offset = 0;
  const total = data.reduce((s, d) => s + d.pct, 0) || 100;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#eef2ff" strokeWidth={thickness} />
      {data.map((d, i) => {
        const seg = (d.pct / total) * c;
        const dash = `${seg} ${c - seg}`;
        const el = (
          <circle key={i}
            cx={size / 2} cy={size / 2} r={r}
            fill="none" stroke={d.color} strokeWidth={thickness}
            strokeDasharray={dash}
            strokeDashoffset={-offset}
            strokeLinecap="butt"
          />
        );
        offset += seg;
        return el;
      })}
      {(centerLabel || centerValue) && (
        <g transform={`rotate(90 ${size / 2} ${size / 2})`}>
          {centerValue && (
            <text x="50%" y="48%" textAnchor="middle" className="fill-vnd-primary-900" style={{ fontFamily: "Lexend", fontWeight: 700, fontSize: 22 }}>
              {centerValue}
            </text>
          )}
          {centerLabel && (
            <text x="50%" y="64%" textAnchor="middle" className="fill-on-surface-variant" style={{ fontFamily: "Inter", fontSize: 11, letterSpacing: 0.5 }}>
              {centerLabel}
            </text>
          )}
        </g>
      )}
    </svg>
  );
}

// --- Progress ring ---
function ProgressRing({ value = 50, size = 64, thickness = 6, label, sub }) {
  const r = size / 2 - thickness / 2 - 1;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size/2} cy={size/2} r={r} fill="none" strokeWidth={thickness} className="ring-track" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" strokeWidth={thickness}
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" className="ring-fill" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display font-bold text-vnd-primary-900" style={{ fontSize: Math.max(11, size * 0.28) }}>{label ?? value + "%"}</span>
        {sub && <span className="text-[9px] font-mono text-on-surface-variant uppercase tracking-wider">{sub}</span>}
      </div>
    </div>
  );
}

// --- Stat tile ---
function Stat({ label, value, sub, trend, icon, tone = "blue" }) {
  const tones = {
    blue:   "bg-vnd-primary-50 text-vnd-primary-700",
    green:  "bg-emerald-50 text-emerald-700",
    amber:  "bg-amber-50 text-amber-700",
    purple: "bg-fuchsia-50 text-fuchsia-700",
    slate:  "bg-surface-container-high text-on-surface-variant"
  };
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        {icon && <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${tones[tone]}`}><Icon name={icon} size={18} weight={500} /></div>}
        {typeof trend === "number" && (
          <span className={`inline-flex items-center gap-0.5 text-[11px] font-bold ${trend >= 0 ? "text-emerald-600" : "text-red-600"}`}>
            <Icon name={trend >= 0 ? "trending_up" : "trending_down"} size={14} />
            {trend > 0 ? "+" : ""}{trend}%
          </span>
        )}
      </div>
      <div>
        <p className="text-[11px] uppercase tracking-wider text-on-surface-variant font-semibold">{label}</p>
        <p className="font-display font-bold text-headline-md text-vnd-primary-900 mt-0.5">{value}</p>
        {sub && <p className="text-[12px] text-on-surface-variant mt-1">{sub}</p>}
      </div>
    </div>
  );
}

// --- Image placeholder ---
function ImageSlot({ label = "Product shot", ratio = "16/9", className = "" }) {
  return (
    <div className={`img-placeholder ${className}`} style={{ aspectRatio: ratio }}>
      <span>{label}</span>
    </div>
  );
}

// --- Search input chip-row ---
function FilterBar({ children, className = "" }) {
  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`}>{children}</div>
  );
}

function ChipToggle({ active, onClick, children, icon }) {
  return (
    <button onClick={onClick}
      className={`inline-flex items-center gap-1.5 h-8 px-3 rounded-full text-[12.5px] font-medium transition-all
        ${active
          ? "bg-vnd-primary-900 text-white"
          : "bg-white text-on-surface-variant ring-1 ring-outline-variant/60 hover:bg-surface-container-low"}`}>
      {icon && <Icon name={icon} size={14} />}
      {children}
    </button>
  );
}

// --- Toast bus ---
const ToastCtx = createContext(null);
function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const push = useCallback((msg, opts = {}) => {
    const id = Math.random().toString(36).slice(2);
    setItems(prev => [...prev, { id, msg, tone: opts.tone || "info", icon: opts.icon }]);
    setTimeout(() => setItems(prev => prev.filter(x => x.id !== id)), opts.duration || 3000);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-2 items-end">
        {items.map(t => {
          const tones = {
            info:    "bg-vnd-primary-900 text-white",
            success: "bg-emerald-600 text-white",
            warn:    "bg-amber-500 text-white",
            error:   "bg-red-600 text-white"
          };
          return (
            <div key={t.id} className={`pointer-events-auto px-4 py-2.5 rounded-xl shadow-lift flex items-center gap-2 animate-slide-in ${tones[t.tone]}`}>
              {t.icon && <Icon name={t.icon} size={18} />}
              <span className="text-sm font-medium">{t.msg}</span>
            </div>
          );
        })}
      </div>
    </ToastCtx.Provider>
  );
}
const useToast = () => useContext(ToastCtx);

// Currency formatter (VND short)
function vnd(value, unit = "M") {
  if (unit === "M") {
    if (value >= 1000) return (value / 1000).toFixed(1).replace(/\.0$/, "") + " tỷ";
    return value.toLocaleString("vi-VN") + " tr";
  }
  return value;
}

Object.assign(window, {
  Icon, Avatar, Badge, PriorityPill, Button, Card, SectionTitle, Tabs, Toggle, Modal, Drawer,
  TextField, Empty, Sparkline, BarChart, DonutChart, ProgressRing, Stat, ImageSlot, FilterBar,
  ChipToggle, ToastProvider, useToast, vnd,
  useState, useEffect, useRef, useMemo, useCallback, createContext, useContext, Fragment
});
