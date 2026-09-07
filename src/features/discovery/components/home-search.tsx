'use client';

import type { FormEvent } from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function HomeSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = query.trim();
    const search = normalized ? `?q=${encodeURIComponent(normalized)}` : '';
    router.push(`/classificados${search}`);
  }

  return (
    <form className="searchBox" role="search" onSubmit={submit}>
      <label className="srOnly" htmlFor="home-search">
        Buscar nos Classificados de Salvador
      </label>
      <input
        id="home-search"
        name="q"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Buscar nos Classificados..."
        autoComplete="off"
      />
      <span className="locationButton" aria-label="Território da busca">
        📍 Salvador · BA
      </span>
      <button type="submit" className="searchButton">Buscar</button>
    </form>
  );
}
