// Institutional & Administrative Portals (University & Government)

function ProLayout({ user, title, subtitle, nav, children }) {
  const currentHash = location.hash || nav[0]?.href;

  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shrink-0 border-r border-slate-800">
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-white text-slate-900 font-bold rounded flex items-center justify-center text-xs">
              SG
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-white">SolveGrid Pro</p>
              <p className="text-[10px] text-slate-400">Institutional Interface</p>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1 flex-1">
          {nav.map(item => {
            const active = currentHash === item.href;
            return (
              <a
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2.5 px-3 py-2 rounded text-xs font-medium transition-colors ${
                  active ? 'bg-slate-800 text-white font-semibold' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* User footer */}
        <div className="p-3 border-t border-slate-800 text-xs text-slate-400">
          <p className="font-semibold text-white truncate">{user.name}</p>
          <p className="text-[11px] capitalize text-slate-500">{user.role}</p>
          <button
            onClick={() => {
              sessionStorage.removeItem('sg_user');
              sessionStorage.removeItem('sg_token');
              location.hash = '#/';
              location.reload();
            }}
            className="mt-2 text-[11px] text-red-400 hover:text-red-300 font-medium"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-slate-200 px-6 py-3 flex items-center justify-between">
          <div>
            <h1 className="text-sm font-bold text-slate-900">{title}</h1>
            {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
          </div>
          <a href="#/feed" className="text-xs font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 rounded px-2.5 py-1">
            ← Switch to Citizen View
          </a>
        </header>

        <main className="p-6 flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

// 1. University & R&D Solver Dashboard
function InstitutionDashboard({ user }) {
  const org = ORGANIZATIONS[0]; // Demo BIT Mesra Civil & Environmental
  const [tab, setTab] = useState('matched');
  const [problems, setProblems] = useState(null);
  const [updateModal, setUpdateModal] = useState(null);
  const [note, setNote] = useState('');
  const [status, setStatus] = useState('In Progress');

  const myCats = CATEGORIES.filter(c => 
    (STAKEHOLDER_MAP[c.id]?.university_expertise || []).some(e => org.expertise.includes(e))
  ).map(c => c.id);

  const load = async () => {
    const all = await SolveGridAPI.listProblems({});
    setProblems(all);
  };

  useEffect(() => { load(); }, []);

  const matched = (problems || []).filter(p => myCats.includes(p.category));
  const active = (problems || []).filter(p => ['Adopted', 'In Progress', 'Prototype / Pilot'].includes(p.status) && myCats.includes(p.category));

  const handleAdopt = async (p) => {
    try {
      const res = await SolveGridAPI.expressInterest(p.id, org);
      toast(res.message);
      load();
    } catch (e) {
      toast(e.message, 'error');
    }
  };

  const handlePostUpdate = async () => {
    if (!note.trim()) return;
    try {
      await SolveGridAPI.addUpdate(updateModal.id, { note, status });
      toast('Progress milestone logged successfully.');
      setUpdateModal(null);
      setNote('');
      load();
    } catch (e) {
      toast(e.message, 'error');
    }
  };

  return (
    <ProLayout
      user={user}
      title={org.name}
      subtitle="Academic Problem-Solving & Prototype Hatchery"
      nav={[
        { href: '#/institution', icon: '🎯', label: 'Department Matched' },
        { href: '#/institution', icon: '🚀', label: 'Active Projects' }
      ]}
    >
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <StatCard label="Matching Department Expertise" value={matched.length} sub={org.expertise.slice(0, 2).join(', ')} />
        <StatCard label="Adopted R&D Projects" value={active.length} sub="Active engineering prototypes" />
        <StatCard label="Registered Partner Labs" value="6 Active" sub="Inter-university R&D alliance" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4 border-b border-slate-200 pb-2">
        <button
          onClick={() => setTab('matched')}
          className={`px-3 py-1.5 rounded text-xs font-semibold ${
            tab === 'matched' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          Matching Challenges ({matched.length})
        </button>
        <button
          onClick={() => setTab('active')}
          className={`px-3 py-1.5 rounded text-xs font-semibold ${
            tab === 'active' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          My Adopted Work ({active.length})
        </button>
      </div>

      {/* Table */}
      {problems === null ? (
        <Spinner text="Loading departmental challenges..." />
      ) : (
        <div className="portal-card rounded-lg overflow-hidden">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px]">
                <th className="p-3">Problem Statement</th>
                <th className="p-3">Category</th>
                <th className="p-3">Priority</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(tab === 'matched' ? matched : active).map(p => (
                <tr key={p.id} className="hover:bg-slate-50">
                  <td className="p-3 max-w-sm">
                    <a href={'#/problem/' + p.id} className="font-bold text-slate-900 hover:underline block leading-snug">
                      {p.title}
                    </a>
                    <p className="text-[11px] text-slate-400 mt-0.5">{p.id} · {p.location_text}</p>
                  </td>
                  <td className="p-3"><CategoryChip id={p.category} /></td>
                  <td className="p-3"><PriorityBadge p={prOf(p)} /></td>
                  <td className="p-3"><StatusBadge status={p.status} /></td>
                  <td className="p-3 text-right">
                    {tab === 'matched' ? (
                      <button
                        onClick={() => handleAdopt(p)}
                        className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-medium"
                      >
                        Express Interest
                      </button>
                    ) : (
                      <button
                        onClick={() => setUpdateModal(p)}
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded text-xs font-medium"
                      >
                        Post Milestone
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {((tab === 'matched' ? matched : active).length === 0) && (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-slate-400 text-xs">
                    No records found in this category.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Post Milestone Modal */}
      {updateModal && (
        <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 p-5 max-w-md w-full shadow-lg space-y-3">
            <h3 className="font-bold text-sm text-slate-900">Post Milestone Update</h3>
            <p className="text-xs text-slate-500">{updateModal.id}: {updateModal.title}</p>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Update Status</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value)}
                className="w-full px-3 py-2 portal-input text-xs bg-white"
              >
                <option value="In Progress">In Progress</option>
                <option value="Prototype / Pilot">Prototype / Pilot Built</option>
                <option value="Completed">Completed & Validated</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Milestone Description</label>
              <textarea
                value={note}
                onChange={e => setNote(e.target.value)}
                rows={3}
                placeholder="Details on testing, findings, student team involvement..."
                className="w-full px-3 py-2 portal-input text-xs"
              />
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setUpdateModal(null)}
                className="flex-1 py-1.5 border border-slate-200 text-xs font-semibold text-slate-600 rounded hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handlePostUpdate}
                disabled={!note.trim()}
                className="flex-1 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded hover:bg-slate-800 disabled:opacity-50"
              >
                Save Milestone
              </button>
            </div>
          </div>
        </div>
      )}
    </ProLayout>
  );
}

// 2. Government & Administrative Dashboard
function GovDashboard({ user }) {
  const [analytics, setAnalytics] = useState(null);
  const [tab, setTab] = useState('overview');

  const load = async () => {
    const data = await SolveGridAPI.getAnalytics();
    setAnalytics(data);
  };

  useEffect(() => { load(); }, []);

  const handleModerate = async (p, action) => {
    try {
      const res = await SolveGridAPI.moderateProblem(p.id, action);
      toast(res.message);
      load();
    } catch (e) {
      toast(e.message, 'error');
    }
  };

  return (
    <ProLayout
      user={user}
      title="Administrative Command Dashboard"
      subtitle="District Administration & Monitoring Cell — Jharkhand"
      nav={[
        { href: '#/gov', icon: '📊', label: 'Executive Analytics' },
        { href: '#/gov', icon: '🗂️', label: 'Triage Queue' }
      ]}
    >
      <div className="flex gap-2 mb-5 border-b border-slate-200 pb-2">
        <button
          onClick={() => setTab('overview')}
          className={`px-3 py-1.5 rounded text-xs font-semibold ${
            tab === 'overview' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          📊 Executive Overview
        </button>
        <button
          onClick={() => setTab('queue')}
          className={`px-3 py-1.5 rounded text-xs font-semibold ${
            tab === 'queue' ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-200'
          }`}
        >
          🗂️ Triage & Review Queue ({analytics?.reviewQueue?.length || 0})
        </button>
      </div>

      {!analytics ? (
        <Spinner text="Aggregating departmental statistics..." />
      ) : (
        <>
          {tab === 'overview' && (
            <div className="space-y-5">
              {/* Metrics */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <StatCard label="Total Grievances" value={analytics.total} sub="District-wide registered" />
                <StatCard label="Citizen Confirmations" value={analytics.totalConfirmations} sub="Endorsement signals" />
                <StatCard label="Under R&D / Adopted" value={analytics.adopted} sub="Assigned to institutes" />
                <StatCard label="Pending Triage" value={analytics.reviewQueue.length} sub="Awaiting verification" />
              </div>

              {/* Breakdown metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="portal-card rounded-lg p-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Lifecycle Pipeline</h3>
                  <div className="space-y-2">
                    {STATUSES.map(s => {
                      const count = analytics.byStatus[s] || 0;
                      if (!count) return null;
                      return (
                        <div key={s} className="flex items-center justify-between text-xs">
                          <span className="text-slate-600 font-medium">{s}</span>
                          <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="portal-card rounded-lg p-5">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Challenges by Sector</h3>
                  <div className="space-y-2">
                    {CATEGORIES.map(c => {
                      const count = analytics.byCategory[c.id] || 0;
                      if (!count) return null;
                      return (
                        <div key={c.id} className="flex items-center justify-between text-xs">
                          <span className="text-slate-600 font-medium">{c.icon} {c.name}</span>
                          <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Priority list */}
              <div className="portal-card rounded-lg p-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Top Priority Challenges</h3>
                <div className="divide-y divide-slate-100">
                  {analytics.topPriority.map(p => (
                    <div key={p.id} className="py-2.5 flex items-center justify-between text-xs">
                      <div>
                        <a href={'#/problem/' + p.id} className="font-bold text-slate-900 hover:underline">
                          {p.id} · {p.title}
                        </a>
                        <p className="text-[11px] text-slate-400 mt-0.5">{p.location_text} · {p.confirmations} endorsements</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <PriorityBadge p={prOf(p)} />
                        <StatusBadge status={p.status} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'queue' && (
            <div className="portal-card rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold text-[10px]">
                    <th className="p-3">Problem</th>
                    <th className="p-3">Sector</th>
                    <th className="p-3">Priority</th>
                    <th className="p-3">Current Status</th>
                    <th className="p-3 text-right">Triage Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {analytics.reviewQueue.map(p => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="p-3 max-w-sm">
                        <a href={'#/problem/' + p.id} className="font-bold text-slate-900 hover:underline block leading-snug">
                          {p.title}
                        </a>
                        <p className="text-[11px] text-slate-400 mt-0.5">{p.id} · {p.location_text}</p>
                      </td>
                      <td className="p-3"><CategoryChip id={p.category} /></td>
                      <td className="p-3"><PriorityBadge p={prOf(p)} /></td>
                      <td className="p-3"><StatusBadge status={p.status} /></td>
                      <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                        <button
                          onClick={() => handleModerate(p, 'validate')}
                          className="px-2.5 py-1 bg-slate-900 text-white rounded text-[11px] font-medium hover:bg-slate-800"
                        >
                          Verify Evidence
                        </button>
                        <button
                          onClick={() => handleModerate(p, 'review')}
                          className="px-2.5 py-1 bg-slate-100 border border-slate-200 text-slate-700 rounded text-[11px] font-medium hover:bg-slate-200"
                        >
                          Dispatch to Dept
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!analytics.reviewQueue.length && (
                    <tr>
                      <td colSpan="5" className="p-6 text-center text-slate-400 text-xs">
                        Review queue is clear. No pending unvalidated items.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </ProLayout>
  );
}
