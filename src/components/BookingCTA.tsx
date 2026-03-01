import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const BookingCTA = () => {
  return (
    <section id="book" className="py-32 md:py-48 px-6 md:px-12 relative overflow-hidden">
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[500px] h-[500px] rounded-full bg-foreground/3 blur-[150px]" />
      </div>

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2 }}
        >
          <p className="font-body text-[10px] uppercase tracking-[0.5em] text-muted-foreground mb-8">
            Ready?
          </p>
          <h2 className="font-display text-8xl md:text-[12rem] leading-[0.82] text-foreground mb-8">
            BOOK
            <br />
            YOUR
            <br />
            <span className="text-metallic">SESSION</span>
          </h2>
          <p className="font-body text-sm text-muted-foreground max-w-md mx-auto mb-14">
            Choose your artist. Pick your service. Lock in your time.
            No wait. No walk-ins. Just precision.
          </p>
          <Link
            to="/book"
            className="inline-block font-body text-xs uppercase tracking-[0.3em] bg-foreground text-background px-14 py-5 hover:bg-primary transition-all duration-500"
          >
            Book Appointment
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default BookingCTA;
