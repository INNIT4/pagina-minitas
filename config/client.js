export const CLIENT_CONFIG = {
  // Identidad
  nombre: "El Marqués",
  tagline: "Elegancia y distinción para cada celebración",
  logo: "assets/logo.jpg",

  // Contacto (inmutable — solo el developer edita este archivo)
  telefono: "+52 1 662 508 5924",
  whatsapp: "5216625085924",
  email: "elmarqueseventos@hotmail.com",
  direccion: "Ramón Valdez Ramírez 1004, Unión de Ladrilleros, Hermosillo, Son.",
  maps_embed_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3512.0!2d-111.0105531!3d29.1249753!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x86ce8139dbe39b81:0x979223b7f50f4e40!2sEventos+El+Marqu%C3%A9s!5e0!3m2!1ses!2smx!4v1234567890",

  // SEO
  seo: {
    title: "El Marqués – Salón de Eventos en Hermosillo, Sonora",
    description: "Bodas, XV años, bautizos y eventos empresariales en Hermosillo, Sonora. Capacidad 100–600 invitados. Elegancia y servicio de primera calidad.",
    keywords: "salon eventos hermosillo, bodas hermosillo sonora, xv años hermosillo, bautizos hermosillo, eventos empresariales hermosillo, el marques eventos",
    og_image: "assets/og-image.jpg",
    url_canonica: "https://www.eventoselmarques.mx",
    local_business_schema: {
      addressLocality: "Hermosillo",
      addressRegion: "Sonora",
      postalCode: "83131",
      streetAddress: "Ramón Valdez Ramírez 1004, Unión de Ladrilleros"
    }
  },

  // Colores → inyectados como CSS variables en runtime
  colores: {
    primario: "#8B1A1A",
    primario_claro: "#A52020",
    acento: "#C9A84C",
    fondo: "#FAF8F4",
    texto: "#1A1A1A"
  },

  // Hero
  hero_video_id: null,           // null = usar hero-fallback.jpg
  hero_cta_texto: "Cotiza tu evento",

  // Redes sociales (null = no mostrar ícono)
  redes: {
    facebook: "https://facebook.com/elmarqueseventos",
    instagram: "https://www.instagram.com/elmarques.eventoshmo",
    tiktok: null
  },

  // Estructura de navegación
  nav_eventos: ["bodas", "xv", "bautizos", "empresariales"],
  nav_espacios: ["salon-principal", "terraza", "area-lounge"],

  // Capacidad y horario
  capacidad_min: 100,
  capacidad_max: 600,
  horario_max: "2:00 AM",
  precio_minimo: 20500,

  // Mensaje WhatsApp pre-llenado
  whatsapp_mensaje: "Hola, me interesa cotizar un evento en El Marqués.",

  // Paquetes/precios
  paquetes: [
    {
      nombre: "Paquete Clásico",
      precio_por_persona: 200,
      minimo_personas: 100,
      color: "var(--color-surface-alt)",
      incluye: [
        "Salón con decoración base",
        "Menú 3 tiempos (res o pollo)",
        "Agua y refrescos ilimitados",
        "Pista de baile",
        "Coordinación de evento",
        "Estacionamiento amplio"
      ]
    },
    {
      nombre: "Paquete Premier",
      precio_por_persona: 248,
      minimo_personas: 150,
      destacado: true,
      color: "var(--color-primary)",
      incluye: [
        "Todo lo del paquete Clásico",
        "Decoración premium personalizada",
        "Menú 4 tiempos (res, pollo o puerco)",
        "Barra iluminada de bebidas",
        "Mesa de snacks",
        "Área lounge",
        "Coordinador dedicado"
      ]
    },
    {
      nombre: "Paquete Marqués",
      precio_por_persona: 295,
      minimo_personas: 200,
      color: "var(--color-surface-alt)",
      incluye: [
        "Todo lo del paquete Premier",
        "Decoración de lujo con flores naturales",
        "Barra libre completa hasta 2:00 AM",
        "Pastel incluido",
        "Salas lounge exclusivas",
        "Servicio de valet parking",
        "Fotografía del evento (2 horas)"
      ]
    }
  ],

  // Cloudinary (para subida de fotos sin Firebase Storage)
  cloudinary: {
    cloud_name: "dxvmswmpn",
    upload_preset: "elmarques"
  },

  // Meta
  _template_version: "1.0.0",
  _cliente_id: "eventos-el-marques"
};
