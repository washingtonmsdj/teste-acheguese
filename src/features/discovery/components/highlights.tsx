import Image from 'next/image';
import Link from 'next/link';
import { highlights } from '@/features/discovery/home-data';

export function Highlights() {
  return (
    <div className="highlightGrid">
      {highlights.map((item) => (
        <article className="businessCard" key={item.name}>
          <div className="businessImage">
            <Image
              src={item.image}
              alt=""
              fill
              sizes="(min-width: 720px) 33vw, 100vw"
            />
            <span className="demoBadge">Prévia</span>
          </div>
          <div>
            <p className="cardKicker">{item.category}</p>
            <h3>{item.name}</h3>
            <p>{item.description}</p>
            <Link href={item.href}>Explorar →</Link>
          </div>
        </article>
      ))}
    </div>
  );
}
