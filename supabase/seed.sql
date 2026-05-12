-- =============================================
-- POLLA MUNDIAL 2026 - Datos del Fixture
-- =============================================
-- Ejecuta este script DESPUÉS del schema.sql
-- Mundial FIFA 2026 - USA, Canadá, México
-- 12 grupos, 104 partidos, 11 Jun - 19 Jul 2026

-- =============================================
-- EQUIPOS (48 selecciones)
-- =============================================
insert into public.teams (name, flag, group_name, confederation) values
-- GRUPO A
('México',           '🇲🇽', 'A', 'CONCACAF'),
('Corea del Sur',    '🇰🇷', 'A', 'AFC'),
('Sudáfrica',        '🇿🇦', 'A', 'CAF'),
('Chequia',          '🇨🇿', 'A', 'UEFA'),
-- GRUPO B
('Canadá',           '🇨🇦', 'B', 'CONCACAF'),
('Bosnia y Herz.',   '🇧🇦', 'B', 'UEFA'),
('Qatar',            '🇶🇦', 'B', 'AFC'),
('Suiza',            '🇨🇭', 'B', 'UEFA'),
-- GRUPO C
('Brasil',           '🇧🇷', 'C', 'CONMEBOL'),
('Marruecos',        '🇲🇦', 'C', 'CAF'),
('Haití',            '🇭🇹', 'C', 'CONCACAF'),
('Escocia',          '🏴󠁧󠁢󠁳󠁣󠁴󠁿', 'C', 'UEFA'),
-- GRUPO D
('Estados Unidos',   '🇺🇸', 'D', 'CONCACAF'),
('Paraguay',         '🇵🇾', 'D', 'CONMEBOL'),
('Australia',        '🇦🇺', 'D', 'AFC'),
('Turquía',          '🇹🇷', 'D', 'UEFA'),
-- GRUPO E
('Alemania',         '🇩🇪', 'E', 'UEFA'),
('Curazao',          '🇨🇼', 'E', 'CONCACAF'),
('Costa de Marfil',  '🇨🇮', 'E', 'CAF'),
('Ecuador',          '🇪🇨', 'E', 'CONMEBOL'),
-- GRUPO F
('Países Bajos',     '🇳🇱', 'F', 'UEFA'),
('Japón',            '🇯🇵', 'F', 'AFC'),
('Suecia',           '🇸🇪', 'F', 'UEFA'),
('Túnez',            '🇹🇳', 'F', 'CAF'),
-- GRUPO G
('Bélgica',          '🇧🇪', 'G', 'UEFA'),
('Egipto',           '🇪🇬', 'G', 'CAF'),
('Irán',             '🇮🇷', 'G', 'AFC'),
('Nueva Zelanda',    '🇳🇿', 'G', 'OFC'),
-- GRUPO H
('España',           '🇪🇸', 'H', 'UEFA'),
('Cabo Verde',       '🇨🇻', 'H', 'CAF'),
('Arabia Saudita',   '🇸🇦', 'H', 'AFC'),
('Uruguay',          '🇺🇾', 'H', 'CONMEBOL'),
-- GRUPO I
('Francia',          '🇫🇷', 'I', 'UEFA'),
('Senegal',          '🇸🇳', 'I', 'CAF'),
('Irak',             '🇮🇶', 'I', 'AFC'),
('Noruega',          '🇳🇴', 'I', 'UEFA'),
-- GRUPO J
('Argentina',        '🇦🇷', 'J', 'CONMEBOL'),
('Argelia',          '🇩🇿', 'J', 'CAF'),
('Austria',          '🇦🇹', 'J', 'UEFA'),
('Jordania',         '🇯🇴', 'J', 'AFC'),
-- GRUPO K
('Portugal',         '🇵🇹', 'K', 'UEFA'),
('Rep. Dem. Congo',  '🇨🇩', 'K', 'CAF'),
('Uzbekistán',       '🇺🇿', 'K', 'AFC'),
('Colombia',         '🇨🇴', 'K', 'CONMEBOL'),
-- GRUPO L
('Inglaterra',       '🏴󠁧󠁢󠁥󠁮󠁧󠁿', 'L', 'UEFA'),
('Croacia',          '🇭🇷', 'L', 'UEFA'),
('Ghana',            '🇬🇭', 'L', 'CAF'),
('Panamá',           '🇵🇦', 'L', 'CONCACAF');

