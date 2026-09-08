import Link from 'next/link';
import { ClassifiedCategoryIcon } from '@/modules/classifieds/components/category-icon';
import styles from '@/modules/classifieds/components/category-nav.module.css';
import {
  classifiedCategories,
  type ClassifiedCategoryId,
} from '@/modules/classifieds/domain/categories';

type CategoryNavProps = {
  activeCategory?: ClassifiedCategoryId;
  query?: string;
};

const categoryDescriptions: Record<ClassifiedCategoryId, string> = {
  vehicles: 'Carros, motos e peças',
  'real-estate': 'Casas, apartamentos e aluguel',
  electronics: 'Celulares, informática e acessórios',
  home: 'Móveis, decoração e utilidades',
  fashion: 'Roupas, calçados e acessórios',
  sports: 'Esporte, lazer e equipamentos',
  pets: 'Itens e cuidados para animais',
  other: 'O que não se encaixa nas demais',
};

export function ClassifiedCategoryNav({
  activeCategory,
  query,
}: CategoryNavProps) {
  return (
    <div className="classifiedCategoryGrid" aria-label="Categorias de Classificados">
      {classifiedCategories.map((category) => {
        const params = new URLSearchParams();
        params.set('categoria', category.id);
        if (query) params.set('q', query);

        const active = activeCategory === category.id;

        return (
          <Link
            className={active ? 'active' : undefined}
            href={`/classificados?${params.toString()}`}
            key={category.id}
            aria-current={active ? 'page' : undefined}
          >
            <span className={styles.icon} aria-hidden="true">
              <ClassifiedCategoryIcon category={category.id} />
            </span>
            <span className={styles.copy}>
              <strong>{category.label}</strong>
              <small>{categoryDescriptions[category.id]}</small>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
