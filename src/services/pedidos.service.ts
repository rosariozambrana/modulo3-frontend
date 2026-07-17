import { api } from "@/lib/api";
import type { Pedido, PedidoEstado, PedidoInput } from "@/models/types";

const BASE = "/pedidos";

export const PedidosService = {
  list: async () => {
    const res = await api.get<{ items: any[]; meta: unknown }>(BASE);
    const mappedItems = res.items.map((p) => ({
      ...p,
      status: translateStatusToEs(p.status),
    })) as Pedido[];
    return { items: mappedItems, meta: res.meta };
  },

  getById: async (id: string) => {
    const p = await api.get<any>(`${BASE}/${id}`);
    return {
      ...p,
      status: translateStatusToEs(p.status),
    } as Pedido;
  },

  create: (data: PedidoInput) => api.post<Pedido>(BASE, data),

  addItems: (id: string, items: PedidoInput["items"]) =>
    api.post<Pedido>(`${BASE}/${id}/items`, { items }),

  changeStatus: (id: string, status: PedidoEstado) => {
    const statusMap: Record<PedidoEstado, string> = {
      PENDIENTE: "PENDING",
      CONFIRMADO: "CONFIRMED",
      ENTREGADO: "DELIVERED",
      CANCELADO: "CANCELLED",
    };
    return api.patch<Pedido>(`${BASE}/${id}/status`, { status: statusMap[status] });
  },
};

const translateStatusToEs = (status: string): PedidoEstado => {
  const map: Record<string, PedidoEstado> = {
    PENDING: "PENDIENTE",
    CONFIRMED: "CONFIRMADO",
    DELIVERED: "ENTREGADO",
    CANCELLED: "CANCELADO",
  };
  return map[status] || "PENDIENTE";
};
