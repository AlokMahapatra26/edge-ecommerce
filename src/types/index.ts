export interface Category {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  title: string;
  priceOverride?: number | null;
  inventoryQuantity: number;
}

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  displayOrder: number;
}

export interface Product {
  id: string;
  categoryId?: number | null;
  title: string;
  slug: string;
  description: string;
  basePrice: number;
  compareAtPrice?: number | null;
  primaryImage: string;
  isActive: boolean;
  featured: boolean;
  createdAt: string;
  variants?: ProductVariant[];
  images?: ProductImage[];
  category?: Category | null;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  title: string;
  variantTitle?: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerEmail: string;
  customerName: string;
  shippingAddress: string;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  totalAmount: number;
  paymentStatus: 'unpaid' | 'paid' | 'refunded';
  fulfillmentStatus: 'pending' | 'processing' | 'shipped' | 'delivered';
  stripeSessionId?: string | null;
  trackingNumber?: string | null;
  createdAt: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId?: string | null;
  title: string;
  variantTitle?: string | null;
  unitPrice: number;
  quantity: number;
  image?: string | null;
}
