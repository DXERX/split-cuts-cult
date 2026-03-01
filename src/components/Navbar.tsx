import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const navItems = [
  { label: "Artists", href: "#barbers" },
  { label: "Services", href: "#services" },
  { label: "Book", href: "/book" },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 mix-blend-difference">
      <div className="flex items-center justify-between px-6 md:px-12 py-6">
        <Link to="/" className="font-display text-3xl md:text-4xl text-foreground tracking-[0.15em]">
          SPLIT CUTS
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {navItems.map((item) =>
            item.href.startsWith("/") ? (
              <Link key={item.label} to={item.href} className="font-body text-xs uppercase tracking-[0.3em] text-foreground text-distort">
                {item.label}
              </Link>
            ) : (
              <a key={item.label} href={item.href} className="font-body text-xs uppercase tracking-[0.3em] text-foreground text-distort">
                {item.label}
              </a>
            )
          )}
        </div>

        <button onClick={() => setIsOpen(!isOpen)} className="md:hidden text-foreground z-50">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background flex flex-col items-center justify-center gap-12 md:hidden"
          >
            {navItems.map((item, i) => (
              <motion.div key={item.label} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                {item.href.startsWith("/") ? (
                  <Link to={item.href} onClick={() => setIsOpen(false)} className="font-display text-7xl text-foreground text-distort">
                    {item.label}
                  </Link>
                ) : (
                  <a href={item.href} onClick={() => setIsOpen(false)} className="font-display text-7xl text-foreground text-distort">
                    {item.label}
                  </a>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
