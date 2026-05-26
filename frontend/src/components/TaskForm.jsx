import { useEffect, useState } from 'react';

const initialForm = {
  title: '',
  description: '',
  status: 'pending'
};

export default function TaskForm({ initialValues, onSubmit, onCancel, busy, mode }) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    setForm(initialValues || initialForm);
  }, [initialValues]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-3xl border border-white/10 bg-slate-900/80 p-5 shadow-glow backdrop-blur">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="title">
          Task title
        </label>
        <input
          id="title"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          placeholder="Plan sprint review"
          className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="description">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          rows="4"
          placeholder="Add notes, links, or subtasks"
          className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="status">
          Status
        </label>
        <select
          id="status"
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-slate-100 outline-none transition focus:border-cyan-400"
        >
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center justify-center rounded-2xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? 'Saving...' : mode === 'edit' ? 'Update task' : 'Add task'}
        </button>
        {onCancel ? (
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex items-center justify-center rounded-2xl border border-white/10 px-5 py-3 font-semibold text-slate-100 transition hover:bg-white/5"
          >
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
