import Image from 'next/image';
import Link from 'next/link';
import type { ClassifiedListItem } from '@/modules/classifieds/domain/types';
import { NavigationIcon } from '@/shared/navigation/navigation-icon';

type ClassifiedCardProps = {
  item: ClassifiedListItem;
  imageUrl: string | null;
};

const conditionLabels: Record<string, string> = {
  new: 'Novo',
  like_new: 'Seminovo',
  used: 'Usado',
  for_parts: 'Para peças',
};

function formatPrice(amountInCents: number | null) {
  if (amountInCents === null) return 'Preço a combinar';

  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amountInCents / 100);
}

export function ClassifiedCard({
  item,
  imageUrl,
}: ClassifiedCardProps) {
  const location = [
    item.location.neighborhood,
    item.location.cityName,
  ].filter(Boolean).join(' · ');

  return (
    <article className="publicClassifiedCard">
      <Link
        className="publicClassifiedImage"
        href={`/classificados/anuncio/${item.slug}`}
        aria-label={`Ver anúncio: ${item.title}`}
      >
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={item.cover?.alt || item.title}
            fill
            sizes="(min-width: 980px) 25vw, (min-width: 620px) 50vw, 100vw"
          />
        ) : (
          <span className="publicClassifiedPlaceholder" aria-hidden="true">
            <NavigationIcon name="tag" />
          </span>
        )}
      </Link>

      <div className="publicClassifiedBody">
        <div className="publicClassifiedMeta">
          <span className="publicClassifiedCondition">
            {conditionLabels[item.condition] ?? item.condition}
          </span>
          <span className="publicClassifiedLocation">
            {location || 'Salvador'}
          </span>
        </div>

        <h3>
          <Link href={`/classificados/anuncio/${item.slug}`}>
            {item.title}
          </Link>
        </h3>

        <strong className="publicClassifiedPrice">
          {formatPrice(item.price?.amountInCents ?? null)}
        </strong>

        <Link
          className="publicClassifiedAction"
          href={`/classificados/anuncio/${item.slug}`}
        >
          Ver anúncio <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}
