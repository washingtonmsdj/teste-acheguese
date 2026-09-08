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
            <strong>{category.label}</strong>
          </Link>
        );
      })}
    </div>
  );
}
