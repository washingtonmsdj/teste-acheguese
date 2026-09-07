'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export function HomeSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = query.trim();
    const search = normalized ? `?q=${encodeURIComponent(normalized)}` : '';
    router.push(`/buscar${search}`);
  }

  return (
    <form className="searchBox" role="search" onSubmit={submit}>
      <label className="srOnly" htmlFor="home-search">O que você procura?</label>
      <input
        id="home-search"
        name="q"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="O que você procura hoje?"
        autoComplete="off"
      />
      <button type="button" className="locationButton" aria-label="Usar minha região">
        📍 Minha região
      </button>
      <button type="submit" className="searchButton">Buscar</button>
    </form>
  );
}
