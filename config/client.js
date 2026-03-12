export const CLIENT_CONFIG = {
  // Identidad
  nombre: "Salón Primavera",
  tagline: "El lugar perfecto para tu evento especial",
  logo: "assets/logo.svg",

  // Contacto (inmutable — solo el developer edita este archivo)
  telefono: "+52 662 123 4567",
  whatsapp: "526621234567",
  email: "contacto@salonprimavera.mx",
  direccion: "Blvd. García Morales 123, Hermosillo, Son.",
  maps_embed_url: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3512.123!2d-110.9559!3d29.0911!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zSGVybW9zaWxsbw!5e0!3m2!1ses!2smx!4v1234567890",

  // SEO
  seo: {
    title: "Salón Primavera – Eventos en Hermosillo, Sonora",
    description: "Bodas, XV años, bautizos y eventos empresariales en Hermosillo, Sonora. Instalaciones de primer nivel con atención personalizada.",
    keywords: "salon eventos hermosillo, bodas sonora, xv años hermosillo, bautizos hermosillo, eventos empresariales hermosillo",
    og_image: "assets/og-image.jpg",
    url_canonica: "https://www.salonprimavera.mx"
  },

  // Colores → inyectados como CSS variables en runtime
  colores: {
    primario: "#8B6914",
    primario_claro: "#B8921E",
    acento: "#C8A44A",
    fondo: "#FAF8F4",
    texto: "#1A1A1A"
  },

  // Hero
  hero_video_id: null,           // null = usar hero-fallback.jpg
  hero_cta_texto: "Cotiza tu evento",

  // Redes sociales (null = no mostrar ícono)
  redes: {
    facebook: "https://facebook.com/salonprimavera",
    instagram: "https://instagram.com/salonprimavera",
    tiktok: null
  },

  // Estructura de navegación
  nav_eventos: ["bodas", "xv", "bautizos", "empresariales"],
  nav_espacios: ["salon-principal", "jardin", "terraza"],

  // Mensaje WhatsApp pre-llenado
  whatsapp_mensaje: "Hola, me interesa cotizar un evento en Salón Primavera.",

  // Paquetes/precios (null = sección oculta)
  paquetes: null,

  // Meta
  _template_version: "1.0.0",
  _cliente_id: "salon-primavera"
};
