import { createFileRoute, Link } from "@tanstack/react-router";
import { Card, PageHeader } from "@/views/ui";
import { API_BASE_URL } from "@/lib/api";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const modulos = [
    {
      to: "/clientes" as const,
      title: "Clientes",
      desc: "Registrar, listar, actualizar y desactivar clientes.",
    },
    {
      to: "/productos" as const,
      title: "Productos",
      desc: "Gestionar catálogo, precios y stock disponible.",
    },
    {
      to: "/pedidos" as const,
      title: "Pedidos",
      desc: "Crear pedidos, agregar productos y cambiar estado.",
    },
  ];
  return (
    <div>
      <PageHeader
        eyebrow="Clase 1 — Objetivo"
        title="Phoenix Orders MVP"
      />
      <p className="mb-8 max-w-2xl text-sm text-muted-foreground">
        Sistema interno de <strong>Phoenix Financial Group</strong> para
        gestionar clientes, productos y pedidos. Frontend en React + TypeScript
        listo para conectarse al backend Node.js/PostgreSQL.
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        {modulos.map((m) => (
          <Link key={m.to} to={m.to} className="group">
            <Card className="h-full transition-shadow group-hover:shadow-md">
              <div className="mb-2 h-1 w-8 rounded-full bg-primary" />
              <h3 className="text-lg font-bold uppercase tracking-tight">
                {m.title}
              </h3>
              <p className="mt-2 text-sm text-muted-foreground">{m.desc}</p>
              <div className="mt-4 text-xs font-semibold text-primary">
                Ir al módulo →
              </div>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-8">
        <h3 className="mb-2 text-sm font-bold uppercase tracking-wide">
          Conexión con el backend
        </h3>
        <p className="text-sm text-muted-foreground">
          El frontend consume la API en{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            {API_BASE_URL}
          </code>
          . Configura la variable{" "}
          <code className="rounded bg-muted px-1 py-0.5 text-xs">
            VITE_API_URL
          </code>{" "}
          en tu archivo <code>.env</code> para apuntar a tu backend Node.js.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Endpoints esperados: <code>/clientes</code>, <code>/productos</code>,{" "}
          <code>/pedidos</code> (GET, POST, PUT, PATCH, DELETE).
        </p>
      </Card>
    </div>
  );
}
