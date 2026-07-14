import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ClientesService } from "@/services/clientes.service";
import type { Cliente, ClienteInput } from "@/models/types";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorBanner,
  Field,
  Input,
  PageHeader,
} from "@/views/ui";

export const Route = createFileRoute("/clientes")({
  component: ClientesPage,
});

const EMPTY: ClienteInput = { fullName: "", email: "", phone: "" };

function ClientesPage() {
  const [items, setItems] = useState<Cliente[]>([]);
  const [form, setForm] = useState<ClienteInput>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const load = async () => {
    setLoading(true);
    try {
      setItems(await ClientesService.list());
      setError(null);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) await ClientesService.update(editingId, form);
      else await ClientesService.create(form);
      setForm(EMPTY);
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err);
    }
  };

  const edit = (c: Cliente) => {
    setEditingId(c.id);
    setForm({ fullName: c.fullName, email: c.email, phone: c.phone ?? "" });
  };

  const deactivate = async (id: string) => {
    if (!confirm("¿Desactivar cliente?")) return;
    try {
      await ClientesService.deactivate(id);
      await load();
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div>
      <PageHeader eyebrow="Módulo" title="Clientes" />
      <ErrorBanner error={error} />

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <Card>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide">
            {editingId ? "Editar cliente" : "Nuevo cliente"}
          </h2>
          <form onSubmit={submit} className="space-y-3">
            <Field label="Nombre completo">
              <Input
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              />
            </Field>
            <Field label="Email (único)">
              <Input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </Field>
            <Field label="Teléfono (opcional)">
              <Input
                value={form.phone ?? ""}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </Field>
            <div className="flex gap-2 pt-2">
              <Button type="submit">
                {editingId ? "Actualizar" : "Registrar"}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setEditingId(null);
                    setForm(EMPTY);
                  }}
                >
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </Card>

        <Card>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide">
            Listado {loading && "· cargando..."}
          </h2>
          {items.length === 0 && !loading ? (
            <EmptyState message="Sin clientes. Registra el primero." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                    <th className="py-2 pr-2">Nombre</th>
                    <th className="py-2 pr-2">Email</th>
                    <th className="py-2 pr-2">Teléfono</th>
                    <th className="py-2 pr-2">Estado</th>
                    <th className="py-2 pr-2 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((c) => (
                    <tr key={c.id} className="border-b border-border/50">
                      <td className="py-2 pr-2 font-medium">{c.fullName}</td>
                      <td className="py-2 pr-2 text-muted-foreground">{c.email}</td>
                      <td className="py-2 pr-2 text-muted-foreground">{c.phone || "—"}</td>
                      <td className="py-2 pr-2">
                        <Badge tone={c.isActive ? "success" : "danger"}>
                          {c.isActive ? "Activo" : "Inactivo"}
                        </Badge>
                      </td>
                      <td className="py-2 pr-2 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="secondary" onClick={() => edit(c)}>
                            Editar
                          </Button>
                          {c.isActive && (
                            <Button variant="danger" onClick={() => deactivate(c.id)}>
                              Desactivar
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}