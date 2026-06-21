import { api } from "./client";
import type {
  Book,
  Cart,
  LoginResponse,
  Order,
  PaginatedResponse,
  User,
} from "../types";

export const authApi = {
  login: (username: string, password: string) =>
    api.post<LoginResponse>("/api/auth/login/", { username, password }),
  register: (data: {
    username: string;
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
  }) => api.post("/api/auth/register/", data),
  logout: (refresh: string) =>
    api.post("/api/auth/logout/", { refresh }),
  me: () => api.get<User>("/api/auth/me/"),
  updateProfile: (data: Partial<User>) =>
    api.patch<User>("/api/auth/me/", data),
  changePassword: (old_password: string, new_password: string) =>
    api.post("/api/auth/change-password/", { old_password, new_password }),
  googleLogin: () => {
    window.location.href = "/api/auth/google/login/";
  },
};

export const booksApi = {
  list: (params?: Record<string, string>) =>
    api.get<PaginatedResponse<Book>>("/api/books/", { params }),
  get: (slug: string) => api.get<Book>(`/api/books/${slug}/`),
  categories: () => api.get("/api/categories/"),
};

export const cartApi = {
  get: () => api.get<Cart>("/api/cart/me/"),
  addItem: (book_id: number, quantity: number) =>
    api.post("/api/cart/me/items/", { book_id, quantity }),
  removeItem: (itemId: number) =>
    api.delete(`/api/cart/me/items/${itemId}/`),
};

export const ordersApi = {
  list: () => api.get<PaginatedResponse<Order>>("/api/orders/"),
  get: (id: number) => api.get<Order>(`/api/orders/${id}/`),
  checkout: (shipping_address: string) =>
    api.post<Order>("/api/orders/checkout/", { shipping_address }),
};
