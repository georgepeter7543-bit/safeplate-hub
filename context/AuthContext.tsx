"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface UserProfile {
  name: string;
  email: string;
  role: "diner" | "merchant";
  avatar?: string;
  businessName?: string;
  neighborhood?: string;
  phone?: string;
  whatsapp?: string;
}

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  savedAccounts: UserProfile[];
  isAuthModalOpen: boolean;
  authModalTab: "signin" | "register";
  openAuthModal: (tab?: "signin" | "register") => void;
  closeAuthModal: () => void;
  login: (email: string, name?: string, role?: "diner" | "merchant", metadata?: Partial<UserProfile>) => void;
  quickLogin: (account: UserProfile) => void;
  updateProfile: (data: Partial<UserProfile>) => void;
  removeSavedAccount: (email: string) => void;
  registerPlace: (data: {
    businessName: string;
    ownerName: string;
    email: string;
    neighborhood: string;
    phone: string;
    whatsapp?: string;
  }) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* Default sample remembered accounts for instant quick-login exploration */
const INITIAL_SAVED_ACCOUNTS: UserProfile[] = [
  {
    name: "Mama Zawadi",
    email: "zawadi@arusha.tz",
    role: "merchant",
    businessName: "Mama Zawadi's Kitchen",
    neighborhood: "Ngarenaro, Arusha",
    phone: "+255 754 112 233",
    whatsapp: "+255 754 112 233",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
  {
    name: "Rashid Ali",
    email: "rashid@arusha.tz",
    role: "merchant",
    businessName: "Clock Tower BBQ & Grills",
    neighborhood: "Clock Tower, Arusha",
    phone: "+255 784 990 011",
    whatsapp: "+255 784 990 011",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  },
  {
    name: "Grace Temba",
    email: "grace@gmail.com",
    role: "diner",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [savedAccounts, setSavedAccounts] = useState<UserProfile[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"signin" | "register">("signin");

  /* Load stored session and saved accounts on initial mount */
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("safeplate_user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      const storedAccounts = localStorage.getItem("safeplate_saved_accounts");
      if (storedAccounts) {
        const parsed = JSON.parse(storedAccounts);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedAccounts(parsed);
          return;
        }
      }
      // Initialize with default remembered accounts if empty
      setSavedAccounts(INITIAL_SAVED_ACCOUNTS);
      localStorage.setItem("safeplate_saved_accounts", JSON.stringify(INITIAL_SAVED_ACCOUNTS));
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  /* Helper to persist remembered account in localStorage */
  const persistAccount = (profile: UserProfile) => {
    setSavedAccounts((prev) => {
      const filtered = prev.filter((a) => a.email.toLowerCase() !== profile.email.toLowerCase());
      const updated = [profile, ...filtered];
      try {
        localStorage.setItem("safeplate_saved_accounts", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const openAuthModal = (tab: "signin" | "register" = "signin") => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const login = (
    email: string,
    name?: string,
    role: "diner" | "merchant" = "diner",
    metadata?: Partial<UserProfile>
  ) => {
    // Check if account already exists in saved accounts to preserve full metadata
    const existing = savedAccounts.find((a) => a.email.toLowerCase() === email.toLowerCase());

    const displayName = name || existing?.name || email.split("@")[0] || "User";
    const profile: UserProfile = {
      name: displayName,
      email,
      role: existing?.role || role,
      avatar: existing?.avatar || (role === "merchant"
        ? "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
        : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"),
      businessName: metadata?.businessName || existing?.businessName,
      neighborhood: metadata?.neighborhood || existing?.neighborhood || (role === "merchant" ? "Ngarenaro, Arusha" : undefined),
      phone: metadata?.phone || existing?.phone || (role === "merchant" ? "+255 754 000 111" : undefined),
      whatsapp: metadata?.whatsapp || existing?.whatsapp || (role === "merchant" ? (metadata?.phone || existing?.phone || "+255 754 000 111") : undefined),
      ...metadata,
    };

    setUser(profile);
    try {
      localStorage.setItem("safeplate_user", JSON.stringify(profile));
    } catch {}
    persistAccount(profile);
    closeAuthModal();
  };

  const quickLogin = (account: UserProfile) => {
    setUser(account);
    try {
      localStorage.setItem("safeplate_user", JSON.stringify(account));
    } catch {}
    persistAccount(account);
    closeAuthModal();
  };

  const updateProfile = (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated: UserProfile = { ...user, ...data };
    setUser(updated);
    try {
      localStorage.setItem("safeplate_user", JSON.stringify(updated));
    } catch {}
    persistAccount(updated);
  };

  const removeSavedAccount = (email: string) => {
    setSavedAccounts((prev) => {
      const updated = prev.filter((a) => a.email.toLowerCase() !== email.toLowerCase());
      try {
        localStorage.setItem("safeplate_saved_accounts", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const registerPlace = (data: {
    businessName: string;
    ownerName: string;
    email: string;
    neighborhood: string;
    phone: string;
    whatsapp?: string;
  }) => {
    const profile: UserProfile = {
      name: data.ownerName,
      email: data.email,
      role: "merchant",
      businessName: data.businessName,
      neighborhood: data.neighborhood,
      phone: data.phone,
      whatsapp: data.whatsapp || data.phone,
      avatar: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80`,
    };
    setUser(profile);
    try {
      localStorage.setItem("safeplate_user", JSON.stringify(profile));
    } catch {}
    persistAccount(profile);
    closeAuthModal();
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem("safeplate_user");
    } catch {}
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        savedAccounts,
        isAuthModalOpen,
        authModalTab,
        openAuthModal,
        closeAuthModal,
        login,
        quickLogin,
        updateProfile,
        removeSavedAccount,
        registerPlace,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