-- =============================================
-- PARTIDOS FASE DE GRUPOS
-- Nota: fechas y horarios en UTC-5 (Colombia)
-- =============================================

-- GRUPO A (México, Corea del Sur, Sudáfrica, Chequia)
insert into public.matches (match_number, home_team_id, away_team_id, match_date, venue, city, stage, group_name) values
(1,  (select id from teams where name='México'),        (select id from teams where name='Sudáfrica'),      '2026-06-11 19:00:00-05', 'Estadio Azteca',              'Ciudad de México', 'group', 'A'),
(2,  (select id from teams where name='Corea del Sur'), (select id from teams where name='Chequia'),        '2026-06-11 22:00:00-05', 'AT&T Stadium',                'Dallas',           'group', 'A'),
(3,  (select id from teams where name='México'),        (select id from teams where name='Chequia'),        '2026-06-15 16:00:00-05', 'Estadio Azteca',              'Ciudad de México', 'group', 'A'),
(4,  (select id from teams where name='Sudáfrica'),     (select id from teams where name='Corea del Sur'),  '2026-06-15 22:00:00-05', 'AT&T Stadium',                'Dallas',           'group', 'A'),
(5,  (select id from teams where name='México'),        (select id from teams where name='Corea del Sur'),  '2026-06-19 21:00:00-05', 'Estadio Azteca',              'Ciudad de México', 'group', 'A'),
(6,  (select id from teams where name='Chequia'),       (select id from teams where name='Sudáfrica'),      '2026-06-19 21:00:00-05', 'AT&T Stadium',                'Dallas',           'group', 'A'),

-- GRUPO B (Canadá, Bosnia, Qatar, Suiza)
(7,  (select id from teams where name='Canadá'),        (select id from teams where name='Bosnia y Herz.'), '2026-06-12 18:00:00-05', 'BMO Field',                   'Toronto',          'group', 'B'),
(8,  (select id from teams where name='Qatar'),         (select id from teams where name='Suiza'),          '2026-06-12 22:00:00-05', 'Estadio BBVA',                'Monterrey',        'group', 'B'),
(9,  (select id from teams where name='Canadá'),        (select id from teams where name='Qatar'),          '2026-06-16 18:00:00-05', 'BMO Field',                   'Toronto',          'group', 'B'),
(10, (select id from teams where name='Bosnia y Herz.'),(select id from teams where name='Suiza'),          '2026-06-16 22:00:00-05', 'Estadio BBVA',                'Monterrey',        'group', 'B'),
(11, (select id from teams where name='Canadá'),        (select id from teams where name='Suiza'),          '2026-06-20 21:00:00-05', 'BMO Field',                   'Toronto',          'group', 'B'),
(12, (select id from teams where name='Bosnia y Herz.'),(select id from teams where name='Qatar'),          '2026-06-20 21:00:00-05', 'Estadio BBVA',                'Monterrey',        'group', 'B'),

-- GRUPO C (Brasil, Marruecos, Haití, Escocia)
(13, (select id from teams where name='Brasil'),        (select id from teams where name='Haití'),          '2026-06-12 19:00:00-05', 'SoFi Stadium',                'Los Ángeles',      'group', 'C'),
(14, (select id from teams where name='Marruecos'),     (select id from teams where name='Escocia'),        '2026-06-12 22:00:00-05', 'Levi''s Stadium',             'San Francisco',    'group', 'C'),
(15, (select id from teams where name='Brasil'),        (select id from teams where name='Escocia'),        '2026-06-16 19:00:00-05', 'SoFi Stadium',                'Los Ángeles',      'group', 'C'),
(16, (select id from teams where name='Marruecos'),     (select id from teams where name='Haití'),          '2026-06-16 22:00:00-05', 'Levi''s Stadium',             'San Francisco',    'group', 'C'),
(17, (select id from teams where name='Brasil'),        (select id from teams where name='Marruecos'),      '2026-06-20 21:00:00-05', 'SoFi Stadium',                'Los Ángeles',      'group', 'C'),
(18, (select id from teams where name='Escocia'),       (select id from teams where name='Haití'),          '2026-06-20 21:00:00-05', 'Levi''s Stadium',             'San Francisco',    'group', 'C'),

