import { motion } from "framer-motion";

const services = [
  { name: "Hair + Beard", price: "49", duration: "45 min" },
  { name: "Beard Only", price: "20", duration: "20 min" },
  { name: "Hair Only", price: "30", duration: "30 min" },
  { name: "Design", price: "20", duration: "30 min" },
  { name: "Cornrows", price: "99", duration: "90 min" },
  { name: "Twist", price: "199", duration: "2 hrs" },
  { name: "Dreads", price: "199", duration: "2 hrs" },
];

const ServicesSection = () => {
  return (
    <section id="services" className="py-24 md:py-40 px-6 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1 }}
        className="mb-20 md:mb-32"
      >
        <p className="font-body text-[10px] uppercase tracking-[0.5em] text-muted-foreground mb-4">
          The Menu
        </p>
        <h2 className="font-display text-8xl md:text-[10rem] text-foreground leading-[0.85]">
          SER
          <br />
          <span className="text-metallic">VICES</span>
        </h2>
      </motion.div>

      <div className="max-w-5xl">
        {services.map((service, i) => (
          <motion.div
            key={service.name}
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.06 }}
            className="group border-b border-border py-6 md:py-8 flex items-center justify-between hover:pl-6 transition-all duration-700 cursor-default"
          >
            <div className="flex items-baseline gap-6">
              <span className="font-display text-4xl md:text-6xl text-foreground group-hover:text-metallic transition-all duration-500">
                {service.name}
              </span>
              <span className="font-body text-[10px] uppercase tracking-[0.3em] text-muted-foreground hidden md:inline">
                {service.duration}
              </span>
            </div>
            <span className="font-display text-3xl md:text-5xl text-muted-foreground group-hover:text-foreground transition-colors duration-500">
              {service.price} <span className="text-lg md:text-2xl">SAR</span>
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default ServicesSection;
