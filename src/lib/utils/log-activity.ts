import { createClient } from "@/lib/supabase/client";

export async function logActivity(
  userId: string,
  action: string,
  entityType?: string,
  entityId?: string,
  metadata?: Record<string, unknown>
) {
  const supabase = createClient();
  await supabase.from("activity_log").insert({
    user_id: userId,
    action,
    entity_type: entityType || null,
    entity_id: entityId || null,
    metadata: metadata || {},
  });
}