-- GRUPO D (Estados Unidos, Paraguay, Australia, Turquía)
(19, (select id from teams where name='Estados Unidos'),(select id from teams where name='Paraguay'),        '2026-06-13 19:00:00-05', 'SoFi Stadium',                'Los Ángeles',      'group', 'D'),
(20, (select id from teams where name='Australia'),     (select id from teams where name='Turquía'),        '2026-06-13 22:00:00-05', 'MetLife Stadium',             'Nueva York',       'group', 'D'),
(21, (select id from teams where name='Estados Unidos'),(select id from teams where name='Australia'),      '2026-06-17 19:00:00-05', 'SoFi Stadium',                'Los Ángeles',      'group', 'D'),
(22, (select id from teams where name='Paraguay'),      (select id from teams where name='Turquía'),        '2026-06-17 22:00:00-05', 'MetLife Stadium',             'Nueva York',       'group', 'D'),
(23, (select id from teams where name='Estados Unidos'),(select id from teams where name='Turquía'),        '2026-06-21 21:00:00-05', 'SoFi Stadium',                'Los Ángeles',      'group', 'D'),
(24, (select id from teams where name='Paraguay'),      (select id from teams where name='Australia'),      '2026-06-21 21:00:00-05', 'MetLife Stadium',             'Nueva York',       'group', 'D'),

-- GRUPO E (Alemania, Curazao, Costa de Marfil, Ecuador)
(25, (select id from teams where name='Alemania'),      (select id from teams where name='Curazao'),        '2026-06-13 16:00:00-05', 'Lincoln Financial Field',    'Filadelfia',       'group', 'E'),
(26, (select id from teams where name='Costa de Marfil'),(select id from teams where name='Ecuador'),       '2026-06-13 22:00:00-05', 'Arrowhead Stadium',          'Kansas City',      'group', 'E'),
(27, (select id from teams where name='Alemania'),      (select id from teams where name='Ecuador'),        '2026-06-17 16:00:00-05', 'Lincoln Financial Field',    'Filadelfia',       'group', 'E'),
(28, (select id from teams where name='Curazao'),       (select id from teams where name='Costa de Marfil'),'2026-06-17 22:00:00-05', 'Arrowhead Stadium',          'Kansas City',      'group', 'E'),
(29, (select id from teams where name='Alemania'),      (select id from teams where name='Costa de Marfil'),'2026-06-21 21:00:00-05', 'Lincoln Financial Field',    'Filadelfia',       'group', 'E'),
(30, (select id from teams where name='Ecuador'),       (select id from teams where name='Curazao'),        '2026-06-21 21:00:00-05', 'Arrowhead Stadium',          'Kansas City',      'group', 'E'),

-- GRUPO F (Países Bajos, Japón, Suecia, Túnez)
(31, (select id from teams where name='Países Bajos'),  (select id from teams where name='Japón'),          '2026-06-14 16:00:00-05', 'Gillette Stadium',            'Boston',           'group', 'F'),
(32, (select id from teams where name='Suecia'),        (select id from teams where name='Túnez'),          '2026-06-14 22:00:00-05', 'Estadio Guadalajara',         'Guadalajara',      'group', 'F'),
(33, (select id from teams where name='Países Bajos'),  (select id from teams where name='Suecia'),         '2026-06-18 16:00:00-05', 'Gillette Stadium',            'Boston',           'group', 'F'),
(34, (select id from teams where name='Japón'),         (select id from teams where name='Túnez'),          '2026-06-18 22:00:00-05', 'Estadio Guadalajara',         'Guadalajara',      'group', 'F'),
(35, (select id from teams where name='Países Bajos'),  (select id from teams where name='Túnez'),          '2026-06-22 21:00:00-05', 'Gillette Stadium',            'Boston',           'group', 'F'),
(36, (select id from teams where name='Japón'),         (select id from teams where name='Suecia'),         '2026-06-22 21:00:00-05', 'Estadio Guadalajara',         'Guadalajara',      'group', 'F'),

