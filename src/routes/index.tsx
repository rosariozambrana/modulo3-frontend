import { createFileRoute, Link } from "@tanstack/react-router";
import { API_BASE_URL } from "@/lib/api";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const modulos = [
    {
      to: "/clientes" as const,
      title: "Clientes",
      desc: "Registra, actualiza y desactiva la base de clientes.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
        </svg>
      ),
    },
    {
      to: "/productos" as const,
      title: "Productos",
      desc: "Gestiona catálogo, precios y stock disponible en tiempo real.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6">
          <path d="M3 7l9-4 9 4-9 4-9-4z" />
          <path d="M3 7v10l9 4 9-4V7" />
          <path d="M12 11v10" />
        </svg>
      ),
    },
    {
      to: "/pedidos" as const,
      title: "Pedidos",
      desc: "Crea pedidos, agrega productos y controla el estado del flujo.",
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="h-6 w-6">
          <path d="M4 4h3l2 12h10l2-8H7" />
          <circle cx="10" cy="20" r="1.5" />
          <circle cx="18" cy="20" r="1.5" />
        </svg>
      ),
    },
  ];

  const stats = [
    { label: "Módulos activos", value: "3" },
    { label: "Stack", value: "React · TS" },
    { label: "Backend", value: "Node · PG" },
    { label: "Estado", value: "MVP" },
  ];

  return (
    <div className="space-y-14">
      {/* HERO */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-card">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-70"
          style={{
            background:
              "radial-gradient(60% 80% at 85% 10%, color-mix(in oklab, var(--color-primary) 22%, transparent) 0%, transparent 60%), radial-gradient(50% 60% at 10% 100%, color-mix(in oklab, var(--color-primary) 12%, transparent) 0%, transparent 60%)",
          }}
        />
        <div className="relative grid gap-8 p-8 md:grid-cols-[1.4fr_1fr] md:p-12">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Phoenix Financial Group
            </div>
            <h1 className="mt-5 text-4xl font-black leading-[1.05] tracking-tight md:text-5xl">
              Gestiona clientes, productos y{" "}
              <span className="text-primary">pedidos</span> en un solo lugar.
            </h1>
            <p className="mt-4 max-w-xl text-base text-muted-foreground">
              Phoenix Orders es la plataforma interna para operar el flujo
              comercial de punta a punta. Rápido, ordenado y listo para
              conectar al backend Node.js + PostgreSQL.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/pedidos"
                className="inline-flex items-center justify-center rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90"
              >
                Ir a Pedidos →
              </Link>
              <Link
                to="/clientes"
                className="inline-flex items-center justify-center rounded-md border border-border bg-background px-5 py-2.5 text-sm font-semibold text-foreground transition hover:bg-accent"
              >
                Ver Clientes
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 self-center">
            {stats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-border bg-background/70 p-4 backdrop-blur"
              >
                <div className="text-2xl font-black tracking-tight text-foreground">
                  {s.value}
                </div>
                <div className="mt-1 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MÓDULOS */}
      <section>
        <div className="mb-6 flex items-end justify-between">
          <div>
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">
              Módulos
            </div>
            <h2 className="mt-1 text-2xl font-bold tracking-tight">
              Empieza por donde lo necesites
            </h2>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {modulos.map((m) => (
            <Link key={m.to} to={m.to} className="group">
              <div className="relative h-full overflow-hidden rounded-xl border border-border bg-card p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  {m.icon}
                </div>
                <h3 className="mt-5 text-lg font-bold tracking-tight">
                  {m.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {m.desc}
                </p>
                <div className="mt-6 inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-80 transition group-hover:gap-2 group-hover:opacity-100">
                  Ir al módulo <span aria-hidden>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* BACKEND */}
      <section className="rounded-xl border border-border bg-card p-6 md:p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="max-w-xl">
            <div className="text-xs font-semibold uppercase tracking-widest text-primary">
              Integración
            </div>
            <h3 className="mt-1 text-xl font-bold tracking-tight">
              Conectar con el backend
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Configura{" "}
              <code className="rounded bg-muted px-1.5 py-0.5 text-xs font-mono">
                VITE_API_URL
              </code>{" "}
              en tu archivo <code className="font-mono">.env</code>. Endpoints
              esperados: <code className="font-mono">/clientes</code>,{" "}
              <code className="font-mono">/productos</code>,{" "}
              <code className="font-mono">/pedidos</code>.
            </p>
          </div>
          <div className="rounded-lg border border-border bg-background px-4 py-3 font-mono text-xs">
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              API base
            </div>
            <div className="text-foreground">{API_BASE_URL}</div>
          </div>
        </div>
      </section>
    </div>
  );
}
