import { createClient } from '../../lib/supabase/server';
import { logout } from '../login/actions';

const PROXIMOS = ['Dashboard Maestro', 'Dashboard Estadístico', 'Revisión Previa de Trabajo', 'Investigación de Accidentes', 'Biblioteca Preventiva'];

export default async function AdminLayout({ children }) {
  const supabase = createClient();
  // La política de seguridad solo deja ver esta tabla a un administrador.
  const { data: adm } = await supabase.from('admins').select('user_id').limit(1);
  if (!adm?.length) {
    return (
      <main className="login">
        <form action={logout} className="box">
          <h1>Sin acceso</h1>
          <p>Tu usuario no está registrado como administrador.</p>
          <button className="p">Salir</button>
        </form>
      </main>
    );
  }
  return (
    <div className="app">
      <aside className="sb">
        <div className="brand">Punto Seguro<small>Administrador</small></div>
        <nav>
          <a href="/centros" aria-current="page">Centros de Trabajo</a>
          {PROXIMOS.map((n) => <span key={n} className="soon">{n}</span>)}
        </nav>
        <form action={logout}><button className="out">Salir</button></form>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}
