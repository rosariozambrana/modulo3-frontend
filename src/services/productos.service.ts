import { api } from "@/lib/api";
import type { Producto, ProductoInput } from "@/models/types";

const BASE = "/productos";

// 🔑 Ajustamos para que list devuelva { items, meta }
export const ProductosService = {
  list: () => api.get<{ items: Producto[]; meta: any }>(BASE),
  getById: (id: string) => api.get<Producto>(`${BASE}/${id}`),
  create: (data: ProductoInput) => api.post<Producto>(BASE, data),
  update: (id: string, data: Partial<ProductoInput>) =>
    api.put<Producto>(`${BASE}/${id}`, data),
  deactivate: (id: string) => api.delete<void>(`${BASE}/${id}`),
};
