"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

interface Permission {
  id: string;
  page_slug: string;
  is_visible: boolean;
}

export function usePermissions(userId: string | undefined) {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPermissions = useCallback(async () => {
    if (!userId) return;
    const supabase = createClient();
    const { data } = await supabase
      .from("user_permissions")
      .select("id, page_slug, is_visible")
      .eq("user_id", userId);

    if (data) {
      setPermissions(data);
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchPermissions();
  }, [fetchPermissions]);

  const allowedPages = permissions
    .filter((p) => p.is_visible)
    .map((p) => p.page_slug);

  const isAllowed = (slug: string) => {
    // If no permissions loaded yet, allow all (loading state)
    if (permissions.length === 0 && loading) return true;
    // Dashboard is always allowed
    if (slug === "/dashboard") return true;
    return allowedPages.includes(slug);
  };

  return { permissions, allowedPages, isAllowed, loading, refetch: fetchPermissions };
}
