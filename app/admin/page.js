import supabase from '../../db.js';
import AdminPanel from './AdminPanel';
import { logout } from './auth-actions';

export const metadata = {
  title: 'Panel de Administración | Tienda Luxa',
  robots: { index: false, follow: false }
};

export default async function AdminPage() {
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .order('id', { ascending: false });

  return (
    <div style={{ minHeight: '100vh', background: '#000', color: 'white' }}>
      <header style={{ padding: '1.5rem 2rem', borderBottom: '1px solid #333', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#111' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <h2 style={{ margin: 0, color: '#d4af37' }}>LUXA</h2>
          <span style={{ color: '#888', borderLeft: '1px solid #333', paddingLeft: '1rem' }}>Panel Administrativo</span>
        </div>
        <form action={logout}>
          <button type="submit" className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
            Cerrar Sesión
          </button>
        </form>
      </header>
      <main>
        <AdminPanel products={products || []} />
      </main>
    </div>
  );
}
