import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PedidosService } from "@/services/pedidos.service";
import { ClientesService } from "@/services/clientes.service";
import { ProductosService } from "@/services/productos.service";
import type {
  Cliente,
  Pedido,
  PedidoEstado,
  Producto,
} from "@/models/types";
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorBanner,
  Field,
  Input,
  PageHeader,
  Select,
} from "@/views/ui";

export const Route = createFileRoute("/pedidos")({
  component: PedidosPage,
});

const ESTADOS: PedidoEstado[] = [
  "PENDIENTE",
  "CONFIRMADO",
  "ENTREGADO",
  "CANCELADO",
];

const estadoTone = (s: PedidoEstado) =>
  s === "PENDIENTE" ? "warn"
  : s === "CONFIRMADO" ? "primary"
  : s === "ENTREGADO" ? "success"
  : "danger";

interface DraftItem {
  productId: string;
  quantity: number;
}

function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [clientId, setClientId] = useState("");
  const [items, setItems] = useState<DraftItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const load = async () => {
    setLoading(true);
    try {
      const [p, c, pr] = await Promise.all([
        PedidosService.list(),
        ClientesService.list(),
        ProductosService.list(),
      ]);
      setPedidos(p);
      setClientes(c.filter((x) => x.isActive));
      setProductos(pr.filter((x) => x.isActive));
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

  const productosMap = useMemo(
    () => new Map(productos.map((p) => [p.id, p])),
    [productos],
  );

  const total = useMemo(
    () =>
      items.reduce((sum, it) => {
        const p = productosMap.get(it.productId);
        return sum + (p ? p.price * it.quantity : 0);
      }, 0),
    [items, productosMap],
  );

  const addItem = () => {
    if (productos.length === 0) return;
    setItems([...items, { productId: productos[0].id, quantity: 1 }]);
  };

  const updateItem = (idx: number, patch: Partial<DraftItem>) => {
    setItems(items.map((it, i) => (i === idx ? { ...it, ...patch } : it)));
  };

  const removeItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId) return setError(new Error("Selecciona un cliente"));
    if (items.length === 0) return setError(new Error("Agrega al menos 1 producto"));
    if (items.some((i) => i.quantity <= 0))
      return setError(new Error("Las cantidades deben ser mayores a 0"));
    try {
      await PedidosService.create({ clientId, items });
      setClientId("");
      setItems([]);
      await load();
    } catch (err) {
      setError(err);
    }
  };

  const changeStatus = async (id: string, status: PedidoEstado) => {
    try {
      await PedidosService.changeStatus(id, status);
      await load();
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div>
      <PageHeader eyebrow="Módulo" title="Pedidos" />
      <ErrorBanner error={error} />

      <Card className="mb-6">
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide">
          Nuevo pedido
        </h2>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Cliente">
              <Select
                required
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
              >
                <option value="">— Selecciona un cliente —</option>
                {clientes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.fullName} ({c.email})
                  </option>
                ))}
              </Select>
            </Field>
            <div className="flex items-end">
              <Button type="button" variant="secondary" onClick={addItem}>
                + Agregar producto
              </Button>
            </div>
          </div>

          {items.length > 0 && (
            <div className="rounded-md border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50 text-left text-xs uppercase text-muted-foreground">
                    <th className="p-2">Producto</th>
                    <th className="p-2 w-28">Cantidad</th>
                    <th className="p-2 w-28">Precio</th>
                    <th className="p-2 w-28">Subtotal</th>
                    <th className="p-2 w-16"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it, i) => {
                    const p = productosMap.get(it.productId);
                    return (
                      <tr key={i} className="border-b border-border/50">
                        <td className="p-2">
                          <Select
                            value={it.productId}
                            onChange={(e) => updateItem(i, { productId: e.target.value })}
                          >
                            {productos.map((prod) => (
                              <option key={prod.id} value={prod.id}>
                                {prod.name} (stock: {prod.stock})
                              </option>
                            ))}
                          </Select>
                        </td>
                        <td className="p-2">
                          <Input
                            type="number"
                            min={1}
                            max={p?.stock ?? 999}
                            value={it.quantity}
                            onChange={(e) =>
                              updateItem(i, { quantity: Number(e.target.value) })
                            }
                          />
                        </td>
                        <td className="p-2">${p ? Number(p.price).toFixed(2) : "—"}</td>
                        <td className="p-2 font-semibold">
                          ${p ? (p.price * it.quantity).toFixed(2) : "—"}
                        </td>
                        <td className="p-2 text-right">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => removeItem(i)}
                          >
                            ✕
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-muted/30">
                    <td colSpan={3} className="p-2 text-right text-sm font-semibold uppercase">
                      Total
                    </td>
                    <td colSpan={2} className="p-2 text-lg font-bold text-primary">
                      ${total.toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={!clientId || items.length === 0}>
              Crear pedido
            </Button>
          </div>
        </form>
      </Card>

      <Card>
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide">
          Pedidos {loading && "· cargando..."}
        </h2>
        {pedidos.length === 0 && !loading ? (
          <EmptyState message="Sin pedidos todavía." />
        ) : (
          <div className="space-y-3">
            {pedidos.map((p) => (
              <div
                key={p.id}
                className="rounded-md border border-border p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs text-muted-foreground">
                      #{p.id.slice(0, 8)} · {new Date(p.createdAt).toLocaleString()}
                    </div>
                    <div className="font-semibold">
                      {p.clientName ??
                        clientes.find((c) => c.id === p.clientId)?.fullName ??
                        p.clientId}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge tone={estadoTone(p.status)}>{p.status}</Badge>
                    <div className="text-lg font-bold text-primary">
                      ${Number(p.total).toFixed(2)}
                    </div>
                    <Select
                      value={p.status}
                      onChange={(e) =>
                        changeStatus(p.id, e.target.value as PedidoEstado)
                      }
                      className="w-40"
                    >
                      {ESTADOS.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </Select>
                  </div>
                </div>
                <ul className="mt-3 divide-y divide-border/50 text-sm">
                  {p.items.map((it, i) => (
                    <li key={i} className="flex justify-between py-1">
                      <span>
                        {it.productName ??
                          productosMap.get(it.productId)?.name ??
                          it.productId}{" "}
                        × {it.quantity}
                      </span>
                      {it.unitPrice != null && (
                        <span className="text-muted-foreground">
                          ${(it.unitPrice * it.quantity).toFixed(2)}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}