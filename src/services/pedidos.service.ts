import { api } from "@/lib/api";
import type { Pedido, PedidoEstado, PedidoInput } from "@/models/types";

const BASE = "/pedidos";

export const PedidosService = {
  list: () => api.get<Pedido[]>(BASE),
  getById: (id: string) => api.get<Pedido>(`${BASE}/${id}`),
  create: (data: PedidoInput) => api.post<Pedido>(BASE, data),
  addItems: (id: string, items: PedidoInput["items"]) =>
    api.post<Pedido>(`${BASE}/${id}/items`, { items }),
  changeStatus: (id: string, status: PedidoEstado) =>
    api.patch<Pedido>(`${BASE}/${id}/status`, { status }),
};