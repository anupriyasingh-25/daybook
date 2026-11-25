import { useEffect, useMemo, useState } from 'react';
import { CheckCheck, CheckCircle2, Circle, ClipboardList, LogOut, Search, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen.jsx';
import TaskCard from '../components/TaskCard.jsx';
import TaskForm from '../components/TaskForm.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import { tasksApi } from '../services/api.js';

const filters = [
  { id: 'all', label: 'All tasks', icon: ClipboardList },
  { id: 'pending', label: 'Pending', icon: Circle },
  { id: 'completed', label: 'Completed', icon: CheckCircle2 }
];

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [notice, setNotice] = useState('');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    let active = true;
    tasksApi.list()
      .then(({ tasks: loadedTasks }) => { if (active) setTasks(loadedTasks); })
      .catch((error) => { if (active) setPageError(error.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const pendingCount = tasks.filter((task) => !task.completed).length;
  const completedCount = tasks.length - pendingCount;
  const visibleTasks = useMemo(() => tasks.filter((task) => {
    const matchesFilter = filter === 'all' || (filter === 'completed' ? task.completed : !task.completed);
    return matchesFilter && task.title.toLowerCase().includes(search.trim().toLowerCase());
  }), [tasks, filter, search]);

  async function createTask(details) {
    setPageError('');
    setNotice('');
    const { task } = await tasksApi.create(details);
    setTasks((current) => [task, ...current]);
    setNotice('Task added to your list.');
  }

  async function updateTask(id, details) {
    const { task } = await tasksApi.update(id, details);
    setTasks((current) => current.map((item) => item._id === id ? task : item));
    setNotice('Your changes have been saved.');
  }

  async function toggleTask(id) {
    const { task } = await tasksApi.toggle(id);
    setTasks((current) => current.map((item) => item._id === id ? task : item));
  }

  async function deleteTask(id) {
    await tasksApi.remove(id);
    setTasks((current) => current.filter((item) => item._id !== id));
    setNotice('Task deleted.');
  }

  async function signOut() {
    setLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      setPageError(error.message);
    } finally {
      setTasks([]);
      navigate('/login', { replace: true });
    }
  }

  if (loading) return <LoadingScreen label="Loading your tasks..." />;

  return (
    <div className="dashboard-page">
      <header className="topbar">
        <div className="topbar-inner">
          <Link className="brand" to="/dashboard"><span className="brand-mark"><CheckCircle2 size={20} /></span><span>daybook</span></Link>
          <div className="topbar-right"><span className="user-greeting">Hi, {user?.name?.split(' ')[0]}</span><button className="logout-button" onClick={signOut} disabled={loggingOut}><LogOut size={16} /><span>{loggingOut ? 'Logging out...' : 'Log out'}</span></button></div>
        </div>
      </header>
      <main className="dashboard-main">
        <section className="welcome-row">
          <div><span className="eyebrow"><Sparkles size={15} /> YOUR PERSONAL SPACE</span><h1>Good to see you, {user?.name?.split(' ')[0]} <span className="wave">✦</span></h1><p>A fresh page for everything you want to get done.</p></div>
          <div className="date-chip">{new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}</div>
        </section>
        <section className="stats-grid" aria-label="Task summary">
          <div className="stat-card"><span className="stat-icon stat-purple"><ClipboardList size={19} /></span><div><span className="stat-label">Total tasks</span><strong>{tasks.length}</strong></div></div>
          <div className="stat-card"><span className="stat-icon stat-amber"><Circle size={19} /></span><div><span className="stat-label">Pending</span><strong>{pendingCount}</strong></div></div>
          <div className="stat-card"><span className="stat-icon stat-green"><CheckCheck size={19} /></span><div><span className="stat-label">Completed</span><strong>{completedCount}</strong></div></div>
        </section>
        {pageError && <div className="alert alert-error page-alert" role="alert">{pageError}</div>}
        {notice && <div className="alert alert-success page-alert" role="status">{notice}<button type="button" aria-label="Dismiss message" onClick={() => setNotice('')}>×</button></div>}
        <div className="dashboard-columns">
          <aside className="sidebar"><TaskForm onCreate={createTask} /><div className="tip-card"><Sparkles size={18} /><div><strong>A small reminder</strong><p>Progress is built one task at a time. Keep going at your own pace.</p></div></div></aside>
          <section className="tasks-section">
            <div className="task-list-heading"><div><h2>Your tasks</h2><p>{pendingCount === 0 && tasks.length > 0 ? 'Everything is wrapped up. Nice work!' : `${pendingCount} ${pendingCount === 1 ? 'thing' : 'things'} still on your list`}</p></div><div className="search-field"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} aria-label="Search tasks by title" placeholder="Search tasks" /></div></div>
            <div className="task-toolbar"><div className="filter-tabs" role="tablist" aria-label="Filter tasks">{filters.map(({ id, label, icon: Icon }) => <button key={id} type="button" role="tab" aria-selected={filter === id} className={filter === id ? 'filter-tab active' : 'filter-tab'} onClick={() => setFilter(id)}><Icon size={15} /> {label}<span>{id === 'all' ? tasks.length : id === 'pending' ? pendingCount : completedCount}</span></button>)}</div></div>
            {visibleTasks.length > 0 ? <div className="task-list">{visibleTasks.map((task) => <TaskCard key={task._id} task={task} onToggle={toggleTask} onUpdate={updateTask} onDelete={deleteTask} />)}</div> : <div className="empty-state"><span className="empty-icon"><ClipboardList size={24} /></span><h3>{search ? 'No matching tasks' : filter === 'completed' ? 'No completed tasks yet' : filter === 'pending' ? 'No pending tasks' : 'Your list is looking fresh'}</h3><p>{search ? 'Try another search term.' : filter === 'all' ? 'Add your first task and make today count.' : 'Tasks will show up here when they match this filter.'}</p></div>}
          </section>
        </div>
        <footer className="dashboard-footer">Made for your everyday momentum <span>·</span> Daybook</footer>
      </main>
    </div>
  );
}