-- GRUPO G (Bélgica, Egipto, Irán, Nueva Zelanda)
(37, (select id from teams where name='Bélgica'),       (select id from teams where name='Nueva Zelanda'),  '2026-06-14 19:00:00-05', 'Empower Field',               'Denver',           'group', 'G'),
(38, (select id from teams where name='Irán'),          (select id from teams where name='Egipto'),         '2026-06-14 22:00:00-05', 'Lumen Field',                 'Seattle',          'group', 'G'),
(39, (select id from teams where name='Bélgica'),       (select id from teams where name='Irán'),           '2026-06-18 19:00:00-05', 'Empower Field',               'Denver',           'group', 'G'),
(40, (select id from teams where name='Egipto'),        (select id from teams where name='Nueva Zelanda'),  '2026-06-18 22:00:00-05', 'Lumen Field',                 'Seattle',          'group', 'G'),
(41, (select id from teams where name='Bélgica'),       (select id from teams where name='Egipto'),         '2026-06-22 21:00:00-05', 'Empower Field',               'Denver',           'group', 'G'),
(42, (select id from teams where name='Irán'),          (select id from teams where name='Nueva Zelanda'),  '2026-06-22 21:00:00-05', 'Lumen Field',                 'Seattle',          'group', 'G'),

-- GRUPO H (España, Cabo Verde, Arabia Saudita, Uruguay)
(43, (select id from teams where name='España'),        (select id from teams where name='Arabia Saudita'), '2026-06-15 19:00:00-05', 'Hard Rock Stadium',           'Miami',            'group', 'H'),
(44, (select id from teams where name='Uruguay'),       (select id from teams where name='Cabo Verde'),     '2026-06-15 22:00:00-05', 'Estadio Caliente',            'Tijuana',          'group', 'H'),
(45, (select id from teams where name='España'),        (select id from teams where name='Uruguay'),        '2026-06-19 19:00:00-05', 'Hard Rock Stadium',           'Miami',            'group', 'H'),
(46, (select id from teams where name='Arabia Saudita'),(select id from teams where name='Cabo Verde'),     '2026-06-19 22:00:00-05', 'Estadio Caliente',            'Tijuana',          'group', 'H'),
(47, (select id from teams where name='España'),        (select id from teams where name='Cabo Verde'),     '2026-06-23 21:00:00-05', 'Hard Rock Stadium',           'Miami',            'group', 'H'),
(48, (select id from teams where name='Arabia Saudita'),(select id from teams where name='Uruguay'),        '2026-06-23 21:00:00-05', 'Estadio Caliente',            'Tijuana',          'group', 'H'),

-- GRUPO I (Francia, Senegal, Irak, Noruega)
(49, (select id from teams where name='Francia'),       (select id from teams where name='Irak'),           '2026-06-15 16:00:00-05', 'MetLife Stadium',             'Nueva York',       'group', 'I'),
(50, (select id from teams where name='Senegal'),       (select id from teams where name='Noruega'),        '2026-06-15 22:00:00-05', 'BC Place',                    'Vancouver',        'group', 'I'),
(51, (select id from teams where name='Francia'),       (select id from teams where name='Noruega'),        '2026-06-19 16:00:00-05', 'MetLife Stadium',             'Nueva York',       'group', 'I'),
(52, (select id from teams where name='Senegal'),       (select id from teams where name='Irak'),           '2026-06-19 22:00:00-05', 'BC Place',                    'Vancouver',        'group', 'I'),
(53, (select id from teams where name='Francia'),       (select id from teams where name='Senegal'),        '2026-06-23 21:00:00-05', 'MetLife Stadium',             'Nueva York',       'group', 'I'),
(54, (select id from teams where name='Noruega'),       (select id from teams where name='Irak'),           '2026-06-23 21:00:00-05', 'BC Place',                    'Vancouver',        'group', 'I'),

-- GRUPO J (Argentina, Argelia, Austria, Jordania)
(55, (select id from teams where name='Argentina'),     (select id from teams where name='Argelia'),        '2026-06-16 19:00:00-05', 'MetLife Stadium',             'Nueva York',       'group', 'J'),
(56, (select id from teams where name='Austria'),       (select id from teams where name='Jordania'),       '2026-06-16 22:00:00-05', 'Mercedes-Benz Stadium',       'Atlanta',          'group', 'J'),
(57, (select id from teams where name='Argentina'),     (select id from teams where name='Jordania'),       '2026-06-20 19:00:00-05', 'MetLife Stadium',             'Nueva York',       'group', 'J'),
(58, (select id from teams where name='Argelia'),       (select id from teams where name='Austria'),        '2026-06-20 22:00:00-05', 'Mercedes-Benz Stadium',       'Atlanta',          'group', 'J'),
(59, (select id from teams where name='Argentina'),     (select id from teams where name='Austria'),        '2026-06-24 21:00:00-05', 'MetLife Stadium',             'Nueva York',       'group', 'J'),
(60, (select id from teams where name='Argelia'),       (select id from teams where name='Jordania'),       '2026-06-24 21:00:00-05', 'Mercedes-Benz Stadium',       'Atlanta',          'group', 'J'),

