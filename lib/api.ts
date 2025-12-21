const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const api = {
  async request(endpoint: string, options: RequestInit = {}) {
    // Try to get token from localStorage first, then from cookies
    let token = null;
    if (typeof window !== "undefined") {
      token = localStorage.getItem("auth_token");
      if (!token) {
        // Try to get from cookies as fallback
        const cookies = document.cookie.split(';');
        const authCookie = cookies.find(cookie => cookie.trim().startsWith('auth_token='));
        if (authCookie) {
          token = authCookie.split('=')[1];
        }
      }
    }
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}/api${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: "Unknown error" }));
      console.error(`API Error for ${endpoint}:`, {
        status: response.status,
        statusText: response.statusText,
        error,
      });
      const errorMessage = error.message || error.error || error.statusCode || `Request failed: ${response.status}`;
      throw new Error(typeof errorMessage === 'string' ? errorMessage : JSON.stringify(errorMessage));
    }

    const json = await response.json();
    // Backend wraps responses in { data: {...}, timestamp }
    // Return the data property if it exists, otherwise return the whole response
    return json.data !== undefined ? json.data : json;
  },

  // Products
  products: {
    getAll: (lang?: string) => {
      const params = lang ? `?lang=${lang}` : "";
      return api.request(`/products${params}`);
    },
    getFeatured: (lang?: string) => {
      const params = lang ? `?lang=${lang}` : "";
      return api.request(`/products/featured${params}`);
    },
    getBySlug: (slug: string, lang?: string) => {
      const params = lang ? `?lang=${lang}` : "";
      return api.request(`/products/slug/${slug}${params}`);
    },
    getByCategory: (categorySlug: string) => api.request(`/products/category/${categorySlug}`),
  },

  // Categories
  categories: {
    getAll: (lang?: string) => {
      const params = lang ? `?lang=${lang}` : "";
      return api.request(`/categories${params}`);
    },
    getBySlug: (slug: string, lang?: string) => {
      const params = lang ? `?lang=${lang}` : "";
      return api.request(`/categories/slug/${slug}${params}`);
    },
  },

  // Cart
  cart: {
    get: () => api.request("/cart"),
    add: (productId: string, quantity = 1, selectedVariant?: any) =>
      api.request("/cart", {
        method: "POST",
        body: JSON.stringify({ productId, quantity, selectedVariant }),
      }),
    update: (id: string, quantity: number, selectedVariant?: any) =>
      api.request(`/cart/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ quantity, selectedVariant }),
      }),
    remove: (id: string) => api.request(`/cart/${id}`, { method: "DELETE" }),
    clear: () => api.request("/cart", { method: "DELETE" }),
  },

  // Orders
  orders: {
    getAll: () => api.request("/orders"),
    getById: (id: string) => api.request(`/orders/${id}`),
    create: (orderData: any) =>
      api.request("/orders", {
        method: "POST",
        body: JSON.stringify(orderData),
      }),
  },

  // Favorites
  favorites: {
    getAll: () => api.request("/favorites"),
    getIds: () => api.request("/favorites/ids"),
    add: (productId: string) =>
      api.request("/favorites", {
        method: "POST",
        body: JSON.stringify({ productId }),
      }),
    remove: (productId: string) => api.request(`/favorites/${productId}`, { method: "DELETE" }),
    check: (productId: string) => api.request(`/favorites/check/${productId}`),
  },

  // Auth
  auth: {
    signUp: async (email: string, password: string, fullName?: string) => {
      const data = await api.request("/auth/register", {
        method: "POST",
        body: JSON.stringify({ email, password, fullName }),
      });
      if (data.access_token) {
        if (typeof window !== "undefined") {
          localStorage.setItem("auth_token", data.access_token);
          // Also save to cookies for persistence
          document.cookie = `auth_token=${data.access_token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
        }
      }
      return data;
    },
    signIn: async (email: string, password: string) => {
      const data = await api.request("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });
      if (data.access_token) {
        if (typeof window !== "undefined") {
          localStorage.setItem("auth_token", data.access_token);
          // Also save to cookies for persistence
          document.cookie = `auth_token=${data.access_token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
        }
      }
      return data;
    },
    signOut: async () => {
      try {
        await api.request("/auth/logout", { method: "POST" });
      } catch (e) {
        // Ignore errors on logout
      }
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token");
        // Also remove from cookies
        document.cookie = "auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      }
    },
    getMe: () => api.request("/users/me"),
  },

  // Settings
  settings: {
    faq: {
      getAll: (lang?: string) => {
        const params = lang ? `?lang=${lang}` : "";
        return api.request(`/settings/faq${params}`);
      },
      getById: (id: string) => api.request(`/settings/faq/${id}`),
    },
    aboutUs: {
      getAll: (lang?: string) => {
        const params = lang ? `?lang=${lang}` : "";
        return api.request(`/settings/about-us${params}`);
      },
      getByKey: (key: string, lang?: string) => {
        const params = lang ? `?lang=${lang}` : "";
        return api.request(`/settings/about-us/${key}${params}`);
      },
    },
  },

  // Admin
  admin: {
    dashboard: () => api.request("/admin/dashboard"),
    orders: {
      getAll: () => api.request("/orders"),
      updateStatus: (id: string, status: string) =>
        api.request(`/orders/${id}/status`, {
          method: "PATCH",
          body: JSON.stringify({ status }),
        }),
    },
    products: {
      getAll: () => api.request("/products"),
      create: (product: any) =>
        api.request("/products", {
          method: "POST",
          body: JSON.stringify(product),
        }),
      update: (id: string, product: any) =>
        api.request(`/products/${id}`, {
          method: "PATCH",
          body: JSON.stringify(product),
        }),
      delete: (id: string) => api.request(`/products/${id}`, { method: "DELETE" }),
    },
  },
};
