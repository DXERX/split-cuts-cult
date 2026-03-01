
-- Admin role system
CREATE TYPE public.app_role AS ENUM ('admin');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checking
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = auth.uid() AND role = 'admin'
  )
$$;

-- Barbers table
CREATE TABLE public.barbers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  title TEXT NOT NULL DEFAULT '',
  specialty TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.barbers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read barbers" ON public.barbers FOR SELECT USING (true);
CREATE POLICY "Admin manage barbers" ON public.barbers FOR ALL USING (public.is_admin());

-- Services table
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price_sar NUMERIC(10,2) NOT NULL,
  duration_minutes INT NOT NULL DEFAULT 30,
  active BOOLEAN NOT NULL DEFAULT true,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Admin manage services" ON public.services FOR ALL USING (public.is_admin());

-- Working hours (per barber, per day)
CREATE TABLE public.working_hours (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barber_id UUID REFERENCES public.barbers(id) ON DELETE CASCADE NOT NULL,
  day_of_week INT NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL DEFAULT '16:00',
  end_time TIME NOT NULL DEFAULT '04:00',
  is_active BOOLEAN NOT NULL DEFAULT true,
  UNIQUE (barber_id, day_of_week)
);
ALTER TABLE public.working_hours ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read working_hours" ON public.working_hours FOR SELECT USING (true);
CREATE POLICY "Admin manage working_hours" ON public.working_hours FOR ALL USING (public.is_admin());

-- Time slot overrides (holidays, Ramadan, Eid)
CREATE TABLE public.time_slot_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  barber_id UUID REFERENCES public.barbers(id) ON DELETE CASCADE NOT NULL,
  override_date DATE NOT NULL,
  start_time TIME,
  end_time TIME,
  available BOOLEAN NOT NULL DEFAULT false,
  reason TEXT,
  UNIQUE (barber_id, override_date)
);
ALTER TABLE public.time_slot_overrides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read overrides" ON public.time_slot_overrides FOR SELECT USING (true);
CREATE POLICY "Admin manage overrides" ON public.time_slot_overrides FOR ALL USING (public.is_admin());

-- Bookings table
CREATE TABLE public.bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  service_id UUID REFERENCES public.services(id) NOT NULL,
  barber_id UUID REFERENCES public.barbers(id) NOT NULL,
  booking_date DATE NOT NULL,
  booking_time TIME NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'no_show')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can create booking" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read all bookings" ON public.bookings FOR SELECT USING (public.is_admin());
CREATE POLICY "Admin manage bookings" ON public.bookings FOR UPDATE USING (public.is_admin());
CREATE POLICY "Admin delete bookings" ON public.bookings FOR DELETE USING (public.is_admin());

-- Notifications table
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'promotion' CHECK (type IN ('promotion', 'ramadan', 'eid', 'new_service', 'general')),
  active BOOLEAN NOT NULL DEFAULT true,
  starts_at TIMESTAMPTZ,
  ends_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read active notifications" ON public.notifications FOR SELECT USING (active = true);
CREATE POLICY "Admin manage notifications" ON public.notifications FOR ALL USING (public.is_admin());

-- RLS for user_roles
CREATE POLICY "Admin read roles" ON public.user_roles FOR SELECT USING (public.is_admin() OR user_id = auth.uid());
CREATE POLICY "Admin manage roles" ON public.user_roles FOR ALL USING (public.is_admin());

-- Seed barbers
INSERT INTO public.barbers (name, title, specialty, sort_order) VALUES
  ('Jeff', 'Master Barber', 'Classic Fades & Razor Work', 1),
  ('Sammy', 'Creative Director', 'Modern Cuts & Design', 2),
  ('Qader', 'Senior Barber', 'Beard Sculpting & Styling', 3);

-- Seed services with SAR pricing
INSERT INTO public.services (name, price_sar, duration_minutes, sort_order) VALUES
  ('Hair + Beard', 49, 45, 1),
  ('Beard Only', 20, 20, 2),
  ('Hair Only', 30, 30, 3),
  ('Design', 20, 30, 4),
  ('Cornrows', 99, 90, 5),
  ('Twist', 199, 120, 6),
  ('Dreads', 199, 120, 7);

-- Seed default working hours (4PM-4AM, all barbers, all days)
INSERT INTO public.working_hours (barber_id, day_of_week, start_time, end_time, is_active)
SELECT b.id, d.day, '16:00'::TIME, '04:00'::TIME, true
FROM public.barbers b
CROSS JOIN generate_series(0, 6) AS d(day);
