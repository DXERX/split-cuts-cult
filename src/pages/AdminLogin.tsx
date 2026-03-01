import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Check if user is admin
    const { data: roles } = await supabase.from("user_roles").select("role").single();
    if (!roles || roles.role !== "admin") {
      setError("Access denied. Admin only.");
      await supabase.auth.signOut();
      setLoading(false);
      return;
    }

    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="grain-overlay" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <h1 className="font-display text-6xl text-foreground mb-2 text-center">ADMIN</h1>
        <p className="font-body text-[10px] uppercase tracking-[0.5em] text-muted-foreground text-center mb-10">
          Split Cuts Management
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-secondary border border-border text-foreground font-body text-sm p-4 placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-secondary border border-border text-foreground font-body text-sm p-4 placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30"
            required
          />
          {error && <p className="font-body text-xs text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full font-body text-xs uppercase tracking-[0.3em] bg-foreground text-background py-5 hover:bg-primary transition-all duration-500 disabled:opacity-30"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
