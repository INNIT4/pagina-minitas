# venue-template — Instrucciones para Claude Code

## Cliente actual: Hacienda Las Minitas

| Campo | Valor |
|-------|-------|
| **Nombre** | Hacienda Las Minitas |
| **Ciudad** | Hermosillo, Sonora |
| **Dirección** | Calle de los Molinos #97 (Final), Col. Las Minitas, C.P. 83285 |
| **Teléfono/WhatsApp** | +52 662 184 7562 |
| **Email** | haciendalasminitas@hotmail.com |
| **Instagram** | @hacienda_minitas |
| **Facebook** | /HaciendaLasMinitas |
| **Firebase project** | salon-primavera (hosting compartido, modo estático) |
| **Hosting site** | minitas |
| **Capacidad** | 100–600 invitados |
| **Precios** | No publicados (paquetes demo: $220–$320 MXN/persona) |
| **Horario máximo** | 12:00 AM (no especificado, sujeto a contrato) |
| **Colores** | Verde `#2A4B3C` + Dorado `#C9A265` |
| **Logo** | `assets/logo.jpg` (pendiente — descargar de Instagram/Facebook) |
| **Hero** | `assets/hero-fallback.jpg` (pendiente — usar foto de jardín/alberca de Instagram) |
| **Coordenadas** | 29.0529134, -110.9902715 |
| **Maps Place ID** | `0x6392cc3ac7b02379` |

### Paquetes configurados (demo — precios referenciales)
| Paquete | Precio/persona | Mínimo |
|---------|---------------|--------|
| Jardín | $220 | 100 personas |
| Hacienda | $270 | 150 personas |
| Exclusivo | $320 | 200 personas |



## Stack
Vanilla HTML + CSS + ES6 modules. Sin build step.

## Servir localmente
```bash
# Python
python -m http.server 8080

# Node
npx serve .
```
Abrir `http://localhost:8080`. Los ES modules requieren HTTP, no funciona con `file://`.

## Arquitectura

### Dos capas de datos
| Capa | Archivo | Quién edita | Cuándo |
|------|---------|-------------|--------|
| Estática | `config/client.js` | Developer | Al clonar el template |
| Dinámica | Firestore | Cliente via admin panel | Cualquier momento |

El sitio siempre funciona con solo `config/client.js` (fallback graceful si Firestore falla).

### Módulos JS
| Archivo | Rol |
|---------|-----|
| `js/main.js` | Entry point — orquesta todos los módulos |
| `js/config-loader.js` | Aplica CSS variables + SEO meta tags desde config/client.js |
| `js/content-loader.js` | Lee Firestore con fallback a config.js |
| `js/firebase-config.js` | Init Firebase SDK — detecta si está configurado |
| `js/navbar.js` | Sticky header, hamburger, dropdown |
| `js/hero.js` | Video YouTube o imagen fallback |
| `js/calendar.js` | Disponibilidad desde Firestore, oculta si no hay Firebase |
| `js/quote-form.js` | Cotización → WhatsApp + email + guarda en Firestore |
| `js/gallery.js` | Filtros por categoría + lightbox vanilla |
| `js/stats.js` | Contador animado con IntersectionObserver |
| `js/faq.js` | Accordion (delegación de eventos) |
| `js/popup.js` | Modal promo con sessionStorage guard |
| `js/reveal.js` | Reveal on scroll con IntersectionObserver + MutationObserver |
| `js/whatsapp.js` | Botón FAB |

### Panel Admin (`/admin`)
| Archivo | Rol |
|---------|-----|
| `admin/js/admin-main.js` | Entry point, auth guard, navegación de secciones |
| `admin/js/admin-auth.js` | Firebase Auth email/password |
| `admin/js/admin-cotizaciones.js` | Ver + marcar leídas + botón WhatsApp directo |
| `admin/js/admin-calendar.js` | Bloquear/desbloquear fechas en Firestore |
| `admin/js/admin-textos.js` | Editar hero + nosotros en Firestore |
| `admin/js/admin-galeria.js` | Upload fotos a Cloudinary + guarda URL en Firestore, delete |

## Onboarding de cliente nuevo

1. Clonar este repo
2. Editar `config/client.js` (colores, datos, SEO, teléfonos)
3. Crear proyecto Firebase → editar `js/firebase-config.js` + `.firebaserc`
4. `firebase deploy --only firestore:rules`
5. Reemplazar `assets/logo.jpg` (o .svg), `assets/hero-fallback.jpg`, `assets/og-image.jpg`
6. `firebase deploy`
7. Crear usuario admin en Firebase Auth Console
8. Entregar URL `/admin/` + credenciales al cliente

## Colecciones Firestore
```
/content/hero             { texto_principal, subtexto }
/content/nosotros         { titulo, texto, imagen_url }
/content/stats            { items: [{valor, sufijo, etiqueta}] }
/eventos/{id}             { nombre, descripcion, imagen_url }
/espacios/{id}            { nombre, capacidad, descripcion, imagen_url }
/gallery/{id}             { url, categoria, orden }
/availability/blocked_dates { fechas: [{fecha: "YYYY-MM-DD", motivo}] }
/cotizaciones/{id}        { nombre, telefono, email, tipo_evento, paquete, fecha, horario, personas, referencia, mensaje, timestamp, leido }
/testimonios/{id}         { nombre, evento, texto, estrellas, visible }
/faq/{id}                 { pregunta, respuesta, orden }
/popup/config             { activo, titulo, texto, imagen_url, delay_ms }
```

## Personalizar colores
En `config/client.js`, campo `colores`. Se inyectan como CSS variables en runtime por `config-loader.js`. Los valores por defecto en `css/tokens.css` son los colores dorado/Hermosillo.

## Notas de código
- `[hidden] { display: none !important; }` en reset.css es obligatorio.
- Firebase SDK se carga via CDN (versión 10.7.1). No hay npm.
- `isConfigured` en firebase-config.js detecta si las credenciales son placeholder.
- `admin-galeria.js` usa Firebase Storage — requiere habilitar Storage en Firebase Console.
