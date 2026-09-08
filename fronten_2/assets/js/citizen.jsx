// Citizen Grievance Portal & Workflows

function LoginPage({ onLogin }) {
  const [role, setRole] = useState('citizen');
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [busy, setBusy] = useState(false);

  const roles = [
    { id: 'citizen', label: 'Citizen', desc: 'Report & endorse civic issues', icon: '👤' },
    { id: 'university', label: 'University / R&D', desc: 'Adopt problems for engineering solutions', icon: '🏛️' },
    { id: 'government', label: 'Department / Admin', desc: 'Review, triage & monitor progress', icon: '🏢' },
  ];

  const handleSendOtp = async () => {
    if (phone.length !== 10) {
      toast('Please enter a valid 10-digit mobile number', 'error');
      return;
    }
    setBusy(true);
    try {
      const res = await SolveGridAPI.requestOtp(phone);
      toast(res.message);
      setOtpSent(true);
    } catch (e) {
      toast(e.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleVerify = async () => {
    if (otp.length < 6) {
      toast('Please enter 6-digit OTP', 'error');
      return;
    }
    setBusy(true);
    try {
      const res = await SolveGridAPI.verifyOtp(phone, otp, role);
      toast('Identity verified. Entering portal...');
      onLogin(res.user);
    } catch (e) {
      toast(e.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-slate-50">
      <div className="tricolor-strip"></div>
      
      {/* Official Top Banner */}
      <div className="bg-white border-b border-slate-200 px-6 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center text-white font-bold text-xs">
              SG
            </div>
            <div>
              <p className="text-xs font-bold tracking-wide uppercase text-slate-900">SolveGrid · Jan Samadhan Platform</p>
              <p className="text-[10px] text-slate-500">Government of Jharkhand · Smart India Hackathon 2026 (SIH26043)</p>
            </div>
          </div>
          <span className="text-[11px] font-medium text-slate-500 hidden sm:inline">Citizen & Institutional Problem Solving Portal</span>
        </div>
      </div>

      {/* Main Login Card */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white border border-slate-200 rounded-lg p-6 sm:p-8 shadow-sm fade-in">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-slate-900">Portal Authentication</h2>
            <p className="text-xs text-slate-500 mt-1">Select your role to access the corresponding service interface</p>
          </div>

          {/* Role Selector */}
          <div className="space-y-2 mb-6">
            <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Select Access Role</label>
            <div className="grid grid-cols-1 gap-2">
              {roles.map(r => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setRole(r.id)}
                  className={`flex items-start gap-3 p-3 rounded border text-left transition-colors ${
                    role === r.id
                      ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <span className="text-xl">{r.icon}</span>
                  <div>
                    <p className="text-xs font-bold text-slate-900">{r.label}</p>
                    <p className="text-[11px] text-slate-500">{r.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {!otpSent ? (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Registered Mobile Number</label>
                <div className="flex rounded border border-slate-300 overflow-hidden focus-within:border-slate-900 focus-within:ring-1 focus-within:ring-slate-900">
                  <span className="bg-slate-100 px-3 py-2.5 text-xs font-semibold text-slate-600 border-r border-slate-200 flex items-center">+91</span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    placeholder="10-digit phone number"
                    className="flex-1 px-3 py-2 text-sm outline-none bg-white"
                  />
                </div>
              </div>
              <button
                onClick={handleSendOtp}
                disabled={busy || phone.length !== 10}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-medium text-xs rounded transition-colors"
              >
                {busy ? 'Dispatching OTP...' : 'Send Verification Code'}
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-slate-700">6-Digit Verification Code (OTP)</label>
                  <span className="text-[10px] text-slate-400">Demo code: 246810</span>
                </div>
                <input
                  type="text"
                  value={otp}
                  onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="••••••"
                  className="w-full px-3 py-2 text-center tracking-widest text-lg font-bold border border-slate-300 rounded focus:border-slate-900 focus:outline-none"
                  maxLength={6}
                />
              </div>
              <button
                onClick={handleVerify}
                disabled={busy || otp.length !== 6}
                className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-medium text-xs rounded transition-colors"
              >
                {busy ? 'Verifying...' : 'Verify & Proceed'}
              </button>
              <button
                onClick={() => setOtpSent(false)}
                className="w-full text-xs text-slate-500 hover:text-slate-900 text-center font-medium"
              >
                ← Change Mobile Number
              </button>
            </div>
          )}

          <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400 text-center">
            Standard 2FA Authentication · Data protected under Gov IT Security Guidelines
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center py-4 text-xs text-slate-500 border-t border-slate-200 bg-white">
        Smart India Hackathon 2026 · Team SolveGrid · Problem Statement ID: SIH26043
      </div>
    </div>
  );
}

function CitizenLayout({ user, children }) {
  const currentHash = location.hash || '#/feed';
  const navItems = [
    { href: '#/feed', label: 'All Challenges', icon: '📋' },
    { href: '#/submit', label: 'Submit Problem', icon: '➕' },
    { href: '#/my', label: 'My Submissions', icon: '📁' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <div className="tricolor-strip"></div>
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center justify-between">
          <a href="#/feed" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-slate-900 rounded flex items-center justify-center text-white font-bold text-xs">
              SG
            </div>
            <div>
              <span className="text-sm font-bold text-slate-900 tracking-tight">SolveGrid</span>
              <span className="hidden sm:inline text-xs text-slate-500 ml-2 border-l border-slate-200 pl-2">Jan Samadhan Portal</span>
            </div>
          </a>

          {/* Nav */}
          <nav className="flex items-center gap-1">
            {navItems.map(item => {
              const active = currentHash.startsWith(item.href);
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                    active ? 'bg-slate-900 text-white' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <span className="mr-1">{item.icon}</span> {item.label}
                </a>
              );
            })}
          </nav>

          {/* User profile */}
          <div className="flex items-center gap-2 text-xs">
            <span className="hidden md:inline px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-medium">
              {user.name || 'Citizen'}
            </span>
            <button
              onClick={() => {
                sessionStorage.removeItem('sg_user');
                sessionStorage.removeItem('sg_token');
                location.hash = '#/';
                location.reload();
              }}
              className="text-slate-500 hover:text-red-700 font-medium px-2 py-1"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main container */}
      <main className="max-w-5xl mx-auto px-4 py-6 flex-1 w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-500">
        <p>A digital platform to crowdsource societal challenges and connect them with institutional problem solvers.</p>
        <p className="mt-0.5 text-[11px] text-slate-400">SIH 2026 · Team SolveGrid</p>
      </footer>
    </div>
  );
}

function ProblemCard({ p }) {
  const pr = prOf(p);
  const total = SolveGridAI.priorityTotal(pr);

  return (
    <a 
      href={'#/problem/' + p.id} 
      className="block portal-card rounded-lg p-4 hover:border-slate-400 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="font-mono text-[11px] font-semibold text-slate-400">{p.id}</span>
            <CategoryChip id={p.category} />
            <StatusBadge status={p.status} />
          </div>
          <h3 className="text-sm font-bold text-slate-900 leading-snug">{p.title}</h3>
          <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
            {p.ai ? p.ai.summary : p.description}
          </p>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-[11px] text-slate-500">
            <span>📍 {p.location_text}</span>
            <span>👥 {p.confirmations} citizen confirmations</span>
            <span>🗓️ {fmtDate(p.created_at)}</span>
          </div>
        </div>

        {/* Priority metric badge */}
        <div className="text-right shrink-0">
          <div className="text-sm font-bold text-slate-900">{total} / 20</div>
          <p className="text-[10px] text-slate-400 uppercase font-medium">Priority Score</p>
        </div>
      </div>
    </a>
  );
}

function FeedPage() {
  const [problems, setProblems] = useState(null);
  const [cat, setCat] = useState('');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('recent');

  const load = async () => {
    const list = await SolveGridAPI.listProblems({ category: cat || undefined, q: q || undefined, sort });
    setProblems(list);
  };

  useEffect(() => { load(); }, [cat, sort]);
  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [q]);

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-lg p-5">
        <div className="max-w-2xl">
          <h2 className="text-base font-bold tracking-tight">Reported Societal & Civic Challenges</h2>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            Browse verified community issues. Endorse problems you experience with one tap to elevate their priority score for universities, departments, and startups.
          </p>
        </div>
      </div>

      {/* Filter and search row */}
      <div className="flex flex-wrap gap-2 items-center">
        <div className="flex-1 min-w-[220px]">
          <input
            type="text"
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search challenges by keyword, village, or district..."
            className="w-full px-3 py-2 portal-input text-xs"
          />
        </div>
        <select
          value={sort}
          onChange={e => setSort(e.target.value)}
          className="px-3 py-2 portal-input text-xs font-medium text-slate-700 bg-white"
        >
          <option value="recent">Sort: Most Recent</option>
          <option value="priority">Sort: Highest Priority</option>
          <option value="confirmations">Sort: Most Confirmed</option>
        </select>
      </div>

      {/* Category Pills */}
      <div className="flex gap-1.5 overflow-x-auto scroll-clean pb-1 text-xs">
        <button
          onClick={() => setCat('')}
          className={`px-3 py-1 rounded border whitespace-nowrap font-medium transition-colors ${
            !cat ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
          }`}
        >
          All Sectors
        </button>
        {CATEGORIES.map(c => (
          <button
            key={c.id}
            onClick={() => setCat(c.id)}
            className={`px-2.5 py-1 rounded border whitespace-nowrap font-medium transition-colors ${
              cat === c.id ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
            }`}
          >
            {c.icon} {c.name}
          </button>
        ))}
      </div>

      {/* Challenges list */}
      {problems === null ? (
        <Spinner text="Loading published records..." />
      ) : problems.length === 0 ? (
        <EmptyState title="No matching problems found" sub="Adjust your search criteria or report a new problem." />
      ) : (
        <div className="space-y-2.5">
          {problems.map(p => <ProblemCard key={p.id} p={p} />)}
        </div>
      )}
    </div>
  );
}

function SubmitWizard({ user }) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    title: '',
    description: '',
    recurrence: false,
    affected: '',
    evidence_type: 'none',
    evidence_name: null,
    location_text: '',
    severity: 'medium',
    urgency: 'medium'
  });
  const [phase, setPhase] = useState('form');
  const [result, setResult] = useState(null);

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }));
  const totalSteps = 4;

  const handleSubmit = async () => {
    setPhase('processing');
    try {
      const res = await SolveGridAPI.createProblem(form);
      const full = await SolveGridAPI.getProblem(res.problem_id || res.id);
      setTimeout(() => {
        setResult(full);
        setPhase('done');
      }, 1500);
    } catch (e) {
      toast(e.message, 'error');
      setPhase('form');
    }
  };

  if (phase === 'processing') {
    return (
      <div className="portal-card rounded-lg p-10 text-center max-w-lg mx-auto">
        <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin mx-auto"></div>
        <h3 className="font-bold text-sm text-slate-900 mt-4">Processing Problem Submission</h3>
        <p className="text-xs text-slate-500 mt-1">AI categorization engine is parsing metadata and calculating initial priority...</p>
      </div>
    );
  }

  if (phase === 'done' && result) {
    return (
      <div className="portal-card rounded-lg p-6 max-w-2xl mx-auto space-y-4">
        <div className="pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-emerald-700 font-bold text-lg">✓</span>
            <h3 className="font-bold text-base text-slate-900">Problem Registered Successfully</h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Problem Identification Code: <span className="font-mono font-bold text-slate-900">{result.id}</span>
          </p>
        </div>

        {/* AI Structured Organization */}
        <div className="bg-slate-50 border border-slate-200 rounded p-4 space-y-2 text-xs">
          <p className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">AI Organization (Decision Support)</p>
          <p><span className="text-slate-500">Sector:</span> <CategoryChip id={result.category} /></p>
          <p><span className="text-slate-500">Summary:</span> <span className="text-slate-800 font-medium">{result.ai.summary}</span></p>
          <div>
            <span className="text-slate-500">Extracted Keywords:</span>{' '}
            {result.ai.tags.map(t => (
              <span key={t} className="inline-block bg-white border border-slate-200 px-1.5 py-0.5 rounded text-[10px] text-slate-600 mr-1 font-mono">
                #{t}
              </span>
            ))}
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <a href={'#/problem/' + result.id} className="flex-1 text-center py-2 px-3 bg-slate-900 text-white rounded text-xs font-semibold hover:bg-slate-800">
            View Problem Record
          </a>
          <a href="#/feed" className="flex-1 text-center py-2 px-3 bg-slate-100 text-slate-700 rounded text-xs font-semibold hover:bg-slate-200">
            Return to Feed
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto portal-card rounded-lg p-6">
      {/* Wizard Progress */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
        <div>
          <h2 className="text-sm font-bold text-slate-900">Grievance Submission Wizard</h2>
          <p className="text-[11px] text-slate-500">Step {step} of {totalSteps}</p>
        </div>
        <div className="flex items-center gap-1.5">
          {[1, 2, 3, 4].map(s => (
            <div
              key={s}
              className={`w-6 h-6 rounded text-xs font-bold flex items-center justify-center ${
                s === step ? 'bg-slate-900 text-white' : s < step ? 'bg-slate-200 text-slate-700' : 'bg-slate-100 text-slate-400'
              }`}
            >
              {s < step ? '✓' : s}
            </div>
          ))}
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Problem Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.title}
              onChange={e => set('title', e.target.value)}
              placeholder="e.g., Recurring waterlogging near girls hostel road"
              className="w-full px-3 py-2 portal-input text-xs"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Description <span className="text-red-500">*</span></label>
            <textarea
              value={form.description}
              onChange={e => set('description', e.target.value)}
              rows={5}
              placeholder="Describe what is happening, who is affected, and any safety hazards..."
              className="w-full px-3 py-2 portal-input text-xs leading-relaxed"
            />
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-700">
              <input
                type="checkbox"
                checked={form.recurrence}
                onChange={e => set('recurrence', e.target.checked)}
                className="rounded border-slate-300"
              />
              Recurring issue happening repeatedly
            </label>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Supporting Documentation / Evidence</label>
            <p className="text-[11px] text-slate-500 mb-3">Optional: Uploading photos or videos increases verification speed and reliability.</p>
            <div className="border border-dashed border-slate-300 rounded p-6 text-center bg-slate-50">
              <input
                type="file"
                accept="image/*,video/*"
                className="hidden"
                id="file-upload"
                onChange={e => {
                  const f = e.target.files[0];
                  if (f) {
                    set('evidence_name', f.name);
                    set('evidence_type', f.type.startsWith('video') ? 'video' : 'photo');
                  }
                }}
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <span className="text-2xl block mb-1">📷</span>
                <span className="text-xs font-semibold text-slate-700 hover:underline">
                  {form.evidence_name ? form.evidence_name : 'Select Photo / Video Evidence'}
                </span>
                <span className="block text-[10px] text-slate-400 mt-0.5">Supports JPG, PNG, MP4 up to 25MB</span>
              </label>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Incident Location <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.location_text}
              onChange={e => set('location_text', e.target.value)}
              placeholder="e.g., Kanke Block, Ranchi District, Jharkhand"
              className="w-full px-3 py-2 portal-input text-xs"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              set('location_text', 'BIT Mesra Campus, Ranchi, Jharkhand');
              toast('Location populated from GPS coordinates');
            }}
            className="text-xs text-slate-700 font-medium bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded border border-slate-200"
          >
            📍 Use Current Geolocation (GPS)
          </button>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Severity Level</label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                ['low', 'Low', 'Minor inconvenience'],
                ['medium', 'Medium', 'Functional obstruction'],
                ['high', 'High', 'Critical safety risk']
              ].map(([v, l, d]) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => set('severity', v)}
                  className={`p-2.5 rounded border text-left ${
                    form.severity === v ? 'border-slate-900 bg-slate-50 font-bold text-slate-900' : 'border-slate-200 text-slate-600'
                  }`}
                >
                  <p className="text-xs">{l}</p>
                  <p className="text-[10px] text-slate-400 font-normal">{d}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 pt-5 border-t border-slate-100 mt-5">
        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep(s => s - 1)}
            className="px-4 py-2 border border-slate-200 text-xs font-semibold text-slate-700 rounded hover:bg-slate-50"
          >
            Back
          </button>
        )}
        {step < totalSteps ? (
          <button
            type="button"
            onClick={() => {
              if (step === 1 && (!form.title.trim() || !form.description.trim())) {
                toast('Please provide title and description', 'error');
                return;
              }
              setStep(s => s + 1);
            }}
            className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded"
          >
            Proceed
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            className="flex-1 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded"
          >
            Submit Grievance
          </button>
        )}
      </div>
    </div>
  );
}

function ProblemDetailPage({ id, user }) {
  const [p, setP] = useState(null);
  const [confirming, setConfirming] = useState(false);

  const load = async () => {
    try {
      const res = await SolveGridAPI.getProblem(id);
      setP(res);
    } catch (e) {
      toast(e.message, 'error');
    }
  };

  useEffect(() => { load(); }, [id]);

  if (!p) return <Spinner text="Fetching problem record..." />;

  const map = STAKEHOLDER_MAP[p.category] || {};
  const pr = prOf(p);

  const handleConfirm = async () => {
    setConfirming(true);
    try {
      await SolveGridAPI.confirmProblem(id, user.phone);
      toast('Your endorsement has been recorded.');
      load();
    } catch (e) {
      toast(e.message, 'error');
    } finally {
      setConfirming(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <a href="#/feed" className="text-xs font-semibold text-slate-500 hover:text-slate-900 inline-block mb-1">
        ← Back to Challenges
      </a>

      {/* Problem Header */}
      <div className="portal-card rounded-lg p-5 space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-xs font-bold text-slate-500">{p.id}</span>
          <CategoryChip id={p.category} />
          <StatusBadge status={p.status} />
        </div>

        <h2 className="text-lg font-bold text-slate-900 leading-snug">{p.title}</h2>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-1 pb-2 border-b border-slate-100">
          <span>📍 {p.location_text}</span>
          <span>👥 {p.confirmations} citizen endorsements</span>
          <span>🗓️ Registered: {fmtDate(p.created_at)}</span>
        </div>

        <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">{p.description}</p>
      </div>

      {/* AI Assistance Analysis */}
      <div className="portal-card rounded-lg p-5 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-900">AI Intelligence Breakdown</span>
          <span className="text-[10px] text-slate-400 font-medium">Automatic Semantic Extraction</span>
        </div>

        <div className="text-xs space-y-2">
          <p><strong className="text-slate-700">Executive Summary:</strong> {p.ai?.summary || 'N/A'}</p>
          <div>
            <strong className="text-slate-700">Identified Keywords:</strong>{' '}
            {(p.ai?.tags || []).map(t => (
              <span key={t} className="inline-block bg-slate-100 border border-slate-200 px-2 py-0.5 rounded text-[10px] text-slate-700 mr-1 font-mono">
                #{t}
              </span>
            ))}
          </div>
        </div>

        {/* Stakeholder Pathway Recommendations */}
        <div className="mt-3 p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-1.5">
          <p className="font-bold text-slate-800">Potential Institutional Pathways</p>
          <p><span className="text-slate-500">Nodal Authority:</span> {map.govt_body || 'District Administration'}</p>
          <p><span className="text-slate-500">Relevant University Department:</span> {(map.university_expertise || []).join(', ') || 'Engineering & Sciences'}</p>
          <p><span className="text-slate-500">Action Pathway:</span> {map.solution_pathway || 'Field assessment and proof-of-concept prototyping'}</p>
        </div>
      </div>

      {/* Community Endorsement Action */}
      <div className="portal-card rounded-lg p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <h4 className="text-xs font-bold text-slate-900">Community Signal Endorsement</h4>
          <p className="text-[11px] text-slate-500">Confirm this issue to strengthen its priority calculation score.</p>
        </div>
        <button
          onClick={handleConfirm}
          disabled={confirming}
          className="w-full sm:w-auto px-4 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white text-xs font-semibold rounded shrink-0 transition-colors"
        >
          {confirming ? 'Recording...' : '✋ I also face this issue (Endorse)'}
        </button>
      </div>

      {/* Priority Breakdown */}
      <PriorityBreakdown p={pr} />

      {/* Progress Timeline */}
      <div className="portal-card rounded-lg p-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">Lifecycle & Progress Updates</h3>
        <Timeline items={p.timeline || []} />
      </div>
    </div>
  );
}

function MyProblemsPage({ user }) {
  const [problems, setProblems] = useState(null);

  useEffect(() => {
    SolveGridAPI.listProblems({ mine: user.phone }).then(setProblems);
  }, []);

  if (problems === null) return <Spinner text="Retrieving your submissions..." />;

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-base font-bold text-slate-900">My Submissions</h2>
        <p className="text-xs text-slate-500">Track current status, validator reviews, and solver milestones</p>
      </div>

      {problems.length === 0 ? (
        <EmptyState title="No records found" sub="Problems you report will appear here." />
      ) : (
        <div className="space-y-2.5">
          {problems.map(p => <ProblemCard key={p.id} p={p} />)}
        </div>
      )}
    </div>
  );
}
