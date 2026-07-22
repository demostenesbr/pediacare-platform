type ContentRecord = {
  id: string;
  title: string;
  channel: 'linkedin' | 'medium';
  updatedAt: string;
};

async function getDashboardData() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';

  try {
    const response = await fetch(`${apiBaseUrl}/content`, { cache: 'no-store' });
    if (!response.ok) return [] as ContentRecord[];
    return response.json();
  } catch {
    return [] as ContentRecord[];
  }
}

export default async function Home() {
  const items = await getDashboardData();
  const byChannel = items.reduce(
    (acc, item) => {
      acc[item.channel] += 1;
      return acc;
    },
    { linkedin: 0, medium: 0 },
  );

  return (
    <main
      className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#d7f9f4,_#f5f3ff_45%,_#fff7ed)] px-6 py-10 text-slate-900"
      style={{ fontFamily: "'Space Grotesk', 'Segoe UI', sans-serif" }}
    >
      <section className="mx-auto grid max-w-6xl gap-4 lg:grid-cols-3">
        <article className="rounded-3xl border border-emerald-200 bg-white/85 p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-600">Posts</p>
          <h2 className="mt-3 text-3xl font-bold">{items.length}</h2>
          <p className="mt-1 text-sm text-slate-600">Total de conteudos cadastrados</p>
        </article>
        <article className="rounded-3xl border border-cyan-200 bg-white/85 p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-cyan-700">LinkedIn</p>
          <h2 className="mt-3 text-3xl font-bold">{byChannel.linkedin}</h2>
          <p className="mt-1 text-sm text-slate-600">Materiais prontos para publicacao</p>
        </article>
        <article className="rounded-3xl border border-orange-200 bg-white/85 p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-orange-700">Medium</p>
          <h2 className="mt-3 text-3xl font-bold">{byChannel.medium}</h2>
          <p className="mt-1 text-sm text-slate-600">Artigos longos em edicao</p>
        </article>
      </section>

      <section className="mx-auto mt-6 max-w-6xl rounded-3xl border border-slate-200 bg-white/80 p-6">
        <h1 className="text-2xl font-bold">Painel operacional do MVP</h1>
        <p className="mt-2 text-sm text-slate-600">
          Consuma a documentacao em /api/docs para criar, editar e remover conteudos.
        </p>

        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 text-slate-600">
                <th className="py-2">Titulo</th>
                <th className="py-2">Canal</th>
                <th className="py-2">Atualizado em</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} className="border-b border-slate-100">
                  <td className="py-3">{item.title}</td>
                  <td className="py-3 uppercase">{item.channel}</td>
                  <td className="py-3">{new Date(item.updatedAt).toLocaleString('pt-BR')}</td>
                </tr>
              ))}
              {items.length === 0 && (
                <tr>
                  <td className="py-3 text-slate-500" colSpan={3}>
                    Nenhum item encontrado. Inicie a API e cadastre conteudos para visualizar o painel.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
