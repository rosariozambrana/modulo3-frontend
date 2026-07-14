import { api } from "@/lib/api";
import type { Producto, ProductoInput } from "@/models/types";

const BASE = "/productos";

export const ProductosService = {
  list: () => api.get<Producto[]>(BASE),
  getById: (id: string) => api.get<Producto>(`${BASE}/${id}`),
  create: (data: ProductoInput) => api.post<Producto>(BASE, data),
  update: (id: string, data: Partial<ProductoInput>) =>
    api.put<Producto>(`${BASE}/${id}`, data),
  deactivate: (id: string) => api.delete<void>(`${BASE}/${id}`),
};