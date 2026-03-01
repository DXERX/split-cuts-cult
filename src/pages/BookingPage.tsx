import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { Check, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";

interface Service { id: string; name: string; price_sar: number; duration_minutes: number; }
interface Barber { id: string; name: string; title: string; }

const BookingPage = () => {
  const [step, setStep] = useState(0);
  const [services, setServices] = useState<Service[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedBarber, setSelectedBarber] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const [sRes, bRes] = await Promise.all([
        supabase.from("services").select("*").eq("active", true).order("sort_order"),
        supabase.from("barbers").select("*").order("sort_order"),
      ]);
      if (sRes.data) setServices(sRes.data);
      if (bRes.data) setBarbers(bRes.data);
    };
    fetch();
  }, []);

  // Generate time slots from 4PM to 3:30AM (in 30-min increments)
  const timeSlots: string[] = [];
  for (let h = 16; h <= 23; h++) {
    timeSlots.push(`${String(h).padStart(2, "0")}:00`);
    timeSlots.push(`${String(h).padStart(2, "0")}:30`);
  }
  for (let h = 0; h <= 3; h++) {
    timeSlots.push(`${String(h).padStart(2, "0")}:00`);
    if (h < 3 || true) timeSlots.push(`${String(h).padStart(2, "0")}:30`);
  }

  const getTodayStr = () => {
    const d = new Date();
    return d.toISOString().split("T")[0];
  };

  const handleSubmit = async () => {
    if (!customerName || !customerPhone) return;
    setLoading(true);
    const { error } = await supabase.from("bookings").insert({
      customer_name: customerName,
      customer_phone: customerPhone,
      customer_email: customerEmail || null,
      service_id: selectedService,
      barber_id: selectedBarber,
      booking_date: selectedDate,
      booking_time: selectedTime,
    });
    setLoading(false);
    if (!error) setSubmitted(true);
  };

  const selectedServiceData = services.find((s) => s.id === selectedService);

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="grain-overlay" />
        <Navbar />
        <div className="flex flex-col items-center justify-center min-h-screen px-6 text-center">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", damping: 15 }}>
            <div className="w-20 h-20 border border-foreground/20 flex items-center justify-center mb-8 mx-auto">
              <Check className="w-10 h-10 text-foreground" />
            </div>
          </motion.div>
          <h1 className="font-display text-6xl md:text-8xl text-foreground mb-4">BOOKED</h1>
          <p className="font-body text-sm text-muted-foreground mb-8">Your session has been locked in. We'll see you there.</p>
          <Link to="/" className="font-body text-xs uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-colors">
            ← Back to home
          </Link>
        </div>
      </div>
    );
  }

  const steps = [
    // Step 0: Service
    <div key="service" className="space-y-3">
      <p className="font-body text-[10px] uppercase tracking-[0.5em] text-muted-foreground mb-6">Choose your service</p>
      {services.map((s) => (
        <button
          key={s.id}
          onClick={() => { setSelectedService(s.id); setStep(1); }}
          className={`w-full text-left border p-5 flex justify-between items-center transition-all duration-500 ${
            selectedService === s.id ? "border-foreground/30 bg-secondary" : "border-border hover:border-foreground/10"
          }`}
        >
          <div>
            <span className="font-display text-2xl text-foreground">{s.name}</span>
            <span className="font-body text-[10px] text-muted-foreground ml-3">{s.duration_minutes} min</span>
          </div>
          <span className="font-display text-xl text-muted-foreground">{s.price_sar} SAR</span>
        </button>
      ))}
    </div>,
    // Step 1: Barber
    <div key="barber" className="space-y-3">
      <p className="font-body text-[10px] uppercase tracking-[0.5em] text-muted-foreground mb-6">Choose your artist</p>
      {barbers.map((b) => (
        <button
          key={b.id}
          onClick={() => { setSelectedBarber(b.id); setStep(2); }}
          className={`w-full text-left border p-5 transition-all duration-500 ${
            selectedBarber === b.id ? "border-foreground/30 bg-secondary" : "border-border hover:border-foreground/10"
          }`}
        >
          <span className="font-display text-3xl text-foreground">{b.name}</span>
          <span className="font-body text-[10px] text-muted-foreground ml-3 uppercase tracking-[0.2em]">{b.title}</span>
        </button>
      ))}
    </div>,
    // Step 2: Date & Time
    <div key="datetime" className="space-y-6">
      <div>
        <p className="font-body text-[10px] uppercase tracking-[0.5em] text-muted-foreground mb-4">Pick a date</p>
        <input
          type="date"
          min={getTodayStr()}
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="w-full bg-secondary border border-border text-foreground font-body text-sm p-4 focus:outline-none focus:border-foreground/30"
        />
      </div>
      {selectedDate && (
        <div>
          <p className="font-body text-[10px] uppercase tracking-[0.5em] text-muted-foreground mb-4">Pick a time</p>
          <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
            {timeSlots.map((t) => (
              <button
                key={t}
                onClick={() => { setSelectedTime(t); setStep(3); }}
                className={`font-body text-xs p-3 border transition-all duration-300 ${
                  selectedTime === t ? "border-foreground/30 bg-secondary text-foreground" : "border-border text-muted-foreground hover:border-foreground/10 hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>,
    // Step 3: Customer info
    <div key="info" className="space-y-4">
      <p className="font-body text-[10px] uppercase tracking-[0.5em] text-muted-foreground mb-6">Your details</p>
      <input
        type="text"
        placeholder="Name *"
        value={customerName}
        onChange={(e) => setCustomerName(e.target.value)}
        className="w-full bg-secondary border border-border text-foreground font-body text-sm p-4 placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30"
      />
      <input
        type="tel"
        placeholder="Phone *"
        value={customerPhone}
        onChange={(e) => setCustomerPhone(e.target.value)}
        className="w-full bg-secondary border border-border text-foreground font-body text-sm p-4 placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30"
      />
      <input
        type="email"
        placeholder="Email (optional)"
        value={customerEmail}
        onChange={(e) => setCustomerEmail(e.target.value)}
        className="w-full bg-secondary border border-border text-foreground font-body text-sm p-4 placeholder:text-muted-foreground focus:outline-none focus:border-foreground/30"
      />

      {/* Summary */}
      <div className="border border-border p-5 mt-6 space-y-2">
        <p className="font-body text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Summary</p>
        <p className="font-display text-xl text-foreground">{selectedServiceData?.name} — {selectedServiceData?.price_sar} SAR</p>
        <p className="font-body text-xs text-muted-foreground">
          {barbers.find((b) => b.id === selectedBarber)?.name} · {selectedDate} · {selectedTime}
        </p>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!customerName || !customerPhone || loading}
        className="w-full font-body text-xs uppercase tracking-[0.3em] bg-foreground text-background py-5 hover:bg-primary transition-all duration-500 disabled:opacity-30 disabled:cursor-not-allowed mt-4"
      >
        {loading ? "Booking..." : "Confirm Booking"}
      </button>
    </div>,
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="grain-overlay" />
      <Navbar />
      <div className="pt-32 pb-20 px-6 md:px-12 max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <h1 className="font-display text-7xl md:text-9xl text-foreground mb-2">BOOK</h1>
          <p className="font-body text-[10px] uppercase tracking-[0.5em] text-muted-foreground mb-12">
            Step {step + 1} of 4
          </p>
        </motion.div>

        {/* Step navigation */}
        <div className="flex gap-2 mb-10">
          {[0, 1, 2, 3].map((s) => (
            <div key={s} className={`h-px flex-1 transition-all duration-500 ${s <= step ? "bg-foreground" : "bg-border"}`} />
          ))}
        </div>

        <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          {steps[step]}
        </motion.div>

        {step > 0 && (
          <button onClick={() => setStep(step - 1)} className="mt-8 font-body text-[10px] uppercase tracking-[0.3em] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
            <ChevronLeft size={12} /> Back
          </button>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
