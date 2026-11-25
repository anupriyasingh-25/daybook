import { useState } from 'react';
import { Plus } from 'lucide-react';

const emptyForm = { title: '', description: '', dueDate: '' };

export default function TaskForm({ onCreate }) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  function update(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function submit(event) {
    event.preventDefault();
    setError('');
    if (!form.title.trim()) {
      setError('Give your task a title to get started.');
      return;
    }
    setSaving(true);
    try {
      await onCreate(form);
      setForm(emptyForm);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="create-form" onSubmit={submit}>
      <div className="form-heading">
        <span className="form-icon"><Plus size={19} /></span>
        <div><h2>Add a task</h2><p>Get it out of your head and onto your list.</p></div>
      </div>
      {error && <p className="inline-error" role="alert">{error}</p>}
      <label className="sr-only" htmlFor="task-title">Task title</label>
      <input id="task-title" name="title" value={form.title} onChange={update} placeholder="What needs to get done?" maxLength="160" required />
      <label className="sr-only" htmlFor="task-description">Description (optional)</label>
      <textarea id="task-description" name="description" value={form.description} onChange={update} placeholder="Add a note or details (optional)" rows="2" maxLength="2000" />
      <div className="create-form-bottom">
        <label className="date-field"><span>Due date</span><input aria-label="Due date (optional)" type="date" name="dueDate" value={form.dueDate} onChange={update} /></label>
        <button className="button button-primary" type="submit" disabled={saving}><Plus size={17} /> {saving ? 'Adding...' : 'Add task'}</button>
      </div>
    </form>
  );
}
