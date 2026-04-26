import { useState, useEffect } from 'react';

export interface Product {
  id: string;
  name: string;
  price: number;
  discount: number; // percentage 0-100
  isActive: boolean;
  createdAt: string;
}

const defaultProducts: Product[] = [
  { id: 'internet', name: 'Internet', price: 49.99, discount: 0, isActive: true, createdAt: new Date().toISOString() },
  { id: 'other-services', name: 'Other Services', price: 29.99, discount: 0, isActive: true, createdAt: new Date().toISOString() },
];

const STORAGE_KEY = 'marketpro_products';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>(defaultProducts);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setProducts(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse products', e);
      }
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProducts));
    }
  }, []);

  const addProduct = (product: Omit<Product, 'id' | 'createdAt'>) => {
    const newProduct: Product = {
      ...product,
      id: product.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    const updated = [...products, newProduct];
    setProducts(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    const updated = products.map(p => p.id === id ? { ...p, ...updates } : p);
    setProducts(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter(p => p.id !== id);
    setProducts(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const toggleProduct = (id: string) => {
    const updated = products.map(p => p.id === id ? { ...p, isActive: !p.isActive } : p);
    setProducts(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const activeProducts = products.filter(p => p.isActive);

  const getDiscountedPrice = (id: string) => {
    const product = products.find(p => p.id === id);
    if (!product) return 0;
    return product.price * (1 - product.discount / 100);
  };

  return { products, activeProducts, addProduct, updateProduct, deleteProduct, toggleProduct, getDiscountedPrice };
}
