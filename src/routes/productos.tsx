import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ProductosService } from "@/services/productos.service";
import type { Producto, ProductoInput } from "@/models/types";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorBanner,
  Field,
  Input,
  PageHeader,
  Textarea,
} from "@/views/ui";

export const Route = createFileRoute("/productos")({
  component: ProductosPage,
});

const EMPTY: ProductoInput = { name: "", description: "", price: 0, stock: 0 };

function ProductosPage() {
  const [items, setItems] = useState<Producto[]>([]);
  const [form, setForm] = useState<ProductoInput>(EMPTY);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const load = async () => {
    setLoading(true);
    try {
      const result = await ProductosService.list();
      setItems(Array.isArray(result.items) ? result.items : []); // ✅ ahora sí guarda el array
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
    if (form.price <= 0) return setError(new Error("El precio debe ser mayor que 0"));
    if (form.stock < 0) return setError(new Error("El stock no puede ser negativo"));
    try {
      if (editingId) await ProductosService.update(editingId, form);
      else await ProductosService.create(form);
      setForm(EMPTY);
      setEditingId(null);
      await load();
    } catch (err) {
      setError(err);
    }
  };

  const edit = (p: Producto) => {
    setEditingId(p.id);
    setForm({
      name: p.name,
      description: p.description ?? "",
      price: p.price,
      stock: p.stock,
    });
  };

  const deactivate = async (id: string) => {
    if (!confirm("¿Desactivar producto?")) return;
    try {
      await ProductosService.deactivate(id);
      await load();
    } catch (err) {
      setError(err);
    }
  };

  const money = (n: number) =>
    new Intl.NumberFormat("es-BO", {
      style: "currency",
      currency: "BOB", // ✅ Bolivianos
      minimumFractionDigits: 2,
    }).format(Number.isFinite(n) ? n : 0);

  return (
    <div>
      <PageHeader eyebrow="Módulo" title="Productos" />
      <ErrorBanner error={error} />

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <Card>
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wide">
            {editingId ? "Editar producto" : "Nuevo producto"}
          </h2>
          <form onSubmit={submit} className="space-y-3">
            <Field label="Nombre">
              <Input
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </Field>
            <Field label="Descripción">
              <Textarea
                rows={3}
                value={form.description ?? ""}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Precio">
                <Input
                  type="number"
                  step={1}
                  min={1}
                  required
                  value={form.price || ""}
                  onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                />
              </Field>
              <Field label="Stock">
                <Input
                  type="number"
                  step={1}
                  min={0}
                  required
                  value={form.stock || ""}
                  onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })}
                />
              </Field>
            </div>
            <div className="flex gap-2 pt-2">
              <Button type="submit">{editingId ? "Actualizar" : "Registrar"}</Button>
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
            Catálogo {loading && "· cargando..."}
          </h2>
          {items.length === 0 && !loading ? (
            <EmptyState message="Sin productos. Agrega el primero." />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                    <th className="py-2 pr-2">Nombre</th>
                    <th className="py-2 pr-2">Precio</th>
                    <th className="py-2 pr-2">Stock</th>
                    <th className="py-2 pr-2">Estado</th>
                    <th className="py-2 pr-2 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((p) => (
                    <tr key={p.id} className="border-b border-border/50">
                      <td className="py-2 pr-2">
                        <div className="font-medium">{p.name}</div>
                        {p.description && (
                          <div className="text-xs text-muted-foreground">{p.description}</div>
                        )}
                      </td>
                      <td className="py-2 pr-2">{money(p.price)}</td>
                      <td className="py-2 pr-2">
                        <Badge tone={p.stock > 5 ? "success" : p.stock > 0 ? "warn" : "danger"}>
                          {p.stock}
                        </Badge>
                      </td>
                      <td className="py-2 pr-2">
                        <Badge tone={p.isActive ? "success" : "danger"}>
                          {p.isActive ? "Activo" : "Inactivo"}
                        </Badge>
                      </td>
                      <td className="py-2 pr-2 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="secondary" onClick={() => edit(p)}>
                            Editar
                          </Button>
                          {p.isActive && (
                            <Button variant="danger" onClick={() => deactivate(p.id)}>
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
