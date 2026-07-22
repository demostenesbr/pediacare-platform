type ContentRecord = {
  id: string;
  title: string;
  summary: string;
  channel: 'linkedin' | 'medium';
  tags: string[];
  updatedAt: string;
};

async function getContent(): Promise<ContentRecord[]> {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:3000';

  try {
    const response = await fetch(`${apiBaseUrl}/content`, { cache: 'no-store' });
    if (!response.ok) return [];
    return response.json();
  } catch {
    return [];
  }
}

export default async function Home() {
  const records = await getContent();

  return (
    <main
      className="min-h-screen bg-gradient-to-b from-amber-50 via-orange-50 to-rose-100 px-6 py-10 text-slate-900"
      style={{ fontFamily: "'IBM Plex Sans', 'Segoe UI', sans-serif" }}
    >
      <section className="mx-auto max-w-5xl rounded-3xl border border-amber-200/70 bg-white/80 p-8 shadow-xl backdrop-blur">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-rose-700">PediaCare Platform</p>
        <h1 className="text-4xl font-bold leading-tight">Conteudo para LinkedIn e Medium com suporte a agentes de IA</h1>
        <p className="mt-4 max-w-3xl text-base text-slate-700">
          Front-end publico conectado ao backend NestJS. Este exemplo lista os itens criados via CRUD na API.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {records.length === 0 ? (
            <article className="rounded-2xl border border-dashed border-slate-300 bg-white p-6 sm:col-span-2">
              <h2 className="text-lg font-semibold">Sem conteudo publicado ainda</h2>
              <p className="mt-2 text-sm text-slate-600">Suba a API e crie um item em /api/docs para visualizar aqui.</p>
            </article>
          ) : (
            records.map((item) => (
              <article key={item.id} className="rounded-2xl border border-rose-100 bg-white p-6 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-600">{item.channel}</p>
                <h2 className="mt-2 text-xl font-bold">{item.title}</h2>
                <p className="mt-2 text-sm text-slate-600">{item.summary}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {item.tags.map((tag) => (
                    <span key={`${item.id}-${tag}`} className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-900">
                      #{tag}
                    </span>
                  ))}
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}
