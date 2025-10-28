import { useEffect, useState } from 'react';

const empty = { name: '', email: '', course: '', status: 'Active' };

export default function StudentForm({ onSubmit, onCancel, defaultValues }) {
  const [form, setForm] = useState(empty);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (defaultValues) setForm({
      name: defaultValues.name || '',
      email: defaultValues.email || '',
      course: defaultValues.course || '',
      status: defaultValues.status || 'Active',
    });
  }, [defaultValues]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await onSubmit({ ...form });
      setForm(empty);
    } finally {
      setSubmitting(false);
    }
  };

  const isEdit = Boolean(defaultValues?.id);

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold">{isEdit ? 'Edit Student' : 'Add Student'}</h3>
      <p className="text-xs text-neutral-500 mb-4">{isEdit ? 'Update this record.' : 'Create a new student record.'}</p>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-xs text-neutral-600 mb-1">Name</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
            placeholder="Jane Doe"
          />
        </div>
        <div>
          <label className="block text-xs text-neutral-600 mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
            placeholder="jane@example.com"
          />
        </div>
        <div>
          <label className="block text-xs text-neutral-600 mb-1">Course</label>
          <input
            name="course"
            value={form.course}
            onChange={handleChange}
            required
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
            placeholder="Computer Science"
          />
        </div>
        <div>
          <label className="block text-xs text-neutral-600 mb-1">Status</label>
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"
          >
            <option>Active</option>
            <option>Pending</option>
            <option>Graduated</option>
            <option>Inactive</option>
          </select>
        </div>

        <div className="pt-2 flex items-center gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-400 disabled:opacity-60"
          >
            {submitting ? 'Saving...' : isEdit ? 'Update' : 'Create'}
          </button>
          {isEdit && (
            <button
              type="button"
              onClick={onCancel}
              className="text-sm text-neutral-600 hover:text-neutral-900"
            >
              Cancel edit
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
