"use client";

import React, { createContext, useContext } from "react";
import { useCurrentUser, type AppUser } from "@/lib/hooks/use-current-user";
import { usePermissions } from "@/lib/hooks/use-permissions";

interface UserContextType {
  user: AppUser | null;
  loading: boolean;
  isAdmin: boolean;
  allowedPages: string[];
  isAllowed: (slug: string) => boolean;
  refetchPermissions: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user, loading: userLoading, isAdmin } = useCurrentUser();
  const {
    allowedPages,
    isAllowed: checkPermission,
    loading: permLoading,
    refetch,
  } = usePermissions(user?.id);

  // Admins can always access everything
  const isAllowed = (slug: string) => {
    if (isAdmin) return true;
    return checkPermission(slug);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading: userLoading || permLoading,
        isAdmin,
        allowedPages: isAdmin
          ? ["/dashboard", "/visits", "/sales", "/leads", "/employees", "/reports", "/users", "/settings"]
          : allowedPages,
        isAllowed,
        refetchPermissions: refetch,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
