-- =============================================
-- POLLA MUNDIAL 2026 - Schema de Base de Datos
-- =============================================
-- Ejecuta este script en el SQL Editor de Supabase
-- Ir a: app.supabase.com -> tu proyecto -> SQL Editor -> New Query

-- 1. PERFILES DE USUARIO (extiende auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  username text unique not null,
  full_name text not null,
  phone text,
  city text,
  -- Pago
  payment_status text not null default 'pending' check (payment_status in ('pending', 'confirmed', 'rejected')),
  payment_reference text,    -- número de transacción Coink
  payment_date timestamptz,
  -- Admin
  is_admin boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. EQUIPOS
create table public.teams (
  id serial primary key,
  name text not null,
  flag text not null default '🏳️',  -- emoji de bandera
  group_name text,  -- 'A' a 'L', null para equipos TBD en eliminatorias
  confederation text  -- UEFA, CONMEBOL, CONCACAF, CAF, AFC, OFC
);

-- 3. PARTIDOS
create table public.matches (
  id serial primary key,
  home_team_id integer references public.teams(id),
  away_team_id integer references public.teams(id),
  home_team_label text,   -- para TBD en eliminatorias: "Ganador A1 vs B2"
  away_team_label text,
  match_date timestamptz not null,
  venue text,
  city text,
  stage text not null check (stage in (
    'group', 'round_of_32', 'round_of_16',
    'quarterfinal', 'semifinal', 'third_place', 'final'
  )),
  group_name text,         -- 'A' a 'L', null para eliminatorias
  match_number integer,    -- número oficial del partido (1-104)
  -- Resultado (null hasta que se juegue)
  home_score integer,
  away_score integer,
  home_score_extra integer,  -- penaltis/prórroga si aplica
  away_score_extra integer,
  is_played boolean not null default false,
  predictions_locked boolean not null default false,  -- se bloquea al inicio del partido
  created_at timestamptz not null default now()
);

-- 4. PREDICCIONES DE PARTIDOS
create table public.predictions (
  id serial primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  match_id integer references public.matches(id) on delete cascade not null,
  predicted_home integer not null check (predicted_home >= 0),
  predicted_away integer not null check (predicted_away >= 0),
  points_awarded integer not null default 0,
  scored_at timestamptz,   -- cuando se otorgaron los puntos
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, match_id)
);

-- 5. PREDICCIONES DE BONOS
create table public.bonus_predictions (
  id serial primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  bonus_type text not null check (bonus_type in (
    'golden_boot',      -- Goleador: nombre del jugador
    'golden_glove',     -- Mejor arquero: nombre
    'top_assists',      -- Más asistencias: nombre
    'champion',         -- Campeón del mundial: nombre del equipo
    'last_team',        -- Peor equipo del mundial: nombre
    'worst_adicto'      -- Peor jugador Adicto: nombre
  )),
  prediction text not null,    -- nombre del jugador o equipo predicho
  points_awarded integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(user_id, bonus_type)
);

-- 6. RESULTADOS DE BONOS (los llena el admin)
create table public.bonus_results (
  bonus_type text primary key check (bonus_type in (
    'golden_boot', 'golden_glove', 'top_assists',
    'champion', 'last_team', 'worst_adicto'
  )),
  result text,              -- el valor correcto
  points_value integer not null default 0,
  is_resolved boolean not null default false,
  resolved_at timestamptz,
  updated_at timestamptz not null default now()
);

-- 7. LOG DE ACTIVIDAD (para auditoría)
create table public.activity_log (
  id serial primary key,
  user_id uuid references public.profiles(id),
  action text not null,
  details jsonb,
  created_at timestamptz not null default now()
);

-- =============================================
-- VISTAS
-- =============================================

-- Vista del leaderboard con totales
create or replace view public.leaderboard as
select
  p.id,
  p.username,
  p.full_name,
  p.city,
  p.payment_status,
  coalesce(sum(pred.points_awarded), 0) as match_points,
  coalesce(sum(bp.points_awarded), 0) as bonus_points,
  coalesce(sum(pred.points_awarded), 0) + coalesce(sum(bp.points_awarded), 0) as total_points,
  count(case when pred.points_awarded > 0 then 1 end) as correct_predictions,
  count(pred.id) as total_predictions,
  row_number() over (
    order by (coalesce(sum(pred.points_awarded), 0) + coalesce(sum(bp.points_awarded), 0)) desc
  ) as position
from public.profiles p
left join public.predictions pred on pred.user_id = p.id
left join public.bonus_predictions bp on bp.user_id = p.id
where p.payment_status = 'confirmed' and p.is_active = true
group by p.id, p.username, p.full_name, p.city, p.payment_status;

-- Vista del leaderboard solo fase de grupos (para "Primer Seco")
create or replace view public.group_stage_leaderboard as
select
  p.id,
  p.username,
  p.full_name,
  coalesce(sum(pred.points_awarded), 0) as group_stage_points,
  row_number() over (
    order by coalesce(sum(pred.points_awarded), 0) desc
  ) as position
from public.profiles p
left join public.predictions pred on pred.user_id = p.id
left join public.matches m on m.id = pred.match_id and m.stage = 'group'
where p.payment_status = 'confirmed' and p.is_active = true
group by p.id, p.username, p.full_name;

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

