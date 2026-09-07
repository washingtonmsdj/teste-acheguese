export const categories = [
  { icon: '🍽️', label: 'Restaurantes', href: '/buscar?categoria=restaurantes' },
  { icon: '✚', label: 'Saúde', href: '/buscar?categoria=saude' },
  { icon: '✦', label: 'Beleza', href: '/buscar?categoria=beleza' },
  { icon: '🛒', label: 'Mercados', href: '/buscar?categoria=mercados' },
  { icon: '🔧', label: 'Oficinas', href: '/buscar?categoria=oficinas' },
  { icon: '🐾', label: 'Pets', href: '/buscar?categoria=pets' },
  { icon: '🎓', label: 'Educação', href: '/buscar?categoria=educacao' },
  { icon: '🏠', label: 'Casa', href: '/buscar?categoria=casa' },
] as const;

export const highlights = [
  {
    name: 'Gastronomia perto de você',
    category: 'Alimentação',
    description: 'Descubra restaurantes, cafés e outros sabores da sua região.',
    href: '/buscar?categoria=restaurantes',
    image:
      'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Saúde na sua região',
    category: 'Saúde e bem-estar',
    description: 'Encontre profissionais, clínicas, farmácias e serviços próximos.',
    href: '/buscar?categoria=saude',
    image:
      'https://images.unsplash.com/photo-1586015555751-63bb77f4322a?auto=format&fit=crop&w=900&q=80',
  },
  {
    name: 'Serviços para o dia a dia',
    category: 'Serviços locais',
    description: 'Veja oficinas, manutenção e profissionais que atendem sua região.',
    href: '/buscar?categoria=oficinas',
    image:
      'https://images.unsplash.com/photo-1487754180451-c456f719a1fc?auto=format&fit=crop&w=900&q=80',
  },
] as const;

export const pillars = [
  ['Local', 'descoberta por proximidade'],
  ['Rápido', 'busca por categoria'],
  ['Confiável', 'privacidade e moderação'],
  ['Escalável', 'arquitetura multi-cidade'],
] as const;
