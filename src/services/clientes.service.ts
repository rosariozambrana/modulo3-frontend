import { api } from "@/lib/api";
import type { Cliente, ClienteInput } from "@/models/types";

const BASE = "/clientes";

export const ClientesService = {
  list: () => api.get<Cliente[]>(BASE),
  getById: (id: string) => api.get<Cliente>(`${BASE}/${id}`),
  create: (data: ClienteInput) => api.post<Cliente>(BASE, data),
  update: (id: string, data: Partial<ClienteInput>) =>
    api.put<Cliente>(`${BASE}/${id}`, data),
  deactivate: (id: string) => api.delete<void>(`${BASE}/${id}`),
};