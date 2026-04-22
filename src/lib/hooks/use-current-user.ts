"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager";
}

export function useCurrentUser() {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    async function fetchUser() {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (!authUser) {
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase
        .from("users")
        .select("id, name, email, role")
        .eq("id", authUser.id)
        .single();

      if (profile) {
        setUser(profile as AppUser);
      }
      setLoading(false);
    }

    fetchUser();
  }, []);

  return {
    user,
    loading,
    isAdmin: user?.role === "admin",
  };
}
