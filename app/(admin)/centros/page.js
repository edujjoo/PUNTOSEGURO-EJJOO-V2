import { createClient } from '../../../lib/supabase/server';

const maps = (d) => `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(d)}`;
const waze = (d) => `https://waze.com/ul?q=${encodeURIComponent(d)}&navigate=yes`;

export default async function Centros({ searchParams }) {
  const supabase = createClient();
  const q = String(searchParams?.q || '').trim();
  let consulta = supabase
    .from('puntos')
    .select('id,nombre,direccion,comuna,cliente,marca,recintos(nombre),asignaciones(count)', { count: 'exact' })
    .order('nombre')
    .limit(200);
  if (q) {
    const t = q.replace(/[%,()]/g, ' ');
    consulta = consulta.or(`nombre.ilike.%${t}%,direccion.ilike.%${t}%,cliente.ilike.%${t}%,comuna.ilike.%${t}%`);
  }
  const { data, count, error } = await consulta;

  return (
    <>
      <h1>Centros de Trabajo</h1>
      <p className="mu">{count ?? 0} centros{q ? ` que coinciden con "${q}"` : ''}.</p>
      <form className="bar" method="get">
        <input name="q" defaultValue={q} placeholder="Buscar por centro, dirección, comuna o cliente" />
        <button>Buscar</button>
      </form>
      {error && <p className="err">No pude leer los centros: {error.message}</p>}
      {!error && !data?.length && (
        <p className="mu">Aún no hay centros cargados. El siguiente paso es cargar aquí la Base Maestra.</p>
      )}
      {count > 200 && <p className="mu">Mostrando 200 de {count}. Afina la búsqueda para ver el resto.</p>}
      <div className="list">
        {data?.map((p) => {
          const dir = [p.direccion, p.comuna].filter(Boolean).join(', ');
          return (
            <div className="item" key={p.id}>
              <div>
                <b>{p.nombre}</b>
                <span className="mu">{dir || 'Sin dirección'}</span>
                <span className="mu">{[p.cliente, p.marca, p.recintos?.nombre].filter(Boolean).join(' · ')}</span>
              </div>
              <div className="acts">
                <span className="chip">{p.asignaciones?.[0]?.count ?? 0} asignados</span>
                {dir && <a href={maps(dir)} target="_blank" rel="noopener noreferrer">Maps</a>}
                {dir && <a href={waze(dir)} target="_blank" rel="noopener noreferrer">Waze</a>}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
