export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
}

export interface Category {
  id: string;
  name: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: { productId: string; productName: string; quantity: number; price: number }[];
  total: number;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  orderDate: string;
}

export const categories: Category[] = [
  { id: 'cat1', name: 'Dresses' },
  { id: 'cat2', name: 'Outerwear' },
  { id: 'cat3', name: 'Accessories' },
  { id: 'cat4', name: 'Footwear' },
  { id: 'cat5', name: 'Bags' },
];

export const products: Product[] = [
  {
    id: 'prod1',
    name: 'Elegant Silk Gown',
    description: 'A luxurious silk gown perfect for evening events. Features a flattering silhouette and a subtle sheen.',
    price: 299.99,
    imageUrl: 'https://images.unsplash.com/photo-1581044777550-4cfa607037dc?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Dresses',
    stock: 15,
  },
  {
    id: 'prod2',
    name: 'Minimalist Trench Coat',
    description: 'Classic trench coat with a modern, minimalist design. Ideal for transitional weather.',
    price: 189.50,
    imageUrl: 'https://images.unsplash.com/photo-1551028150-64b9f39646e2?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Outerwear',
    stock: 10,
  },
  {
    id: 'prod3',
    name: 'Leather Crossbody Bag',
    description: 'Sleek and practical leather crossbody bag with gold-tone hardware. Perfect for everyday elegance.',
    price: 120.00,
    imageUrl: 'https://images.unsplash.com/photo-1566150921091-c45160e80d98?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Bags',
    stock: 25,
  },
  {
    id: 'prod4',
    name: 'Chunky Knit Sweater',
    description: 'Oversized chunky knit sweater made from premium wool blend. Cozy and stylish.',
    price: 85.00,
    imageUrl: 'https://images.unsplash.com/photo-1542272604-786c3c2739b7?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Outerwear',
    stock: 20,
  },
  {
    id: 'prod5',
    name: 'Statement Gold Earrings',
    description: 'Bold, sculptural gold earrings that add a touch of modern luxury to any outfit.',
    price: 55.00,
    imageUrl: 'https://images.unsplash.com/photo-1611603771100-ee757077977b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Accessories',
    stock: 30,
  },
  {
    id: 'prod6',
    name: 'High-Waisted Trousers',
    description: 'Tailored high-waisted trousers with a wide-leg cut. Perfect for a sophisticated look.',
    price: 95.00,
    imageUrl: 'https://images.unsplash.com/photo-1594633313472-f5074a57197e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Dresses', // Could be 'Bottoms' but for simplicity, using 'Dresses' for now
    stock: 18,
  },
  {
    id: 'prod7',
    name: 'Classic White Sneakers',
    description: 'Premium leather sneakers with a minimalist design. Comfortable and versatile.',
    price: 110.00,
    imageUrl: 'https://images.unsplash.com/photo-1514989940723-ad4755b0a7f7?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Footwear',
    stock: 22,
  },
  {
    id: 'prod8',
    name: 'Structured Blazer',
    description: 'A sharp, structured blazer in a neutral tone. Elevates any casual or formal ensemble.',
    price: 160.00,
    imageUrl: 'https://images.unsplash.com/photo-1593032465281-0677910a012c?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Outerwear',
    stock: 12,
  },
  {
    id: 'prod9',
    name: 'Delicate Gold Necklace',
    description: 'A subtle yet elegant gold chain necklace, perfect for layering or wearing on its own.',
    price: 70.00,
    imageUrl: 'https://images.unsplash.com/photo-1611603771100-ee757077977b?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Accessories',
    stock: 40,
  },
  {
    id: 'prod10',
    name: 'Pleated Midi Skirt',
    description: 'Flowy pleated midi skirt in a versatile monochrome shade. Can be dressed up or down.',
    price: 75.00,
    imageUrl: 'https://images.unsplash.com/photo-1594633313472-f5074a57197e?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    category: 'Dresses', // Could be 'Bottoms'
    stock: 15,
  },
];

export const orders: Order[] = [
  {
    id: 'ord1',
    customerName: 'Alice Smith',
    customerEmail: 'alice.smith@example.com',
    items: [
      { productId: 'prod1', productName: 'Elegant Silk Gown', quantity: 1, price: 299.99 },
      { productId: 'prod5', productName: 'Statement Gold Earrings', quantity: 1, price: 55.00 },
    ],
    total: 354.99,
    status: 'Delivered',
    orderDate: '2023-10-26',
  },
  {
    id: 'ord2',
    customerName: 'Bob Johnson',
    customerEmail: 'bob.j@example.com',
    items: [
      { productId: 'prod2', productName: 'Minimalist Trench Coat', quantity: 1, price: 189.50 },
      { productId: 'prod7', productName: 'Classic White Sneakers', quantity: 1, price: 110.00 },
    ],
    total: 299.50,
    status: 'Processing',
    orderDate: '2023-11-01',
  },
  {
    id: 'ord3',
    customerName: 'Charlie Brown',
    customerEmail: 'charlie.b@example.com',
    items: [
      { productId: 'prod3', productName: 'Leather Crossbody Bag', quantity: 1, price: 120.00 },
    ],
    total: 120.00,
    status: 'Pending',
    orderDate: '2023-11-05',
  },
  {
    id: 'ord4',
    customerName: 'Diana Prince',
    customerEmail: 'diana.p@example.com',
    items: [
      { productId: 'prod8', productName: 'Structured Blazer', quantity: 1, price: 160.00 },
      { productId: 'prod9', productName: 'Delicate Gold Necklace', quantity: 2, price: 70.00 },
    ],
    total: 300.00,
    status: 'Shipped',
    orderDate: '2023-10-29',
  },
];