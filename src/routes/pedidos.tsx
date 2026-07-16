import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { PedidosService } from "@/services/pedidos.service";
import { ClientesService } from "@/services/clientes.service";
import { ProductosService } from "@/services/productos.service";
import type { Cliente, Pedido, PedidoEstado, Producto } from "@/models/types";
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

const ESTADOS: PedidoEstado[] = ["PENDIENTE", "CONFIRMADO", "ENTREGADO", "CANCELADO"];

const estadoTone = (s: PedidoEstado) =>
  s === "PENDIENTE"
    ? "warn"
    : s === "CONFIRMADO"
      ? "primary"
      : s === "ENTREGADO"
        ? "success"
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

  const money = (n: number) =>
    new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(Number.isFinite(n) ? n : 0);

  const load = async () => {
    setLoading(true);
    try {
      const [p, c, pr] = await Promise.all([
        PedidosService.list(),
        ClientesService.list(),
        ProductosService.list(),
      ]);
      setPedidos(p.items); // ✅ corregido
      setClientes(c.items.filter((x) => x.isActive)); // ✅ corregido
      setProductos(pr.items.filter((x) => x.isActive)); // ✅ corregido
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

  const productosMap = useMemo(() => new Map(productos.map((p) => [p.id, p])), [productos]);

  const { subtotal, totalUnidades, stockError } = useMemo(() => {
    let sub = 0;
    let units = 0;
    let err: string | null = null;
    for (const it of items) {
      const p = productosMap.get(it.productId);
      if (!p) continue;
      sub += Number(p.price) * it.quantity;
      units += it.quantity;
      if (it.quantity > p.stock)
        err = `Stock insuficiente para "${p.name}" (disponible: ${p.stock})`;
      if (it.quantity <= 0) err = `La cantidad debe ser mayor a 0`;
    }
    return { subtotal: sub, totalUnidades: units, stockError: err };
  }, [items, productosMap]);

  const total = subtotal;

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
    if (stockError) return setError(new Error(stockError));
    try {
      await PedidosService.create({ customerId: clientId, items }); // ✅ corregido
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
        <h2 className="mb-4 text-sm font-bold uppercase tracking-wide">Nuevo pedido</h2>
        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Cliente">
              <Select required value={clientId} onChange={(e) => setClientId(e.target.value)}>
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
                    <th className="p-2 w-32">Cantidad</th>
                    <th className="p-2 w-28 text-right">Precio unit.</th>
                    <th className="p-2 w-32 text-right">Subtotal</th>
                    <th className="p-2 w-16"></th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((it, i) => {
                    const p = productosMap.get(it.productId);
                    const excede = p ? it.quantity > p.stock : false;
                    return (
                      <tr key={i} className="border-b border-border/50 align-middle">
                        <td className="p-2">
                          <Select
                            value={it.productId}
                            onChange={(e) => updateItem(i, { productId: e.target.value })}
                          >
                            {productos.map((prod) => (
                              <option key={prod.id} value={prod.id}>
                                {prod.name} — {money(Number(prod.price))} (stock: {prod.stock})
                              </option>
                            ))}
                          </Select>
                          {p && (
                            <div className="mt-1 text-xs text-muted-foreground">
                              Stock disponible:{" "}
                              <span className={excede ? "font-semibold text-destructive" : ""}>
                                {p.stock}
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="p-2">
                          <div className="flex items-center gap-1">
                            <Button
                              type="button"
                              variant="secondary"
                              className="!px-2 !py-1"
                              onClick={() =>
                                updateItem(i, { quantity: Math.max(1, it.quantity - 1) })
                              }
                            >
                              −
                            </Button>
                            <Input
                              type="number"
                              min={1}
                              max={p?.stock ?? 999}
                              value={it.quantity}
                              onChange={(e) =>
                                updateItem(i, {
                                  quantity: Math.max(1, Number(e.target.value) || 1),
                                })
                              }
                              className="text-center"
                            />
                            <Button
                              type="button"
                              variant="secondary"
                              className="!px-2 !py-1"
                              onClick={() =>
                                updateItem(i, {
                                  quantity: Math.min(p?.stock ?? 999, it.quantity + 1),
                                })
                              }
                            >
                              +
                            </Button>
                          </div>
                        </td>
                        <td className="p-2 text-right tabular-nums">
                          {p ? money(Number(p.price)) : "—"}
                        </td>
                        <td className="p-2 text-right font-semibold tabular-nums">
                          {p ? money(Number(p.price) * it.quantity) : "—"}
                        </td>
                        <td className="p-2 text-right">
                          <Button
                            type="button"
                            variant="ghost"
                            onClick={() => removeItem(i)}
                            aria-label="Quitar producto"
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
                    <td
                      colSpan={3}
                      className="p-2 text-right text-xs uppercase text-muted-foreground"
                    >
                      {items.length} producto{items.length !== 1 && "s"} · {totalUnidades} unidad
                      {totalUnidades !== 1 && "es"}
                    </td>
                    <td colSpan={2} className="p-2 text-right">
                      <div className="text-xs uppercase text-muted-foreground">Total</div>
                      <div className="text-xl font-black text-primary tabular-nums">
                        {money(total)}
                      </div>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}

          {stockError && (
            <div className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
              {stockError}
            </div>
          )}

          <div className="flex justify-end">
            <Button type="submit" disabled={!clientId || items.length === 0 || !!stockError}>
              Crear pedido · {money(total)}
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
              <div key={p.id} className="rounded-md border border-border p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs text-muted-foreground">
                      #{p.id.slice(0, 8)} · {new Date(p.createdAt).toLocaleString()}
                    </div>
                    <div className="font-semibold">
                      {p.customerName ??
                        clientes.find((c) => c.id === p.customerId)?.fullName ??
                        p.customerId}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge tone={estadoTone(p.status)}>{p.status}</Badge>
                    <div className="text-lg font-bold text-primary tabular-nums">
                      {money(Number(p.total))}
                    </div>
                    <Select
                      value={p.status}
                      onChange={(e) => changeStatus(p.id, e.target.value as PedidoEstado)}
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
                  {p.items.map((it, i) => {
                    const prod = productosMap.get(it.productId);
                    const unit = it.unitPrice ?? (prod ? Number(prod.price) : null);
                    const sub = unit != null ? unit * it.quantity : null;
                    return (
                      <li key={i} className="flex items-center justify-between gap-3 py-1.5">
                        <span className="flex-1">
                          {it.productName ?? prod?.name ?? it.productId}
                        </span>
                        <span className="w-32 text-right text-muted-foreground tabular-nums">
                          {unit != null ? money(unit) : "—"} × {it.quantity}
                        </span>
                        <span className="w-24 text-right font-semibold tabular-nums">
                          {sub != null ? money(sub) : "—"}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