alter table public.profiles enable row level security;
alter table public.predictions enable row level security;
alter table public.bonus_predictions enable row level security;
alter table public.bonus_results enable row level security;
alter table public.matches enable row level security;
alter table public.teams enable row level security;
alter table public.activity_log enable row level security;

-- Perfiles: cada usuario ve todos los perfiles (para el leaderboard) pero solo edita el suyo
create policy "Perfiles visibles para todos los autenticados"
  on public.profiles for select
  using (auth.role() = 'authenticated');

create policy "Usuario puede insertar su propio perfil"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Usuario puede actualizar su propio perfil"
  on public.profiles for update
  using (auth.uid() = id);

-- Equipos y partidos: lectura pública
create policy "Equipos: lectura pública"
  on public.teams for select
  using (true);

create policy "Partidos: lectura pública"
  on public.matches for select
  using (true);

-- Solo admin puede modificar partidos y equipos (se hace via service role en API)
create policy "Partidos: solo service role escribe"
  on public.matches for all
  using (auth.role() = 'service_role');

create policy "Equipos: solo service role escribe"
  on public.teams for all
  using (auth.role() = 'service_role');

-- Predicciones: cada usuario ve todas (leaderboard) pero solo escribe las suyas
create policy "Predicciones: lectura para autenticados"
  on public.predictions for select
  using (auth.role() = 'authenticated');

create policy "Predicciones: usuario escribe las suyas"
  on public.predictions for insert
  with check (auth.uid() = user_id);

create policy "Predicciones: usuario actualiza las suyas"
  on public.predictions for update
  using (auth.uid() = user_id);

-- Bonus predictions: igual
create policy "Bonus: lectura para autenticados"
  on public.bonus_predictions for select
  using (auth.role() = 'authenticated');

create policy "Bonus: usuario escribe los suyos"
  on public.bonus_predictions for insert
  with check (auth.uid() = user_id);

create policy "Bonus: usuario actualiza los suyos"
  on public.bonus_predictions for update
  using (auth.uid() = user_id);

-- Bonus results: lectura pública
create policy "Bonus results: lectura pública"
  on public.bonus_results for select
  using (true);

-- =============================================
-- FUNCIONES
-- =============================================

-- Función para calcular puntos de un partido
create or replace function public.calculate_match_points(
  p_predicted_home integer,
  p_predicted_away integer,
  p_actual_home integer,
  p_actual_away integer,
  p_stage text
) returns integer as $$
declare
  v_points integer := 0;
  v_multiplier numeric;
  v_predicted_result integer;
  v_actual_result integer;
begin
  -- Signo del resultado: 1=local gana, 0=empate, -1=visitante gana
  v_predicted_result := sign(p_predicted_home - p_predicted_away);
  v_actual_result := sign(p_actual_home - p_actual_away);

  if p_predicted_home = p_actual_home and p_predicted_away = p_actual_away then
    -- Marcador exacto: 4 bonus + 2 ganador + 1 goles local + 1 goles visita = 8
    v_points := 8;
  elsif v_predicted_result = v_actual_result then
    -- Solo ganador correcto (o empate correcto): 2 puntos
    v_points := 2;
  end if;

  -- Multiplicadores por ronda
  v_multiplier := case p_stage
    when 'group'        then 1.0
    when 'round_of_32'  then 1.5
    when 'round_of_16'  then 2.0
    when 'quarterfinal' then 2.5
    when 'semifinal'    then 3.0
    when 'third_place'  then 2.0
    when 'final'        then 4.0
    else 1.0
  end;

  return floor(v_points * v_multiplier)::integer;
end;
$$ language plpgsql immutable;

-- Función para recalcular puntos de un partido (la llama el admin al ingresar resultado)
create or replace function public.score_match(p_match_id integer)
returns void as $$
declare
  v_match record;
  v_pred record;
  v_points integer;
begin
  select * into v_match from public.matches where id = p_match_id;

  if v_match.home_score is null or v_match.away_score is null then
    raise exception 'El partido no tiene resultado aún';
  end if;

  for v_pred in
    select * from public.predictions where match_id = p_match_id
  loop
    v_points := public.calculate_match_points(
      v_pred.predicted_home,
      v_pred.predicted_away,
      v_match.home_score,
      v_match.away_score,
      v_match.stage
    );

    update public.predictions
    set points_awarded = v_points, scored_at = now()
    where id = v_pred.id;
  end loop;

  update public.matches set is_played = true where id = p_match_id;
end;
$$ language plpgsql security definer;

-- Trigger para actualizar updated_at automáticamente
create or replace function public.update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_profiles_updated_at
  before update on public.profiles
  for each row execute function public.update_updated_at();

create trigger update_predictions_updated_at
  before update on public.predictions
  for each row execute function public.update_updated_at();

create trigger update_bonus_predictions_updated_at
  before update on public.bonus_predictions
  for each row execute function public.update_updated_at();

-- Trigger para crear perfil automáticamente al registrarse
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce(new.raw_user_meta_data->>'phone', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =============================================
-- DATOS INICIALES DE BONUS RESULTS
-- =============================================
insert into public.bonus_results (bonus_type, points_value) values
  ('golden_boot',   20),
  ('golden_glove',  15),
  ('top_assists',   15),
  ('champion',      20),
  ('last_team',     20),
  ('worst_adicto',  30)
on conflict do nothing;
