# 🚀 Guía de Despliegue — Polla Mundial 2026

**Costo total: $0 COP** (Supabase Free + Vercel Free + GitHub Free)
**Tiempo estimado: 30-45 minutos**

---

## Lo que necesitas crear (todo gratuito)

| Servicio | Para qué | Enlace |
|----------|----------|--------|
| GitHub   | Guardar el código | https://github.com |
| Supabase | Base de datos + Login | https://supabase.com |
| Vercel   | Publicar el sitio web | https://vercel.com |

---

## PASO 1: Crear cuenta en Supabase

1. Ve a **https://supabase.com** → clic en **Start your project**
2. Regístrate con tu cuenta de Google o GitHub
3. Clic en **New Project**
4. Llena los campos:
   - **Name**: `polla-mundial-2026`
   - **Database Password**: anota esta contraseña en un lugar seguro
   - **Region**: `South America (São Paulo)` (la más cercana a Colombia)
5. Espera ~2 minutos a que se cree el proyecto

### Crear la base de datos

6. En el menú izquierdo, clic en **SQL Editor**
7. Clic en **New Query**
8. Copia y pega todo el contenido del archivo `supabase/schema.sql`
9. Clic en **Run** (botón verde)
10. Repite con el archivo `supabase/seed.sql`

### Obtener las credenciales

11. En el menú izquierdo, clic en **Project Settings** (ícono de engranaje)
12. Clic en **API**
13. Copia:
    - **Project URL** → la necesitarás después
    - **anon public** key → la necesitarás después

### Asignar rol de administrador

14. En el menú izquierdo, clic en **Table Editor**
15. Abre la tabla **profiles**
16. Encuentra tu usuario (el que usarás como admin)
17. Edita la fila y cambia `is_admin` a `true`

> ⚠️ **Importante**: Primero debes registrarte en la app, y luego volver aquí para activar is_admin.
> Si quieres que juan pablo restrepo sea el admin, él se registra primero y tú activas su is_admin.

---

## PASO 2: Subir el código a GitHub

1. Ve a **https://github.com** → **New repository**
2. Nombre: `polla-mundial-2026`
3. **Private** (recomendado)
4. Clic en **Create repository**
5. Abre una **Terminal** (en Windows: clic derecho → "Open in Terminal" o busca "cmd")
6. Navega a la carpeta del proyecto y ejecuta:

```bash
cd polla-mundial-2026
git init
git add .
git commit -m "Initial commit - Polla Mundial 2026"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/polla-mundial-2026.git
git push -u origin main
```

> Reemplaza `TU_USUARIO` con tu nombre de usuario de GitHub.

---

## PASO 3: Desplegar en Vercel

1. Ve a **https://vercel.com** → **Sign up with GitHub**
2. Clic en **Add New... → Project**
3. Selecciona el repositorio `polla-mundial-2026`
4. En la sección **Environment Variables**, agrega estas variables:

| Variable | Valor |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | La URL de tu proyecto Supabase (del Paso 1) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | La anon key de Supabase (del Paso 1) |
| `NEXT_PUBLIC_ADMIN_EMAIL` | Tu email de administrador |
| `NEXT_PUBLIC_COINK_NUMBER` | Número de Coink del admin (ej: +573001234567) |
| `NEXT_PUBLIC_COINK_NAME` | Nombre del dueño del Coink (ej: Juan Pablo Restrepo) |
| `NEXT_PUBLIC_ENTRY_FEE` | 300000 |
| `NEXT_PUBLIC_POLLA_NAME` | Polla Mundial 2026 - Adictos |

5. Clic en **Deploy**
6. ¡Espera 2-3 minutos!

Tu sitio estará disponible en: `https://polla-mundial-2026.vercel.app`

---

## PASO 4: Configurar el dominio (opcional pero recomendado)

Vercel te da un dominio gratuito como `polla-mundial-2026.vercel.app`.
Si quieres un dominio propio (ej: `adictos2026.com`), puedes comprarlo en:
- namecheap.com (~$8 USD/año)
- cloudflare.com

---

## PASO 5: Primer uso

1. Ve a tu URL de Vercel
2. Clic en **Inscribirme**
3. Crea tu cuenta con tu email
4. Ve a Supabase → Table Editor → profiles → cambia tu `is_admin` a `true`
5. Recarga la app → verás el botón **Admin** en la navbar
6. Ve a **Admin → Pagos** y empieza a confirmar inscripciones

---

## Flujo de juego

### Para el ADMIN (Juan Pablo Restrepo o quien sea):

1. **Antes del 11 de junio**: Confirmar pagos en `/admin/payments`
2. **Cuando empiece un partido**: Ir a `/admin/results` → clic en "🔒 Cerrar predicciones"
3. **Cuando termine**: Ingresar el marcador → clic "💾 Guardar resultado"
   - Los puntos se calculan AUTOMÁTICAMENTE para todos
4. **Al final del torneo**: Ir a `/admin/bonuses` para resolver Bota de Oro, etc.

### Para los JUGADORES:

1. Registrarse en la app con su referencia Coink
2. Esperar confirmación del admin
3. Ir a **Predicciones** → predecir todos los partidos antes que empiece cada uno
4. Ver el **Leaderboard** para ver su posición
5. Ir a **Bonos** para predicciones especiales

---

## Preguntas frecuentes

**¿Y si alguien se registra pero no paga?**
Su cuenta queda como "Pendiente". No aparece en el leaderboard. El admin la rechaza.

**¿Puedo cambiar la inscripción de $300.000?**
Sí, cambia `NEXT_PUBLIC_ENTRY_FEE` en Vercel → Settings → Environment Variables.

**¿Los datos son seguros?**
Supabase usa PostgreSQL con cifrado. Las contraseñas las maneja Supabase Auth (estándar de industria).

**¿Qué pasa si Vercel o Supabase cambian su plan gratuito?**
El plan gratuito de Supabase soporta hasta 500MB de base de datos y 50.000 usuarios activos/mes.
Para 48 personas, estamos muy por debajo del límite durante años.

**¿Cómo actualizo el código?**
Haz cambios en los archivos, luego:
```bash
git add .
git commit -m "descripción del cambio"
git push
```
Vercel despliega automáticamente en ~1 minuto.

---

## Datos de configuración rápida

Copia esto y complétalo para referencia:

```
URL de la app:     https://_____________________.vercel.app
Supabase URL:      https://_____________________.supabase.co
Admin email:       _____________________________
Coink admin:       +57_____________________ / _____________________________
```

---

*¿Problemas? Pregúntale a Francisco en el chat de WhatsApp — él construyó esta cosa 🦾*
