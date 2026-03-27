import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

// Admin credentials — in a real app these would be server-validated
const ADMIN_EMAIL = "admin@inkwell.dev";
const ADMIN_PASSWORD = "admin123";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Persist session across page refreshes
  useEffect(() => {
    const stored = localStorage.getItem("inkwell_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("inkwell_user");
      }
    }
    setLoading(false);
  }, []);

  function login(email, password) {
    // Check admin
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const adminUser = { name: "Admin", email, role: "admin", id: "admin-1" };
      setUser(adminUser);
      localStorage.setItem("inkwell_user", JSON.stringify(adminUser));
      return { success: true };
    }

    // Check registered users
    const users = JSON.parse(localStorage.getItem("inkwell_users") || "[]");
    const found = users.find((u) => u.email === email && u.password === password);
    if (found) {
      const sessionUser = { name: found.name, email: found.email, role: "user", id: found.id };
      setUser(sessionUser);
      localStorage.setItem("inkwell_user", JSON.stringify(sessionUser));
      return { success: true };
    }

    return { success: false, message: "Invalid email or password." };
  }

  function register(name, email, password) {
    const users = JSON.parse(localStorage.getItem("inkwell_users") || "[]");
    if (users.find((u) => u.email === email)) {
      return { success: false, message: "Email already registered." };
    }
    const newUser = { id: `user-${Date.now()}`, name, email, password, role: "user" };
    users.push(newUser);
    localStorage.setItem("inkwell_users", JSON.stringify(users));

    const sessionUser = { name, email, role: "user", id: newUser.id };
    setUser(sessionUser);
    localStorage.setItem("inkwell_user", JSON.stringify(sessionUser));
    return { success: true };
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("inkwell_user");
  }

  const isAdmin = user?.role === "admin";
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
