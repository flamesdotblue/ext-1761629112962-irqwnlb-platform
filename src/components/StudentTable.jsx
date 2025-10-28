import { useMemo, useState } from 'react';
import { Pencil, Trash2, RefreshCw } from 'lucide-react';

function StatusBadge({ status }) {
  const s = (status || '').toLowerCase();
  const map = {
    active: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
    graduated: 'bg-indigo-50 text-indigo-700 ring-indigo-200',
    pending: 'bg-amber-50 text-amber-700 ring-amber-200',
    inactive: 'bg-neutral-100 text-neutral-700 ring-neutral-200',
  };
  const cls = map[s] || 'bg-neutral-100 text-neutral-700 ring-neutral-200';
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ring-1 ${cls}`}>
      {status || '—'}
    </span>
  );
}

export default function StudentTable({ students = [], loading, error, onEdit, onDelete, reload }) {
  const [sortKey, setSortKey] = useState('createdAt');
  const [sortDir, setSortDir] = useState('desc');

  const sorted = useMemo(() => {
    const arr = [...students];
    arr.sort((a, b) => {
      const va = (a[sortKey] ?? '').toString().toLowerCase();
      const vb = (b[sortKey] ?? '').toString().toLowerCase();
      if (va < vb) return sortDir === 'asc' ? -1 : 1;
      if (va > vb) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return arr;
  }, [students, sortKey, sortDir]);

  const setSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  return (
    <div className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200">
        <div>
          <h4 className="font-medium">Students</h4>
          <p className="text-xs text-neutral-500">{loading ? 'Loading…' : `${students.length} records`}</p>
        </div>
        <button
          onClick={reload}
          className="inline-flex items-center gap-2 rounded-lg border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </button>
      </div>

      {error && (
        <div className="px-4 py-2 text-sm text-red-600">{error}</div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-neutral-50 border-b border-neutral-200">
            <tr>
              <Th onClick={() => setSort('name')} active={sortKey === 'name'} dir={sortDir}>Name</Th>
              <Th onClick={() => setSort('email')} active={sortKey === 'email'} dir={sortDir}>Email</Th>
              <Th onClick={() => setSort('course')} active={sortKey === 'course'} dir={sortDir}>Course</Th>
              <Th onClick={() => setSort('status')} active={sortKey === 'status'} dir={sortDir}>Status</Th>
              <Th onClick={() => setSort('createdAt')} active={sortKey === 'createdAt'} dir={sortDir}>Created</Th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((s) => (
              <tr key={s.id} className="border-b border-neutral-100 hover:bg-neutral-50/60">
                <td className="px-4 py-2 font-medium">{s.name}</td>
                <td className="px-4 py-2 text-neutral-600">{s.email}</td>
                <td className="px-4 py-2">{s.course}</td>
                <td className="px-4 py-2"><StatusBadge status={s.status} /></td>
                <td className="px-4 py-2 text-neutral-500">{formatDate(s.createdAt)}</td>
                <td className="px-4 py-2">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(s)}
                      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs border border-neutral-300 hover:bg-neutral-100"
                    >
                      <Pencil className="h-4 w-4" /> Edit
                    </button>
                    <button
                      onClick={() => onDelete(s.id)}
                      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs border border-red-300 text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {!loading && sorted.length === 0 && (
              <tr>
                <td className="px-4 py-10 text-center text-neutral-500" colSpan={6}>
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Th({ children, onClick, active, dir }) {
  return (
    <th
      onClick={onClick}
      className={`px-4 py-2 text-left text-xs font-medium uppercase tracking-wide select-none cursor-pointer ${active ? 'text-rose-600' : 'text-neutral-500'}`}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        {active && <span>{dir === 'asc' ? '▲' : '▼'}</span>}
      </span>
    </th>
  );
}

function formatDate(ts) {
  if (!ts) return '—';
  try {
    const d = new Date(ts);
    return d.toLocaleDateString();
  } catch {
    return '—';
  }
}
