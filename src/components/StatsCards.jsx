import { Users, GraduationCap, CheckCircle, Clock } from 'lucide-react';

export default function StatsCards({ students = [], loading }) {
  const total = students.length;
  const active = students.filter((s) => (s.status || '').toLowerCase() === 'active').length;
  const graduated = students.filter((s) => (s.status || '').toLowerCase() === 'graduated').length;
  const pending = students.filter((s) => (s.status || '').toLowerCase() === 'pending').length;

  const cards = [
    { name: 'Total Students', value: total, icon: Users, tone: 'text-neutral-900', ring: 'ring-neutral-200', bg: 'bg-white' },
    { name: 'Active', value: active, icon: CheckCircle, tone: 'text-emerald-700', ring: 'ring-emerald-200', bg: 'bg-emerald-50' },
    { name: 'Graduated', value: graduated, icon: GraduationCap, tone: 'text-indigo-700', ring: 'ring-indigo-200', bg: 'bg-indigo-50' },
    { name: 'Pending', value: pending, icon: Clock, tone: 'text-amber-700', ring: 'ring-amber-200', bg: 'bg-amber-50' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((c) => (
        <div
          key={c.name}
          className={`${c.bg} ring-1 ${c.ring} rounded-xl p-4 flex items-center gap-4`}
        >
          <div className={`rounded-lg ${c.bg} ${c.tone}`}>
            <c.icon className={`h-6 w-6 ${loading ? 'animate-pulse' : ''}`} />
          </div>
          <div>
            <p className="text-xs text-neutral-500">{c.name}</p>
            <p className={`text-xl font-semibold ${c.tone}`}>{loading ? '—' : c.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
