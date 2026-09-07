import Link from 'next/link';
import { categories } from '@/features/discovery/home-data';

export function CategoryGrid() {
  return (
    <div className="categoryGrid">
      {categories.map((category) => (
        <Link className="categoryCard" href={category.href} key={category.label}>
          <span aria-hidden="true">{category.icon}</span>
          <strong>{category.label}</strong>
        </Link>
      ))}
    </div>
  );
}
