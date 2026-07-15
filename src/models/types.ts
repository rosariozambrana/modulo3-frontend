// Modelos compartidos con el backend (Node.js + PostgreSQL)

export interface Cliente {
  id: string;
  fullName: string;
  email: string;
  phone?: string | null;
  isActive: boolean;
  createdAt: string;
}

export type ClienteInput = Omit<Cliente, "id" | "isActive" | "createdAt"> & {
  isActive?: boolean;
};

export interface Producto {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  stock: number;
  isActive: boolean;
  createdAt: string;
}

export type ProductoInput = Omit<Producto, "id" | "isActive" | "createdAt"> & {
  isActive?: boolean;
};

export type PedidoEstado =
  | "PENDIENTE"
  | "CONFIRMADO"
  | "ENTREGADO"
  | "CANCELADO";

export interface PedidoItem {
  productId: string;
  productName?: string;
  unitPrice?: number;
  quantity: number;
}

export interface Pedido {
  id: string;
  customerId: string;        // ✅ corregido
  customerName?: string;     // ✅ corregido
  items: PedidoItem[];
  status: PedidoEstado;
  total: number;
  createdAt: string;
}

export interface PedidoInput {
  customerId: string;        // ✅ corregido
  items: { productId: string; quantity: number }[];
}
