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