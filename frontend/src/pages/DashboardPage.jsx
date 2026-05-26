import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import TaskForm from '../components/TaskForm';

function getErrorMessage(error) {
  return error?.response?.data?.message || error.message || 'Something went wrong';
}

function TaskCard({ task, onEdit, onDelete, onToggle }) {
  const completed = task.status === 'completed';

  return (
    <article className="rounded-3xl border border-white/10 bg-slate-950/80 p-5 shadow-glow transition hover:-translate-y-0.5 hover:border-cyan-400/30">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-lg font-semibold text-white">{task.title}</h3>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${completed ? 'bg-emerald-400/15 text-emerald-200' : 'bg-amber-400/15 text-amber-200'}`}>
              {task.status}
            </span>
          </div>
          {task.description ? <p className="mt-2 text-sm leading-6 text-slate-300">{task.description}</p> : null}
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => onToggle(task)}
          className="rounded-2xl border border-white/10 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-white/5"
        >
          Toggle status
        </button>
        <button
          type="button"
          onClick={() => onEdit(task)}
          className="rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-semibold text-cyan-100 transition hover:bg-cyan-400/20"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(task)}
          className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-100 transition hover:bg-rose-500/20"
        >
          Delete
        </button>
      </div>
    </article>
  );
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [editingTask, setEditingTask] = useState(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  async function loadTasks() {
    setLoading(true);
    setError('');

    try {
      const data = await taskApi.list();
      setTasks(data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  const stats = useMemo(() => {
    const completed = tasks.filter((task) => task.status === 'completed').length;
    const pending = tasks.length - completed;

    return [
      { label: 'Total tasks', value: tasks.length },
      { label: 'Completed', value: completed },
      { label: 'Pending', value: pending }
    ];
  }, [tasks]);

  async function handleSaveTask(form) {
    setSaving(true);
    setError('');

    try {
      if (editingTask) {
        const updated = await taskApi.update(editingTask._id, form);
        setTasks((current) => current.map((task) => (task._id === updated._id ? updated : task)));
        setEditingTask(null);
      } else {
        const created = await taskApi.create(form);
        setTasks((current) => [created, ...current]);
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleToggle(task) {
    try {
      const updated = await taskApi.toggle(task._id);
      setTasks((current) => current.map((item) => (item._id === updated._id ? updated : item)));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  async function handleDelete(task) {
    const shouldDelete = window.confirm(`Delete task \"${task.title}\"?`);
    if (!shouldDelete) {
      return;
    }

    try {
      await taskApi.remove(task._id);
      setTasks((current) => current.filter((item) => item._id !== task._id));
    } catch (err) {
      setError(getErrorMessage(err));
    }
  }

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="min-h-screen bg-hero-radial px-4 py-8 text-slate-100 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="rounded-[2rem] border border-white/10 bg-slate-950/80 p-6 shadow-glow backdrop-blur">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">
                Dashboard
              </span>
              <h1 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                Welcome back, {user?.name || 'User'}
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                Create, edit, delete, and toggle task status from a single protected workspace.
              </p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-2xl border border-white/10 px-5 py-3 font-semibold text-slate-100 transition hover:bg-white/5"
            >
              Log out
            </button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm text-slate-400">{stat.label}</p>
                <p className="mt-2 text-3xl font-semibold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold text-white">
                {editingTask ? 'Edit task' : 'Add task'}
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                {editingTask ? 'Update the selected item and save the changes.' : 'Capture a new task and set its status immediately.'}
              </p>
            </div>

            <TaskForm
              initialValues={editingTask || undefined}
              mode={editingTask ? 'edit' : 'create'}
              busy={saving}
              onCancel={editingTask ? () => setEditingTask(null) : undefined}
              onSubmit={handleSaveTask}
            />

            {error ? (
              <div className="rounded-3xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {error}
              </div>
            ) : null}
          </section>

          <section className="rounded-[2rem] border border-white/10 bg-slate-950/70 p-6 shadow-glow backdrop-blur">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-white">Your tasks</h2>
                <p className="mt-1 text-sm text-slate-400">Everything is synced through the protected REST API.</p>
              </div>
            </div>

            {loading ? (
              <div className="mt-6 rounded-3xl border border-white/10 bg-white/5 p-6 text-slate-300">
                Loading tasks...
              </div>
            ) : tasks.length === 0 ? (
              <div className="mt-6 rounded-3xl border border-dashed border-white/15 bg-white/5 p-8 text-center text-slate-300">
                No tasks yet. Create the first one on the left.
              </div>
            ) : (
              <div className="mt-6 grid gap-4">
                {tasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onEdit={setEditingTask}
                    onDelete={handleDelete}
                    onToggle={handleToggle}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
