import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { Calendar, DollarSign, Users, Clock, Bell, Scissors, LogOut, BarChart3, Settings } from "lucide-react";

type Tab = "overview" | "bookings" | "services" | "schedule" | "notifications";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");
  const [bookings, setBookings] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [barbers, setBarbers] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { navigate("/admin/login"); return; }
      const { data: roles } = await supabase.from("user_roles").select("role").single();
      if (!roles || roles.role !== "admin") { navigate("/admin/login"); return; }
      fetchAll();
    };
    checkAuth();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    const [bk, sv, br, nt] = await Promise.all([
      supabase.from("bookings").select("*, services(name, price_sar), barbers(name)").order("booking_date", { ascending: false }),
      supabase.from("services").select("*").order("sort_order"),
      supabase.from("barbers").select("*").order("sort_order"),
      supabase.from("notifications").select("*").order("created_at", { ascending: false }),
    ]);
    if (bk.data) setBookings(bk.data);
    if (sv.data) setServices(sv.data);
    if (br.data) setBarbers(br.data);
    if (nt.data) setNotifications(nt.data);
    setLoading(false);
  };

  const updateBookingStatus = async (id: string, status: string) => {
    await supabase.from("bookings").update({ status }).eq("id", id);
    fetchAll();
  };

  const updateServicePrice = async (id: string, price: number) => {
    await supabase.from("services").update({ price_sar: price }).eq("id", id);
    fetchAll();
  };

  const toggleNotification = async (id: string, active: boolean) => {
    await supabase.from("notifications").update({ active: !active }).eq("id", id);
    fetchAll();
  };

  const addNotification = async (title: string, message: string, type: string) => {
    await supabase.from("notifications").insert({ title, message, type });
    fetchAll();
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/admin/login");
  };

  const totalRevenue = bookings
    .filter((b) => b.status === "completed")
    .reduce((sum, b) => sum + (b.services?.price_sar || 0), 0);

  const todayStr = new Date().toISOString().split("T")[0];
  const todayBookings = bookings.filter((b) => b.booking_date === todayStr);
  const pendingBookings = bookings.filter((b) => b.status === "pending");

  const revenueByBarber = barbers.map((barber) => ({
    ...barber,
    revenue: bookings.filter((b) => b.barber_id === barber.id && b.status === "completed").reduce((sum, b) => sum + (b.services?.price_sar || 0), 0),
    bookingCount: bookings.filter((b) => b.barber_id === barber.id).length,
  }));

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "bookings", label: "Bookings", icon: Calendar },
    { id: "services", label: "Services", icon: Scissors },
    { id: "schedule", label: "Schedule", icon: Clock },
    { id: "notifications", label: "Alerts", icon: Bell },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-body text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="grain-overlay" />
      {/* Header */}
      <div className="border-b border-border px-6 md:px-8 py-4 flex items-center justify-between sticky top-0 bg-background/95 backdrop-blur z-40">
        <div className="flex items-center gap-4">
          <span className="font-display text-2xl text-foreground tracking-[0.15em]">SPLIT CUTS</span>
          <span className="font-body text-[9px] uppercase tracking-[0.3em] text-muted-foreground">Admin</span>
        </div>
        <button onClick={handleSignOut} className="text-muted-foreground hover:text-foreground transition-colors">
          <LogOut size={18} />
        </button>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <nav className="w-16 md:w-56 border-r border-border min-h-[calc(100vh-57px)] p-3 md:p-4 flex flex-col gap-1 sticky top-[57px]">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-3 px-3 py-3 font-body text-xs uppercase tracking-[0.15em] transition-all duration-300 ${
                tab === t.id ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <t.icon size={16} />
              <span className="hidden md:inline">{t.label}</span>
            </button>
          ))}
        </nav>

        {/* Content */}
        <main className="flex-1 p-6 md:p-8">
          <motion.div key={tab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            {tab === "overview" && (
              <div className="space-y-8">
                <h2 className="font-display text-5xl text-foreground">Dashboard</h2>
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: "Total Revenue", value: `${totalRevenue} SAR`, icon: DollarSign },
                    { label: "Today's Bookings", value: todayBookings.length, icon: Calendar },
                    { label: "Pending", value: pendingBookings.length, icon: Clock },
                    { label: "Total Bookings", value: bookings.length, icon: Users },
                  ].map((stat) => (
                    <div key={stat.label} className="border border-border p-5">
                      <stat.icon size={14} className="text-muted-foreground mb-3" />
                      <p className="font-display text-3xl text-foreground">{stat.value}</p>
                      <p className="font-body text-[9px] uppercase tracking-[0.3em] text-muted-foreground mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
                {/* Revenue by barber */}
                <div>
                  <p className="font-body text-[10px] uppercase tracking-[0.5em] text-muted-foreground mb-4">Revenue by Artist</p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {revenueByBarber.map((b) => (
                      <div key={b.id} className="border border-border p-5">
                        <p className="font-display text-2xl text-foreground">{b.name}</p>
                        <p className="font-display text-xl text-muted-foreground mt-1">{b.revenue} SAR</p>
                        <p className="font-body text-[9px] text-muted-foreground mt-1">{b.bookingCount} bookings</p>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Recent bookings */}
                <div>
                  <p className="font-body text-[10px] uppercase tracking-[0.5em] text-muted-foreground mb-4">Recent Bookings</p>
                  <div className="space-y-2">
                    {bookings.slice(0, 10).map((b) => (
                      <div key={b.id} className="border border-border p-4 flex items-center justify-between">
                        <div>
                          <p className="font-body text-sm text-foreground">{b.customer_name}</p>
                          <p className="font-body text-[10px] text-muted-foreground">
                            {b.services?.name} with {b.barbers?.name} · {b.booking_date} {b.booking_time}
                          </p>
                        </div>
                        <span className={`font-body text-[9px] uppercase tracking-[0.2em] px-3 py-1 ${
                          b.status === "completed" ? "bg-foreground/10 text-foreground" :
                          b.status === "pending" ? "bg-secondary text-muted-foreground" :
                          b.status === "confirmed" ? "bg-secondary text-foreground" :
                          "bg-destructive/10 text-destructive"
                        }`}>
                          {b.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {tab === "bookings" && (
              <div className="space-y-6">
                <h2 className="font-display text-5xl text-foreground">Bookings</h2>
                <div className="space-y-2">
                  {bookings.map((b) => (
                    <div key={b.id} className="border border-border p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <p className="font-body text-sm text-foreground">{b.customer_name} — {b.customer_phone}</p>
                        <p className="font-body text-[10px] text-muted-foreground">
                          {b.services?.name} ({b.services?.price_sar} SAR) · {b.barbers?.name} · {b.booking_date} @ {b.booking_time}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {["pending", "confirmed", "completed", "cancelled"].map((s) => (
                          <button
                            key={s}
                            onClick={() => updateBookingStatus(b.id, s)}
                            className={`font-body text-[9px] uppercase tracking-[0.15em] px-3 py-2 border transition-all ${
                              b.status === s ? "border-foreground/30 bg-secondary text-foreground" : "border-border text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                  {bookings.length === 0 && (
                    <p className="font-body text-sm text-muted-foreground">No bookings yet.</p>
                  )}
                </div>
              </div>
            )}

            {tab === "services" && (
              <div className="space-y-6">
                <h2 className="font-display text-5xl text-foreground">Services</h2>
                <div className="space-y-2">
                  {services.map((s) => (
                    <div key={s.id} className="border border-border p-4 flex items-center justify-between">
                      <div>
                        <p className="font-display text-xl text-foreground">{s.name}</p>
                        <p className="font-body text-[10px] text-muted-foreground">{s.duration_minutes} min</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          defaultValue={s.price_sar}
                          onBlur={(e) => updateServicePrice(s.id, Number(e.target.value))}
                          className="w-20 bg-secondary border border-border text-foreground font-body text-sm p-2 text-right focus:outline-none focus:border-foreground/30"
                        />
                        <span className="font-body text-xs text-muted-foreground">SAR</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "schedule" && (
              <div className="space-y-6">
                <h2 className="font-display text-5xl text-foreground">Schedule</h2>
                <p className="font-body text-sm text-muted-foreground">
                  Default hours: 4:00 PM – 4:00 AM. Override specific dates below.
                </p>
                <div>
                  <p className="font-body text-[10px] uppercase tracking-[0.5em] text-muted-foreground mb-4">Barber Schedules</p>
                  {barbers.map((b) => (
                    <div key={b.id} className="border border-border p-5 mb-3">
                      <p className="font-display text-2xl text-foreground mb-2">{b.name}</p>
                      <p className="font-body text-xs text-muted-foreground">16:00 – 04:00 (All Days)</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {tab === "notifications" && (
              <div className="space-y-6">
                <h2 className="font-display text-5xl text-foreground">Notifications</h2>
                <NewNotificationForm onAdd={addNotification} />
                <div className="space-y-2">
                  {notifications.map((n) => (
                    <div key={n.id} className="border border-border p-4 flex items-center justify-between">
                      <div>
                        <p className="font-body text-sm text-foreground">{n.title}</p>
                        <p className="font-body text-[10px] text-muted-foreground">{n.message}</p>
                        <span className="font-body text-[9px] uppercase tracking-[0.2em] text-muted-foreground">{n.type}</span>
                      </div>
                      <button
                        onClick={() => toggleNotification(n.id, n.active)}
                        className={`font-body text-[9px] uppercase tracking-[0.15em] px-3 py-2 border transition-all ${
                          n.active ? "border-foreground/30 text-foreground" : "border-border text-muted-foreground"
                        }`}
                      >
                        {n.active ? "Active" : "Inactive"}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};

const NewNotificationForm = ({ onAdd }: { onAdd: (title: string, message: string, type: string) => void }) => {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("promotion");

  const handleSubmit = () => {
    if (!title || !message) return;
    onAdd(title, message, type);
    setTitle("");
    setMessage("");
  };

  return (
    <div className="border border-border p-5 space-y-3">
      <p className="font-body text-[10px] uppercase tracking-[0.5em] text-muted-foreground">New Notification</p>
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full bg-secondary border border-border text-foreground font-body text-sm p-3 placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30"
      />
      <input
        type="text"
        placeholder="Message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full bg-secondary border border-border text-foreground font-body text-sm p-3 placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30"
      />
      <div className="flex gap-2">
        {["promotion", "ramadan", "eid", "new_service", "general"].map((t) => (
          <button
            key={t}
            onClick={() => setType(t)}
            className={`font-body text-[9px] uppercase tracking-[0.15em] px-3 py-2 border transition-all ${
              type === t ? "border-foreground/30 text-foreground" : "border-border text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>
      <button
        onClick={handleSubmit}
        className="font-body text-[10px] uppercase tracking-[0.3em] bg-foreground text-background px-6 py-3 hover:bg-primary transition-all duration-500"
      >
        Add
      </button>
    </div>
  );
};

export default AdminDashboard;
