# Phoenix Orders — Frontend MVP

Frontend en **React + TypeScript + Vite** para el sistema Phoenix Orders
(clase DevSecOps — Phoenix Financial Group).

## Arquitectura por capas (MVC)

```
src/
 ├── models/         # Modelos / tipos compartidos con el backend
 │    └── types.ts
 ├── services/       # Capa "Controller" — HTTP contra el backend
 │    ├── clientes.service.ts
 │    ├── productos.service.ts
 │    └── pedidos.service.ts
 ├── lib/
 │    └── api.ts     # Cliente HTTP genérico (fetch + VITE_API_URL)
 ├── views/
 │    └── ui.tsx     # Componentes UI reutilizables (View)
 └── routes/         # Páginas (View) — file-based routing
      ├── index.tsx      # Dashboard
      ├── clientes.tsx
      ├── productos.tsx
      └── pedidos.tsx
```

## Configuración

1. Copia `.env.example` a `.env` y ajusta la URL de tu API:
   ```
   VITE_API_URL=http://localhost:3000/api
   ```
2. Instala dependencias: `bun install` (o `npm install`).
3. Ejecuta en dev: `bun run dev`.

## Endpoints esperados en el backend

El frontend consume estos endpoints REST (JSON):

### Clientes
- `GET    /clientes`
- `GET    /clientes/:id`
- `POST   /clientes`           `{ fullName, email, phone? }`
- `PUT    /clientes/:id`       `{ fullName?, email?, phone? }`
- `DELETE /clientes/:id`       → baja lógica (`isActive = false`)

### Productos
- `GET    /productos`
- `GET    /productos/:id`
- `POST   /productos`          `{ name, description?, price, stock }`
- `PUT    /productos/:id`      `{ name?, description?, price?, stock? }`
- `DELETE /productos/:id`      → baja lógica

### Pedidos
- `GET    /pedidos`
- `GET    /pedidos/:id`
- `POST   /pedidos`            `{ clientId, items: [{ productId, quantity }] }`
- `POST   /pedidos/:id/items`  `{ items: [{ productId, quantity }] }`
- `PATCH  /pedidos/:id/status` `{ status: "PENDIENTE"|"CONFIRMADO"|"ENTREGADO"|"CANCELADO" }`

## Reglas de negocio (validadas en UI, deben repetirse en backend)

- Email de cliente único y obligatorio.
- Precio de producto > 0, stock ≥ 0.
- Pedido: cliente activo + al menos 1 producto + cantidad > 0.
- Total del pedido = Σ(price × quantity), calculado también en el frontend
  para feedback en vivo.
- Baja lógica (nunca borrado físico) en clientes y productos.