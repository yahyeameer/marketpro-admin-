"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  CheckCheck,
  Info,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  ExternalLink,
  Inbox,
} from "lucide-react";
import { useNotifications, type Notification } from "@/lib/hooks/use-notifications";
import { useUser } from "@/components/providers/user-provider";

const typeConfig: Record<
  string,
  { icon: typeof Info; color: string; bg: string }
> = {
  info: { icon: Info, color: "text-[#27272a]", bg: "bg-[#f4f4f5]/10" },
  success: { icon: CheckCircle2, color: "text-[#4ade80]", bg: "bg-[#4ade80]/10" },
  warning: { icon: AlertTriangle, color: "text-[#fbbf24]", bg: "bg-[#fbbf24]/10" },
  alert: { icon: AlertCircle, color: "text-[#ff6e84]", bg: "bg-[#ff6e84]/10" },
};

function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}

function NotificationItem({
  notification,
  onRead,
}: {
  notification: Notification;
  onRead: (id: string) => void;
}) {
  const router = useRouter();
  const config = typeConfig[notification.type] || typeConfig.info;
  const Icon = config.icon;

  const handleClick = () => {
    if (!notification.is_read) {
      onRead(notification.id);
    }
    if (notification.link) {
      router.push(notification.link);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full text-left p-4 flex gap-3 transition-all duration-200 hover:bg-[#f4f4f5] border-b border-[#e4e4e7] last:border-0 ${
        notification.is_read ? "opacity-60" : ""
      }`}
    >
      <div className={`p-2 rounded-lg shrink-0 ${config.bg}`}>
        <Icon className={`w-4 h-4 ${config.color}`} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p
            className={`text-sm font-medium truncate ${
              notification.is_read ? "text-[#71717a]" : "text-[#09090b]"
            }`}
          >
            {notification.title}
          </p>
          {!notification.is_read && (
            <div className="w-2 h-2 rounded-full bg-[#09090b] shrink-0 mt-1.5" />
          )}
        </div>
        <p className="text-xs text-[#71717a] mt-0.5 line-clamp-2">
          {notification.message}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="text-[10px] text-[#71717a]/70 font-mono">
            {timeAgo(notification.created_at)}
          </span>
          {notification.link && (
            <ExternalLink className="w-3 h-3 text-[#71717a]/50" />
          )}
        </div>
      </div>
    </button>
  );
}

export function NotificationPanel() {
  const { user } = useUser();
  const { notifications, unreadCount, markAsRead, markAllRead } =
    useNotifications(user?.id);
  const [isOpen, setIsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Trigger */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-[#71717a] hover:text-[#09090b] hover:bg-[#f4f4f5] rounded-full transition-all"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center text-[10px] font-bold text-white bg-[#09090b] rounded-full animate-pulse">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="absolute right-0 top-full mt-2 w-[380px] max-h-[480px] rounded-xl border border-[#e4e4e7] bg-white shadow-[0_10px_40px_rgba(0,0,0,0.1)] overflow-hidden z-50"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-[#e4e4e7] flex items-center justify-between bg-[#f4f4f5]">
              <div className="flex items-center gap-2">
                <h3 className="font-heading text-sm font-bold text-[#09090b]">
                  Notifications
                </h3>
                {unreadCount > 0 && (
                  <span className="text-[10px] font-bold text-[#09090b] bg-[#e4e4e7] px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-[10px] font-medium text-[#71717a] hover:text-[#09090b] transition-colors uppercase tracking-wider"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
            </div>

            {/* Notification List */}
            <div className="overflow-y-auto max-h-[400px] custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="p-4 rounded-full bg-[#f4f4f5] mb-4">
                    <Inbox className="w-8 h-8 text-[#71717a]/50" />
                  </div>
                  <p className="text-sm text-[#71717a] font-medium">
                    All caught up!
                  </p>
                  <p className="text-xs text-[#71717a]/60 mt-1">
                    No new notifications
                  </p>
                </div>
              ) : (
                notifications.map((n) => (
                  <NotificationItem
                    key={n.id}
                    notification={n}
                    onRead={markAsRead}
                  />
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