-- GRUPO K (Portugal, Rep. Dem. Congo, Uzbekistán, Colombia)
(61, (select id from teams where name='Portugal'),      (select id from teams where name='Uzbekistán'),     '2026-06-17 19:00:00-05', 'Rose Bowl',                   'Los Ángeles',      'group', 'K'),
(62, (select id from teams where name='Colombia'),      (select id from teams where name='Rep. Dem. Congo'), '2026-06-17 22:00:00-05','Estadio Akron',               'Guadalajara',      'group', 'K'),
(63, (select id from teams where name='Portugal'),      (select id from teams where name='Colombia'),       '2026-06-21 19:00:00-05', 'Rose Bowl',                   'Los Ángeles',      'group', 'K'),
(64, (select id from teams where name='Rep. Dem. Congo'),(select id from teams where name='Uzbekistán'),    '2026-06-21 22:00:00-05', 'Estadio Akron',               'Guadalajara',      'group', 'K'),
(65, (select id from teams where name='Portugal'),      (select id from teams where name='Rep. Dem. Congo'),'2026-06-25 21:00:00-05', 'Rose Bowl',                   'Los Ángeles',      'group', 'K'),
(66, (select id from teams where name='Uzbekistán'),    (select id from teams where name='Colombia'),       '2026-06-25 21:00:00-05', 'Estadio Akron',               'Guadalajara',      'group', 'K'),

-- GRUPO L (Inglaterra, Croacia, Ghana, Panamá)
(67, (select id from teams where name='Inglaterra'),    (select id from teams where name='Panamá'),         '2026-06-18 19:00:00-05', 'Estadio Azteca',              'Ciudad de México', 'group', 'L'),
(68, (select id from teams where name='Croacia'),       (select id from teams where name='Ghana'),          '2026-06-18 22:00:00-05', 'Empower Field',               'Denver',           'group', 'L'),
(69, (select id from teams where name='Inglaterra'),    (select id from teams where name='Ghana'),          '2026-06-22 19:00:00-05', 'Estadio Azteca',              'Ciudad de México', 'group', 'L'),
(70, (select id from teams where name='Panamá'),        (select id from teams where name='Croacia'),        '2026-06-22 22:00:00-05', 'Empower Field',               'Denver',           'group', 'L'),
(71, (select id from teams where name='Inglaterra'),    (select id from teams where name='Croacia'),        '2026-06-26 21:00:00-05', 'Estadio Azteca',              'Ciudad de México', 'group', 'L'),
(72, (select id from teams where name='Ghana'),         (select id from teams where name='Panamá'),         '2026-06-26 21:00:00-05', 'Empower Field',               'Denver',           'group', 'L');

-- =============================================
-- ELIMINATORIAS (Round of 32, 16, QF, SF, Final)
-- Los equipos se asignan dinámicamente; aquí van los slots
-- El admin los actualiza cuando se conozcan los clasificados
-- =============================================

