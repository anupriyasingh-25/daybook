import { useState } from 'react';
import { CalendarDays, Check, Pencil, Save, Trash2, X } from 'lucide-react';

function formatDueDate(value) {
  if (!value) return null;
  return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

function dateInputValue(value) {
  return value ? new Date(value).toISOString().slice(0, 10) : '';
}

export default function TaskCard({ task, onToggle, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    title: task.title,
    description: task.description || '',
    dueDate: dateInputValue(task.dueDate)
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function save(event) {
    event.preventDefault();
    if (!form.title.trim()) {
      setError('Task title is required.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      await onUpdate(task._id, form);
      setEditing(false);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  async function toggle() {
    setBusy(true);
    setError('');
    try {
      await onToggle(task._id);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!window.confirm(`Delete "${task.title}"? This cannot be undone.`)) return;
    setBusy(true);
    setError('');
    try {
      await onDelete(task._id);
    } catch (requestError) {
      setError(requestError.message);
      setBusy(false);
    }
  }

  return (
    <article className={`task-card${task.completed ? ' task-completed' : ''}`}>
      {editing ? (
        <form className="edit-task-form" onSubmit={save}>
          <label className="sr-only" htmlFor={`edit-title-${task._id}`}>Task title</label>
          <input id={`edit-title-${task._id}`} value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} maxLength="160" required />
          <label className="sr-only" htmlFor={`edit-description-${task._id}`}>Task description</label>
          <textarea id={`edit-description-${task._id}`} value={form.description} onChange={(event) => setForm({ ...form, description: event.target.value })} rows="2" maxLength="2000" placeholder="Description (optional)" />
          <label className="edit-date">Due date <input type="date" value={form.dueDate} onChange={(event) => setForm({ ...form, dueDate: event.target.value })} /></label>
          <div className="task-actions">
            <button className="icon-button" aria-label="Cancel editing" type="button" onClick={() => { setEditing(false); setError(''); }}><X size={17} /></button>
            <button className="icon-button action-save" aria-label="Save changes" type="submit" disabled={busy}><Save size={17} /></button>
          </div>
        </form>
      ) : (
        <>
          <button className={`complete-button${task.completed ? ' is-checked' : ''}`} type="button" onClick={toggle} disabled={busy} aria-label={task.completed ? 'Mark task pending' : 'Mark task complete'}>
            {task.completed && <Check size={15} />}
          </button>
          <div className="task-content">
            <div className="task-title-row"><h3>{task.title}</h3><span className={`status-pill ${task.completed ? 'status-done' : 'status-pending'}`}>{task.completed ? 'Completed' : 'Pending'}</span></div>
            {task.description && <p className="task-description">{task.description}</p>}
            {task.dueDate && <span className="task-due"><CalendarDays size={14} /> Due {formatDueDate(task.dueDate)}</span>}
            {error && <p className="inline-error task-error" role="alert">{error}</p>}
          </div>
          <div className="task-actions">
            <button className="icon-button" type="button" aria-label="Edit task" onClick={() => setEditing(true)} disabled={busy}><Pencil size={16} /></button>
            <button className="icon-button action-delete" type="button" aria-label="Delete task" onClick={remove} disabled={busy}><Trash2 size={16} /></button>
          </div>
        </>
      )}
      {editing && error && <p className="inline-error task-error" role="alert">{error}</p>}
    </article>
  );
}
