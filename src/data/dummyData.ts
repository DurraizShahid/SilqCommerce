export interface ProductVariant {
  id: string;
  name: string;
  value: string;
  priceModifier?: number; // Optional price adjustment for variant
  stock: number;
}

export interface ProductVariation {
  type: 'size' | 'color' | 'material' | 'style';
  name: string;
  options: ProductVariant[];
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  stock: number;
  variations?: ProductVariation[];
  isNew?: boolean;
  isTrending?: boolean;
  views?: number;
  createdAt?: string;
  vendorId?: string;
  videoUrl?: string;
  images?: string[]; // Multiple product images
  isSubscription?: boolean;
  subscriptionFrequency?: 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly';
  isPreOrder?: boolean;
  preOrderReleaseDate?: string;
  preOrderDeposit?: number;
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
  shippingAddress?: {
    fullName: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  shippingMethod?: 'standard' | 'express';
  trackingNumber?: string;
  estimatedDelivery?: string;
  vendorId?: string;
  vendorName?: string;
}

export interface ProductBundle {
  id: string;
  name: string;
  description: string;
  products: Product[];
  bundlePrice: number;
  discount: number; // percentage
  imageUrl: string;
  category: string;
}

export interface Vendor {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  coverImageUrl?: string;
  email: string;
  phone?: string;
  website?: string;
  location?: string;
  joinedDate: string;
  isVerified: boolean;
  isPremium: boolean;
  rating: number;
  totalReviews: number;
  totalProducts: number;
  totalSales: number;
  badges: string[];
  categories: string[];
  socialLinks?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
  };
}

export interface VendorReview {
  id: string;
  vendorId: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
  helpfulCount: number;
  images?: string[];
}

export interface Subscription {
  id: string;
  productId: string;
  productName: string;
  customerId: string;
  frequency: 'weekly' | 'bi-weekly' | 'monthly' | 'quarterly';
  quantity: number;
  startDate: string;
  nextDeliveryDate: string;
  status: 'active' | 'paused' | 'cancelled';
  price: number;
}

export interface PreOrder {
  id: string;
  productId: string;
  productName: string;
  customerId: string;
  quantity: number;
  expectedReleaseDate: string;
  depositAmount: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'cancelled';
  createdAt: string;
}

export interface SupportTicket {
  id: string;
  customerId: string;
  subject: string;
  category: 'order' | 'product' | 'shipping' | 'payment' | 'return' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in-progress' | 'resolved' | 'closed';
  messages: SupportMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface SupportMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderName: string;
  senderType: 'customer' | 'support' | 'vendor';
  content: string;
  attachments?: string[];
  createdAt: string;
}

export interface ReturnRequest {
  id: string;
  orderId: string;
  productId: string;
  productName: string;
  customerId: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'refunded' | 'completed';
  requestedAt: string;
  refundAmount: number;
  trackingNumber?: string;
}

export const categories: Category[] = [
  { id: 'cat1', name: 'Dresses' },
  { id: 'cat2', name: 'Outerwear' },
  { id: 'cat3', name: 'Accessories' },
  { id: 'cat4', name: 'Footwear' },
  { id: 'cat5', name: 'Bags' },
];

const dummyProductImages: Record<string, string[]> = {
  prod1: [
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80',
  ],
  prod2: [
    'https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1495121605193-b116b5b9c5fe?auto=format&fit=crop&w=1200&q=80',
  ],
  prod3: [
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1495121605193-b116b5b9c5fe?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1484515991647-c5760fcecfc7?auto=format&fit=crop&w=1200&q=80',
  ],
  prod4: [
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80',
  ],
  prod5: [
    'https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
  ],
  prod6: [
    'https://images.unsplash.com/photo-1484515991647-c5760fcecfc7?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80',
  ],
  prod7: [
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1200&q=80',
  ],
  prod8: [
    'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
  ],
  prod9: [
    'https://images.pexels.com/photos/1458867/pexels-photo-1458867.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg?auto=compress&cs=tinysrgb&w=1200',
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80',
  ],
  prod10: [
    'https://images.unsplash.com/photo-1495121605193-b116b5b9c5fe?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1484515991647-c5760fcecfc7?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1200&q=80',
  ],
  'prod-new-1': [
    'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=1200&q=80',
  ],
};