-- RONDA DE 32 (Partidos 73-88)
insert into public.matches (match_number, home_team_label, away_team_label, match_date, venue, city, stage) values
(73,  '1er Grupo A', '2do Grupo B', '2026-07-04 19:00:00-05', 'AT&T Stadium',              'Dallas',           'round_of_32'),
(74,  '1er Grupo C', '2do Grupo D', '2026-07-04 22:00:00-05', 'SoFi Stadium',              'Los Ángeles',      'round_of_32'),
(75,  '1er Grupo E', '2do Grupo F', '2026-07-05 16:00:00-05', 'MetLife Stadium',           'Nueva York',       'round_of_32'),
(76,  '1er Grupo G', '2do Grupo H', '2026-07-05 22:00:00-05', 'Hard Rock Stadium',         'Miami',            'round_of_32'),
(77,  '1er Grupo I', '2do Grupo J', '2026-07-06 16:00:00-05', 'Rose Bowl',                 'Los Ángeles',      'round_of_32'),
(78,  '1er Grupo K', '2do Grupo L', '2026-07-06 22:00:00-05', 'Estadio Azteca',            'Ciudad de México', 'round_of_32'),
(79,  '1er Grupo B', '2do Grupo A', '2026-07-07 16:00:00-05', 'BMO Field',                 'Toronto',          'round_of_32'),
(80,  '1er Grupo D', '2do Grupo C', '2026-07-07 22:00:00-05', 'Lincoln Financial Field',   'Filadelfia',       'round_of_32'),
(81,  '1er Grupo F', '2do Grupo E', '2026-07-08 16:00:00-05', 'Gillette Stadium',          'Boston',           'round_of_32'),
(82,  '1er Grupo H', '2do Grupo G', '2026-07-08 22:00:00-05', 'Mercedes-Benz Stadium',     'Atlanta',          'round_of_32'),
(83,  '1er Grupo J', '2do Grupo I', '2026-07-09 16:00:00-05', 'Lumen Field',               'Seattle',          'round_of_32'),
(84,  '1er Grupo L', '2do Grupo K', '2026-07-09 22:00:00-05', 'Estadio BBVA',              'Monterrey',        'round_of_32'),
(85,  '3er mejor 1', '3er mejor 2', '2026-07-10 16:00:00-05', 'Empower Field',             'Denver',           'round_of_32'),
(86,  '3er mejor 3', '3er mejor 4', '2026-07-10 22:00:00-05', 'Arrowhead Stadium',         'Kansas City',      'round_of_32'),
(87,  '3er mejor 5', '3er mejor 6', '2026-07-11 16:00:00-05', 'BC Place',                  'Vancouver',        'round_of_32'),
(88,  '3er mejor 7', '3er mejor 8', '2026-07-11 22:00:00-05', 'Estadio Akron',             'Guadalajara',      'round_of_32'),

-- OCTAVOS DE FINAL (Partidos 89-96)
(89,  'Ganador P73', 'Ganador P74', '2026-07-13 16:00:00-05', 'MetLife Stadium',           'Nueva York',       'round_of_16'),
(90,  'Ganador P75', 'Ganador P76', '2026-07-13 22:00:00-05', 'SoFi Stadium',              'Los Ángeles',      'round_of_16'),
(91,  'Ganador P77', 'Ganador P78', '2026-07-14 16:00:00-05', 'AT&T Stadium',              'Dallas',           'round_of_16'),
(92,  'Ganador P79', 'Ganador P80', '2026-07-14 22:00:00-05', 'Hard Rock Stadium',         'Miami',            'round_of_16'),
(93,  'Ganador P81', 'Ganador P82', '2026-07-15 16:00:00-05', 'Rose Bowl',                 'Los Ángeles',      'round_of_16'),
(94,  'Ganador P83', 'Ganador P84', '2026-07-15 22:00:00-05', 'Estadio Azteca',            'Ciudad de México', 'round_of_16'),
(95,  'Ganador P85', 'Ganador P86', '2026-07-16 16:00:00-05', 'Mercedes-Benz Stadium',     'Atlanta',          'round_of_16'),
(96,  'Ganador P87', 'Ganador P88', '2026-07-16 22:00:00-05', 'Gillette Stadium',          'Boston',           'round_of_16'),

-- CUARTOS DE FINAL (Partidos 97-100)
(97,  'Ganador P89', 'Ganador P90', '2026-07-18 16:00:00-05', 'MetLife Stadium',           'Nueva York',       'quarterfinal'),
(98,  'Ganador P91', 'Ganador P92', '2026-07-18 22:00:00-05', 'AT&T Stadium',              'Dallas',           'quarterfinal'),
(99,  'Ganador P93', 'Ganador P94', '2026-07-19 16:00:00-05', 'SoFi Stadium',              'Los Ángeles',      'quarterfinal'),
(100, 'Ganador P95', 'Ganador P96', '2026-07-19 22:00:00-05', 'Hard Rock Stadium',         'Miami',            'quarterfinal'),

-- SEMIFINALES (Partidos 101-102)
(101, 'Ganador P97', 'Ganador P98', '2026-07-22 19:00:00-05', 'MetLife Stadium',           'Nueva York',       'semifinal'),
(102, 'Ganador P99', 'Ganador P100','2026-07-23 19:00:00-05', 'AT&T Stadium',              'Dallas',           'semifinal'),

-- TERCER PUESTO (Partido 103)
(103, 'Perdedor P101','Perdedor P102','2026-07-25 15:00:00-05','Hard Rock Stadium',         'Miami',            'third_place'),

-- FINAL (Partido 104)
(104, 'Finalista 1', 'Finalista 2', '2026-07-26 17:00:00-05', 'MetLife Stadium',           'Nueva York',       'final');
