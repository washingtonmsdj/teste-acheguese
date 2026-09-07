import Link from 'next/link';

type EmptyStateProps = {
  query?: string;
  hasFilters: boolean;
};

export function ClassifiedsEmptyState({
  query,
  hasFilters,
}: EmptyStateProps) {
  return (
    <div className="classifiedEmptyState">
      <span className="emptyIcon" aria-hidden="true">⌕</span>
      <div>
        <h3>
          {query
            ? `Nenhum anúncio encontrado para “${query}”.`
            : 'Ainda não há anúncios para mostrar aqui.'}
        </h3>
        <p>
          {hasFilters
            ? 'Tente remover os filtros ou publique um anúncio nessa categoria.'
            : 'Quando houver anúncios disponíveis na sua região, eles aparecerão nesta lista.'}
        </p>
      </div>
      <div className="emptyActions">
        {hasFilters && (
          <Link className="ghostButton linkButton" href="/classificados">
            Limpar filtros
          </Link>
        )}
        <Link className="primaryButton linkButton" href="/classificados/novo">
          Criar anúncio
        </Link>
      </div>
    </div>
  );
}