export const products: Product[] = [
  {
    id: 'prod1',
    name: 'Elegant Silk Gown',
    description: 'A luxurious silk gown perfect for evening events. Features a flattering silhouette and a subtle sheen.',
    price: 299.99,
    imageUrl: dummyProductImages.prod1[0],
    images: dummyProductImages.prod1.slice(1),
    category: 'Dresses',
    stock: 15,
    isTrending: true,
    isNew: false,
    views: 1250,
    createdAt: '2023-09-15',
  },
  {
    id: 'prod2',
    name: 'Minimalist Trench Coat',
    description: 'Classic trench coat with a modern, minimalist design. Ideal for transitional weather.',
    price: 189.50,
    imageUrl: dummyProductImages.prod2[0],
    images: dummyProductImages.prod2.slice(1),
    category: 'Outerwear',
    stock: 10,
    isTrending: true,
    isNew: true,
    views: 890,
    createdAt: '2023-11-01',
  },
  {
    id: 'prod3',
    name: 'Leather Crossbody Bag',
    description: 'Sleek and practical leather crossbody bag with gold-tone hardware. Perfect for everyday elegance.',
    price: 120.00,
    imageUrl: dummyProductImages.prod3[0],
    images: dummyProductImages.prod3.slice(1),
    category: 'Bags',
    stock: 25,
    isTrending: false,
    isNew: false,
    views: 450,
    createdAt: '2023-08-20',
    variations: [
      {
        type: 'color',
        name: 'Color',
        options: [
          { id: 'v1', name: 'Black', value: 'black', stock: 15, priceModifier: 0 },
          { id: 'v2', name: 'Brown', value: 'brown', stock: 10, priceModifier: 0 },
        ],
      },
    ],
  },
  {
    id: 'prod4',
    name: 'Chunky Knit Sweater',
    description: 'Oversized chunky knit sweater made from premium wool blend. Cozy and stylish.',
    price: 85.00,
    imageUrl: dummyProductImages.prod4[0],
    images: dummyProductImages.prod4.slice(1),
    category: 'Outerwear',
    stock: 20,
    vendorId: 'vendor1',
    isSubscription: true,
    subscriptionFrequency: 'monthly',
  },
  {
    id: 'prod5',
    name: 'Statement Gold Earrings',
    description: 'Bold, sculptural gold earrings that add a touch of modern luxury to any outfit.',
    price: 55.00,
    imageUrl: dummyProductImages.prod5[0],
    images: dummyProductImages.prod5.slice(1),
    category: 'Accessories',
    stock: 30,
  },
  {
    id: 'prod6',
    name: 'High-Waisted Trousers',
    description: 'Tailored high-waisted trousers with a wide-leg cut. Perfect for a sophisticated look.',
    price: 95.00,
    imageUrl: dummyProductImages.prod6[0],
    images: dummyProductImages.prod6.slice(1),
    category: 'Dresses', // Could be 'Bottoms' but for simplicity, using 'Dresses' for now
    stock: 18,
  },
  {
    id: 'prod7',
    name: 'Classic White Sneakers',
    description: 'Premium leather sneakers with a minimalist design. Comfortable and versatile.',
    price: 110.00,
    imageUrl: dummyProductImages.prod7[0],
    images: dummyProductImages.prod7.slice(1),
    category: 'Footwear',
    stock: 22,
  },
  {
    id: 'prod8',
    name: 'Structured Blazer',
    description: 'A sharp, structured blazer in a neutral tone. Elevates any casual or formal ensemble.',
    price: 160.00,
    imageUrl: dummyProductImages.prod8[0],
    images: dummyProductImages.prod8.slice(1),
    category: 'Outerwear',
    stock: 12,
  },
  {
    id: 'prod9',
    name: 'Delicate Gold Necklace',
    description: 'A subtle yet elegant gold chain necklace, perfect for layering or wearing on its own.',
    price: 70.00,
    imageUrl: dummyProductImages.prod9[0],
    images: dummyProductImages.prod9.slice(1),
    category: 'Accessories',
    stock: 40,
  },
  {
    id: 'prod10',
    name: 'Pleated Midi Skirt',
    description: 'Flowy pleated midi skirt in a versatile monochrome shade. Can be dressed up or down.',
    price: 75.00,
    imageUrl: dummyProductImages.prod10[0],
    images: dummyProductImages.prod10.slice(1),
    category: 'Dresses', // Could be 'Bottoms'
    stock: 15,
  },
  {
    id: 'prod-new-1',
    name: 'Limited Edition Winter Collection',
    description: 'Exclusive limited edition winter collection. Pre-order now to secure your piece.',
    price: 299.99,
    imageUrl: dummyProductImages['prod-new-1'][0],
    images: dummyProductImages['prod-new-1'].slice(1),
    category: 'Dresses',
    stock: 0,
    isPreOrder: true,
    preOrderReleaseDate: '2023-12-15',
    preOrderDeposit: 50.00,
    vendorId: 'vendor1',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder video URL
  },
];

