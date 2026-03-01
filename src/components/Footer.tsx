const Footer = () => {
  return (
    <footer className="border-t border-border px-6 md:px-12 py-16">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
        <div>
          <span className="font-display text-5xl text-foreground tracking-[0.15em]">SPLIT CUTS</span>
          <p className="font-body text-[10px] text-muted-foreground mt-3 uppercase tracking-[0.3em]">
            Not your average barbershop
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-6 md:gap-12">
          {["Artists", "Services", "Book"].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="font-body text-[10px] text-muted-foreground hover:text-foreground transition-colors duration-500 uppercase tracking-[0.3em]">
              {item}
            </a>
          ))}
        </div>
      </div>
      <div className="glow-line mt-14 mb-8" />
      <p className="font-body text-[10px] text-muted-foreground text-center uppercase tracking-[0.3em]">
        © 2026 Split Cuts. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
