import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";

const HeroSection = () => {
  return (
    <section className="relative h-screen flex items-end overflow-hidden blur-vignette">
      <motion.div
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="absolute inset-0"
      >
        <img src={heroBg} alt="Split Cuts" className="w-full h-full object-cover grayscale contrast-125 brightness-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
      </motion.div>

      <div className="relative z-10 w-full px-6 md:px-12 pb-16 md:pb-24">
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <p className="font-body text-[10px] uppercase tracking-[0.5em] text-muted-foreground mb-6">
            Not your average barbershop
          </p>
          <h1 className="font-display text-[18vw] md:text-[14vw] lg:text-[11vw] leading-[0.82] text-foreground">
            SPLIT
            <br />
            <span className="text-metallic">CUTS</span>
          </h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-10 flex items-center gap-8"
        >
          <a href="/book" className="font-body text-xs uppercase tracking-[0.3em] bg-foreground text-background px-10 py-4 hover:bg-primary transition-all duration-500">
            Book Now
          </a>
          <a href="#barbers" className="font-body text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-colors duration-500">
            The Artists ↓
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 right-6 md:right-12"
      >
        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2.5 }} className="w-px h-16 bg-gradient-to-b from-muted-foreground to-transparent" />
      </motion.div>
    </section>
  );
};

export default HeroSection;
