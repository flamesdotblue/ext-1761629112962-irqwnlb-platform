import { useEffect, useMemo, useState } from 'react';
import HeroCover from './components/HeroCover';
import StatsCards from './components/StatsCards';
import StudentForm from './components/StudentForm';
import StudentTable from './components/StudentTable';
import {
  listStudents,
  createStudent,
  updateStudent,
  deleteStudent,
} from './lib/googleSheetsService';

export default function App() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editing, setEditing] = useState(null);
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter((s) =>
      [s.name, s.email, s.course, s.status]
        .filter(Boolean)
        .some((f) => String(f).toLowerCase().includes(q))
    );
  }, [students, query]);

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await listStudents();
      setStudents(Array.isArray(data) ? data : []);
    } catch (e) {
      setError('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (payload) => {
    try {
      if (editing) {
        const updated = await updateStudent(editing.id, payload);
        setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
      } else {
        const created = await createStudent(payload);
        setStudents((prev) => [created, ...prev]);
      }
      setEditing(null);
    } catch (e) {
      setError('Save failed');
    }
  };

  const handleEdit = (student) => setEditing(student);

  const handleDelete = async (id) => {
    try {
      await deleteStudent(id);
      setStudents((prev) => prev.filter((s) => s.id !== id));
      if (editing?.id === id) setEditing(null);
    } catch (e) {
      setError('Delete failed');
    }
  };

  const handleCancelEdit = () => setEditing(null);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <HeroCover />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
        <div className="rounded-xl bg-white/80 backdrop-blur border border-neutral-200 shadow-sm p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Student Management</h2>
              <p className="text-sm text-neutral-500">Backed by Google Sheets</p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, email, course, status"
                className="w-full md:w-80 rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
              />
            </div>
          </div>

          <div className="mt-6">
            <StatsCards students={students} loading={loading} />
          </div>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <StudentForm
                key={editing ? editing.id : 'new'}
                onSubmit={handleSubmit}
                onCancel={handleCancelEdit}
                defaultValues={editing}
              />
            </div>
            <div className="lg:col-span-2">
              <StudentTable
                students={filtered}
                loading={loading}
                error={error}
                onEdit={handleEdit}
                onDelete={handleDelete}
                reload={load}
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 text-center text-xs text-neutral-500">
        <p>
          Configure VITE_SHEETS_ENDPOINT for Google Sheets backend. Falls back to local storage if not set.
        </p>
      </footer>
    </div>
  );
}
