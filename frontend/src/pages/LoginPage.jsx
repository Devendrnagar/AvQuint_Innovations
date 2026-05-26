import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function getErrorMessage(error) {
  return error?.response?.data?.message || error.message || 'Something went wrong';
}

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(form);
      navigate('/dashboard');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-10">
      <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-glow backdrop-blur">
          <span className="inline-flex rounded-full border border-cyan-400/30 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-200">
            Task Manager
          </span>
          <h1 className="mt-6 max-w-xl text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Organize work with a crisp, focused workflow.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-slate-300">
            Log in to manage tasks, switch status instantly, and keep every assignment visible in one responsive dashboard.
          </p>
          
          {/* <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {['JWT auth', 'Task CRUD', 'MongoDB storage'].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4 text-sm text-slate-200">
                {item}
              </div>
            ))}
          </div> */}
        </section>

        <section className="rounded-[2rem] border border-white/10 bg-slate-950/85 p-8 shadow-glow backdrop-blur">
          <h2 className="text-2xl font-semibold text-white">Log in</h2>
          <p className="mt-2 text-sm text-slate-400">Use your credentials to continue to the dashboard.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
                placeholder="name@example.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-200" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-cyan-400"
                placeholder="Enter your password"
              />
            </div>

            {error ? (
              <div className="rounded-2xl border border-rose-400/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {error}
              </div>
            ) : null}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Log in'}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-400">
            New here?{' '}
            <Link to="/register" className="font-semibold text-cyan-300 transition hover:text-cyan-200">
              Create an account
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
