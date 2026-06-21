export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: "customer" | "staff" | "admin";
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginResponse extends AuthTokens {
  user: User;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Author {
  id: number;
  name: string;
  bio: string;
}

export interface Book {
  id: number;
  title: string;
  slug: string;
  isbn: string;
  description?: string;
  price: string;
  stock: number;
  cover_image: string | null;
  pdf:string | null;
  category: Category | null;
  authors: Author[];
  is_active: boolean;
  created_at?: string;
  is_paid: boolean;
}

export interface CartItem {
  id: number;
  book: Book;
  quantity: number;
  subtotal: string;
}

export interface Cart {
  id: number;
  items: CartItem[];
  total: string;
  updated_at: string;
}

export interface OrderItem {
  id: number;
  book: Book;
  quantity: number;
  price: string;
  subtotal: string;
}

export interface Order {
  id: number;
  status: string;
  total: string;
  shipping_address: string;
  items: OrderItem[];
  created_at: string;
}

export interface ApiError {
  detail: string | Record<string, unknown>;
  code?: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
