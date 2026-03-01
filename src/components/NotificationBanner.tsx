import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
}

const NotificationBanner = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchNotifications = async () => {
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("active", true)
        .order("created_at", { ascending: false })
        .limit(5);
      if (data) setNotifications(data);
    };
    fetchNotifications();
  }, []);

  const visibleNotifications = notifications.filter((n) => !dismissed.has(n.id));
  const current = visibleNotifications[currentIndex % visibleNotifications.length];

  if (!current) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={current.id}
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -60, opacity: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed top-0 left-0 right-0 z-[60] bg-secondary border-b border-border"
      >
        <div className="flex items-center justify-between px-6 md:px-12 py-3">
          <div className="flex items-center gap-4">
            <span className="font-body text-[9px] uppercase tracking-[0.3em] text-muted-foreground">
              {current.type}
            </span>
            <span className="font-body text-xs text-foreground">
              {current.title} — {current.message}
            </span>
          </div>
          <button
            onClick={() => setDismissed((prev) => new Set(prev).add(current.id))}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default NotificationBanner;
