// SolveGrid Application Root & Routing Controller

function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem('sg_user'));
    } catch (e) {
      return null;
    }
  });

  const [, setRouteTick] = useState(0);

  useEffect(() => {
    const handleHashChange = () => setRouteTick(t => t + 1);
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // If unauthenticated, present official authentication
  if (!user) {
    return (
      <LoginPage
        onLogin={u => {
          sessionStorage.setItem('sg_user', JSON.stringify(u));
          setUser(u);
          if (u.role === 'university') {
            location.hash = '#/institution';
          } else if (u.role === 'government') {
            location.hash = '#/gov';
          } else {
            location.hash = '#/feed';
          }
        }}
      />
    );
  }

  const rawHash = location.hash.replace(/^#\//, '');
  const segments = rawHash.split('/').filter(Boolean);
  const rootRoute = segments[0] || '';

  // Route by User Role
  if (user.role === 'university' || rootRoute === 'institution') {
    return <InstitutionDashboard user={user} />;
  }

  if (user.role === 'government' || rootRoute === 'gov') {
    return <GovDashboard user={user} />;
  }

  // Citizen routes
  let activeView;
  if (!segments.length || rootRoute === 'feed') {
    activeView = <FeedPage user={user} />;
  } else if (rootRoute === 'submit') {
    activeView = <SubmitWizard user={user} />;
  } else if (rootRoute === 'my') {
    activeView = <MyProblemsPage user={user} />;
  } else if (rootRoute === 'problem' && segments[1]) {
    activeView = <ProblemDetailPage id={segments[1]} user={user} />;
  } else {
    activeView = <FeedPage user={user} />;
  }

  return (
    <CitizenLayout user={user}>
      {activeView}
    </CitizenLayout>
  );
}

// Mount application
const rootNode = document.getElementById('root');
if (rootNode) {
  ReactDOM.createRoot(rootNode).render(<App />);
}
