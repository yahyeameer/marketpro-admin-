"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

export interface ActivityEntry {
  id: string;
  user_id: string;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  user_name?: string;
}

export function useActivityLog(options?: {
  entityType?: string;
  userId?: string;
  limit?: number;
}) {
  const [entries, setEntries] = useState<ActivityEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const limit = options?.limit || 20;

  const fetchEntries = useCallback(
    async (pageNum: number, append = false) => {
      const supabase = createClient();
      let query = supabase
        .from("activity_log")
        .select("*")
        .order("created_at", { ascending: false })
        .range(pageNum * limit, (pageNum + 1) * limit - 1);

      if (options?.entityType) {
        query = query.eq("entity_type", options.entityType);
      }
      if (options?.userId) {
        query = query.eq("user_id", options.userId);
      }

      const { data } = await query;

      if (data) {
        // Fetch user names for each entry
        const userIds = [...new Set(data.map((d) => d.user_id))];
        const { data: users } = await supabase
          .from("users")
          .select("id, name")
          .in("id", userIds);

        const userMap = new Map(users?.map((u) => [u.id, u.name]) || []);
        const enriched = data.map((d) => ({
          ...d,
          user_name: userMap.get(d.user_id) || "System",
        }));

        if (append) {
          setEntries((prev) => [...prev, ...enriched]);
        } else {
          setEntries(enriched);
        }
        setHasMore(data.length === limit);
      }
      setLoading(false);
    },
    [options?.entityType, options?.userId, limit]
  );

  useEffect(() => {
    setPage(0);
    fetchEntries(0);
  }, [fetchEntries]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchEntries(nextPage, true);
  };

  return { entries, loading, hasMore, loadMore, refetch: () => fetchEntries(0) };
}
