import Link from 'next/link';
import { NavigationIcon } from '@/shared/navigation/navigation-icon';

type EmptyStateProps = {
  query?: string;
  categoryLabel?: string;
  hasFilters: boolean;
};

export function ClassifiedsEmptyState({
  query,
  categoryLabel,
  hasFilters,
}: EmptyStateProps) {
  const title = query && categoryLabel
    ? `Nenhum anúncio para “${query}” em ${categoryLabel}.`
    : query
      ? `Nenhum anúncio encontrado para “${query}”.`
      : categoryLabel
        ? `Ainda não há anúncios em ${categoryLabel}.`
        : 'Ainda não há anúncios para mostrar aqui.';

  const guidance = hasFilters
    ? 'Amplie a busca, escolha outra categoria ou limpe os filtros para ver mais anúncios.'
    : 'Quando houver anúncios disponíveis na sua região, eles aparecerão nesta lista.';

  return (
    <div className="classifiedEmptyState">
      <span className="emptyIcon" aria-hidden="true">
        <NavigationIcon name="search" />
      </span>
      <div>
        <h3>{title}</h3>
        <p>{guidance}</p>
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
