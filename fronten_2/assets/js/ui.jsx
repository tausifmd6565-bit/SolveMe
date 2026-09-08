// Shared UI Components — Clean, Institutional, Non-AI Aesthetic

const { useState, useEffect } = React;

function toast(msg, type = 'info') {
  const root = document.getElementById('toast-root');
  if (!root) return;
  const el = document.createElement('div');
  el.className = 'fixed bottom-5 right-5 z-50 px-4 py-2.5 rounded border shadow-md text-xs font-semibold flex items-center gap-2 fade-in ' + 
    (type === 'error' ? 'bg-red-50 border-red-200 text-red-800' : 'bg-slate-900 border-slate-800 text-white');
  el.textContent = msg;
  root.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transition = 'opacity .3s ease';
    setTimeout(() => el.remove(), 300);
  }, 3000);
}

const catById = (id) => CATEGORIES.find(c => c.id === id) || { name: id || 'Uncategorized', icon: '📌', code: 'GEN' };
const prOf = (p) => p.priority || SolveGridAI.computePriority(p);
const fmtDate = (ts) => {
  if (!ts) return 'Recent';
  const d = new Date(ts);
  return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

// Refined Category Tag: Minimal, authentic, no candy styling
function CategoryChip({ id }) {
  const c = catById(id);
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded border border-slate-200 bg-slate-50 text-slate-700 text-xs font-medium">
      <span className="text-xs">{c.icon}</span>
      <span>{c.name}</span>
    </span>
  );
}

// Refined Status Indicator: Clean dot indicator with slate border
function StatusBadge({ status }) {
  const conf = STATUS_CONFIG[status] || { dot: 'bg-slate-400', text: 'text-slate-700' };
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded border border-slate-200 bg-white text-xs font-medium text-slate-700">
      <span className={`status-dot ${conf.dot}`}></span>
      <span>{status}</span>
    </span>
  );
}

// Professional Priority Badge: Tiered, non-generic
function PriorityBadge({ p }) {
  const t = SolveGridAI.priorityTotal(p);
  const l = SolveGridAI.priorityLabel(t);
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold ${l.cls}`}>
      <span>Score: {t}/20</span>
    </span>
  );
}

// Clean Evidence Icon Box
function EvidenceTile({ type, name, big }) {
  const icons = { photo: '📷', video: '🎥', none: '📝' };
  return (
    <div className={`rounded-lg border border-slate-200 bg-slate-50 flex flex-col items-center justify-center ${big ? 'h-36' : 'h-20'}`}>
      <span className={big ? 'text-3xl' : 'text-xl'}>{icons[type] || icons.none}</span>
      <span className="text-[11px] text-slate-500 font-medium mt-1 px-2 truncate max-w-full">
        {name || (type === 'none' ? 'No Attachment' : 'Attached File')}
      </span>
    </div>
  );
}

// Transparent Rule-Based Priority Breakdown
function PriorityBreakdown({ p }) {
  const rows = [
    ['Community Endorsements', p.community || 0, 5, 'Citizen confirmations ("I also face this")'],
    ['Evidence Quality', p.evidence || 0, 3, 'Photographic or video verification'],
    ['Severity Signal', p.severity || 0, 5, 'Hazard and functional disruption score'],
    ['Urgency Factor', p.urgency || 0, 3, 'Time-sensitivity and hazard indicators'],
    ['Validator Signal', p.validation || 0, 4, 'Expert or institutional confirmation']
  ];
  const total = SolveGridAI.priorityTotal(p);
  const label = SolveGridAI.priorityLabel(total);

  return (
    <div className="portal-card rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">Priority Evaluation Metric</h4>
          <p className="text-[11px] text-slate-500">Transparent rule-based priority engine. Not an unverified black-box decision.</p>
        </div>
        <div className="text-right">
          <span className="text-lg font-bold text-slate-900">{total}</span>
          <span className="text-xs text-slate-400"> / 20</span>
        </div>
      </div>

      <div className="space-y-2 text-xs">
        {rows.map(([name, score, max, note]) => (
          <div key={name}>
            <div className="flex items-center justify-between mb-0.5 text-slate-700 font-medium">
              <span>{name}</span>
              <span className="font-semibold text-slate-900">{score} / {max}</span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
              <div 
                className="bg-slate-700 h-1.5 meter-fill rounded-full" 
                style={{ width: `${(score / max) * 100}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Milestone Progress Timeline
function Timeline({ items = [] }) {
  if (!items.length) {
    return <p className="text-xs text-slate-400 py-2">No lifecycle updates posted yet.</p>;
  }
  return (
    <div className="space-y-3 relative pl-4 border-l-2 border-slate-200 ml-1">
      {items.map((item, idx) => (
        <div key={idx} className="relative">
          <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-slate-800 ring-4 ring-white"></div>
          <p className="text-xs font-bold text-slate-900 leading-none">{item.status}</p>
          <p className="text-[11px] text-slate-400 mt-0.5">{fmtDate(item.at)}</p>
          <p className="text-xs text-slate-600 mt-1 leading-normal">{item.note}</p>
        </div>
      ))}
    </div>
  );
}

// Empty State Display
function EmptyState({ icon = '📋', title, sub }) {
  return (
    <div className="text-center py-12 px-4 border border-dashed border-slate-200 rounded-lg bg-white">
      <div className="text-3xl mb-2 text-slate-400">{icon}</div>
      <p className="text-sm font-semibold text-slate-800">{title}</p>
      {sub && <p className="text-xs text-slate-500 mt-0.5">{sub}</p>}
    </div>
  );
}

// Metric Stat Card
function StatCard({ label, value, sub, code }) {
  return (
    <div className="portal-card rounded-lg p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{label}</p>
        {code && <span className="text-[10px] font-mono text-slate-400">{code}</span>}
      </div>
      <p className="text-2xl font-bold text-slate-900 mt-1 tracking-tight">{value}</p>
      {sub && <p className="text-[11px] text-slate-500 mt-1">{sub}</p>}
    </div>
  );
}

// Spinner Loader
function Spinner({ text = 'Loading records...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="w-6 h-6 border-2 border-slate-300 border-t-slate-800 rounded-full animate-spin"></div>
      <p className="text-xs font-medium text-slate-500 mt-3">{text}</p>
    </div>
  );
}
