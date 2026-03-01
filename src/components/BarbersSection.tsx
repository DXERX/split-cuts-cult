import { motion } from "framer-motion";
import barberJeff from "@/assets/barber-jeff.jpg";
import barberSammy from "@/assets/barber-sammy.jpg";
import barberQader from "@/assets/barber-qader.jpg";

const barbers = [
  { name: "Jeff", title: "Master Barber", image: barberJeff, specialty: "Classic Fades & Razor Work" },
  { name: "Sammy", title: "Creative Director", image: barberSammy, specialty: "Modern Cuts & Design" },
  { name: "Qader", title: "Senior Barber", image: barberQader, specialty: "Beard Sculpting & Styling" },
];

const BarbersSection = () => {
  return (
    <section id="barbers" className="py-24 md:py-40 px-6 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1 }}
        className="mb-20 md:mb-32"
      >
        <p className="font-body text-[10px] uppercase tracking-[0.5em] text-muted-foreground mb-4">
          The Crew
        </p>
        <h2 className="font-display text-8xl md:text-[10rem] text-foreground leading-[0.85]">
          OUR
          <br />
          <span className="text-metallic">ARTISTS</span>
        </h2>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {barbers.map((barber, i) => (
          <motion.div
            key={barber.name}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.9, delay: i * 0.2 }}
            className="group relative overflow-hidden cursor-pointer"
          >
            <div className="aspect-[3/4] overflow-hidden">
              <img
                src={barber.image}
                alt={barber.name}
                className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
            </div>

            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <p className="font-body text-[10px] uppercase tracking-[0.4em] text-muted-foreground mb-2">
                {barber.title}
              </p>
              <h3 className="font-display text-6xl md:text-7xl text-foreground mb-1">
                {barber.name}
              </h3>
              <p className="font-body text-xs text-muted-foreground transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
                {barber.specialty}
              </p>
            </div>

            <div className="absolute inset-0 border border-foreground/0 group-hover:border-foreground/10 transition-colors duration-700" />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default BarbersSection;