export const vendors: Vendor[] = [
  {
    id: 'vendor1',
    name: 'Luxury Fashion House',
    description: 'Curated luxury fashion from around the world. Specializing in haute couture and designer pieces.',
    logoUrl: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?q=80&w=2070&auto=format&fit=crop',
    coverImageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2070&auto=format&fit=crop',
    email: 'contact@luxuryfashion.com',
    website: 'https://luxuryfashion.com',
    location: 'Paris, France',
    joinedDate: '2023-01-15',
    isVerified: true,
    isPremium: true,
    rating: 4.8,
    totalReviews: 245,
    totalProducts: 156,
    totalSales: 12450,
    badges: ['Verified', 'Premium', 'Top Seller'],
    categories: ['Dresses', 'Outerwear', 'Accessories'],
    socialLinks: {
      instagram: '@luxuryfashion',
      facebook: 'luxuryfashionhouse',
    },
  },
  {
    id: 'vendor2',
    name: 'Elegant Essentials',
    description: 'Minimalist luxury for the modern wardrobe. Quality over quantity.',
    logoUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2070&auto=format&fit=crop',
    coverImageUrl: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=2070&auto=format&fit=crop',
    email: 'hello@elegantessentials.com',
    location: 'New York, USA',
    joinedDate: '2023-03-20',
    isVerified: true,
    isPremium: false,
    rating: 4.6,
    totalReviews: 189,
    totalProducts: 89,
    totalSales: 8920,
    badges: ['Verified'],
    categories: ['Outerwear', 'Accessories'],
  },
];

export const vendorReviews: VendorReview[] = [
  {
    id: 'review1',
    vendorId: 'vendor1',
    customerId: 'customer1',
    customerName: 'Sarah Johnson',
    rating: 5,
    title: 'Exceptional quality and service',
    comment: 'The dress I ordered was absolutely stunning. The quality exceeded my expectations and shipping was fast.',
    isVerifiedPurchase: true,
    createdAt: '2023-10-15',
    helpfulCount: 12,
    images: [
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1503341455253-b2e723bb3dbb?auto=format&fit=crop&w=800&q=80',
    ],
  },
  {
    id: 'review2',
    vendorId: 'vendor1',
    customerId: 'customer2',
    customerName: 'Michael Chen',
    rating: 4,
    title: 'Great product, minor issue',
    comment: 'Love the coat, but it arrived a day later than expected. Still very happy with the purchase.',
    isVerifiedPurchase: true,
    createdAt: '2023-10-20',
    helpfulCount: 5,
    images: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=800&q=80',
    ],
  },
];

export const subscriptions: Subscription[] = [
  {
    id: 'sub1',
    productId: 'prod4',
    productName: 'Chunky Knit Sweater',
    customerId: 'customer1',
    frequency: 'monthly',
    quantity: 1,
    startDate: '2023-10-01',
    nextDeliveryDate: '2023-12-01',
    status: 'active',
    price: 85.00,
  },
];

export const preOrders: PreOrder[] = [
  {
    id: 'preorder1',
    productId: 'prod-new-1',
    productName: 'Limited Edition Winter Collection',
    customerId: 'customer1',
    quantity: 1,
    expectedReleaseDate: '2023-12-15',
    depositAmount: 50.00,
    totalAmount: 299.99,
    status: 'confirmed',
    createdAt: '2023-11-01',
  },
];

export const supportTickets: SupportTicket[] = [
  {
    id: 'ticket1',
    customerId: 'customer1',
    subject: 'Order delivery inquiry',
    category: 'shipping',
    priority: 'medium',
    status: 'open',
    messages: [
      {
        id: 'msg1',
        ticketId: 'ticket1',
        senderId: 'customer1',
        senderName: 'Sarah Johnson',
        senderType: 'customer',
        content: 'I placed an order last week and haven\'t received a tracking number yet. Can you help?',
        createdAt: '2023-11-05T10:00:00Z',
      },
    ],
    createdAt: '2023-11-05T10:00:00Z',
    updatedAt: '2023-11-05T10:00:00Z',
  },
];

export const returnRequests: ReturnRequest[] = [
  {
    id: 'return1',
    orderId: 'ord1',
    productId: 'prod1',
    productName: 'Elegant Silk Gown',
    customerId: 'customer1',
    reason: 'Size doesn\'t fit',
    status: 'pending',
    requestedAt: '2023-11-06',
    refundAmount: 299.99,
  },
];

export const productBundles: ProductBundle[] = [
  {
    id: 'bundle1',
    name: 'Complete Evening Look',
    description: 'Everything you need for a perfect evening out',
    products: [products[0], products[4], products[2]], // Gown, Earrings, Bag
    bundlePrice: 399.99,
    discount: 20,
    imageUrl: products[0].imageUrl,
    category: 'Bundles',
  },
  {
    id: 'bundle2',
    name: 'Casual Chic Collection',
    description: 'Effortless style for everyday elegance',
    products: [products[1], products[3], products[6]], // Trench, Sweater, Sneakers
    bundlePrice: 299.50,
    discount: 15,
    imageUrl: products[1].imageUrl,
    category: 'Bundles',
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