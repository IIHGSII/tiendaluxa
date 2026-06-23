-- ============================================================
-- TIENDA LUXA — Migración: Tabla de Pedidos (orders)
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

-- 1. Crear la tabla orders
CREATE TABLE IF NOT EXISTS public.orders (
  id                  BIGSERIAL PRIMARY KEY,
  cliente_nombre      TEXT NOT NULL,
  cliente_telefono    TEXT NOT NULL,
  direccion_envio     TEXT NOT NULL,
  ciudad              TEXT NOT NULL,
  detalles_pedido     JSONB NOT NULL,
  total_orden         NUMERIC(12, 0) NOT NULL,
  estado              TEXT NOT NULL DEFAULT 'pendiente',
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Habilitar Row Level Security (RLS)
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- 3. Política: cualquiera puede insertar pedidos (clientes de la tienda)
CREATE POLICY "Clientes pueden crear pedidos"
  ON public.orders
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 4. Política: solo el service role puede leer pedidos (para el admin)
CREATE POLICY "Solo service role puede leer pedidos"
  ON public.orders
  FOR SELECT
  TO service_role
  USING (true);

-- 5. Índice para buscar pedidos por estado rápidamente
CREATE INDEX IF NOT EXISTS orders_estado_idx ON public.orders (estado);
CREATE INDEX IF NOT EXISTS orders_created_at_idx ON public.orders (created_at DESC);

-- Verificar creación
SELECT 'Tabla orders creada exitosamente ✅' AS resultado;
