import Spline from '@splinetool/react-spline';

export default function HeroCover() {
  return (
    <section className="relative h-[56vh] min-h-[380px] w-full">
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/zhZFnwyOYLgqlLWk/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/30 to-white pointer-events-none" />

      <div className="relative z-10 mx-auto flex h-full max-w-7xl items-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <span className="inline-flex items-center rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-rose-600 ring-1 ring-rose-200 backdrop-blur">
            Modern • Minimal • Interactive
          </span>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
            Student Management System
          </h1>
          <p className="mt-3 text-neutral-600">
            Manage students, courses, and statuses with a simple, elegant UI. Powered by Google Sheets or local storage.
          </p>
        </div>
      </div>
    </section>
  );
}
