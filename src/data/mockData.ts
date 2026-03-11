export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  store: string;
  storeId: string;
  rating: number;
  reviews: number;
  category: string;
  delivery: string;
  badge?: string;
}

export interface Store {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  deliveryTime: string;
  deliveryFee: number;
  image: string;
  categories: string[];
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export const categories: Category[] = [
  { id: "cimento", name: "Cimento", icon: "🏗️" },
  { id: "tijolos", name: "Tijolos", icon: "🧱" },
  { id: "eletrica", name: "Elétrica", icon: "⚡" },
  { id: "ferramentas", name: "Ferramentas", icon: "🔧" },
  { id: "tintas", name: "Tintas", icon: "🎨" },
  { id: "hidraulica", name: "Hidráulica", icon: "🚿" },
  { id: "pisos", name: "Pisos", icon: "🪨" },
  { id: "madeira", name: "Madeira", icon: "🪵" },
];

export const products: Product[] = [
  {
    id: "1",
    name: "Saco de Cimento CP-II 50kg",
    price: 34.9,
    originalPrice: 42.0,
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&h=300&fit=crop",
    store: "Loja Constrular",
    storeId: "s1",
    rating: 4.8,
    reviews: 245,
    category: "cimento",
    delivery: "30-45 min",
    badge: "Oferta",
  },
  {
    id: "2",
    name: "Tubo PVC 50mm - 6 metros",
    price: 12.9,
    image: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=300&h=300&fit=crop",
    store: "HidraMais",
    storeId: "s2",
    rating: 4.5,
    reviews: 120,
    category: "hidraulica",
    delivery: "40-60 min",
  },
  {
    id: "3",
    name: "Tijolo Cerâmico 6 furos",
    price: 0.89,
    image: "https://images.unsplash.com/photo-1590075865003-e48277faa558?w=300&h=300&fit=crop",
    store: "Cerâmica Boa Vista",
    storeId: "s3",
    rating: 4.7,
    reviews: 380,
    category: "tijolos",
    delivery: "1-2 horas",
    badge: "Mais vendido",
  },
  {
    id: "4",
    name: "Fio Elétrico 2.5mm - 100m",
    price: 189.9,
    originalPrice: 220.0,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=300&h=300&fit=crop",
    store: "EletroObra",
    storeId: "s4",
    rating: 4.6,
    reviews: 95,
    category: "eletrica",
    delivery: "45-60 min",
    badge: "Oferta",
  },
  {
    id: "5",
    name: "Tinta Acrílica Branca 18L",
    price: 249.9,
    originalPrice: 299.0,
    image: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=300&h=300&fit=crop",
    store: "Tintas & Cores",
    storeId: "s5",
    rating: 4.9,
    reviews: 512,
    category: "tintas",
    delivery: "30-45 min",
    badge: "Oferta",
  },
  {
    id: "6",
    name: "Furadeira de Impacto 750W",
    price: 289.9,
    image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=300&h=300&fit=crop",
    store: "FerraTudo",
    storeId: "s6",
    rating: 4.4,
    reviews: 67,
    category: "ferramentas",
    delivery: "1-2 horas",
  },
  {
    id: "7",
    name: "Porcelanato 60x60cm - Caixa",
    price: 89.9,
    originalPrice: 109.0,
    image: "https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=300&h=300&fit=crop",
    store: "Loja Constrular",
    storeId: "s1",
    rating: 4.7,
    reviews: 198,
    category: "pisos",
    delivery: "2-3 horas",
    badge: "Oferta",
  },
  {
    id: "8",
    name: "Chave de Fenda Phillips",
    price: 15.9,
    image: "https://images.unsplash.com/photo-1586864387789-628af9feed72?w=300&h=300&fit=crop",
    store: "FerraTudo",
    storeId: "s6",
    rating: 4.3,
    reviews: 42,
    category: "ferramentas",
    delivery: "30-45 min",
  },
];

export const stores: Store[] = [
  {
    id: "s1",
    name: "Loja Constrular",
    rating: 4.8,
    reviews: 1240,
    deliveryTime: "30-45 min",
    deliveryFee: 9.9,
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=300&h=200&fit=crop",
    categories: ["cimento", "tijolos", "pisos", "ferramentas"],
  },
  {
    id: "s2",
    name: "HidraMais",
    rating: 4.5,
    reviews: 560,
    deliveryTime: "40-60 min",
    deliveryFee: 12.0,
    image: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=300&h=200&fit=crop",
    categories: ["hidraulica", "eletrica"],
  },
  {
    id: "s3",
    name: "Cerâmica Boa Vista",
    rating: 4.7,
    reviews: 890,
    deliveryTime: "1-2 horas",
    deliveryFee: 15.0,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=300&h=200&fit=crop",
    categories: ["tijolos", "pisos"],
  },
  {
    id: "s4",
    name: "EletroObra",
    rating: 4.6,
    reviews: 340,
    deliveryTime: "45-60 min",
    deliveryFee: 8.0,
    image: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=300&h=200&fit=crop",
    categories: ["eletrica", "ferramentas"],
  },
  {
    id: "s5",
    name: "Tintas & Cores",
    rating: 4.9,
    reviews: 720,
    deliveryTime: "30-45 min",
    deliveryFee: 7.0,
    image: "https://images.unsplash.com/photo-1562259929-b4e1fd3aef09?w=300&h=200&fit=crop",
    categories: ["tintas"],
  },
  {
    id: "s6",
    name: "FerraTudo",
    rating: 4.4,
    reviews: 410,
    deliveryTime: "1-2 horas",
    deliveryFee: 10.0,
    image: "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=300&h=200&fit=crop",
    categories: ["ferramentas"],
  },
];
